import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import M from './loot-filter/model.js';
import { fromExport as adapt } from './loot-filter/catalog.js';

// Exercise the same model and catalog adapter used by the native Svelte editor.
const bundle = JSON.parse(readFileSync(new URL('../../static/data/keyed/loot-filter.json', import.meta.url), 'utf8'));
const strings = JSON.parse(readFileSync(new URL('../../static/data/strings/enUS.json', import.meta.url), 'utf8'));

describe('Reimagined UnHoarder catalog', () => {
  const catalog = adapt(bundle, strings);
  it('loads the exported bases and enrichment without TXT uploads', () => {
    expect(catalog.baseItems.length).toBe(bundle.BaseItems.length);
    expect(catalog.uniqueItems.length).toBe(bundle.UniqueItems.length);
    expect(catalog.setItems.length).toBe(bundle.SetItems.length);
    expect(catalog.baseItems.length).toBeGreaterThan(600);
    for (const section of ['BaseItems', 'UniqueItems', 'SetItems']) {
      for (const item of bundle[section]) expect(strings[item.NameKey], item.NameKey).toBeTruthy();
    }
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

describe('distributed UnHoarder 1.1.0 filter contract', () => {
  const validate = (block: unknown) => M.validateFilter({ version: 3, rules: [{ show: block }] });
  it('round trips ordered Show/Hide and Continue with all actions', () => {
    const filter = { version: 3, rules: [{ show: { ruleName: 'Styled', continue: true,
      conditions: { code: ['r01', 'r02'], quantity: { gte: 256, lte: 65535 }, sockets: { eq: 15 }, itemLevel: { gte: 1, lte: 99 }, ethereal: false, identified: true, rarity: ['normal', 'unique'] },
      name: 'Custom\nName', tooltip: { textColor: 'RGBA(255, 128, 0, 1)', backgroundColor: 'RGBA(0, 0, 0, 0.5)' },
      dropSound: 'Filter16', minimapIcon: { shape: 'star', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 0, 0, 0.5)' }
    } }, { hide: { conditions: { rarity: 'inferior' } } }] };
    const result = M.validateFilter(filter);
    expect(result.errors).toEqual([]);
    expect(JSON.parse(result.json)).toEqual(filter);
  });
  it.each([{ quantity: { eq: 65536 } }, { quantity: { eq: NaN } }, { quantity: { eq: null } }, { sockets: { eq: 16 } }, { itemLevel: { eq: 100 } }, { code: 'toolong' }, { identified: 'yes' }, { uniqueName: 'Shako' }])('rejects unsupported conditions %j', conditions => {
    expect(validate({ conditions }).errors.length).toBeGreaterThan(0);
  });
  it('rejects malformed input and unsupported schema without crashing', () => {
    for (const filter of [null, [], { version: 2, rules: [] }, { version: 3, rules: [null] }, { version: 3, rules: [{ show: {}, hide: {} }] }]) {
      expect(M.validateFilter(filter).errors.length).toBeGreaterThan(0);
    }
  });
  it('enforces rule count, serialized bytes and ASCII names', () => {
    expect(M.validateFilter({ version: 3, rules: Array.from({ length: 4097 }, () => ({ show: {} })) }).errors.join()).toMatch(/4096/);
    expect(validate({ ruleName: 'x'.repeat(4 * 1024 * 1024) }).errors.join()).toMatch(/bytes/);
    expect(validate({ name: 'é' }).errors.join()).toMatch(/ASCII/);
  });
});
