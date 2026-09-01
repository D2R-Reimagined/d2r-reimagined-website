import { describe, expect, it } from 'vitest';

import { buildOrbs, isOrbRecipe } from './orbs';
import type { CatalogItem } from './types';

const CORRUPTION = 'strCubeNoteOrbOfCorruption';
const INFUSION = 'strCubeNoteOrbOfInfusion';

let nextIndex = 0;

function recipe(
  note: string,
  reagent: string,
  target: string,
  outputs: CatalogItem['Outputs'],
  requires: string[] = []
): CatalogItem {
  return {
    Index: (nextIndex += 1),
    Inputs: [
      { Name: { key: target }, Quantity: 1, Qualifiers: requires.map((key) => ({ key })) },
      { Name: { key: reagent }, Quantity: 1 }
    ],
    Outputs: outputs,
    Notes: [{ key: note }]
  };
}

const keeps = (lines: CatalogItem['Lines']): CatalogItem['Outputs'] =>
  ({ A: { Name: { key: 'strCubeOutputUseItemFromInput1' }, Lines: lines } });

const rerollsAs = (qualifier: string): CatalogItem['Outputs'] =>
  ({ A: { Name: { key: 'strCubeOutputUseTypeOfInput1' }, Qualifiers: [{ key: qualifier }], Lines: [] } });

describe('orbs', () => {
  it('recognizes only the orb recipe families', () => {
    expect(isOrbRecipe(recipe(CORRUPTION, 'ka3', 'helmitype', keeps([])))).toBe(true);
    expect(isOrbRecipe(recipe(INFUSION, 'ooi', 'weapitype', keeps([])))).toBe(true);
    expect(isOrbRecipe(recipe('strCubeNoteItemCrafting', 'bag', 'weapitype', keeps([])))).toBe(false);
    expect(isOrbRecipe({ Index: 1 })).toBe(false);
  });

  it('finds the reagent as the input every recipe in the family shares', () => {
    const [orb] = buildOrbs([
      recipe(INFUSION, 'ooi', 'weapitype', rerollsAs('strCubeQualifierRareItem')),
      recipe(INFUSION, 'ooi', 'rin', rerollsAs('strCubeQualifierRareItem'))
    ]);

    expect(orb.reagent).toEqual({ key: 'ooi' });
    expect(orb.targets.map((target) => target.key)).toEqual(['weapitype', 'rin']);
  });

  it('collapses one-recipe-per-quality into a single target holding every condition', () => {
    const [orb] = buildOrbs([
      recipe(INFUSION, 'ooi', 'weapitype', rerollsAs('strCubeQualifierRareItem'), ['strCubeQualifierLowQuality']),
      recipe(INFUSION, 'ooi', 'weapitype', rerollsAs('strCubeQualifierRareItem'), ['strCubeQualifierNormalQuality'])
    ]);

    expect(orb.targets).toHaveLength(1);
    expect(orb.targets[0].requires.map((line) => line.key))
      .toEqual(['strCubeQualifierLowQuality', 'strCubeQualifierNormalQuality']);
    // The two rows lead to the same result, so it is stated once.
    expect(orb.targets[0].outcomes).toHaveLength(1);
  });

  it('reports a shared outcome only when every item type leads to the same result', () => {
    const [infusion] = buildOrbs([
      recipe(INFUSION, 'ooi', 'weapitype', rerollsAs('strCubeQualifierRareItem')),
      recipe(INFUSION, 'ooi', 'rin', rerollsAs('strCubeQualifierRareItem'))
    ]);
    expect(infusion.sharedOutcome?.qualifiers).toEqual([{ key: 'strCubeQualifierRareItem' }]);

    const [corruption] = buildOrbs([
      recipe(CORRUPTION, 'ka3', 'helmitype', keeps([{ key: 'ModStr3k', args: [1] }, { key: 'Corrupted', args: [-1] }])),
      recipe(CORRUPTION, 'ka3', 'helmitype', keeps([{ key: 'Corrupted', args: [-1] }]))
    ]);
    expect(corruption.sharedOutcome).toBeUndefined();
    expect(corruption.targets[0].outcomes).toHaveLength(2);
  });

  it('drops the implied Corrupted marker and classifies each result', () => {
    const [corruption] = buildOrbs([
      recipe(CORRUPTION, 'ka3', 'helmitype', keeps([{ key: 'ModStr3k', args: [1] }, { key: 'Corrupted', args: [-1] }])),
      recipe(CORRUPTION, 'ka3', 'helmitype', keeps([{ key: 'Corrupted', args: [-1] }])),
      recipe(CORRUPTION, 'ka3', 'helmitype', rerollsAs('strCubeQualifierRareItem'))
    ]);
    const [granted, barren, rerolled] = corruption.targets[0].outcomes;

    expect(granted.lines).toEqual([{ key: 'ModStr3k', args: [1] }]);
    expect(granted.barren).toBe(false);
    expect(barren.lines).toEqual([]);
    expect(barren.barren).toBe(true);
    expect(rerolled.rerolls).toBe(true);
    expect(rerolled.barren).toBe(false);
  });

  it('treats an output named after a concrete item as a reroll rather than a kept item', () => {
    const [orb] = buildOrbs([
      recipe('strCubeNoteOrbOfConversion', 'ooc', 'amu', {
        A: { Name: { key: 'amu' }, Qualifiers: [{ key: 'strCubeQualifierUniqueItem' }], Lines: [] }
      })
    ]);
    expect(orb.targets[0].outcomes[0].rerolls).toBe(true);
  });

  it('orders orbs by the listed family order rather than catalog order', () => {
    const orbs = buildOrbs([
      recipe(CORRUPTION, 'ka3', 'helmitype', keeps([])),
      recipe(INFUSION, 'ooi', 'weapitype', rerollsAs('strCubeQualifierRareItem'))
    ]);
    expect(orbs.map((orb) => orb.noteKey)).toEqual([INFUSION, CORRUPTION]);
  });

  it('ignores recipes without both inputs or without an output', () => {
    expect(buildOrbs([
      { Index: 99, Inputs: [{ Name: { key: 'ka3' } }], Outputs: keeps([]), Notes: [{ key: CORRUPTION }] },
      recipe(CORRUPTION, 'ka3', 'helmitype', {})
    ])).toEqual([]);
  });
});
