import { apiRequest } from '$lib/auth';
import type { CharacterDetailsResponse, SaveItem } from '$lib/characters';

export type TradeListingStatus = 'Active' | 'Reserved' | 'Completed' | 'Cancelled' | 'Expired';
export type TradeOfferStatus = 'Pending' | 'Accepted' | 'Declined' | 'Withdrawn';

export interface TradeListing {
  id: string;
  sellerId: string;
  sellerDisplayName: string;
  buyerId: string | null;
  buyerDisplayName: string | null;
  characterId: string | null;
  characterName: string | null;
  ladderId: string | null;
  ladderName: string | null;
  title: string;
  itemName: string;
  description: string | null;
  itemData: string | null;
  itemCode: string | null;
  itemQuality: string | null;
  itemType: string | null;
  requiredLevel: number | null;
  itemLevel: number | null;
  socketCount: number | null;
  isEthereal: boolean;
  isCorrupted: boolean;
  isLadder: boolean;
  price: string | null;
  isNegotiable: boolean;
  status: TradeListingStatus;
  expiresAtUtc: string | null;
  lastBumpedAtUtc: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  offerCount: number;
}

export interface TradeListingPage {
  items: TradeListing[];
  total: number;
  skip: number;
  count: number;
}

export type TradePropertyGroupType = 'And' | 'Or' | 'Count';

export interface TradePropertyFilter {
  stat: string;
  layer?: number;
  minimumValue?: number;
  maximumValue?: number;
  valueShift: number;
  valueFunction?: number;
}

export interface TradePropertyFilterGroup {
  type: TradePropertyGroupType;
  minimumCount?: number;
  maximumCount?: number;
  filters: TradePropertyFilter[];
}

export interface TradeFilters {
  skip?: number;
  count?: number;
  status?: TradeListingStatus;
  sellerId?: string;
  ladderId?: string;
  search?: string;
  quality?: string;
  itemType?: string;
  isLadder?: boolean;
  isNegotiable?: boolean;
  isEthereal?: boolean;
  isCorrupted?: boolean;
  minimumRequiredLevel?: number;
  maximumRequiredLevel?: number;
  minimumItemLevel?: number;
  minimumSockets?: number;
  maximumSockets?: number;
  property?: string;
  propertyGroups?: TradePropertyFilterGroup[];
}

export interface CreateTradeListing {
  characterId: string | null;
  ladderId: string | null;
  title: string;
  itemName: string;
  description: string | null;
  itemData: string;
  itemCode: string | null;
  itemQuality: string | null;
  itemType: string | null;
  requiredLevel: number | null;
  itemLevel: number | null;
  socketCount: number | null;
  isEthereal: boolean;
  isCorrupted: boolean;
  isLadder: boolean;
  price: string | null;
  isNegotiable: boolean;
}

export interface TradeOffer {
  id: string;
  tradeListingId: string;
  conversationId: string;
  buyerId: string;
  buyerDisplayName: string;
  offerText: string;
  status: TradeOfferStatus;
  respondedAtUtc: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface TradeMessage {
  id: string;
  authorId: string;
  authorDisplayName: string;
  body: string;
  createdAtUtc: string;
}

export interface TradeConversationSummary {
  id: string;
  tradeListingId: string;
  listingTitle: string;
  itemName: string;
  otherUserId: string;
  otherUserDisplayName: string;
  lastMessage: string | null;
  lastMessageAtUtc: string | null;
  unreadCount: number;
  isAcceptedTrade: boolean;
  createdAtUtc: string;
}

export interface TradeConversation {
  id: string;
  listing: TradeListing;
  buyerId: string;
  buyerDisplayName: string;
  sellerId: string;
  sellerDisplayName: string;
  messages: TradeMessage[];
  offers: TradeOffer[];
  createdAtUtc: string;
}

export interface SharedStashTab {
  index: number;
  type: string;
  gold: number;
  items: SaveItem[];
}

export interface SharedStash {
  profile: string;
  fileName: string;
  itemFormat: number;
  tabs: SharedStashTab[];
}

export interface TradeInventory {
  ladderId: string | null;
  characters: CharacterDetailsResponse[];
  sharedStashes: SharedStash[];
}

function queryString(filters: TradeFilters): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    query.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  return query.toString();
}

export function getTradeListings(filters: TradeFilters = {}): Promise<TradeListingPage> {
  const query = queryString({ count: 24, ...filters });
  return apiRequest<TradeListingPage>(`/trades?${query}`);
}

export function getTradeListing(id: string): Promise<TradeListing> {
  return apiRequest<TradeListing>(`/trades/${encodeURIComponent(id)}`);
}

export function getMyTradeListings(): Promise<TradeListing[]> {
  return apiRequest<TradeListing[]>('/trades/mine', {}, true);
}

export function getTradeInventory(ladderId: string | null): Promise<TradeInventory> {
  const query = ladderId ? `?ladderId=${encodeURIComponent(ladderId)}` : '';
  return apiRequest<TradeInventory>(`/trades/inventory${query}`, {}, true);
}

export function createTradeListing(input: CreateTradeListing): Promise<TradeListing> {
  return apiRequest<TradeListing>('/trades', {
    method: 'POST',
    body: JSON.stringify(input)
  }, true);
}

export function updateTradeListing(
  id: string,
  input: Partial<CreateTradeListing> & { status?: TradeListingStatus }
): Promise<TradeListing> {
  return apiRequest<TradeListing>(`/trades/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input)
  }, true);
}

export function getTradeOffers(listingId: string): Promise<TradeOffer[]> {
  return apiRequest<TradeOffer[]>(`/trades/${encodeURIComponent(listingId)}/offers`, {}, true);
}

export function createTradeOffer(listingId: string, offerText: string): Promise<TradeOffer> {
  return apiRequest<TradeOffer>(`/trades/${encodeURIComponent(listingId)}/offers`, {
    method: 'POST',
    body: JSON.stringify({ offerText })
  }, true);
}

export function acceptTradeOffer(id: string): Promise<TradeOffer> {
  return apiRequest<TradeOffer>(`/trades/offers/${encodeURIComponent(id)}/accept`, { method: 'POST' }, true);
}

export function declineTradeOffer(id: string): Promise<TradeOffer> {
  return apiRequest<TradeOffer>(`/trades/offers/${encodeURIComponent(id)}/decline`, { method: 'POST' }, true);
}

export function withdrawTradeOffer(id: string): Promise<TradeOffer> {
  return apiRequest<TradeOffer>(`/trades/offers/${encodeURIComponent(id)}/withdraw`, { method: 'POST' }, true);
}

export function getTradeConversations(): Promise<TradeConversationSummary[]> {
  return apiRequest<TradeConversationSummary[]>('/trades/conversations', {}, true);
}

export function startTradeConversation(listingId: string): Promise<TradeConversation> {
  return apiRequest<TradeConversation>(`/trades/${encodeURIComponent(listingId)}/conversations`, {
    method: 'POST'
  }, true);
}

export function getTradeConversation(id: string): Promise<TradeConversation> {
  return apiRequest<TradeConversation>(`/trades/conversations/${encodeURIComponent(id)}`, {}, true);
}

export function sendTradeMessage(id: string, body: string): Promise<TradeMessage> {
  return apiRequest<TradeMessage>(`/trades/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body })
  }, true);
}
