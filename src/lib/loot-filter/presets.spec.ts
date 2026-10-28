import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createPreset, presets, type PresetId } from './presets';
import { fromExport } from './catalog.js';
import M from './model.js';
import { blockOf, kindOf, values, type Conditions, type Rule } from './types';

const catalog = fromExport(JSON.parse(readFileSync(new URL('../../../static/data/keyed/loot-filter.json', import.meta.url), 'utf8')), {});
const knownCodes = new Set(catalog.baseItems.map(item => item.code!));
function matchingRule(preset: PresetId, code: string, rarity = 'normal', sockets = 0, ethereal = false): Rule | undefined {
  const matches = (c?: Conditions) => !c || ((!c.code || values(c.code).includes(code))
    && (!c.baseName || values(c.baseName).some(name => catalog.baseItems.some(b => b.code === code && b.baseName === name)))
    && (!c.rarity || values(c.rarity).includes(rarity))
    && (!c.itemType || values(c.itemType).some(type => catalog.itemTypeMap.get(type)?.has(code)))
    && (!c.sockets || (c.sockets.eq === undefined || c.sockets.eq === sockets) && (c.sockets.gte === undefined || sockets >= c.sockets.gte))
    && (c.ethereal === undefined || c.ethereal === ethereal));
  return createPreset(preset).rules.find(rule => matches((rule.show ?? rule.hide).conditions));
}
function visible(preset: PresetId, code: string, rarity = 'normal', sockets = 0, ethereal = false) {
  return !!matchingRule(preset, code, rarity, sockets, ethereal)?.show;
}
// Map item types arrived in Reimagined 3.0.13. A 3.0.12 export has no such types, so the
// validator reports them as warnings there; they are never errors.
const laterTypes = new Set(['mapi', 'mcur']);
const presetTypes = (id: PresetId) => [...new Set(createPreset(id).rules.flatMap(rule => values((rule.show ?? rule.hide)!.conditions?.itemType)))];
const presetCodes = (id: PresetId) => [...new Set(createPreset(id).rules.flatMap(rule => values((rule.show ?? rule.hide)!.conditions?.code)))];

describe('conservative starter presets', () => {
  it.each(presets)('$name is valid and every code and type exists in the exported mod', preset => {
    const filter = createPreset(preset.id);
    const validation = M.validateFilter(filter, catalog);
    expect(validation.errors).toEqual([]);
    const reparsed = JSON.parse(validation.json);
    expect(reparsed).toEqual(filter);
    expect(reparsed.version).toBe(3);

    // Every item code referenced by any preset rule must exist in the Reimagined catalog.
    for (const code of presetCodes(preset.id)) {
      expect(knownCodes.has(code), `Unknown item code "${code}" in preset "${preset.id}"`).toBe(true);
    }

    const missing = presetTypes(preset.id).filter(type => !catalog.itemTypes.includes(type));
    // A misspelled or retired type fails here; only types newer than the export may be absent.
    expect(missing.filter(type => !laterTypes.has(type))).toEqual([]);
    const warned = (type: string) => validation.warnings.some(warning => warning.includes(`itemType “${type}”`));
    expect(validation.warnings.every(warning => missing.some(type => warning.includes(`itemType “${type}”`)))).toBe(true);
    expect(missing.every(warned)).toBe(true);
    expect(filter.rules.at(-1)).toEqual({ show: { ruleName: 'Keep everything else visible' } });
  });

  it('prioritizes drop-only lvl 107+ unique and lvl 100 set bases above general uniques and sets', () => {
    const dropOnlyBases = [
      'cm1', 'cjw', '7gd', '7fb', '7gs', '7wa', 'obb', 'pae', 'paf', 'ned', 'nee', 'bae',
      'uul', 'uth', 'utp', 'upl', 'uhn', 'urs', 'aqv', 'cqv', 'ame', 'amf', 'amb', 'drb',
      'drf', '7ar', '7cs', '7wb',
      'hgl', 'ghm', 'ful', 'hbt', 'hbl'
    ];
    for (const id of presets.map(p => p.id)) {
      for (const code of dropOnlyBases) {
        const uniqueRule = matchingRule(id, code, 'unique')!;
        const setRule = matchingRule(id, code, 'set')!;
        expect(blockOf(uniqueRule).ruleName).toBe('Drop-only unique and set bases');
        expect(blockOf(setRule).ruleName).toBe('Drop-only unique and set bases');
      }
      // Non-drop-only unique/set bases match the general "Uniques and sets" rule (#2)
      const shakoRule = matchingRule(id, 'uap', 'unique')!;
      expect(blockOf(shakoRule).ruleName).toBe('Uniques and sets');
      // Normal/magic drops of drop-only bases do not falsely trigger the drop-only unique/set callout
      const normalColossalSword = matchingRule(id, '7fb', 'normal')!;
      expect(blockOf(normalColossalSword).ruleName).not.toBe('Drop-only unique and set bases');
    }
  });

  it('orders high-value callouts above broad category and equipment rules', () => {
    for (const id of presets.map(p => p.id)) {
      // High runes (Lem..Hev, stackable & unstacked) match before general Runes/Gems
      for (const code of ['r20', 'r30', 'r39', 's20', 's30', 's39']) {
        expect(blockOf(matchingRule(id, code)!).ruleName).toBe('High runes (Lem through Hev)');
      }
      // Low runes (El..Fal) fall through to general Runes, gems and Reimagined currencies
      for (const code of ['r01', 'r19', 's01', 's19']) {
        expect(blockOf(matchingRule(id, code)!).ruleName).toBe('Runes, gems and Reimagined currencies');
      }
      // Colossal jewels, sunder charms, and torches match before general Charms, jewels and jewelry
      expect(blockOf(matchingRule(id, 'cjw', 'magic')!).ruleName).toBe('Colossal jewels, sunder charms and torches');
      // Power orbs and Gem Clusters match their dedicated callout
      for (const code of ['ka3', 'oos', 'ooc', '1or', '1gc']) {
        expect(blockOf(matchingRule(id, code)!).ruleName).toBe('Power orbs and Gem Clusters');
      }
      // Circlets match their dedicated Circlets rule before Rare/Crafted or Hide rules
      expect(blockOf(matchingRule(id, 'ci3', 'rare')!).ruleName).toBe('Circlets');
      expect(blockOf(matchingRule(id, 'ci0', 'normal')!).ruleName).toBe('Circlets');
      // Buff and sunder potions sit near the bottom above Hide rules, with text color only (no border or minimap icon)
      for (const code of ['mfp', 'xpp', 'fsp', 'csp', 'lsp', 'psp', 'msp', 'php']) {
        const potRule = matchingRule(id, code)!;
        expect(kindOf(potRule)).toBe('show');
        expect(blockOf(potRule).ruleName).toBe('Buff and sunder potions');
        expect(blockOf(potRule).tooltip).toEqual({ textColor: 'RGBA(185, 255, 225, 1)' });
        expect(blockOf(potRule).minimapIcon).toBeUndefined();
      }
    }
  });

  it('strictness progressively reduces ordinary equipment while protecting valuable categories', () => {
    expect(['starter', 'semi-strict', 'strict'].map(id => visible(id as PresetId, 'hax'))).toEqual([true, false, false]);
    expect(['starter', 'semi-strict', 'strict'].map(id => visible(id as PresetId, 'hax', 'magic'))).toEqual([true, true, false]);
    for (const id of presets.map(p => p.id)) {
      for (const rarity of ['rare', 'crafted', 'unique', 'set']) expect(visible(id, 'hax', rarity)).toBe(true);
      expect(visible(id, 'hax', 'normal', 3)).toBe(true);
      expect(visible(id, 'hax', 'normal', 0, true)).toBe(true);
      for (const code of ['mor', 'md1', 'r39', 's39', 'gpv', 'cm1', 'jew', 'cjw', 'box', 'rin', 'amu', 'hp1', 'gld', 'UNKNOWN']) expect(visible(id, code)).toBe(true);
    }
  });

  it('keeps every misc item and all unique/set/rare/crafted drops visible across the real catalog', () => {
    for (const item of catalog.baseItems) {
      for (const id of presets.map(p => p.id)) {
        if (item.kind === 'misc') expect(visible(id, item.code!), `${id}:${item.code}`).toBe(true);
        for (const rarity of ['unique', 'set', 'rare', 'crafted']) expect(visible(id, item.code!, rarity)).toBe(true);
      }
    }
  });

  it('creates independent copies without changing templates or another filter', () => {
    const first = createPreset('starter'), second = createPreset('starter');
    first.rules[0].show!.ruleName = 'Edited';
    expect(second.rules[0].show!.ruleName).toBe('Drop-only unique and set bases');
    expect(M.RARITIES).toContain('crafted');
    expect(M.validateFilter({ version: 3, rules: [{ show: { conditions: { rarity: 'crafted' } } }] }, catalog).errors).toEqual([]);
  });
});
