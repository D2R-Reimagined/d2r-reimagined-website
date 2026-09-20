// The sender's chat role, already resolved by the API: admin over moderator
// when they hold both, absent for a player. Same values the game plugin reads.
export type GlobalChatRole = 'admin' | 'moderator';

export interface GlobalChatMessage {
  messageId: string;
  userId: string;
  displayName: string;
  message: string;
  sentAtUtc: string;
  role?: GlobalChatRole;
}

// Red for an admin, matching the server's own lines in game; blue for a
// moderator; the usual name colour for everyone else. Anything unrecognised is
// treated as no role rather than trusted.
export function roleNameClass(role: unknown): string {
  if (role === 'admin') return 'text-requirement';
  if (role === 'moderator') return 'text-magic';
  return 'text-ember-400';
}

export function roleLabel(role: unknown): string {
  if (role === 'admin') return 'Admin';
  if (role === 'moderator') return 'Moderator';
  return '';
}

export interface GlobalChatState {
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  messages: GlobalChatMessage[];
  sending: boolean;
  error: string;
}

// One outstanding send: the wire protocol has no client request IDs.
export function createGlobalChatClient(dependencies: {
  authorize: () => Promise<boolean>;
  connect: () => WebSocket;
  changed: (state: GlobalChatState) => void;
  accepted: () => void;
}) {
  let state: GlobalChatState = { status: 'connecting', messages: [], sending: false, error: '' };
  let socket: WebSocket | undefined;
  let stopped = false;
  let attempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let sendTimer: ReturnType<typeof setTimeout> | undefined;
  let connectionTimer: ReturnType<typeof setTimeout> | undefined;
  const seen = new Set<string>();
  const update = (patch: Partial<GlobalChatState>) => {
    state = { ...state, ...patch };
    dependencies.changed(state);
  };
  function uncertain() {
    clearTimeout(sendTimer);
    if (state.sending) update({ sending: false, error: 'Delivery could not be confirmed. Check recent messages before sending again.' });
  }
  function retry() {
    if (stopped) return;
    update({ status: 'reconnecting' });
    const delay = Math.min(30_000, 1000 * 2 ** Math.min(attempts++, 5)) * (0.8 + Math.random() * 0.2);
    reconnectTimer = setTimeout(() => void connect(), delay);
  }
  function receiveMessages(incoming: GlobalChatMessage[]) {
    const fresh = incoming.filter(message => {
      if (!message || typeof message.messageId !== 'string' || typeof message.message !== 'string' ||
          typeof message.displayName !== 'string' || typeof message.sentAtUtc !== 'string' || seen.has(message.messageId)) return false;
      seen.add(message.messageId);
      // Keep only a role this build knows, so an unexpected value cannot style anything.
      if (message.role !== 'admin' && message.role !== 'moderator') delete message.role;
      return true;
    });
    while (seen.size > 1000) seen.delete(seen.values().next().value!);
    update({ messages: [...state.messages, ...fresh].sort((a, b) => a.sentAtUtc.localeCompare(b.sentAtUtc)).slice(-200) });
  }
  async function connect() {
    try {
      if (!await dependencies.authorize()) {
        if (!stopped) update({ status: 'disconnected', error: 'Sign in with an Admin account to use global chat.' });
        return;
      }
      if (stopped) return;
      const current = dependencies.connect();
      socket = current;
      connectionTimer = setTimeout(() => current.close(), 15_000);
      current.onmessage = event => {
        if (stopped || current !== socket) return;
        let data;
        try { data = JSON.parse(event.data); } catch { return; }
        if (!data || typeof data !== 'object') return;
        if (data.type === 'chat_history' && Array.isArray(data.messages)) {
          clearTimeout(connectionTimer);
          attempts = 0;
          update({ status: 'connected' });
          receiveMessages(data.messages);
        } else if (data.type === 'chat_message') {
          receiveMessages([data]);
        } else if (data.type === 'chat_ack' && state.sending) {
          clearTimeout(sendTimer);
          update({ sending: false, error: '' });
          dependencies.accepted();
        } else if (data.type === 'chat_error') {
          clearTimeout(sendTimer);
          update({ sending: false, error: typeof data.message === 'string' ? data.message : 'Unable to send this message.' });
        }
      };
      current.onclose = () => {
        if (stopped || current !== socket) return;
        clearTimeout(connectionTimer);
        uncertain();
        socket = undefined;
        retry();
      };
      current.onerror = () => current.close();
    } catch {
      if (!stopped) retry();
    }
  }
  return {
    start: () => void connect(),
    send(message: string) {
      const text = message.trim();
      if (!text || text.length > 500 || state.sending || state.status !== 'connected' || socket?.readyState !== 1) return;
      update({ sending: true, error: '' });
      try {
        socket.send(JSON.stringify({ message: text }));
        sendTimer = setTimeout(() => {
          uncertain();
          // Reconnect before another send so a late ack cannot clear a new draft.
          update({ status: 'reconnecting' });
          socket?.close();
        }, 15_000);
      } catch {
        uncertain();
        update({ status: 'reconnecting' });
        socket?.close();
      }
    },
    stop() {
      stopped = true;
      clearTimeout(reconnectTimer);
      clearTimeout(sendTimer);
      clearTimeout(connectionTimer);
      socket?.close();
    }
  };
}
