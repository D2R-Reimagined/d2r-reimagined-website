import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { SaveItem } from '$lib/characters';
import { rareItemName, type RareNamePresentation } from './rare-name-presentation';

const names: RareNamePresentation = {
  // The save indexes one combined table: null, suffix rows, then prefix rows.
  Names: [null, 'bite', 'scratch', 'Beast', 'Eagle']
};

function item(quality: string, rarePrefixId: unknown, rareSuffixId: unknown): SaveItem {
  return {
    quality,
    qualityData: {
      type: 'RareCraftQualityData',
      fileIndex: null,
      properties: { rarePrefixId, rareSuffixId }
    }
  } as unknown as SaveItem;
}

describe('rare item names', () => {
  it('resolves the one-based prefix and suffix IDs stored in the save', () => {
    expect(rareItemName(item('Rare', 4, 1), names)).toBe('Eagle bite');
  });

  it('uses localized values for both generated name halves', () => {
    const translations: Record<string, string> = { Beast: 'Bête', scratch: 'Éraflure' };
    expect(rareItemName(item('Crafted', 3, 2), names, (key) => translations[key] ?? key))
      .toBe('Bête Éraflure');
  });

  it('falls back when the saved IDs cannot be resolved', () => {
    expect(rareItemName(item('Rare', 99, 1), names)).toBeNull();
    expect(rareItemName(item('Magic', 1, 1), names)).toBeNull();
  });

  it('resolves the generated data IDs from an actual parsed Reimagined save', () => {
    const exported = JSON.parse(
      readFileSync(resolve('static/data/keyed/rare-names.json'), 'utf8')
    ) as RareNamePresentation;
    const strings = JSON.parse(
      readFileSync(resolve('static/data/strings/enUS.json'), 'utf8')
    ) as Record<string, string>;

    expect(rareItemName(item('Rare', 164, 132), exported, (key) => strings[key] ?? key))
      .toBe('Doom Heart');
  });
});
