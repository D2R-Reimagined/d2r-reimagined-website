import { afterEach, describe, expect, it, vi } from 'vitest';
const request = vi.hoisted(() => vi.fn());
vi.mock('$lib/auth', () => ({ apiRequest: request, apiWebSocketUrl: () => 'wss://api.example/ws/trades' }));
import { connectTradeEvents, isTradeNotification, parseTradeEvent } from './trade-realtime';

class Socket {
  static all: Socket[] = [];
  onopen?: () => void;
  onclose?: () => void;
  onmessage?: (event: { data: string }) => void;
  onerror?: () => void;
  close = vi.fn(() => this.onclose?.());
  constructor() { Socket.all.push(this); }
}
const notification = { type: 'offer_created', eventId: 'event', tradeListingId: 'listing', senderDisplayName: 'Buyer', itemName: 'Ring', preview: 'Two Ber' };
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.clearAllMocks(); Socket.all = []; });

describe('trade notifications', () => {
  it('rejects malformed frames and distinguishes sender refreshes from recipient notifications', () => {
    expect(parseTradeEvent('{')).toBeNull();
    expect(parseTradeEvent('null')).toBeNull();
    expect(parseTradeEvent('{"type":"unknown"}')).toBeNull();
    expect(parseTradeEvent('{"type":"offer_created","preview":123}')).toBeNull();
    expect(isTradeNotification(parseTradeEvent(JSON.stringify(notification))!)).toBe(true);
    expect(isTradeNotification({ type: 'offer_created', tradeListingId: 'listing' })).toBe(false);
  });

  it('refreshes auth before reconnect, deduplicates events, and stops on cleanup', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('WebSocket', Socket);
    request.mockResolvedValue({ id: 'seller' });
    const received = vi.fn();
    const ready = vi.fn();
    const stop = connectTradeEvents('seller', received, ready);
    await vi.advanceTimersByTimeAsync(0);
    const socket = Socket.all[0];
    socket.onopen?.();
    socket.onmessage?.({ data: JSON.stringify(notification) });
    socket.onmessage?.({ data: JSON.stringify(notification) });
    socket.onmessage?.({ data: '{' });
    expect(received).toHaveBeenCalledTimes(1);
    expect(ready).toHaveBeenCalledOnce();
    socket.close();
    await vi.advanceTimersByTimeAsync(2600);
    expect(request).toHaveBeenCalledTimes(2);
    stop();
    await vi.advanceTimersByTimeAsync(120000);
    expect(Socket.all).toHaveLength(2);
    Socket.all[1].onmessage?.({ data: JSON.stringify({ ...notification, eventId: 'late' }) });
    expect(received).toHaveBeenCalledTimes(1);
  });

  it('does not connect when an old account handshake finishes after logout', async () => {
    vi.stubGlobal('WebSocket', Socket);
    let finish!: (value: { id: string }) => void;
    request.mockReturnValue(new Promise((resolve) => finish = resolve));
    const stop = connectTradeEvents('seller', vi.fn(), vi.fn());
    stop();
    finish({ id: 'seller' });
    await Promise.resolve();
    expect(Socket.all).toHaveLength(0);
  });
});
