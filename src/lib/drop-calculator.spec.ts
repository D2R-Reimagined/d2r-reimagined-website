import { describe, expect, it } from 'vitest';
import { adjustedNoDrop, calculateDrops, simulateKills, matchesDropSource, itemSuggestions, qualityChance, type DropClass, type DropData, type DropItem } from './drop-calculator';
import exported from '../../static/data/keyed/drop-calculator.json';

const target: DropItem = { Id: 'rune:r01', Code: 'r01', NameKey: 'El Rune', Quality: 'rune', Level: 1, Rarity: 1, Random: true, Condition: '' };
const settings = { players: 1, party: 1, magicFind: 0, difficulty: 2, kind: 'all' };
const tc = (Code: string, Picks: number, Entries: DropClass['Entries'], NoDrop = 0): DropClass => ({ Code, Picks, Entries, NoDrop, Group: '', Level: 0, Unique: 0, Set: 0, Condition: '', QuestFlag: '', QuestFlagEx: '' });
function fixture(classes: DropClass[]): DropData {
  return { Items: [target], Bases: ['r01', 'gld'].map(Code => ({ Code, Level: 1, Uber: false, ClassSpecific: false, Quest: false })), Ratios: [], TreasureClasses: classes,
    Sources: [{ Id: 'mob', NameKey: 'Monster', AreaKey: '', Difficulty: 2, Kind: 'normal', Level: 80, TreasureClass: classes[0].Code }] };
}
const chance = (data: DropData) => calculateDrops(data, target, settings)[0].chance;

describe('drop probabilities', () => {
  it('combines weighted nested rolls into at-least-one odds', () => {
    expect(chance(fixture([tc('root', 2, [{ Code: 'nested', Weight: 1 }]), tc('nested', 1, [{ Code: 'r01', Weight: 1 }, { Code: 'gld', Weight: 3 }])]))).toBeCloseTo(1 - 0.75 ** 2, 12);
  });
  it('applies player scaling only to no-drop and preserves player-one weights exactly', () => {
    expect(adjustedNoDrop(7, 13, 1, 1)).toBe(7);
    expect(adjustedNoDrop(100, 100, 3, 1)).toBe(33);
    expect(adjustedNoDrop(100, 100, 2, 2)).toBe(33);
    const data = fixture([tc('root', 1, [{ Code: 'r01', Weight: 1 }], 3)]);
    expect(chance(data)).toBeCloseTo(0.25, 12);
    expect(calculateDrops(data, target, { ...settings, players: 3 })[0].chance).toBeCloseTo(0.5, 12);
  });
  it('caps positive picks at six generated items', () => {
    expect(chance(fixture([tc('root', 7, [{ Code: 'r01', Weight: 1 }, { Code: 'gld', Weight: 1 }])]))).toBeCloseTo(1 - 0.5 ** 6, 12);
  });
  it('keeps ordered guaranteed drops from overflowing into a Countess rune roll', () => {
    const root = tc('root', -2, [{ Code: 'items', Weight: 1 }, { Code: 'runes', Weight: 1 }]);
    expect(chance(fixture([root, tc('items', 6, [{ Code: 'gld', Weight: 1 }]), tc('runes', 3, [{ Code: 'r01', Weight: 1 }])]))).toBe(0);
    expect(chance(fixture([root, tc('items', 5, [{ Code: 'gld', Weight: 1 }]), tc('runes', 3, [{ Code: 'r01', Weight: 1 }])]))).toBe(1);
  });
  it('counts no-drop as using no capacity', () => {
    const data = fixture([tc('root', -2, [{ Code: 'empty', Weight: 1 }, { Code: 'r01', Weight: 1 }]), tc('empty', 0, [])]);
    expect(chance(data)).toBe(1);
  });
  it('proves unrelated conditional drops cannot change odds when capacity remains', () => {
    const conditional = { ...tc('conditional', 1, [{ Code: 'gld', Weight: 1 }]), QuestFlagEx: '40' };
    expect(chance(fixture([tc('root', -2, [{ Code: 'conditional', Weight: 1 }, { Code: 'r01', Weight: 1 }]), conditional]))).toBe(1);
    expect(chance(fixture([tc('root', -7, [{ Code: 'conditional', Weight: 6 }, { Code: 'r01', Weight: 1 }]), conditional]))).toBeNull();
  });
  it('allows explicitly assigned nonrandom uniques without putting them in the random pool', () => {
    const unique: DropItem = { ...target, Id: 'unique:fixed', NameKey: 'Fixed Unique', Quality: 'unique', Random: false, Level: 999 };
    const data = fixture([tc('root', 1, [{ Code: 'Fixed Unique', Weight: 1 }])]);
    data.Items = [unique];
    expect(calculateDrops(data, unique, settings)[0].chance).toBe(1);
    data.TreasureClasses[0].Entries[0].Code = target.Code;
    expect(calculateDrops(data, unique, settings)[0].chance).toBe(0);
  });
  it('does not invent percentages for unresolved references or cycles', () => {
    expect(chance(fixture([tc('root', 1, [{ Code: 'missing', Weight: 1 }])]))).toBeNull();
    expect(chance(fixture([tc('root', 1, [{ Code: 'root', Weight: 1 }])]))).toBeNull();
  });
  it('applies quality minima before TC modifiers', () => {
    expect(qualityChance(400, 1, 6400, 0, 0, 250, 0)).toBeCloseTo(1 / 400, 12);
    expect(qualityChance(400, 1, 6400, 0, 0, 250, 1024)).toBe(1);
    expect(qualityChance(400, 1, 6400, 0, 10000, 250, 0)).toBeGreaterThan(1 / 400);
  });
  it('weights eligible named uniques and prevents an unavailable unique from rolling as a set', () => {
    const unique: DropItem = { ...target, Id: 'unique:test', Quality: 'unique', Rarity: 1 };
    const data = fixture([tc('root', 1, [{ Code: 'r01', Weight: 1 }])]);
    data.Items = [unique, { ...unique, Id: 'unique:other', Rarity: 3 }];
    data.Ratios = [{ Version: 1, Uber: 0, ClassSpecific: 0, Unique: 400, UniqueDivisor: 1, UniqueMin: 6400, Set: 160, SetDivisor: 2, SetMin: 5600 }];
    data.TreasureClasses[0].Unique = 1024;
    expect(calculateDrops(data, unique, settings)[0].chance).toBeCloseTo(0.25, 12);
    const set: DropItem = { ...unique, Id: 'set:test', Quality: 'set' };
    data.Items = [set];
    expect(calculateDrops(data, set, settings)[0].chance).toBe(0);
  });
  it('upgrades grouped classes on Nightmare and Hell', () => {
    const data = fixture([tc('root', 1, [{ Code: 'gld', Weight: 1 }]), tc('higher', 1, [{ Code: 'r01', Weight: 1 }])]);
    data.TreasureClasses.forEach((t, i) => { t.Group = '1'; t.Level = 10 + 60 * i; });
    expect(chance(data)).toBe(1);
    data.Sources[0].Level = 69;
    expect(chance(data)).toBe(0);
  });
});

describe('item suggestions', () => {
  it('starts at three characters and matches translated names within the selected quality', () => {
    expect(itemSuggestions([target], 'el', 'rune', k => k)).toEqual([]);
    expect(itemSuggestions([target], 'rUn', 'rune', k => k)).toEqual([target]);
    expect(itemSuggestions([target], 'rune', 'set', k => k)).toEqual([]);
    expect(itemSuggestions([target], 'translated', 'rune', () => 'Translated item')).toEqual([target]);
  });
});

describe('exported Reimagined data', () => {
  it.each([0, 1, 2])('resolves ordinary drop graphs for a real rune in difficulty %i', difficulty => {
    const data = exported as DropData;
    const rune = data.Items.find(i => i.Quality === 'rune')!;
    expect(rune).toBeDefined();
    const results = calculateDrops(data, rune, { ...settings, difficulty });
    const unresolved = results.filter(r => r.chance === null && !r.reason?.startsWith('Conditional'));
    expect(unresolved.map(r => `${r.source.TreasureClass}: ${r.reason}`).slice(0, 15)).toEqual([]);
    expect(results.some(r => (r.chance ?? 0) > 0)).toBe(true);
    expect(results.every(r => r.chance === null || r.chance >= 0 && r.chance <= 1)).toBe(true);
  });
});


describe('kill simulations and source selection', () => {
  it('handles impossible and guaranteed drops without random rolls', () => {
    const random = () => { throw new Error('Unexpected random roll'); };
    expect(simulateKills(0, 100000, random)).toMatchObject({ successes: 0, expected: 0, atLeastOne: 0 });
    expect(simulateKills(1, 100000, random)).toEqual({ kills: 100000, successes: 100000, expected: 100000, atLeastOne: 1 });
  });
  it('samples independent successful kills and keeps exact batch statistics', () => {
    expect(simulateKills(0.5, 5, () => 0.5)).toEqual({ kills: 5, successes: 2, expected: 2.5, atLeastOne: 0.96875 });
    expect(simulateKills(1e-12, 100000, () => 0.5).atLeastOne).toBeCloseTo(1e-7, 12);
    expect(simulateKills(1, 999999).kills).toBe(100000);
  });
  it('filters by upgraded TC and inclusive monster level, including unavailable rows', () => {
    const data = fixture([tc('root', 1, [{ Code: 'gld', Weight: 1 }]), tc('higher', 1, [{ Code: 'r01', Weight: 1 }])]);
    data.TreasureClasses.forEach((t, i) => { t.Group = '1'; t.Level = 10 + 60 * i; });
    const row = calculateDrops(data, target, settings)[0];
    expect(row.treasureClass).toBe('higher');
    expect(matchesDropSource(row, 'higher', 80, 80)).toBe(true);
    expect(matchesDropSource(row, 'root', 1, 999)).toBe(false);
    expect(matchesDropSource(row, '', 81, 999)).toBe(false);
    expect(matchesDropSource({ ...row, chance: null }, '', 1, 80)).toBe(true);
  });
});


describe('miscellaneous item drops', () => {
  it('does not invent tiny drop odds when the item is absent from a weighted graph', () => {
    const data = fixture([tc('root', 6, [{ Code: 'gld', Weight: 1 }], 2)]);
    expect(chance(data)).toBe(0);
  });
  it('uses direct item weights, ignoring MF and quality-level eligibility for quest items', () => {
    const misc: DropItem = { ...target, Id: 'misc:r01', NameKey: 'r01', Quality: 'misc', Level: 999 };
    const data = fixture([tc('root', 1, [{ Code: 'r01', Weight: 1 }, { Code: 'gld', Weight: 3 }])]);
    data.Items = [misc];
    data.Bases[0].Quest = true;
    for (const magicFind of [0, 10000]) {
      expect(calculateDrops(data, misc, { ...settings, magicFind })[0].chance).toBeCloseTo(0.25, 12);
    }
    expect(itemSuggestions(data.Items, 'r01', 'misc', k => k)).toEqual([misc]);
  });
  it('does not treat misc translation keys as explicit named unique drops', () => {
    const unique: DropItem = { ...target, Id: 'unique:test', NameKey: 'Test Unique', Quality: 'unique' };
    const misc: DropItem = { ...target, Id: 'misc:r01', NameKey: 'r01', Quality: 'misc' };
    const data = fixture([tc('root', 1, [{ Code: 'r01', Weight: 1 }])]);
    data.Items = [unique, misc];
    data.Ratios = [{ Version: 1, Uber: 0, ClassSpecific: 0, Unique: 400, UniqueDivisor: 1, UniqueMin: 6400, Set: 160, SetDivisor: 2, SetMin: 5600 }];
    data.TreasureClasses[0].Unique = 1024;
    expect(calculateDrops(data, unique, settings)[0].chance).toBe(1);
  });
  it('keeps conditional misc drops unavailable', () => {
    const misc: DropItem = { ...target, Id: 'misc:r01', Quality: 'misc' };
    const data = fixture([{ ...tc('root', 1, [{ Code: 'r01', Weight: 1 }]), QuestFlag: '1' }]);
    data.Items = [misc];
    expect(calculateDrops(data, misc, settings)[0].chance).toBeNull();
  });
  it('exports all seven crafting orbs, uber keys, and five regional shards', () => {
    const codes = ['ka3', 'oos', 'ooc', 'ooa', 'ooi', 'ooe', 'oor', 'pk1', 'pk2', 'pk3', 'xa1', 'xa2', 'xa3', 'xa4', 'xa5'];
    for (const code of codes) {
      const item = (exported as DropData).Items.find(i => i.Id === `misc:${code}`);
      expect(item, code).toMatchObject({ Quality: 'misc', Code: code });
      const rows = calculateDrops(exported as DropData, item!, settings);
      const conditionalOnly = ['ooe', 'oor', 'xa1', 'xa2', 'xa3', 'xa4', 'xa5'].includes(code);
      expect(rows.some(row => (row.chance ?? 0) > 0), code).toBe(!conditionalOnly);
      if (conditionalOnly) expect(rows.some(row => row.chance === null), code).toBe(true);
      expect(rows.filter(row => row.chance === null && !row.reason?.startsWith('Conditional')), code).toEqual([]);
    }
  }, 30000);
});
