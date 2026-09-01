import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CatalogItem } from './types';
import { buildItemUpgradeTiers } from './item-upgrade-tiers';

function bases(): CatalogItem[] {
  return ['armors', 'weapons'].flatMap(
    (file) =>
      JSON.parse(
        readFileSync(resolve('static/data/keyed', `${file}.json`), 'utf8')
      ) as CatalogItem[]
  );
}

describe('item upgrade tiers', () => {
  it('groups every tier of a base under each of its codes', () => {
    const tiers = buildItemUpgradeTiers([
      { NameKey: 'ci1', NormCode: 'ci1', UberCode: 'ci2', UltraCode: 'ci3' }
    ]);

    expect([...(tiers.get('ci3') ?? [])].sort()).toEqual(['ci1', 'ci2', 'ci3']);
    expect(tiers.get('ci1')).toBe(tiers.get('ci3'));
  });

  it('merges chains that name one another so any tier reaches the whole family', () => {
    const tiers = buildItemUpgradeTiers([
      { NameKey: 'ci0', NormCode: 'ci0', UberCode: 'ci2', UltraCode: 'ci3' },
      { NameKey: 'ci1', NormCode: 'ci1', UberCode: 'ci2', UltraCode: 'ci3' }
    ]);

    expect([...(tiers.get('ci0') ?? [])].sort()).toEqual(['ci0', 'ci1', 'ci2', 'ci3']);
  });

  it('keeps unrelated bases apart', () => {
    const tiers = buildItemUpgradeTiers([
      { NameKey: 'ci1', NormCode: 'ci1', UberCode: 'ci2', UltraCode: 'ci3' },
      { NameKey: 'aqv', NormCode: 'aqv', UberCode: 'aqv', UltraCode: 'aqv' }
    ]);

    expect(tiers.get('ci3')?.has('aqv')).toBe(false);
  });

  it('reads the shipped base catalogs without merging distinct item families', () => {
    const tiers = buildItemUpgradeTiers(bases());

    expect([...(tiers.get('ci3') ?? [])].sort()).toEqual(['ci0', 'ci1', 'ci2', 'ci3']);
    expect([...(tiers.get('uui') ?? [])].sort()).toEqual(['qui', 'uui', 'xui']);
    // Circlets never share a chain with body armour, however far the merge walks.
    expect(tiers.get('ci3')?.has('uui')).toBe(false);
    expect(Math.max(...[...new Set(tiers.values())].map((family) => family.size))).toBeLessThan(8);
  });
});
