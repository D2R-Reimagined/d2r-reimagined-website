import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import M from './loot-filter/model.js';
import { fromExport as adapt } from './loot-filter/catalog.js';
import { blockOf, kindOf, values } from './loot-filter/types.js';

// Exercise the same model and catalog adapter used by the native Svelte editor.
const bundle = JSON.parse(readFileSync(new URL('../../static/data/keyed/loot-filter.json', import.meta.url), 'utf8'));
const strings = JSON.parse(readFileSync(new URL('../../static/data/strings/enUS.json', import.meta.url), 'utf8'));

describe('Reimagined Pyre Loot Filter catalog', () => {
  const catalog = adapt(bundle, strings);
  it('loads the exported bases and enrichment without TXT uploads', () => {
    expect(catalog.baseItems.length).toBe(bundle.BaseItems.length);
    expect(catalog.uniqueItems.length).toBe(bundle.UniqueItems.length);
    expect(catalog.setItems.length).toBe(bundle.SetItems.length);
    expect(catalog.baseItems.length).toBeGreaterThan(600);
    for (const section of ['BaseItems', 'UniqueItems', 'SetItems']) {
      for (const item of bundle[section]) expect(strings[item.NameKey], item.NameKey).toBeTruthy();
    }
    expect(catalog.itemTypeNames?.get('cjwl')).toBeTruthy();
    expect(catalog.baseItems.find(x => x.code === 'hax')?.tier).toBe('normal');
    expect(catalog.baseItems.find(x => x.code === '9ha')?.tier).toBe('exceptional');
    expect(catalog.baseItems.find(x => x.code === '7ha')?.tier).toBe('elite');
  });
  it('keeps translated display names out of runtime selectors', () => {
    const base = bundle.BaseItems.find((x: any) => x.Kind === 'weapon' && x.BaseNameSelector);
    const localized = adapt(bundle, { [base.NameKey]: 'Translated weapon' });
    const item = localized.baseItems.find((x: any) => x.kind === 'weapon' && x.code === base.Code)!;
    expect(item.displayName).toBe('Translated weapon');
    expect(M.createRuleForFinderItem(item, 'show').show!.conditions).toEqual({ baseName: base.BaseNameSelector });
  });
  it('uses codes for miscellaneous items and base plus rarity for named items', () => {
    const misc = catalog.baseItems.find((x: any) => x.kind === 'misc')!;
    expect(M.createRuleForFinderItem(misc, 'hide')).toEqual({ hide: { conditions: { code: misc.code } } });
    for (const item of [...catalog.uniqueItems, ...catalog.setItems]) {
      const rule = M.createRuleForFinderItem(item, 'show');
      expect(Object.keys(rule.show!.conditions!).sort()).toEqual([item.baseName ? 'baseName' : 'code', 'rarity'].sort());
      expect(rule.show!.conditions!.rarity).toBe(item.kind);
      expect(M.validateFilter({ version: 3, rules: [rule] }, catalog).errors).toEqual([]);
    }
  });
  it('includes both transitive type parents and literal whitespace', () => {
    const c = adapt({ SchemaVersion: 1, FilterVersion: 3,
      BaseItems: [{ Kind: 'weapon', Code: 'abc', NameKey: 'abc', BaseNameSelector: ' Literal ', TypeCode: 'leaf', TypeCode2: 'alt' }],
      ItemTypes: [{ Code: 'leaf', TypeNameSelector: ' Leaf ', ParentCode: 'root', ParentCode2: '' },
        { Code: 'root', TypeNameSelector: 'Root', ParentCode: '', ParentCode2: '' },
        { Code: 'alt', TypeNameSelector: 'Other', ParentCode: '', ParentCode2: '' }], UniqueItems: [], SetItems: []
    }, {});
    expect(c.baseNames).toEqual([' Literal ']);
    for (const type of ['leaf', ' Leaf ', 'root', 'Root', 'alt', 'Other']) expect([...c.itemTypeMap.get(type)!]).toEqual(['abc']);
  });
  it('rejects unsupported catalog schemas', () => {
    expect(() => adapt({ ...bundle, SchemaVersion: 99 }, strings)).toThrow(/Unsupported/);
  });
});

describe('Pyre Loot Filter schema v3 contract', () => {
  const validate = (block: unknown) => M.validateFilter({ version: 3, rules: [{ show: block }] });
  it('round trips ordered Show/Hide and Continue with all actions', () => {
    const filter = { version: 3, rules: [{ show: { ruleName: 'Styled', continue: true,
      conditions: { code: ['r01', 'r02'], tier: ['exceptional', 'elite'], quantity: { gte: 256, lte: 65535 }, sockets: { eq: 15 }, itemLevel: { gte: 1, lte: 99 }, ethereal: false, identified: true, rarity: ['normal', 'unique'] },
      name: 'Custom\nName', tooltip: { textColor: 'RGBA(255, 128, 0, 1)', borderColor: 'RGBA(225, 205, 255, 1)', backgroundColor: 'RGBA(0, 0, 0, 0.5)' },
      dropSound: 'Filter16', minimapIcon: { shape: 'square', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 0.5)' }
    } }, { hide: { conditions: { rarity: 'inferior', tier: 'normal' } } }] };
    const result = M.validateFilter(filter);
    expect(result.errors).toEqual([]);
    expect(JSON.parse(result.json)).toEqual(filter);
    expect(M.summarizeRule(filter.rules[1])).toMatchObject({ kind: 'hide', conditionSummary: 'tier: normal · rarity: inferior' });
    for (const shape of ['circle', 'square', 'diamond', 'triangle', 'triangleDown', 'star', 'spark', 'kite', 'hexagon', 'cross', 'chevron', 'bullseye']) {
      expect(validate({ minimapIcon: { shape, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 0.5)' } }).errors).toEqual([]);
    }
  });
  it('treats unchecked/undefined optional fields as omitted like JSON serialization', () => {
    const rule = {
      show: {
        ruleName: undefined,
        continue: undefined,
        conditions: undefined,
        name: undefined,
        tooltip: undefined,
        dropSound: undefined,
        minimapIcon: undefined
      }
    };
    const withPartial = {
      show: {
        conditions: { rarity: 'unique', tier: undefined, code: undefined, ethereal: undefined, sockets: undefined },
        tooltip: { textColor: 'RGBA(255, 180, 90, 1)', borderColor: undefined, backgroundColor: undefined },
        minimapIcon: { shape: 'diamond', borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(215, 175, 85, 1)', size: undefined }
      }
    };
    const result = M.validateFilter({ version: 3, rules: [rule, withPartial] });
    expect(result.errors).toEqual([]);
    expect(JSON.parse(result.json)).toEqual({
      version: 3,
      rules: [
        { show: {} },
        {
          show: {
            conditions: { rarity: 'unique' },
            tooltip: { textColor: 'RGBA(255, 180, 90, 1)' },
            minimapIcon: { shape: 'diamond', borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(215, 175, 85, 1)' }
          }
        }
      ]
    });
    expect(M.summarizeRule(rule)).toMatchObject({ kind: 'show', conditionSummary: 'Catch-all', actionSummary: 'Visibility only' });
    expect(M.summarizeRule(withPartial)).toMatchObject({ kind: 'show', conditionSummary: 'rarity: unique', actionSummary: 'Tooltip · Minimap' });
  });
  it('accepts all 7 non-empty combinations of tooltip backgroundColor, borderColor, and textColor', () => {
    const bg = 'RGBA(28, 12, 44, 0.92)';
    const border = 'RGBA(210, 120, 255, 1)';
    const text = 'RGBA(240, 200, 255, 1)';
    const combos = [
      { backgroundColor: bg },
      { borderColor: border },
      { textColor: text },
      { backgroundColor: bg, borderColor: border },
      { backgroundColor: bg, textColor: text },
      { borderColor: border, textColor: text },
      { backgroundColor: bg, borderColor: border, textColor: text }
    ];
    for (const tooltip of combos) {
      const res = validate({ tooltip });
      expect(res.errors, JSON.stringify(tooltip)).toEqual([]);
      expect(JSON.parse(res.json).rules[0].show.tooltip).toEqual(tooltip);
    }
    expect(validate({ tooltip: {} }).errors.length).toBeGreaterThan(0);
    expect(validate({ tooltip: { outlineColor: border } }).errors.length).toBeGreaterThan(0);
    // Schema v3 forbids flat v2 color keys directly on the rule block.
    for (const flatKey of ['backgroundColor', 'borderColor', 'textColor']) {
      expect(validate({ [flatKey]: border }).errors.length).toBeGreaterThan(0);
    }
  });
  it('round-trips color picker hex and opacity values into RGBA(r, g, b, a) strings and accepts #RRGGBB/#RRGGBBAA', () => {
    const cases = [
      { hex: '#000000', alpha: 0, expected: 'RGBA(0, 0, 0, 0)' },
      { hex: '#ffffff', alpha: 1, expected: 'RGBA(255, 255, 255, 1)' },
      { hex: '#e45a35', alpha: 0.85, expected: 'RGBA(228, 90, 53, 0.85)' },
      { hex: '#d278ff', alpha: -0.5, expected: 'RGBA(210, 120, 255, 0)' },
      { hex: '#d278ff', alpha: 2.5, expected: 'RGBA(210, 120, 255, 1)' },
      { hex: 'invalid', alpha: NaN, expected: 'RGBA(0, 0, 0, 1)' }
    ];
    for (const c of cases) {
      const str = M.rgbaString(c.hex, c.alpha);
      expect(str).toBe(c.expected);
      expect(M.parseRgba(str)).toBeTruthy();
      expect(validate({ tooltip: { borderColor: str } }).errors).toEqual([]);
    }
    expect(M.rgbaToHex('RGBA(228, 90, 53, 0.85)')).toEqual({ hex: '#e45a35', alpha: 0.85 });
    expect(M.parseRgba('#ff3d00')).toEqual({ r: 255, g: 61, b: 0, a: 1 });
    expect(M.parseRgba('#ff3d00ff')).toEqual({ r: 255, g: 61, b: 0, a: 1 });
    expect(validate({ tooltip: { borderColor: '#FF3D00FF' } }).errors).toEqual([]);
    for (const badColor of ['', 'rgb(255, 0, 0)', '#ff00', 'RGBA(256, 0, 0, 1)', 'RGBA(0, -1, 0, 1)', 'RGBA(0, 0, 0, 1.01)', 'RGBA(0, 0, 0, -0.1)', 'RGBA(1.5, 0, 0, 1)']) {
      expect(M.parseRgba(badColor), badColor).toBeNull();
      expect(validate({ tooltip: { textColor: badColor } }).errors.length, badColor).toBeGreaterThan(0);
    }
  });
  it('validates all 16 drop sounds, all 8 rarities, all 3 tiers, and all 12 minimap shapes and size bounds', () => {
    expect(M.DROP_SOUNDS).toHaveLength(16);
    for (const dropSound of M.DROP_SOUNDS) {
      expect(validate({ dropSound }).errors).toEqual([]);
    }
    for (const badSound of ['', 'Filter00', 'Filter17', 'Filter1', '../Filter01', 'Filter01.flac']) {
      expect(validate({ dropSound: badSound }).errors.length, badSound).toBeGreaterThan(0);
    }

    expect(M.RARITIES).toEqual(['inferior', 'normal', 'superior', 'magic', 'set', 'rare', 'unique', 'crafted']);
    for (const rarity of M.RARITIES) {
      expect(validate({ conditions: { rarity } }).errors).toEqual([]);
    }
    expect(validate({ conditions: { rarity: M.RARITIES } }).errors).toEqual([]);
    expect(validate({ conditions: { rarity: [...M.RARITIES, 'inferior'] } }).errors.length).toBeGreaterThan(0);

    expect(M.TIERS).toEqual(['normal', 'exceptional', 'elite']);
    for (const tier of M.TIERS) {
      expect(validate({ conditions: { tier } }).errors).toEqual([]);
    }
    expect(validate({ conditions: { tier: M.TIERS } }).errors).toEqual([]);
    expect(validate({ conditions: { tier: [...M.TIERS, 'normal'] } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { tier: 'mythic' } }).errors.length).toBeGreaterThan(0);

    expect(M.MINIMAP_SHAPES).toEqual(['circle', 'square', 'diamond', 'triangle', 'triangleDown', 'star', 'spark', 'kite', 'hexagon', 'cross', 'chevron', 'bullseye']);
    for (const size of [4, 12, 24, 40, 128]) {
      const res = validate({ minimapIcon: { shape: 'star', size, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 145, 35, 1)' } });
      expect(res.errors).toEqual([]);
      expect(res.warnings).toEqual([]);
    }
    // Out-of-range integer sizes warn that the plugin clamps them, whereas non-integers fail validation.
    for (const clampedSize of [2, 160]) {
      const res = validate({ minimapIcon: { shape: 'circle', size: clampedSize, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 145, 35, 1)' } });
      expect(res.errors).toEqual([]);
      expect(res.warnings.length).toBe(1);
    }
    for (const badIcon of [
      { shape: 'pentagon', borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 1)' },
      { shape: 'star', borderColor: 'RGBA(255, 255, 255, 1)' },
      { shape: 'star', fillColor: 'RGBA(255, 0, 0, 1)' },
      { shape: 'star', size: 16.5, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 1)' },
      { shape: 'star', borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 1)', extra: true }
    ]) {
      expect(validate({ minimapIcon: badIcon }).errors.length, JSON.stringify(badIcon)).toBeGreaterThan(0);
    }
  });
  it('validates custom ground names across line counts, line lengths, and total ASCII byte limits', () => {
    expect(validate({ name: 'Single line name' }).errors).toEqual([]);
    expect(validate({ name: '[GG] {name}' }).errors).toEqual([]);
    expect(validate({ name: 'Line one\nLine two\nLine three' }).errors).toEqual([]);
    expect(validate({ name: 'A'.repeat(55) }).errors).toEqual([]);
    // 55 + 1 (\n) + 23 = 79 bytes total across 2 lines
    expect(validate({ name: `${'A'.repeat(55)}\n${'B'.repeat(23)}` }).errors).toEqual([]);

    for (const badName of [
      '',
      'Line one\n\nLine three',
      'Line one\n',
      '\nLine two',
      'Line 1\nLine 2\nLine 3\nLine 4',
      'A'.repeat(56),
      `${'A'.repeat(55)}\n${'B'.repeat(24)}`, // 80 bytes
      'Line one\r\nLine two',
      'Tab\there',
      'Non-ASCII é'
    ]) {
      expect(validate({ name: badName }).errors.length, JSON.stringify(badName)).toBeGreaterThan(0);
    }
  });
  it('validates all numeric comparators, bounds, and condition array limits', () => {
    for (const test of [
      { eq: 0 },
      { gt: 0, lt: 15 },
      { gte: 1, lte: 6 },
      { eq: 4, gte: 1, lte: 6 }
    ]) {
      expect(validate({ conditions: { sockets: test } }).errors, JSON.stringify(test)).toEqual([]);
    }
    // Conflicting minimum or maximum comparators must be rejected
    for (const badNumeric of [
      {},
      { gt: 1, gte: 2 },
      { lt: 5, lte: 6 },
      { min: 1 },
      { eq: -1 },
      { eq: 1.5 }
    ]) {
      expect(validate({ conditions: { sockets: badNumeric } }).errors.length, JSON.stringify(badNumeric)).toBeGreaterThan(0);
    }

    // String/array condition limits (1..64 items, printable codes, <=127 char selectors)
    const codes64 = Array.from({ length: 64 }, (_, i) => `c${String(i).padStart(2, '0')}`);
    expect(validate({ conditions: { code: codes64 } }).errors).toEqual([]);
    expect(validate({ conditions: { code: [...codes64, 'c64'] } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { code: [] } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { code: '   ' } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { baseName: 'A'.repeat(127) } }).errors).toEqual([]);
    expect(validate({ conditions: { baseName: 'A'.repeat(128) } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { itemType: 'weap\narmo' } }).errors.length).toBeGreaterThan(0);
    expect(validate({ conditions: { itemType: 'weap\tarmo' } }).errors.length).toBeGreaterThan(0);
  });
  it('supports editor helper operations without leaving invalid empty objects in serialized JSON', () => {
    const filter = { version: 3 as const, rules: [M.makeRule('show'), M.makeRule('hide')] };
    expect(kindOf(filter.rules[0])).toBe('show');
    expect(kindOf(filter.rules[1])).toBe('hide');
    expect(M.ruleKind(filter.rules[0])).toBe('show');
    expect(M.ruleKind(filter.rules[1])).toBe('hide');
    blockOf(filter.rules[0]).ruleName = 'Top priority rule';
    expect(M.ruleBlock(filter.rules[0]).ruleName).toBe('Top priority rule');
    const cloned = M.clone(filter);
    expect(M.validateFilter(cloned).errors).toEqual([]);
    expect(values(undefined)).toEqual([]);
    expect(values('r20')).toEqual(['r20']);
    expect(values(['r20', 'r21'])).toEqual(['r20', 'r21']);
  });
  it.each([{ quantity: { eq: 65536 } }, { quantity: { eq: NaN } }, { quantity: { eq: null } }, { sockets: { eq: 16 } }, { itemLevel: { eq: 0 } }, { itemLevel: { eq: 100 } }, { code: 'toolong' }, { identified: 'yes' }, { ethereal: 1 }, { uniqueName: 'Shako' }])('rejects unsupported conditions %j', conditions => {
    expect(validate({ conditions }).errors.length).toBeGreaterThan(0);
  });
  it('rejects malformed input and unsupported schema without crashing', () => {
    for (const filter of [null, [], { version: 2, rules: [] }, { version: 3, rules: [null] }, { version: 3, rules: [{ show: {}, hide: {} }] }, { version: 3, rules: [{}] }]) {
      expect(M.validateFilter(filter).errors.length).toBeGreaterThan(0);
    }
  });
  it('enforces rule count, serialized bytes and ASCII names', () => {
    expect(M.validateFilter({ version: 3, rules: Array.from({ length: 4097 }, () => ({ show: {} })) }).errors.join()).toMatch(/4096/);
    expect(validate({ ruleName: 'x'.repeat(4 * 1024 * 1024) }).errors.join()).toMatch(/bytes/);
    expect(validate({ name: 'é' }).errors.join()).toMatch(/ASCII/);
  });
});
