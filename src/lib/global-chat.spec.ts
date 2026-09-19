import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGlobalChatClient, type GlobalChatState } from './global-chat';
import { canAccessAdminPage } from './admin-access';

class Socket {
  readyState = 1;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  send = vi.fn();
  close = vi.fn(() => { this.readyState = 3; this.onclose?.(); });
  receive(data: unknown) { this.onmessage?.({ data: JSON.stringify(data) }); }
}

async function setup(allowed = true) {
  vi.useFakeTimers();
  const sockets: Socket[] = [];
  let state: GlobalChatState;
  const accepted = vi.fn();
  const authorize = vi.fn(async () => allowed);
  const client = createGlobalChatClient({
    authorize,
    connect: () => { const socket = new Socket(); sockets.push(socket); return socket as unknown as WebSocket; },
    changed: value => { state = value; }, accepted
  });
  client.start();
  await Promise.resolve();
  return { client, sockets, accepted, authorize, state: () => state };
}
const message = (id: string) => ({ messageId: id, userId: 'user', displayName: '<b>Player</b>', message: '<script>hello</script>', sentAtUtc: '2026-09-19T12:00:00Z' });
afterEach(() => vi.useRealTimers());

describe('admin global chat', () => {
  it('restricts the page to admins and does not connect without authorization', async () => {
    expect(canAccessAdminPage(['Admin'], '/admin/global-chat')).toBe(true);
    expect(canAccessAdminPage(['Moderator'], '/admin/global-chat')).toBe(false);
    expect(canAccessAdminPage([], '/admin/global-chat')).toBe(false);
    const test = await setup(false);
    expect(test.sockets).toHaveLength(0);
    expect(test.state().status).toBe('disconnected');
    test.client.stop();
  });

  it('deduplicates history and live overlap across reconnects, preserving plain text', async () => {
    const test = await setup();
    test.sockets[0].receive({ type: 'chat_message', ...message('one') });
    test.sockets[0].receive({ type: 'chat_history', messages: [message('one')] });
    expect(test.state().messages).toHaveLength(1);
    expect(test.state().messages[0]).toMatchObject(message('one'));
    test.sockets[0].close();
    await vi.advanceTimersByTimeAsync(1000);
    expect(test.authorize).toHaveBeenCalledTimes(2);
    test.sockets[1].receive({ type: 'chat_history', messages: [message('one'), message('two')] });
    expect(test.state().messages).toHaveLength(2);
    test.client.stop();
  });

  it('serializes sends and only clears a draft after acknowledgement', async () => {
    const test = await setup();
    const socket = test.sockets[0];
    socket.receive({ type: 'chat_history', messages: [] });
    test.client.send(' hello ');
    test.client.send('second');
    expect(socket.send).toHaveBeenCalledExactlyOnceWith(JSON.stringify({ message: 'hello' }));
    socket.receive({ type: 'chat_message', ...message('one') });
    expect(test.accepted).not.toHaveBeenCalled();
    socket.receive({ type: 'chat_ack', messageId: 'one' });
    expect(test.accepted).toHaveBeenCalledOnce();
    expect(test.state().sending).toBe(false);
    test.client.stop();
  });

  it('shows server rejections without clearing drafts', async () => {
    const test = await setup();
    test.sockets[0].receive({ type: 'chat_history', messages: [] });
    test.client.send('hello');
    test.sockets[0].receive({ type: 'chat_error', code: 'muted', message: 'You are muted.' });
    expect(test.state().error).toBe('You are muted.');
    expect(test.state().sending).toBe(false);
    expect(test.accepted).not.toHaveBeenCalled();
    test.client.stop();
  });

  it('never retries an uncertain send and closes before accepting another', async () => {
    const test = await setup();
    test.sockets[0].receive({ type: 'chat_history', messages: [] });
    test.client.send('hello');
    await vi.advanceTimersByTimeAsync(15_000);
    expect(test.state().error).toContain('Delivery could not be confirmed');
    expect(test.sockets[0].close).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1000);
    test.sockets[1].receive({ type: 'chat_history', messages: [message('one')] });
    expect(test.sockets[1].send).not.toHaveBeenCalled();
    expect(test.accepted).not.toHaveBeenCalled();
    test.client.stop();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(test.sockets).toHaveLength(2);
  });

  it('bounds retained messages and does not open a socket after unmount', async () => {
    const test = await setup();
    test.sockets[0].receive({ type: 'chat_history', messages: Array.from({ length: 250 }, (_, i) => message(String(i))) });
    expect(test.state().messages).toHaveLength(200);
    test.client.stop();
    let resolve!: (allowed: boolean) => void;
    const connect = vi.fn();
    const client = createGlobalChatClient({ authorize: () => new Promise<boolean>(r => { resolve = r; }), connect, changed: vi.fn(), accepted: vi.fn() });
    client.start();
    client.stop();
    resolve(true);
    await Promise.resolve();
    expect(connect).not.toHaveBeenCalled();
  });
});
