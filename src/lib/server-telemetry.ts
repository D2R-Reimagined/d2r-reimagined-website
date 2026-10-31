import { ApiError, apiRequest, apiStreamRequest } from '#lib/auth.js';
import type { ServerBuildState } from '#lib/admin.js';
import { currentServerBuild, installedBuildLabels, installedBuildMatch, shortBuildId, type InstalledBuildMatch,
  type InstalledServerBuild } from '#lib/server-builds.js';

export interface MonitorPlayer {
  name: string; clientId: number; class: string; state: string; stateCode: number;
  connectedSeconds: number; stateSeconds: number; stalled: boolean;
}
export interface MonitorGame {
  id: string; name: string; description: string; passwordRequired: boolean; difficulty: string;
  mode: string; hardcore: boolean; ladder: boolean; terrorized: boolean; maxPlayers: number;
  connectedCount: number; levelDifference: number; levelDifferenceEnabled: boolean;
  observedSeconds: number; players: MonitorPlayer[];
}
export interface MonitorSnapshot {
  session: string; pid: number; capturedAtUnixMs: number; uptimeSeconds: number; gamePort: number; tickAgeMs: number;
  snapshotAgeMs: number; ready: boolean; ticks: number; slowTicks: number; lastTickMs: number;
  maxTickMs: number; memoryBytes: number; joins: number; leaves: number; logPackets: boolean;
  verbose: boolean; games: MonitorGame[];
  lobby: { state: string; lastStatus: number; failures: number; networkError: number; lastSuccessAgeSeconds?: number };
}
export interface TelemetryServer {
  id: string; ladderId: string; address: string; status: 'online' | 'delayed' | 'offline' | 'stalled' | 'starting' | 'disabled';
  regionIds?: string[];
  receivedAtUtc: string | null; snapshot: MonitorSnapshot | null; sourceGaps: number;
  /** Card counts; the live stream sends these instead of the snapshot for every server it is not watching. Absent from an older API. */
  gamePort?: number; gameCount?: number; connectionCount?: number;
  /** The d2rl-d2rds.dll its supervisor last reported installed; absent until it reports one. */
  serverBuild?: InstalledServerBuild | null;
  /** The ladder bundle and D2RLoader its supervisor last reported installed; absent until it reports them. */
  deployment?: ServerDeployment | null;
  /** What its ladder wants now; absent from an API that predates it. */
  ladderTarget?: LadderDeploymentTarget | null;
  /**
   * The configured box this d2rds process is one of, which one, its display name ("Box #1"), and how many the
   * box runs: `id` is `boxId` for instance 0 and `boxId~N` for instance N. Build and deployment are the box's.
   * Absent from an API that predates instances (every server is then a box of one).
   */
  boxId?: string; instance?: number; name?: string | null; boxInstances?: number;
}

/** The configured box a reported server belongs to. */
export const serverBoxId = (server: Pick<TelemetryServer, 'id' | 'boxId'>): string => server.boxId || server.id;

/** Servers grouped by box, boxes in first-seen order and each box's instances by number. */
export function groupServersByBox<T extends Pick<TelemetryServer, 'id' | 'boxId' | 'instance'>>(servers: readonly T[]): { boxId: string; servers: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const server of servers) {
    const box = serverBoxId(server);
    const group = groups.get(box);
    if (group) group.push(server); else groups.set(box, [server]);
  }
  return [...groups].map(([boxId, members]) => ({ boxId, servers: [...members].sort((a, b) => (a.instance ?? 0) - (b.instance ?? 0)) }));
}
export interface ServerDeployment {
  bundleId: string | null; revision: number | null;
  /** D2RLoader.exe's product version; null on Linux hosts, where it cannot be read. */
  d2rLoaderVersion: string | null;
  /** Whether its D2RLoader files are the ladder's pinned build; null without a pin or files to compare. */
  d2rLoaderMatchesPin: boolean | null;
  reportedAtUtc: string;
}
export interface LadderDeploymentTarget {
  bundleId: string | null; revision: number | null; minimumD2RLoaderVersion: string | null; pinnedD2RLoaderVersion: string | null;
}
export interface DeploymentLine { label: string; note: string; tone: 'ok' | 'warn' | null; title: string }
export interface TelemetryLog {
  cursor: number; session: string; sourceId: number; timestamp: number; level: number; message: string;
}
export interface TelemetryFrame {
  nowUtc: string; servers: TelemetryServer[]; serverId: string; cursor: number; gap: boolean; entries: TelemetryLog[];
}
export const logLevels = ['Debug', 'Info', 'Warning', 'Error'];
// A card's installed server build: its short id, the full hash for a tooltip, and
// how it compares with the ladder's current build (null when that is not loaded).
export function installedBuildSummary(installed: InstalledServerBuild | null | undefined, ladder: ServerBuildState | null | undefined):
  { label: string; title: string; match: InstalledBuildMatch | null } {
  const match = installedBuildMatch(installed, ladder);
  const label = !installed ? installedBuildLabels['not-reported'] : installed.buildId ? shortBuildId(installed.buildId) : installedBuildLabels['unknown-build'];
  const current = currentServerBuild(ladder);
  const title = [installed ? `Installed SHA-256 ${installed.sha256}` : '', match === 'outdated' && current ? `Ladder current ${shortBuildId(current.id)} · ${current.sha256}` : '']
    .filter(Boolean).join('\n');
  return { label, title, match };
}
// A card's installed ladder bundle against the ladder's active one.
export function bundleRevisionSummary(installed: ServerDeployment | null | undefined, ladder: LadderDeploymentTarget | null | undefined): DeploymentLine {
  if (!installed) return { label: 'Not reported', note: '', tone: null, title: '' };
  const current = ladder?.bundleId ? `Ladder active bundle ${ladder.bundleId} (revision ${ladder.revision})` : '';
  if (!installed.bundleId) return { label: 'None recorded', note: ladder?.revision ? `ladder is on revision ${ladder.revision}` : '', tone: 'warn', title: current };
  const label = `revision ${installed.revision}`;
  const title = [`Installed bundle ${installed.bundleId}`, installed.bundleId === ladder?.bundleId ? '' : current].filter(Boolean).join('\n');
  if (!ladder?.bundleId) return { label, note: '', tone: null, title };
  return installed.bundleId === ladder.bundleId
    ? { label, note: 'up to date', tone: 'ok', title }
    : { label, note: `ladder is on revision ${ladder.revision}`, tone: 'warn', title };
}
// A card's D2RLoader against the ladder's pin, or without one the bundle's minimum version.
export function d2rLoaderSummary(installed: ServerDeployment | null | undefined, ladder: LadderDeploymentTarget | null | undefined): DeploymentLine {
  if (!installed) return { label: 'Not reported', note: '', tone: null, title: '' };
  const pin = ladder?.pinnedD2RLoaderVersion;
  const label = installed.d2rLoaderVersion ?? (pin && installed.d2rLoaderMatchesPin ? pin : 'Unknown version');
  const title = installed.d2rLoaderVersion ? '' : 'This host did not report a version (Linux hosts cannot read it).';
  if (pin) {
    if (installed.d2rLoaderMatchesPin) return { label, note: 'matches the ladder\'s pin', tone: 'ok', title };
    return { label, note: installed.d2rLoaderMatchesPin === false ? `not the ladder's pinned ${pin}` : `ladder pins ${pin}`, tone: 'warn', title };
  }
  const minimum = ladder?.minimumD2RLoaderVersion;
  if (!minimum) return { label, note: '', tone: null, title };
  const comparison = compareVersionCores(installed.d2rLoaderVersion, minimum);
  if (comparison === null) return { label, note: `bundle needs ${minimum} or newer`, tone: null, title };
  return comparison >= 0
    ? { label, note: `meets the bundle's minimum ${minimum}`, tone: 'ok', title }
    : { label, note: `below the bundle's minimum ${minimum}`, tone: 'warn', title };
}
// Compares the numeric part of two versions ("1.3.1-beta", "1.3.1.0"); null when either is not one.
function compareVersionCores(left: string | null, right: string): number | null {
  const parse = (value: string) => {
    const parts = value.trim().replace(/^v/i, '').split(/[-+]/)[0].split('.');
    return parts.length && parts.every(part => /^\d+$/.test(part)) ? parts.map(Number) : null;
  };
  const a = left ? parse(left) : null;
  const b = parse(right);
  if (!a || !b) return null;
  for (let i = 0; i < Math.max(a.length, b.length, 3); i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0);
    if (difference) return Math.sign(difference);
  }
  return 0;
}
export const getServers = (signal?: AbortSignal) => apiRequest<TelemetryFrame>('/admin/servers', { signal, cache: 'no-store' }, true);

// Incremental framing survives split UTF-8 characters and arbitrary network chunks.
export class TelemetryEventParser {
  private buffer = '';
  push(chunk: string): TelemetryFrame[] {
    this.buffer = (this.buffer + chunk).replace(/\r\n/g, '\n');
    if (this.buffer.length > 4 * 1024 * 1024) throw new Error('Monitoring frame exceeded the buffer limit.');
    const frames: TelemetryFrame[] = [];
    let end: number;
    while ((end = this.buffer.indexOf('\n\n')) !== -1) {
      const event = this.buffer.slice(0, end);
      this.buffer = this.buffer.slice(end + 2);
      if (!event.split('\n').includes('event: telemetry')) continue;
      const data = event.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
      const frame = JSON.parse(data) as TelemetryFrame;
      if (!Array.isArray(frame.servers) || !Array.isArray(frame.entries) || !Number.isSafeInteger(frame.cursor) || frame.cursor < 0) {
        throw new Error('Invalid monitoring frame.');
      }
      frames.push(frame);
    }
    return frames;
  }
}
export function appendLogs(current: TelemetryLog[], entries: TelemetryLog[], maximum = 2000): TelemetryLog[] {
  const seen = new Set(current.map(e => `${e.session}:${e.sourceId}`));
  const result = [...current, ...entries.filter(e => {
    const key = `${e.session}:${e.sourceId}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  })].slice(-maximum);
  const encoder = new TextEncoder();
  let bytes = result.reduce((sum, e) => sum + encoder.encode(e.message).length, 0);
  while (bytes > 1024 * 1024 && result.length) bytes -= encoder.encode(result.shift()!.message).length;
  return result;
}
export function connectServerTelemetry(id: string, onFrame: (frame: TelemetryFrame) => void,
  onStatus: (status: string, error?: string) => void): () => void {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cursor = 0, retry = 1000;
  async function connect(): Promise<void> {
    const attempt = new AbortController();
    const abort = () => attempt.abort();
    controller.signal.addEventListener('abort', abort, { once: true });
    let watchdog = setTimeout(abort, 20000);
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let terminal = false;
    try {
      onStatus(cursor ? 'Reconnecting' : 'Connecting');
      const response = await apiStreamRequest(`/admin/servers/${encodeURIComponent(id)}/events?after=${cursor}`, attempt.signal);
      if (!response.body) throw new Error('The live stream is unavailable.');
      reader = response.body.getReader();
      const decoder = new TextDecoder();
      const parser = new TelemetryEventParser();
      while (!controller.signal.aborted) {
        const chunk = await reader.read();
        if (chunk.done) break;
        clearTimeout(watchdog); watchdog = setTimeout(abort, 20000);
        for (const frame of parser.push(decoder.decode(chunk.value, { stream: true }))) {
          if (controller.signal.aborted) return;
          cursor = frame.cursor;
          retry = 1000;
          onStatus('Live'); onFrame(frame);
        }
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      terminal = error instanceof ApiError && [401, 403, 404].includes(error.status);
      onStatus(terminal ? 'Access unavailable' : 'Reconnecting', error instanceof Error ? error.message : 'Connection interrupted.');
    } finally {
      clearTimeout(watchdog);
      controller.signal.removeEventListener('abort', abort);
      await reader?.cancel().catch(() => {});
      reader?.releaseLock();
    }
    if (!controller.signal.aborted && !terminal) {
      timer = setTimeout(() => void connect(), retry);
      retry = Math.min(retry * 2, 30000);
    }
  }
  void connect();
  return () => { controller.abort(); clearTimeout(timer); };
}
