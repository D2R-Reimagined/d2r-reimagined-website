import { describe, expect, it } from 'vitest';
import { calculateDrops, type DropData, type DropItem } from './drop-calculator';
import { checkDropForm, checkWholeNumber, describeLevelRange, magicFindApplies, magicFindNote, maxLevelText, monsterLevelRange, partyForPlayers, UNRESTRICTED_MAX_LEVEL, type DropFormText } from './drop-calculator-form';
import { countAdvancedDropFilters, readDropUrl, writeDropUrl } from './drop-calculator-url';
import exported from '../../static/data/keyed/drop-calculator.json';

const data = exported as DropData;
const levels = monsterLevelRange(data.Sources);
const base = new URL('https://example.com/data/drop-calculator');
const defaults: DropFormText = { magicFind: '0', minLevel: '1', maxLevel: '', kills: '100000' };
const form = (text: Partial<DropFormText>, mf = true) => checkDropForm({ ...defaults, ...text }, levels, mf);
// Real exported treasure classes, limited to Hell bosses to keep full-graph calculations quick.
const bosses: DropData = { ...data, Sources: data.Sources.filter(source => source.Kind === 'boss' && source.Difficulty === 2) };

describe('monster level range', () => {
  it('comes from the exported sources', () => {
    const exportedLevels = data.Sources.map(source => source.Level);
    expect(levels).toEqual({ min: Math.min(...exportedLevels), max: Math.max(...exportedLevels) });
    expect(levels.min).toBe(1);
    expect(levels.max).toBeLessThan(UNRESTRICTED_MAX_LEVEL);
    expect(monsterLevelRange([{ Level: 7 }, { Level: 42 }, { Level: 3 }])).toEqual({ min: 3, max: 42 });
  });
  it('displays the default maximum as unrestricted', () => {
    const state = readDropUrl(base, data.Items, levels);
    expect(state.maxLevel).toBe(UNRESTRICTED_MAX_LEVEL);
    expect(maxLevelText(state.maxLevel, levels)).toBe('');
    expect(form({}).values).toMatchObject({ minLevel: 1, maxLevel: UNRESTRICTED_MAX_LEVEL });
    expect(describeLevelRange(1, UNRESTRICTED_MAX_LEVEL)).toBe('all monster levels');
    expect(describeLevelRange(80, UNRESTRICTED_MAX_LEVEL)).toBe('level 80 and above');
    expect(describeLevelRange(80, 90)).toBe('levels 80–90');
  });
  it('keeps legacy maxLevel=999 bookmarks and other oversized maximums unrestricted', () => {
    for (const legacy of ['999', String(levels.max + 1), '5000']) {
      const state = readDropUrl(new URL(`${base}?maxLevel=${legacy}`), data.Items, levels);
      expect(state.maxLevel).toBe(UNRESTRICTED_MAX_LEVEL);
      expect(maxLevelText(state.maxLevel, levels)).toBe('');
      expect(countAdvancedDropFilters(state)).toBe(0);
      expect(writeDropUrl(base, state).searchParams.has('maxLevel')).toBe(false);
    }
  });
  it('accepts valid explicit limits, including the highest exported level', () => {
    const check = form({ minLevel: '80', maxLevel: String(levels.max) });
    expect(check).toMatchObject({ valid: true, levelsValid: true, values: { minLevel: 80, maxLevel: levels.max } });
    const state = { ...readDropUrl(base, data.Items, levels), minLevel: 80, maxLevel: levels.max };
    const restored = readDropUrl(writeDropUrl(base, state), data.Items, levels);
    expect(restored).toMatchObject({ minLevel: 80, maxLevel: levels.max });
    expect(maxLevelText(restored.maxLevel, levels)).toBe(String(levels.max));
    expect(form({ minLevel: '85', maxLevel: '85' }).valid).toBe(true);
  });
  it('reports a minimum above the maximum beside the maximum', () => {
    const check = form({ minLevel: '90', maxLevel: '80' });
    expect(check.valid).toBe(false);
    expect(check.levelsValid).toBe(false);
    expect(check.levelRangeError).toBe('Maximum level must be at least the minimum level (90).');
    expect(check.errors).toEqual({});
  });
  it('treats an empty maximum as unrestricted', () => {
    for (const empty of ['', '   ']) expect(form({ minLevel: '50', maxLevel: empty })).toMatchObject({ valid: true, values: { maxLevel: UNRESTRICTED_MAX_LEVEL } });
  });
  it('never turns an empty minimum into a filtering value', () => {
    const check = form({ minLevel: '' });
    expect(check.levelsValid).toBe(false);
    expect(check.values.minLevel).toBeUndefined();
    expect(check.errors.minLevel).toBe(`Enter a minimum level from 1 to ${levels.max}.`);
  });
  it('rejects 999 and other levels outside the exported range when typed', () => {
    expect(form({ maxLevel: '999' }).errors.maxLevel).toBe(`Use a whole number from 1 to ${levels.max}, or leave it empty for any level.`);
    expect(form({ minLevel: '0' }).errors.minLevel).toMatch(/whole number from 1/);
    expect(form({ minLevel: String(levels.max + 1) }).levelsValid).toBe(false);
  });
});

describe('numeric validation', () => {
  it('rejects empty, negative, fractional, nonnumeric, and excessively large values', () => {
    const cases: [string, RegExp][] = [
      ['', /^Enter kills per monster from 1 to 100,000\.$/], ['-5', /whole number/], ['2.5', /whole number/], ['10.', /whole number/],
      ['abc', /Enter a number/], ['1e3', /Enter a number/], ['0x10', /Enter a number/], ['10,000', /Enter a number/],
      ['100001', /whole number/], ['99999999999999999999', /whole number/], ['NaN', /Enter a number/]
    ];
    for (const [text, message] of cases) {
      const check = checkWholeNumber(text, 'kills per monster', 1, 100000);
      expect(check.value, text).toBeUndefined();
      expect(check.error, text).toMatch(message);
    }
    expect(checkWholeNumber(' 250 ', 'kills', 1, 100000)).toEqual({ value: 250 });
    expect(checkWholeNumber('+7', 'kills', 1, 100000)).toEqual({ value: 7 });
  });
  it('validates Magic Find against the calculator limit and reports 123123', () => {
    expect(form({ magicFind: '123123' })).toMatchObject({ valid: false, errors: { magicFind: 'Use a whole number from 0 to 10,000.' } });
    expect(form({ magicFind: '10000' }).values.magicFind).toBe(10000);
    expect(form({ magicFind: '' }).errors.magicFind).toBe('Enter a Magic Find value from 0 to 10,000.');
  });
  it('skips inapplicable Magic Find without discarding it', () => {
    const check = form({ magicFind: '123123' }, false);
    expect(check.valid).toBe(true);
    expect(check.values.magicFind).toBeUndefined();
  });
  it('validates kills per monster', () => {
    expect(form({ kills: '0' }).valid).toBe(false);
    expect(form({ kills: '100000' }).values.kills).toBe(100000);
  });
  it('restores normal submission once a value is corrected', () => {
    expect(form({ minLevel: '90', maxLevel: '80', kills: '1.5' }).valid).toBe(false);
    expect(form({ minLevel: '90', maxLevel: '95', kills: '15' })).toMatchObject({ valid: true, values: { minLevel: 90, maxLevel: 95, kills: 15 } });
  });
  it('keeps nearby party within the player count', () => {
    expect(partyForPlayers(6, 3)).toBe(3);
    expect(partyForPlayers(2, 8)).toBe(2);
    expect(partyForPlayers(1, 1)).toBe(1);
  });
});

describe('URL numbers', () => {
  it('never writes invalid numeric representations', () => {
    const state = readDropUrl(base, data.Items, levels);
    for (const bad of [NaN, Infinity, -1, 2.5, null as unknown as number, '' as unknown as number]) {
      const url = writeDropUrl(base, { ...state, players: bad, party: bad, magicFind: bad, minLevel: bad, maxLevel: bad, kills: bad });
      expect(url.search, String(bad)).toBe('');
    }
    expect(writeDropUrl(base, { ...state, magicFind: 123123 }).searchParams.has('mf')).toBe(false);
  });
  it('normalizes restored legacy values without inventing a restriction', () => {
    expect(readDropUrl(new URL(`${base}?minLevel=500&maxLevel=20`), data.Items, levels)).toMatchObject({ minLevel: levels.max, maxLevel: UNRESTRICTED_MAX_LEVEL });
    expect(readDropUrl(new URL(`${base}?minLevel=1.5&maxLevel=null`), data.Items, levels)).toMatchObject({ minLevel: 1, maxLevel: UNRESTRICTED_MAX_LEVEL });
    expect(readDropUrl(new URL(`${base}?minLevel=&maxLevel=`), data.Items, levels)).toMatchObject({ minLevel: 1, maxLevel: UNRESTRICTED_MAX_LEVEL });
  });
});

describe('Magic Find applicability', () => {
  it('follows the selected category and stays enabled when nothing narrows it', () => {
    expect(['unique', 'set', null].map(quality => magicFindApplies(quality as never))).toEqual([true, true, true]);
    expect(magicFindApplies('rune')).toBe(false);
    expect(magicFindApplies('misc')).toBe(false);
    expect(magicFindNote('rune')).toBe('Magic Find does not affect rune drops. Your previous value is preserved.');
    expect(magicFindNote('misc')).toMatch(/miscellaneous item drops\. Your previous value is preserved\.$/);
    expect(magicFindNote('unique')).toBe('');
  });
  it('matches the calculator: MF changes unique odds but not rune odds', () => {
    const unique = data.Items.find(item => item.Quality === 'unique' && item.Random)!;
    const rune = data.Items.find(item => item.Quality === 'rune')!;
    const chances = (target: DropItem, magicFind: number) => calculateDrops(bosses, target, { players: 1, party: 1, magicFind, difficulty: 2, kind: 'all' }).map(row => row.chance);
    expect(chances(rune, 500)).toEqual(chances(rune, 0));
    expect(chances(unique, 500)).not.toEqual(chances(unique, 0));
  });
});

it('feeds validated values to the calculator unchanged', () => {
  const target = data.Items.find(item => item.Quality === 'unique' && item.Random)!;
  const state = readDropUrl(base, data.Items, levels);
  const { values } = form({ magicFind: '250' });
  const settings = { players: state.players, party: state.party, difficulty: state.difficulty, kind: state.kind };
  expect(calculateDrops(bosses, target, { ...settings, magicFind: values.magicFind! }))
    .toEqual(calculateDrops(bosses, target, { ...settings, magicFind: 250 }));
});
