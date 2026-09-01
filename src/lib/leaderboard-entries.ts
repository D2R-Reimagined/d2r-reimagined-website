// Leaderboard shapes and the pure helpers over them. Kept free of `$lib`
// imports so it stays unit-testable; `$lib/leaderboards` adds the API calls.

/**
 * Where a leaderboard row's numbers came from.
 *
 * `LadderSave` rows are projected by the API from saves it holds itself, inside
 * the same transaction that stored them. `Manual` rows were uploaded by their
 * owner, so nothing about them is verified beyond the save's checksum - which is
 * why a ladder board shows projected rows only.
 */
export type CharacterSource = 'Manual' | 'LadderSave';

export interface LeaderboardEntry {
  rank: number;
  characterId: string;
  characterName: string;
  class: string;
  level: number;
  experience: number;
  isHardcore: boolean;
  ladderId: string | null;
  ladderName: string | null;
  isLadder: boolean;
  ladderSeason: number | null;
  isDead: boolean;
  userId: string;
  ownerDisplayName: string;
  ownerSteamId: string | null;
  lastTrackedAtUtc: string;
  source: CharacterSource;
  lastPlayedAtUtc: string | null;
  saveRemovedAtUtc: string | null;
}

export interface LeaderboardResponse {
  items: LeaderboardEntry[];
  total: number;
  skip: number;
  count: number;
}

export interface MyLeaderboardResponse {
  ladderId: string | null;
  entries: LeaderboardEntry[];
  total: number;
}

export interface LeaderboardRequest {
  skip?: number;
  count?: number;
  ladderId?: string | null;
  characterClass?: string;
  isHardcore?: boolean;
  source?: CharacterSource;
  search?: string;
}

export function leaderboardQuery(request: LeaderboardRequest = {}): URLSearchParams {
  const parameters = new URLSearchParams();
  parameters.set('skip', String(request.skip ?? 0));
  parameters.set('count', String(request.count ?? 25));
  if (request.ladderId) parameters.set('ladderId', request.ladderId);
  if (request.characterClass) parameters.set('class', request.characterClass);
  if (request.isHardcore !== undefined) parameters.set('isHardcore', String(request.isHardcore));
  if (request.source) parameters.set('source', request.source);
  if (request.search) parameters.set('search', request.search);
  return parameters;
}

/** A row's state, for the badge the table shows beside its name. */
export type EntryStanding = 'alive' | 'dead' | 'removed';

export function entryStanding(entry: LeaderboardEntry): EntryStanding {
  if (entry.isDead) return 'dead';

  // A softcore save can leave the bucket without anyone dying - the player
  // deleted a character they were finished with. That is not a death, and the
  // board should not claim it was.
  return entry.saveRemovedAtUtc ? 'removed' : 'alive';
}

export function formatExperience(experience: number): string {
  return experience.toLocaleString();
}
