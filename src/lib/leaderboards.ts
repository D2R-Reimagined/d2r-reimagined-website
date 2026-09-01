import { apiRequest } from '$lib/auth';
import {
  leaderboardQuery,
  type LeaderboardRequest,
  type LeaderboardResponse,
  type MyLeaderboardResponse
} from '$lib/leaderboard-entries';

export type {
  CharacterSource,
  EntryStanding,
  LeaderboardEntry,
  LeaderboardRequest,
  LeaderboardResponse,
  MyLeaderboardResponse
} from '$lib/leaderboard-entries';
export { entryStanding, formatExperience, leaderboardQuery } from '$lib/leaderboard-entries';

export function getLeaderboard(request: LeaderboardRequest = {}): Promise<LeaderboardResponse> {
  return apiRequest<LeaderboardResponse>(`/leaderboards/characters?${leaderboardQuery(request)}`);
}

/**
 * The signed-in player's own rows on the same board, each carrying its absolute
 * rank. Separate from the paged board because finding yourself on it otherwise
 * means fetching every page above you.
 */
export function getMyLeaderboardEntries(
  request: LeaderboardRequest = {}
): Promise<MyLeaderboardResponse> {
  return apiRequest<MyLeaderboardResponse>(
    `/leaderboards/characters/mine?${leaderboardQuery(request)}`,
    {},
    true
  );
}
