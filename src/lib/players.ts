import { apiRequest } from '$lib/auth';

export interface OnlinePlayersResponse {
  online: number;
  measuredAtUtc: string;
}

/**
 * How many players are connected right now.
 *
 * Counted from the announcement WebSocket, which is the same set the server
 * would actually broadcast to - so the number on the page and the number an
 * announcement reaches are the same number, and cannot drift apart.
 *
 * A player whose loader does not carry the announcements plugin is not counted,
 * because the server cannot see them.
 */
export function getOnlinePlayers(): Promise<OnlinePlayersResponse> {
  return apiRequest<OnlinePlayersResponse>('/players/online');
}
