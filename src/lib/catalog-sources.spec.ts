import { describe, expect, it } from 'vitest';

import { buildCatalog, catalogSources, loadCatalog } from './catalog-sources';
import { catalogSlugs, type CatalogItem } from './types';

describe('catalog sources', () => {
  it('covers every catalog slug', () => {
    expect(Object.keys(catalogSources).sort()).toEqual([...catalogSlugs].sort());
  });

  it('merges paired files and tags each half so cards and filters can tell them apart', () => {
    const files: Record<string, CatalogItem[]> = {
      armors: [{ Index: 'Tower Shield' }],
      weapons: [{ Index: 'Berserker Axe' }]
    };
    expect(buildCatalog('bases', files)).toEqual([
      { Index: 'Tower Shield', source: 'armor' },
      { Index: 'Berserker Axe', source: 'weapon' }
    ]);
  });

  it('splits one file between the catalogs that own its rows', () => {
    const rows: CatalogItem[] = [
      { Index: 1, Notes: [{ key: 'strCubeNoteOrbOfCorruption' }] },
      { Index: 2, Notes: [{ key: 'strCubeNoteItemCrafting' }] }
    ];
    expect(buildCatalog('orbs', { 'cube-recipes': rows })).toEqual([rows[0]]);
    expect(buildCatalog('cube-recipes', { 'cube-recipes': rows })).toEqual([rows[1]]);
  });

  it('leaves single-file catalogs untagged', () => {
    const rows: CatalogItem[] = [{ Index: 'Gull' }];
    expect(buildCatalog('uniques', { uniques: rows })).toEqual(rows);
  });

  it('shares one request per catalog and retries after a failure', async () => {
    const calls: string[] = [];
    let fail = true;
    const fetcher = (async (url: string) => {
      calls.push(url);
      if (fail) return { ok: false, status: 500 } as Response;
      return { ok: true, json: async () => [{ Index: 'Gull' }] } as unknown as Response;
    }) as unknown as typeof fetch;

    await expect(loadCatalog('uniques', fetcher)).rejects.toThrow('uniques.json');

    fail = false;
    // Both callers share the retry rather than firing a request each.
    const [first, second] = await Promise.all([
      loadCatalog('uniques', fetcher),
      loadCatalog('uniques', fetcher)
    ]);

    expect(first).toEqual([{ Index: 'Gull' }]);
    expect(second).toBe(first);
    expect(calls).toEqual(['/data/keyed/uniques.json', '/data/keyed/uniques.json']);
  });
});
