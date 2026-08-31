import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';
import { defaultLadder, type LadderSummary } from '$lib/ladder-schedule';
import { leaderboardQuery, type LeaderboardResponse } from '$lib/leaderboard-entries';

// SvelteKit only allows its own exports from a server load module, so this is
// local. The page keeps its own copy for client-side paging.
const pageSize = 25;

function apiBaseUrl(): string {
  return (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
}

/**
 * Renders the first page of the board on the server.
 *
 * The board is public and the same for everyone, so serving it already-rendered
 * costs nothing and means a shared link shows standings rather than a spinner.
 * The signed-in player's own rank needs their token, so it stays a client call.
 */
export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
  setHeaders({ 'cache-control': 'public, max-age=30, stale-while-revalidate=300' });

  const requestedLadderId = url.searchParams.get('ladderId');

  let ladders: LadderSummary[] = [];
  try {
    const response = await fetch(`${apiBaseUrl()}/ladders`);
    if (response.ok) ladders = (await response.json()) as LadderSummary[];
  } catch {
    // A board with no ladder list still works - it falls back to Standard.
    ladders = [];
  }

  // An unknown id in the URL falls back rather than rendering an empty board
  // that looks like nobody has played.
  const selected = requestedLadderId
    ? (ladders.find((ladder) => ladder.id === requestedLadderId)?.id ?? null)
    : (defaultLadder(ladders)?.id ?? null);

  const query = leaderboardQuery({ skip: 0, count: pageSize, ladderId: selected });

  try {
    const response = await fetch(`${apiBaseUrl()}/leaderboards/characters?${query}`);
    if (!response.ok) throw new Error(`The leaderboard API returned ${response.status}.`);

    return {
      ladders,
      selectedLadderId: selected,
      board: (await response.json()) as LeaderboardResponse,
      error: null as string | null
    };
  } catch {
    return {
      ladders,
      selectedLadderId: selected,
      board: null,
      error: 'The leaderboard could not be loaded.'
    };
  }
};
