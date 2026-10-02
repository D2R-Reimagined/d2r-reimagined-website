import { afterEach, expect, it, vi } from 'vitest';
const stream = vi.hoisted(() => vi.fn());
vi.mock('$lib/auth', () => ({ apiRequest: vi.fn(), apiStreamRequest: stream,
  ApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { ApiError } from '$lib/auth';
import { appendLogs, connectServerTelemetry, TelemetryEventParser, type TelemetryFrame, type TelemetryLog } from './server-telemetry';
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
it('stops reconnecting when current admin access is denied', async () => {
  vi.useFakeTimers(); stream.mockRejectedValue(new ApiError('Forbidden', 403));
  const status = vi.fn(); const stop = connectServerTelemetry('a', vi.fn(), status);
  await vi.advanceTimersByTimeAsync(60000);
  expect(stream).toHaveBeenCalledOnce(); expect(status).toHaveBeenCalledWith('Access unavailable', 'Forbidden'); stop();
});
