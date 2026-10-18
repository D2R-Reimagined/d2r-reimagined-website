import { ApiError, apiRequest, apiStreamRequest } from '$lib/auth';
import type { ServerBuildState } from '$lib/admin';
import { currentServerBuild, installedBuildLabels, installedBuildMatch, shortBuildId, type InstalledBuildMatch,
  type InstalledServerBuild } from '$lib/server-builds';

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
  /** The d2rl-d2rds.dll its supervisor last reported installed; absent until it reports one. */
  serverBuild?: InstalledServerBuild | null;
}
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
