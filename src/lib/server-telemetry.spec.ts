import { afterEach, expect, it, vi } from 'vitest';
const stream = vi.hoisted(() => vi.fn());
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn(), apiStreamRequest: stream,
  ApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { ApiError } from '#lib/auth.js';
import { appendLogs, bundleRevisionSummary, connectServerTelemetry, d2rLoaderSummary, installedBuildSummary, TelemetryEventParser, type TelemetryFrame, type TelemetryLog } from './server-telemetry';
const frame: TelemetryFrame = { nowUtc: '2026-10-02T12:00:00Z', servers: [], serverId: 'eu-1', cursor: 1, gap: false,
  entries: [{ cursor: 1, session: 'one', sourceId: 1, timestamp: 1, level: 1, message: 'Aurelia joined 漢' }] };
const wire = (f = frame) => `event: telemetry\ndata: ${JSON.stringify(f)}\n\n`;
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });
it('parses arbitrarily split frames and multiple events without losing log text', () => {
  const parser = new TelemetryEventParser();
  const text = wire();
  expect(parser.push(text.slice(0, 25))).toEqual([]);
  expect(parser.push(text.slice(25) + ': keepalive\n\n' + text)).toEqual([frame, frame]);
  expect(() => parser.push('event: telemetry\ndata: {"cursor":-1,"servers":[],"entries":[]}\n\n')).toThrow();
});
it('bounds malformed input that never completes a frame', () => {
  expect(() => new TelemetryEventParser().push('x'.repeat(4 * 1024 * 1024 + 1))).toThrow();
});
it('accepts CRLF stream delimiters split between network chunks', () => {
  const parser = new TelemetryEventParser();
  const text = wire().replaceAll('\n', '\r\n');
  expect(parser.push(text.slice(0, -1))).toEqual([]);
  expect(parser.push(text.slice(-1))).toEqual([frame]);
});
it('deduplicates retries but keeps the same source IDs after process restarts', () => {
  const first = frame.entries[0];
  const restart = { ...first, session: 'two', cursor: 2 };
  expect(appendLogs([first], [first, restart])).toEqual([first, restart]);
  expect(appendLogs([first], [restart], 1)).toEqual([restart]);
  const large: TelemetryLog[] = Array.from({ length: 100 }, (_, i) => ({ ...first, sourceId: i, message: '漢'.repeat(16000) }));
  expect(appendLogs([], large).length).toBeLessThan(25);
});
it('reconnects with the received cursor and aborts cleanup without late updates', async () => {
  vi.useFakeTimers();
  stream.mockImplementation(() => Promise.resolve(new Response(new ReadableStream({ start(c) {
    c.enqueue(new TextEncoder().encode(wire())); c.close();
  } }))));
  const update = vi.fn(); const status = vi.fn();
  const stop = connectServerTelemetry('eu 1', update, status);
  await vi.advanceTimersByTimeAsync(0);
  expect(update).toHaveBeenCalledWith(frame);
  await vi.advanceTimersByTimeAsync(1000);
  expect(stream.mock.calls[1][0]).toBe('/admin/servers/eu%201/events?after=1');
  const signal = stream.mock.calls[1][1] as AbortSignal;
  stop(); expect(signal.aborted).toBe(false); // completed attempt is already detached
  const calls = stream.mock.calls.length;
  await vi.advanceTimersByTimeAsync(60000);
  expect(stream).toHaveBeenCalledTimes(calls);
});
it('summarises a card\'s installed server build against its ladder', () => {
  const current = { id: 'bbbbbbbb-0000', ladderId: 'l', sha256: 'B'.repeat(64), sizeBytes: 1, uploadedAtUtc: frame.nowUtc, status: 'current' as const };
  const ladder = { ladderId: 'l', currentBuildId: current.id, builds: [current] };
  const reportedAtUtc = frame.nowUtc;
  expect(installedBuildSummary({ buildId: current.id, sha256: current.sha256, reportedAtUtc }, ladder))
    .toEqual({ label: 'bbbbbbbb', title: `Installed SHA-256 ${current.sha256}`, match: 'up-to-date' });
  const old = installedBuildSummary({ buildId: 'aaaaaaaa-0000', sha256: 'A'.repeat(64), reportedAtUtc }, ladder);
  expect(old.match).toBe('outdated'); expect(old.title).toContain(`Ladder current bbbbbbbb · ${current.sha256}`);
  expect(installedBuildSummary({ buildId: null, sha256: 'C'.repeat(64), reportedAtUtc }, undefined)).toMatchObject({ label: 'Unknown build', match: 'unknown-build' });
  expect(installedBuildSummary(undefined, ladder)).toEqual({ label: 'Not reported', title: '', match: 'not-reported' });
  expect(installedBuildSummary({ buildId: current.id, sha256: current.sha256, reportedAtUtc }, undefined).match).toBeNull();
});
it('summarises a card\'s installed ladder bundle revision against its ladder', () => {
  const ladder = { bundleId: 'b5', revision: 5, minimumD2RLoaderVersion: '1.3.1', pinnedD2RLoaderVersion: null };
  const installed = { bundleId: 'b5', revision: 5, d2rLoaderVersion: '1.3.1', d2rLoaderMatchesPin: null, reportedAtUtc: frame.nowUtc };
  expect(bundleRevisionSummary(installed, ladder)).toMatchObject({ label: 'revision 5', note: 'up to date', tone: 'ok' });
  expect(bundleRevisionSummary({ ...installed, bundleId: 'b4', revision: 4 }, ladder)).toMatchObject({ label: 'revision 4', note: 'ladder is on revision 5', tone: 'warn' });
  expect(bundleRevisionSummary({ ...installed, bundleId: null, revision: null }, ladder)).toMatchObject({ label: 'None recorded', tone: 'warn' });
  expect(bundleRevisionSummary(installed, undefined)).toMatchObject({ label: 'revision 5', note: '', tone: null });
  expect(bundleRevisionSummary(undefined, ladder)).toEqual({ label: 'Not reported', note: '', tone: null, title: '' });
});
it('summarises a card\'s D2RLoader against the ladder\'s pin or the bundle\'s minimum', () => {
  const pinned = { bundleId: 'b5', revision: 5, minimumD2RLoaderVersion: '1.3.1', pinnedD2RLoaderVersion: '1.3.1-beta' };
  const installed = { bundleId: 'b5', revision: 5, d2rLoaderVersion: '1.3.1-beta', d2rLoaderMatchesPin: true, reportedAtUtc: frame.nowUtc };
  expect(d2rLoaderSummary(installed, pinned)).toMatchObject({ label: '1.3.1-beta', note: 'matches the ladder\'s pin', tone: 'ok' });
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: '1.3.2', d2rLoaderMatchesPin: false }, pinned))
    .toMatchObject({ label: '1.3.2', note: 'not the ladder\'s pinned 1.3.1-beta', tone: 'warn' });
  // A Linux host reports no version: a matching pin names it.
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: null }, pinned)).toMatchObject({ label: '1.3.1-beta', tone: 'ok' });
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: null, d2rLoaderMatchesPin: false }, pinned)).toMatchObject({ label: 'Unknown version', tone: 'warn' });
  const unpinned = { ...pinned, pinnedD2RLoaderVersion: null };
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: '1.3.1.0', d2rLoaderMatchesPin: null }, unpinned)).toMatchObject({ note: 'meets the bundle\'s minimum 1.3.1', tone: 'ok' });
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: '1.2.9', d2rLoaderMatchesPin: null }, unpinned)).toMatchObject({ note: 'below the bundle\'s minimum 1.3.1', tone: 'warn' });
  expect(d2rLoaderSummary({ ...installed, d2rLoaderVersion: null, d2rLoaderMatchesPin: null }, unpinned)).toMatchObject({ note: 'bundle needs 1.3.1 or newer', tone: null });
  expect(d2rLoaderSummary(undefined, pinned)).toMatchObject({ label: 'Not reported', tone: null });
});
it('stops reconnecting when current admin access is denied', async () => {
  vi.useFakeTimers(); stream.mockRejectedValue(new ApiError('Forbidden', 403));
  const status = vi.fn(); const stop = connectServerTelemetry('a', vi.fn(), status);
  await vi.advanceTimersByTimeAsync(60000);
  expect(stream).toHaveBeenCalledOnce(); expect(status).toHaveBeenCalledWith('Access unavailable', 'Forbidden'); stop();
});
