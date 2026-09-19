import { apiRequest, apiWebSocketUrl } from '$lib/auth';
import { writable } from 'svelte/store';

export interface TradeEvent {
  type: string;
  tradeListingId?: string;
  conversationId?: string;
  eventId?: string;
  senderDisplayName?: string;
  itemName?: string;
  preview?: string;
}

const eventTypes = new Set(['offer_created', 'offer_updated', 'offer_accepted', 'message_created', 'listing_updated', 'listing_deleted']);
export const tradeEvent = writable<TradeEvent | null>(null);

export function parseTradeEvent(data: string): TradeEvent | null {
  try {
    const value: unknown = JSON.parse(data);
    if (!value || typeof value !== 'object') return null;
    const event = value as Record<string, unknown>;
    if (typeof event.type !== 'string' || !eventTypes.has(event.type)) return null;
    for (const key of ['tradeListingId', 'conversationId', 'eventId', 'senderDisplayName', 'itemName', 'preview']) {
      if (event[key] != null && typeof event[key] !== 'string') return null;
    }
    return event as unknown as TradeEvent;
  } catch { return null; }
}

export function isTradeNotification(event: TradeEvent): boolean {
  return !!(event.eventId && event.senderDisplayName && event.itemName && event.preview && event.tradeListingId);
}

export function tradeNotificationTitle(event: TradeEvent): string {
  const action = event.type === 'offer_created' ? 'New offer' : event.type === 'message_created' ? 'New message' : 'Offer update';
  return `${action} from ${event.senderDisplayName} · ${event.itemName}`;
}

// Each account owns one connection. Cleanup invalidates pending HTTP handshakes as well as sockets.
export function connectTradeEvents(userId: string, onEvent: (event: TradeEvent) => void, onConnected: () => void): () => void {
  let disposed = false;
  let socket: WebSocket | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let retry = 2000;
  const seen = new Set<string>();

  function reconnect(): void {
    if (disposed) return;
    timer = setTimeout(() => void connect(), retry + Math.random() * 500);
    retry = Math.min(retry * 2, 60000);
  }
  async function connect(): Promise<void> {
    try {
      // HTTP refreshes an expired access token using the existing secure refresh cookie.
      const user = await apiRequest<{ id: string }>('/users/me', {}, true);
      if (disposed || user.id !== userId) return;
      const current = new WebSocket(apiWebSocketUrl('/ws/trades'));
      socket = current;
      current.onopen = () => { if (!disposed) { retry = 2000; onConnected(); } };
      current.onmessage = ({ data }) => {
        if (disposed || socket !== current) return;
        const event = parseTradeEvent(String(data));
        if (!event || (event.eventId && seen.has(event.eventId))) return;
        if (event.eventId) {
          seen.add(event.eventId);
          if (seen.size > 256) seen.delete(seen.values().next().value!);
        }
        onEvent(event);
      };
      current.onclose = () => { if (socket === current) { socket = null; reconnect(); } };
      current.onerror = () => current.close();
    } catch { reconnect(); }
  }
  void connect();
  return () => {
    disposed = true;
    clearTimeout(timer);
    socket?.close();
    socket = null;
  };
}
