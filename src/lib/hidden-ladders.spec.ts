import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ browser: true, api: vi.fn(), initialize: vi.fn() }));
vi.mock('$app/environment', () => ({ get browser() { return mocks.browser; } }));
vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: 'https://api.example' } }));
vi.mock('$lib/auth', () => ({ apiRequest: mocks.api, initializeAuth: mocks.initialize }));

import { getActiveLadders, getLadders } from './ladders';
import { getLeaderboard } from './leaderboards';
import { getTradeListing, getTradeListings } from './trades';
import { load as loadLeaderboard } from '../routes/leaderboard/+page';
import { load as loadLayout } from '../routes/+layout';
import { loadTradeMarketplace } from './trade-marketplace';

const hidden = { id: 'hidden-id', name: 'Tester Season', isHidden: true,
  startDateUtc: '2020-01-01T00:00:00Z', endDateUtc: '2099-01-01T00:00:00Z' };
const board = { items: [], total: 0, skip: 0, count: 25 };

beforeEach(() => {
  mocks.browser = true;
  mocks.api.mockReset();
  mocks.initialize.mockReset().mockResolvedValue(undefined);
});

describe('hidden ladder page access', () => {
  it('attaches optional authentication to ladder, standings, and trade reads', async () => {
    await getLadders();
    await getActiveLadders();
    await getLeaderboard({ ladderId: hidden.id });
    await getTradeListings({ ladderId: hidden.id });
    await getTradeListing('listing-id');
    expect(mocks.api).toHaveBeenCalledTimes(5);
    for (const call of mocks.api.mock.calls) expect(call.slice(1)).toEqual([{}, 'optional']);
  });

  it('resolves a tester leaderboard deep link after authentication', async () => {
    mocks.api.mockResolvedValueOnce([hidden]).mockResolvedValueOnce(board);
    const result = await loadLeaderboard({ url: new URL(`https://website/leaderboard?ladderId=${hidden.id}`),
      fetch: vi.fn(), setHeaders: vi.fn() } as never);
    expect(result).toMatchObject({ ladders: [hidden], selectedLadderId: hidden.id, board });
    expect(mocks.initialize).toHaveBeenCalledOnce();
    expect(mocks.api.mock.calls[1][0]).toContain(`ladderId=${hidden.id}`);
  });

  it('keeps hidden boards out of public SSR and disables shared caching', async () => {
    mocks.browser = false;
    const fetch = vi.fn().mockResolvedValueOnce(Response.json([])).mockResolvedValueOnce(Response.json(board));
    const setHeaders = vi.fn();
    const result = await loadLeaderboard({ url: new URL(`https://website/leaderboard?ladderId=${hidden.id}`),
      fetch, setHeaders } as never);
    expect(result).toMatchObject({ ladders: [], selectedLadderId: null, board });
    expect(fetch.mock.calls[1][0]).not.toContain(hidden.id);
    expect(mocks.api).not.toHaveBeenCalled();
    expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'private, no-store' });
  });

  it('adds authorized hidden trade realms to navigation and resolves their listings', async () => {
    mocks.api.mockResolvedValueOnce([hidden]);
    const layout = await loadLayout({ data: { tradeEnabled: true, tradeLadders: [] },
      url: new URL('https://website/trade/TesterSeason'), depends: vi.fn() } as never);
    expect(layout?.tradeLadders).toEqual([{ ...hidden, slug: 'TesterSeason' }]);
    mocks.api.mockResolvedValueOnce(board);
    const market = await loadTradeMarketplace(vi.fn(), layout!.tradeLadders, 'TesterSeason');
    expect(market.realm.ladder?.id).toBe(hidden.id);
    expect(market.initialListings).toEqual(board);
    expect(mocks.api.mock.calls[1][0]).toContain(`ladderId=${hidden.id}`);
  });

  it('rejects a hidden trade realm absent from the viewers catalog before fetching listings', async () => {
    await expect(loadTradeMarketplace(vi.fn(), [], 'TesterSeason')).rejects.toMatchObject({ status: 404 });
    expect(mocks.api).not.toHaveBeenCalled();
  });
});
