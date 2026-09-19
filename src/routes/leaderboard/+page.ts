import { browser } from '$app/environment';
import { initializeAuth, apiRequest } from '$lib/auth';
import type { PageLoad } from './$types';
import { env } from '$env/dynamic/public';
import { defaultLadder, type LadderSummary } from '$lib/ladder-schedule';
import { leaderboardClass, leaderboardQuery, type LeaderboardResponse } from '$lib/leaderboard-entries';

// The page keeps its own copy for client-side paging.
const pageSize = 25;

function apiBaseUrl(): string {
  return (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
}

// Public SSR is refreshed with the signed-in viewer's ladders during hydration.
export const load: PageLoad = async ({ fetch, url, setHeaders }) => {
  if (!browser) setHeaders({ 'cache-control': 'private, no-store' });
  if (browser) await initializeAuth();
  async function read<T>(path: string): Promise<T> {
    if (browser) return apiRequest<T>(path, {}, 'optional');
    const response = await fetch(`${apiBaseUrl()}${path}`);
    if (!response.ok) throw new Error(`The API returned ${response.status}.`);
    return response.json() as Promise<T>;
  }

  const requestedLadderId = url.searchParams.get('ladderId');
  const selectedClass = leaderboardClass(url.searchParams.get('class'));

  let ladders: LadderSummary[] = [];
  try {
    ladders = await read<LadderSummary[]>('/ladders/summaries');
  } catch {
    // A board with no ladder list still works - it falls back to Standard.
    ladders = [];
  }

  // An unknown id in the URL falls back rather than rendering an empty board
  // that looks like nobody has played.
  const selected = requestedLadderId !== null
    ? (ladders.find((ladder) => ladder.id === requestedLadderId)?.id ?? null)
    : (defaultLadder(ladders)?.id ?? null);

  const query = leaderboardQuery({ skip: 0, count: pageSize, ladderId: selected, characterClass: selectedClass });

  try {
    const board = await read<LeaderboardResponse>(`/leaderboards/characters?${query}`);

    return {
      ladders,
      selectedLadderId: selected,
      selectedClass,
      board,
      error: null as string | null
    };
  } catch {
    return {
      ladders,
      selectedLadderId: selected,
      selectedClass,
      board: null,
      error: 'The leaderboard could not be loaded.'
    };
  }
};
