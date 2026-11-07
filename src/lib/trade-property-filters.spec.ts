import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatTemplate } from '../utilities/format-template';
import type { ItemStatPresentationBundle } from './item-stat-presentation';
import {
  activeTradePropertyCount,
  buildTradePropertyOptions,
  compoundTradePropertyOutsideAnd,
  createTradePropertyFilter,
  createTradePropertyGroup,
  invalidTradePropertyQuery,
  resolveTradePropertyOption,
  searchTradePropertyOptions,
  toTradePropertyFilterGroups,
  tradePropertyDefinitions
} from './trade-property-filters';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const bundle: ItemStatPresentationBundle = read('static/data/keyed/item-stat-presentation.json');
const strings: Record<string, string> = read('static/data/strings/enUS.json');

function catalogOptions(language: Record<string, string> = strings) {
  const text = { ...strings, ...language };
  return buildTradePropertyOptions(tradePropertyDefinitions(bundle), (definition) => {
    const args = (definition.labelArgs ?? ['#', '#', '#', '#']).map((arg) => text[arg] ?? arg);
    const label = formatTemplate(text[definition.labelKey] ?? definition.labelKey, args);
    return definition.classOnly ? `${label} ${text[definition.classOnly]}` : label;
  });
}

describe('trade property search', () => {
  const options = catalogOptions();
  const topStat = (query: string) => searchTradePropertyOptions(options, query)[0]?.stat;

  it.each(readdirSync('static/data/strings'))('gives every property a unique label in %s', (file) => {
    const translated = catalogOptions(read(`static/data/strings/${file}`));
    expect(new Set(translated.map((option) => option.label.toLowerCase())).size).toBe(translated.length);
  });

  it.each([
    ['fcr', 'item_fastercastrate'],
    ['FHR', 'item_fastergethitrate'],
    ['ias', 'item_fasterattackrate'],
    ['mf', 'item_magicbonus'],
    ['magic find', 'item_magicbonus'],
    ['strength', 'strength'],
    ['life', 'maxhp'],
    ['cast rate faster', 'item_fastercastrate'],
    ['+20% Faster Cast Rate', 'item_fastercastrate'],
    ['+1 to all skills', 'item_allskills'],
    ['all res', 'all_resistances'],
    ['all attributes', 'all_attributes'],
    ['any class skill levels', 'item_addclassskills'],
    ['any skill tab', 'item_addskill_tab'],
    ['paladin skill levels', 'item_addclassskills'],
    ['necromancer skill levels', 'item_addclassskills'],
    ['summoning skills druid', 'item_addskill_tab'],
    ['all maximum resistances', 'all_maximum_resistances'],
    ['warlock skills', 'item_addclassskills'],
    ['poison skills', 'item_elemskillpoison'],
    ['teleport sorceress', 'item_singleskill'],
    ['teleport oskill', 'item_nonclassskill'],
    ['fanaticism aura', 'item_aura']
  ])('finds %s', (query, stat) => {
    expect(topStat(query)).toBe(stat);
  });

  it('lists the plain stat before its per-level and over-time variants', () => {
    const labels = searchTradePropertyOptions(options, 'strength').map((option) => option.label);
    expect(labels[0]).toBe('# to Strength');
    expect(labels.slice(-2)).toEqual(['# to Strength · Over Time', '# to Strength · Per Level']);
  });

  it('browses without a query and reports nothing for unknown or number-only text', () => {
    expect(searchTradePropertyOptions(options, '')).toHaveLength(options.length);
    expect(searchTradePropertyOptions(options, '   ')).toHaveLength(options.length);
    expect(searchTradePropertyOptions(options, '20')).toEqual([]);
    expect(searchTradePropertyOptions(options, '+2')).toEqual([]);
    expect(searchTradePropertyOptions(options, 'zzzz')).toEqual([]);
  });

  it('offers any-class and any-tab options alongside every class, skill tab and catalog aura', () => {
    const byStat = (stat: string) => options.filter((option) => option.stat === stat);
    expect(byStat('item_addclassskills').filter((option) => option.layer === undefined)).toHaveLength(1);
    expect(byStat('item_addclassskills').filter((option) => option.layer !== undefined)).toHaveLength(8);
    expect(byStat('item_addskill_tab').filter((option) => option.layer === undefined)).toHaveLength(1);
    expect(byStat('item_addskill_tab').filter((option) => option.layer !== undefined)).toHaveLength(24);
    expect(searchTradePropertyOptions(options, 'any class')[0]?.layer).toBeUndefined();
    expect(searchTradePropertyOptions(options, 'any skill tab')[0]?.layer).toBeUndefined();

    const auras = new Set(byStat('item_aura').map((option) => strings[option.labelArgs![1]]));
    const used = new Set<string>();
    const visit = (value: unknown): void => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (!value || typeof value !== 'object') return;
      const line = value as { key?: string; args?: unknown[] };
      if (line.key === 'ModitemAura') {
        for (const arg of line.args ?? []) if (typeof arg === 'string') used.add(strings[arg]);
      }
      Object.values(value).forEach(visit);
    };
    for (const file of ['uniques', 'sets', 'runewords', 'magicprefix', 'magicsuffix']) {
      visit(read(`static/data/keyed/${file}.json`));
    }
    expect(used.size).toBeGreaterThan(0);
    expect([...used].filter((name) => !auras.has(name))).toEqual([]);
  });

  it('sends the layer and expands compound mods into their real stats', () => {
    const pick = (query: string) => searchTradePropertyOptions(options, query)[0];
    const group = createTradePropertyGroup('And');
    const paladin = pick('paladin skill levels');
    const resistances = pick('all res');
    group.filters.push(createTradePropertyFilter());
    Object.assign(group.filters[0], { stat: paladin.stat, layer: paladin.layer, minimumValue: '2' });
    Object.assign(group.filters[1], { stat: resistances.stat, stats: resistances.stats, minimumValue: '20' });

    const [serialized] = toTradePropertyFilterGroups([group]);
    expect(serialized.filters.map(({ stat, layer, minimumValue }) => [stat, layer, minimumValue])).toEqual([
      ['item_addclassskills', 3, 2],
      ['fireresist', undefined, 20],
      ['lightresist', undefined, 20],
      ['coldresist', undefined, 20],
      ['poisonresist', undefined, 20]
    ]);

    expect(compoundTradePropertyOutsideAnd([group])).toBe(false);
    group.type = 'Or';
    expect(compoundTradePropertyOutsideAnd([group])).toBe(true);
  });

  it('only resolves typed text that names a single property', () => {
    expect(resolveTradePropertyOption(options, 'fcr')?.stat).toBe('item_fastercastrate');
    expect(resolveTradePropertyOption(options, 'ias')?.stat).toBe('item_fasterattackrate');
    expect(resolveTradePropertyOption(options, 'ed')).toBeUndefined();
    expect(resolveTradePropertyOption(options, '# to life')?.stat).toBe('maxhp');
    expect(resolveTradePropertyOption(options, 'strength')).toBeUndefined();
    expect(resolveTradePropertyOption(options, '20')).toBeUndefined();
  });
});

describe('trade property filters', () => {
  it('omits untouched rows and serializes selected stat ranges', () => {
    const group = createTradePropertyGroup('And');
    Object.assign(group.filters[0], {
      query: '#% Faster Cast Rate',
      stat: 'item_fastercastrate',
      minimumValue: '20',
      maximumValue: '40',
      valueShift: 0,
      valueFunction: 19
    });

    expect(toTradePropertyFilterGroups([group])).toEqual([{
      type: 'And',
      minimumCount: undefined,
      maximumCount: undefined,
      filters: [{
        stat: 'item_fastercastrate',
        minimumValue: 20,
        maximumValue: 40,
        valueShift: 0,
        valueFunction: 19
      }]
    }]);
    expect(activeTradePropertyCount([group])).toBe(1);
  });

  it('accepts number and null values coerced by Svelte number inputs', () => {
    const group = createTradePropertyGroup('Count');
    group.minimumCount = 2;
    group.maximumCount = null;
    Object.assign(group.filters[0], {
      query: '#% Faster Cast Rate',
      stat: 'item_fastercastrate',
      minimumValue: 20,
      maximumValue: null,
      valueShift: 0,
      valueFunction: 19
    });

    expect(toTradePropertyFilterGroups([group])).toEqual([{
      type: 'Count',
      minimumCount: 2,
      maximumCount: undefined,
      filters: [{
        stat: 'item_fastercastrate',
        minimumValue: 20,
        maximumValue: undefined,
        valueShift: 0,
        valueFunction: 19
      }]
    }]);
  });

  it('retains COUNT limits and detects typed but unselected properties', () => {
    const group = createTradePropertyGroup('Count');
    group.minimumCount = '2';
    group.maximumCount = '3';
    group.filters[0].query = 'resist';

    expect(invalidTradePropertyQuery([group])).toBe(true);
    expect(toTradePropertyFilterGroups([group])).toEqual([]);
  });
});
