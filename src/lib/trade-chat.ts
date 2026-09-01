import { writable } from 'svelte/store';

export interface TradeChatRequest {
  conversationId?: string;
  listingId?: string;
  nonce: number;
}

export const tradeChatRequest = writable<TradeChatRequest>({ nonce: 0 });

let nonce = 0;

export function openTradeChat(request: Omit<TradeChatRequest, 'nonce'> = {}): void {
  tradeChatRequest.set({ ...request, nonce: ++nonce });
}
