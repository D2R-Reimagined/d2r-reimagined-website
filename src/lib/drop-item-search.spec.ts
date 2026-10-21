import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { i18n, initializeI18n } from './i18n';
import type { DropData, DropItem } from './drop-calculator';
import { buildDropSearchIndex, dropSuggestionLabel, searchDropItems, showsDropBase, type DropSearchEntry } from './drop-item-search';
import exported from '../../static/data/keyed/drop-calculator.json';
import enUS from '../../static/data/strings/enUS.json';
import deDE from '../../static/data/strings/deDE.json';

const data = exported as DropData;
const english = () => { initializeI18n(enUS); return buildDropSearchIndex(data.Items, data.Bases, get(i18n).t); };
const ids = (entries: DropSearchEntry[]) => entries.map(entry => entry.item.Id);

describe('unified drop item search with exported data', () => {
  let index: DropSearchEntry[];
  beforeEach(() => { index = english(); });

  it('finds Harlequin Crest and every other item on a Shako through base metadata', () => {
    const { matches, total } = searchDropItems(index, 'Shako');
    expect(ids(matches)).toEqual(expect.arrayContaining(['unique:Harlequin Crest', "unique:Bane's Dark Wisdom", "set:Darkmage's Celestial Fury", "set:Kingpin's Crown"]));
    expect(total).toBe(matches.length);
    expect(new Set(matches.map(entry => entry.item.Quality))).toEqual(new Set(['unique', 'set']));
    const crest = matches.find(entry => entry.item.Id === 'unique:Harlequin Crest')!;
    expect(crest.base).toBe('Shako [E]');
    expect(showsDropBase(crest)).toBe(true);
  });

  it('still finds Harlequin Crest by its displayed name', () => {
    expect(ids(searchDropItems(index, 'crest').matches)).toContain('unique:Harlequin Crest');
    expect(searchDropItems(index, '  HARLEQUIN crest ').matches[0].item.Id).toBe('unique:Harlequin Crest');
  });

  it('supports two-character rune names', () => {
    expect(searchDropItems(index, 'El').matches[0].item.Id).toBe('rune:r01');
    expect(searchDropItems(index, 'ko').matches[0].item.Id).toBe('rune:r18');
    expect(searchDropItems(index, 'k')).toEqual({ matches: [], total: 0 });
    expect(searchDropItems(index, ' e ')).toEqual({ matches: [], total: 0 });
  });

  it('filters by category without changing ranking inside the category', () => {
    const all = searchDropItems(index, 'Shako', 'all', Infinity).matches;
    const sets = searchDropItems(index, 'Shako', 'set').matches;
    expect(sets.every(entry => entry.item.Quality === 'set')).toBe(true);
    expect(ids(sets)).toEqual(ids(all.filter(entry => entry.item.Quality === 'set')));
    expect(searchDropItems(index, 'El', 'unique').matches.some(entry => entry.item.Quality === 'rune')).toBe(false);
  });

  it('limits rendered suggestions and reports the total match count', () => {
    const unlimited = searchDropItems(index, 'an', 'all', Infinity);
    expect(unlimited.total).toBeGreaterThan(50);
    const limited = searchDropItems(index, 'an');
    expect(limited.matches).toHaveLength(50);
    expect(limited.total).toBe(unlimited.total);
    expect(ids(limited.matches)).toEqual(ids(unlimited.matches.slice(0, 50)));
  });

  it('returns the original exported objects so IDs and categories are preserved', () => {
    const crest = searchDropItems(index, 'harlequin').matches[0];
    expect(crest.item).toBe(data.Items.find(item => item.Id === 'unique:Harlequin Crest'));
    expect(crest.item.Quality).toBe('unique');
    expect(dropSuggestionLabel(crest)).toBe('Harlequin Crest, Unique item, base Shako [E]');
    const el = searchDropItems(index, 'el').matches[0];
    expect(dropSuggestionLabel(el)).toBe('El Rune (#1), Rune item');
  });

  it('matches translated base names in the active language', () => {
    initializeI18n(deDE);
    const german = buildDropSearchIndex(data.Items, data.Bases, get(i18n).t);
    const matches = searchDropItems(german, 'tschako').matches;
    expect(ids(matches)).toContain('unique:Harlequin Crest');
    expect(matches.find(entry => entry.item.Id === 'unique:Harlequin Crest')!.name).toBe('Harlekinskrone');
    expect(searchDropItems(german, 'shako').total).toBe(0);
  });
});

describe('drop item search ranking', () => {
  const item = (Id: string, NameKey: string, Code: string, Quality: DropItem['Quality'] = 'unique'): DropItem =>
    ({ Id, NameKey, Code, Quality, Level: 1, Rarity: 1, Random: true, Condition: '' });
  const bases: DropData['Bases'] = ['cap', 'crn', 'xcr', 'tcr', 'rin', 'amu', 'zzz'].map(Code => ({ Code, NameKey: `base-${Code}`, Level: 1, Uber: false, ClassSpecific: false, Quest: false }));
  const names: Record<string, string> = { 'base-cap': 'Cap', 'base-crn': 'Crown', 'base-xcr': 'Crown Jewel', 'base-tcr': 'Grand Crown', 'base-rin': 'Ring', 'base-amu': 'Amulet' };
  const translate = (key: string) => names[key] ?? key;
  const items = [
    item('substring-base', 'Zed Hat', 'tcr'),
    item('substring-name', 'Old Crown Relic', 'amu'),
    item('prefix-base', 'Alpha', 'xcr', 'set'),
    item('prefix-name-b', 'Crownguard', 'rin'),
    item('exact-base-b', 'Beta', 'crn'),
    item('exact-name', 'Crown', 'cap', 'set'),
    item('prefix-name-a', 'Crownfall', 'rin', 'rune'),
    item('exact-base-a', 'Aardvark', 'crn', 'misc'),
    item('untranslated-base', 'Gamma', 'zzz'),
    item('unrelated', 'Nothing', 'rin')
  ];
  const expected = ['exact-name', 'exact-base-a', 'exact-base-b', 'prefix-name-a', 'prefix-name-b', 'prefix-base', 'substring-name', 'substring-base'];

  it('orders exact, base exact, prefixes, then substrings, alphabetically within ties', () => {
    const index = buildDropSearchIndex(items, bases, translate);
    expect(ids(searchDropItems(index, ' CROWN ').matches)).toEqual(expected);
    expect(searchDropItems(index, 'crown').total).toBe(expected.length);
  });

  it('is deterministic regardless of input order', () => {
    const forward = ids(searchDropItems(buildDropSearchIndex(items, bases, translate), 'crown').matches);
    const reversed = ids(searchDropItems(buildDropSearchIndex([...items].reverse(), bases, translate), 'crown').matches);
    expect(reversed).toEqual(forward);
  });

  it('mixes categories and returns every item sharing an ambiguous base', () => {
    const index = buildDropSearchIndex(items, bases, translate);
    const crowns = searchDropItems(index, 'crown').matches;
    expect(new Set(crowns.map(entry => entry.item.Quality))).toEqual(new Set(['unique', 'set', 'rune', 'misc']));
    expect(ids(crowns.filter(entry => entry.item.Code === 'crn'))).toEqual(['exact-base-a', 'exact-base-b']);
    expect(ids(searchDropItems(index, 'crown', 'misc').matches)).toEqual(['exact-base-a']);
  });

  it('does not match untranslated internal base codes', () => {
    const index = buildDropSearchIndex(items, bases, translate);
    expect(index.find(entry => entry.item.Id === 'untranslated-base')!.base).toBe('');
    expect(searchDropItems(index, 'zzz').total).toBe(0);
    expect(searchDropItems(index, 'base-').total).toBe(0);
  });
});
