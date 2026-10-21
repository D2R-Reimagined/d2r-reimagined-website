import { describe, expect, it } from 'vitest';

import { buildCatalog, catalogSources, loadCatalog } from './catalog-sources';
import { catalogSlugs, type CatalogItem } from './types';
import runewords from '../../static/data/keyed/runewords.json';
import { load as loadHome } from '../routes/+page.server';
import { load as loadGrail } from '../routes/grail/+page.server';

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

  it('still hides the legacy placeholder runewords if an export ships them', () => {
    const rows: CatalogItem[] = [{ Index: 'Rain' }, { Index: 'Rain Reimagined' }, { Index: 'Fortitude (Dummy)' }, { Index: 'Fortitude' }];
    expect(buildCatalog('runewords', { runewords: rows })).toEqual([rows[0], rows[3]]);
  });

  it('shows every exported runeword across catalogs, search, counts, and the grail', async () => {
    const rows = runewords as CatalogItem[];
    const names = rows.map((row) => String(row.Index));
    // The merged mod source no longer defines the placeholder rows; the real runewords they shadowed remain.
    expect(names).not.toContain('Fortitude (Dummy)');
    expect(names).not.toContain('Rain Reimagined');
    expect(names).toEqual(expect.arrayContaining(['Fortitude', 'Rain', 'Unity', 'Insanity', 'Chromaskin', 'Ravage']));
    expect(buildCatalog('runewords', { runewords: rows })).toEqual(rows);

    const fetcher = (async () => ({ ok: true, json: async () => rows })) as unknown as typeof fetch;
    expect(await loadCatalog('runewords', fetcher)).toEqual(rows);
    expect(loadHome().counts.runewords).toBe(rows.length);
    expect(loadGrail().runewords.map((row) => row.Index)).toEqual(names);
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
