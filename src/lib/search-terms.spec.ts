import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { matchesAllTerms, matchesSubstring, searchTerms } from './search-terms';
import type { DropData } from './drop-calculator';
import exported from '../../static/data/keyed/drop-calculator.json';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const select = read('./components/SearchableSelect.svelte');
const simulator = read('./components/MonsterDropSimulator.svelte');

type SourceData = Pick<DropData, 'TreasureClasses' | 'Sources'>;
// Built exactly as MonsterDropSimulator builds its treasure-class and (English) monster options.
const classOptionsOf = (data: SourceData) => data.TreasureClasses.map(tc => ({ value: tc.Code, label: tc.Level ? `${tc.Code} · Level ${tc.Level}` : tc.Code }))
  .sort((a, b) => a.label.localeCompare(b.label));
const kindLabel = (kind: string) => kind === 'quest' ? 'Quest boss' : kind;
const monsterOptionsOf = (data: SourceData) => data.Sources.filter(s => s.Difficulty === 0).map(s => ({ value: s.Id,
  label: `${s.NameKey} — ${kindLabel(s.Kind)} · ${s.AreaKey || 'Fixed / summoned spawn'} · Level ${s.Level}` }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Treasure classes and monsters named as the Reimagined export names them, so the matching rules
// are checked against controlled labels instead of whichever classes one export happens to ship.
const classes: Array<[string, number]> = [
  ['Act 1 H2H A', 3], ['Act 1 H2H B', 5], ['Act 2 H2H C', 75], ['Act 4 (H) H2H A', 85],
  ['Act 5 H2H A', 37], ['Act 5 H2H B', 38], ['Act 5 H2H C', 39],
  ['Act 5 (N) H2H A', 62], ['Act 5 (N) H2H B', 63], ['Act 5 (N) H2H C', 64],
  ['Act 5 (H) H2H A', 83], ['Act 5 (H) H2H B', 84], ['Act 5 (H) H2H C', 85],
  ['Act 5 (H) Champ A', 83], ['Act 5 (H) Champ A Desecrated', 96], ['Act 5 (H) Champ B Desecrated', 96],
  ['Act 5 (N) Champ A Desecrated', 70], ['Act 4 (H) Champ A Desecrated', 96], ['Act 1 Terrorize Act Consumable Desecrated', 0]
];
const source = (Id: string, NameKey: string, AreaKey: string, Kind: string, Level: number, Difficulty = 0) =>
  ({ Id, NameKey, AreaKey, Kind, Level, Difficulty, TreasureClass: 'Act 1 H2H A' });
const fixture: SourceData = {
  TreasureClasses: classes.map(([Code, Level]) => ({ Code, Level, Picks: 1, Entries: [], NoDrop: 0, Group: '', Unique: 0, Set: 0, Condition: '', QuestFlag: '', QuestFlagEx: '' })),
  Sources: [
    source('skeleton1:3:0:normal', 'Skeleton', 'Cold Plains', 'normal', 4),
    source('skeleton1:3:0:champion', 'Skeleton', 'Cold Plains', 'champion', 6),
    source('zombie1:3:0:normal', 'Zombie', 'Cold Plains', 'normal', 4),
    source('skeleton1:5:0:normal', 'Skeleton', 'Burial Grounds', 'normal', 5),
    source('skeleton1:3:1:normal', 'Skeleton', 'Cold Plains', 'normal', 36, 1),
    source('baalcrab:132:0:quest', 'Baal', '', 'quest', 60)
  ]
};
const classOptions = classOptionsOf(fixture);
const monsterOptions = monsterOptionsOf(fixture);
const find = (options: typeof classOptions, query: string) => options.filter(option => matchesAllTerms(option.label, query));
const codes = (query: string) => find(classOptions, query).map(option => option.value);
const exportedClassOptions = classOptionsOf(exported as DropData);

describe('search terms', () => {
  it('trims and splits on any run of whitespace', () => {
    expect(searchTerms('  Act   5\tH2H ')).toEqual(['act', '5', 'h2h']);
    expect(searchTerms('   ')).toEqual([]);
  });
});

describe('default selector matching', () => {
  it('is the original whole-query, case-insensitive substring match', () => {
    const original = (label: string, query: string) => label.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    for (const query of ['', 'h2h', 'ACT 5', '5 h2h', ' h2h', 'h2h act', '(H)'])
      for (const { label } of [...classOptions, ...exportedClassOptions.slice(0, 400)]) expect(matchesSubstring(label, query)).toBe(original(label, query));
  });

  it('stays the default, and only the simulator source pickers opt into multi-term matching', () => {
    expect(select).toContain('matches: match = matchesSubstring');
    expect(select).toContain('choices.filter((option) => match(option.label, query))');
    expect(simulator.match(/matches=\{matchesAllTerms\}/g)).toHaveLength(2);
    for (const path of ['./components/CatalogFilters.svelte', '../routes/data/drop-calculator/+page.svelte']) expect(read(path)).not.toMatch(/matches=/);
  });
});

describe('simulator source search', () => {
  it('keeps single-term substring matching, ignoring surrounding whitespace', () => {
    for (const term of ['h2h', 'Desecrated', 'champ', '(h)', '5', 'Level'])
      expect(find(classOptions, term)).toEqual(classOptions.filter(option => matchesSubstring(option.label, term)));
    expect(codes('  h2h  ')).toEqual(codes('h2h'));
  });

  it('matches every term in any order, case-insensitively', () => {
    const forward = codes('desecrated champ act 5');
    expect(forward).toContain('Act 5 (H) Champ A Desecrated');
    expect(forward.length).toBeGreaterThan(1);
    for (const query of ['act 5 champ desecrated', 'CHAMP Desecrated ACT 5', '  champ   act 5  desecrated ']) expect(codes(query)).toEqual(forward);
    expect(forward.every(code => /^Act 5\b/.test(code) && /champ/i.test(code) && /desecrated/i.test(code))).toBe(true);
  });

  it('finds the Act 5 H2H classes without unrelated numbers matching', () => {
    const act5 = codes('act 5 h2h');
    expect(act5).toEqual(expect.arrayContaining(['Act 5 H2H A', 'Act 5 H2H C', 'Act 5 (H) H2H A', 'Act 5 (H) H2H C']));
    expect(codes('h2h act 5')).toEqual(act5);
    // "5" is a whole number term: "Level 85" or "Level 75" alone does not make an Act 1–4 class match,
    // and "5" after "act" is the act number, so the level of "Act 1 H2H B · Level 5" does not satisfy it.
    expect(classOptions.find(option => option.value === 'Act 1 H2H B')?.label).toBe('Act 1 H2H B · Level 5');
    expect(act5).not.toContain('Act 1 H2H B');
    expect(act5).toEqual(['Act 5 (H) H2H A', 'Act 5 (H) H2H B', 'Act 5 (H) H2H C', 'Act 5 (N) H2H A', 'Act 5 (N) H2H B', 'Act 5 (N) H2H C',
      'Act 5 H2H A', 'Act 5 H2H B', 'Act 5 H2H C']);
    expect(classOptions.filter(option => matchesSubstring(option.label, 'act') && matchesSubstring(option.label, 'h2h') && matchesSubstring(option.label, '5'))
      .some(option => !act5.includes(option.value))).toBe(true);
  });

  it('keeps parenthetical difficulty and level suffixes searchable', () => {
    expect(codes('(h) h2h act 5')).toEqual(['Act 5 (H) H2H A', 'Act 5 (H) H2H B', 'Act 5 (H) H2H C']);
    // Letters stay substrings ("a" is also in "Act"), so the full name is found among its siblings.
    expect(codes('act 5 (h) h2h a')).toEqual(['Act 5 (H) H2H A', 'Act 5 (H) H2H B', 'Act 5 (H) H2H C']);
    expect(codes('h2h level 85')).toContain('Act 5 (H) H2H C');
  });

  it('binds a number to the act or level word it follows', () => {
    // Explicit level searches still reach the level metadata.
    expect(codes('h2h level 5')).toContain('Act 1 H2H B');
    expect(codes('act 1 h2h level 5')).toEqual(['Act 1 H2H B']);
    expect(codes('level 5 act 5 h2h')).toEqual([]);
    expect(find(classOptions, 'level 5').every(option => /· Level 5$/.test(option.label))).toBe(true);
    // A number after a word the label does not number stays a free whole-number term.
    expect(codes('h2h 5')).toEqual(expect.arrayContaining(['Act 5 H2H A', 'Act 5 (H) H2H A']));
    expect(codes('5 act h2h')).toEqual(expect.arrayContaining(['Act 5 H2H A', 'Act 1 H2H B']));
    // Monster labels bind "level" the same way.
    const skeleton = find(monsterOptions, 'skeleton cold plains').find(option => option.value === 'skeleton1:3:0:normal')!;
    const level = skeleton.label.match(/Level (\d+)$/)![1];
    expect(find(monsterOptions, `skeleton level ${level}`)).toContain(skeleton);
    expect(find(monsterOptions, `skeleton level ${Number(level) + 1}`)).not.toContain(skeleton);
  });

  it('keeps champ desecrated act 5 working', () => {
    expect(codes('champ desecrated act 5')).toContain('Act 5 (H) Champ A Desecrated');
    expect(codes('champ desecrated act 5').every(code => /^Act 5\b/.test(code))).toBe(true);
  });

  it('requires all terms, so an unmatched term returns nothing', () => {
    expect(codes('act 5 h2h zzz')).toEqual([]);
    expect(codes('zzz')).toEqual([]);
    // No class is named with both words, so this stays empty without aliases.
    expect(codes('desecrated h2h')).toEqual([]);
    expect(codes('h2h desecrated')).toEqual([]);
  });

  it('returns the original identifiers in the original order', () => {
    for (const options of [classOptions, exportedClassOptions]) {
      const matched = find(options, 'champ desecrated');
      const ids = new Set(options.map(option => option.value));
      expect(matched.every(option => ids.has(option.value))).toBe(true);
      expect(matched).toEqual(options.filter(option => matched.includes(option)));
    }
  });

  it('finds monsters by name, area and kind in any order', () => {
    const found = find(monsterOptions, 'cold plains skeleton normal');
    expect(found.map(option => option.value)).toEqual(['skeleton1:3:0:normal']);
    expect(find(monsterOptions, 'NORMAL skeleton plains cold')).toEqual(found);
    expect(find(monsterOptions, 'cold plains skeleton nonexistent')).toEqual([]);
    expect(find(monsterOptions, 'quest boss baal').map(option => option.value)).toEqual(['baalcrab:132:0:quest']);
    // Only the selected difficulty's sources are offered.
    expect(monsterOptions.map(option => option.value)).not.toContain('skeleton1:3:1:normal');
  });

  it('finds every exported source and class by its own label', () => {
    for (const options of [exportedClassOptions, monsterOptionsOf(exported as DropData)]) {
      expect(options.length).toBeGreaterThan(0);
      expect(options.filter(option => !matchesAllTerms(option.label, option.label)).map(option => option.label)).toEqual([]);
    }
  });
});

describe('selector interaction', () => {
  it('keeps keyboard and pointer selection, and only selects an existing match', () => {
    expect(select).toContain("event.key === 'Escape'");
    expect(select).toContain("event.key === 'ArrowDown' || event.key === 'ArrowUp'");
    expect(select).toContain("event.key === 'Enter' && matches[active]");
    expect(select).toContain('onclick={() => choose(option)}');
    expect(select).toContain("scrollIntoView({ block: 'nearest' })");
    expect(select).toMatch(/role="listbox"/);
    expect(select).toMatch(/role="option" aria-selected=\{option\.value === value\}/);
    // Typing only changes the query and the active row; the value changes only in choose().
    expect(select).toContain('bind:value={query} oninput={() => active = 0}');
    expect(select.match(/value = option\.value/g)).toHaveLength(1);
  });

  it('describes the search field with the hint only when one is given', () => {
    expect(select).toContain('aria-describedby={hint ? `${id}-hint` : undefined}');
    expect(simulator.match(/hint=\{sourceSearchHint\}/g)).toHaveLength(2);
  });

  it('keeps the simulator selection, URL and runs independent of typing', () => {
    expect(simulator).toContain('bind:value={() => sourceId, value => {sourceId=value;invalidate();}}');
    expect(simulator).toContain('bind:value={() => treasureClass, value => {treasureClass=value;');
    // The search text is internal to the selector, never part of the URL state or the worker message.
    const effect = simulator.slice(simulator.indexOf('$effect(() => {'), simulator.indexOf('async function copyLink'));
    expect(effect).not.toMatch(/query|matchesAllTerms/);
    const form = simulator.slice(simulator.indexOf('<form'), simulator.indexOf('</form>'));
    expect(form.match(/run\(/g)).toHaveLength(2);
  });
});
