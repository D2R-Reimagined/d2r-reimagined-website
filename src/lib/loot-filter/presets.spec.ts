import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createPreset, presets, type PresetId } from './presets';
import { fromExport } from './catalog.js';
import M from './model.js';
import { values, type Conditions } from './types';

const catalog = fromExport(JSON.parse(readFileSync(new URL('../../../static/data/keyed/loot-filter.json', import.meta.url), 'utf8')), {});
function visible(preset: PresetId, code: string, rarity = 'normal', sockets = 0, ethereal = false) {
  const matches = (c?: Conditions) => !c || ((!c.rarity || values(c.rarity).includes(rarity))
    && (!c.itemType || values(c.itemType).some(type => catalog.itemTypeMap.get(type)?.has(code)))
    && (!c.sockets || (c.sockets.eq === undefined || c.sockets.eq === sockets) && (c.sockets.gte === undefined || sockets >= c.sockets.gte))
    && (c.ethereal === undefined || c.ethereal === ethereal));
  const rule = createPreset(preset).rules.find(rule => matches((rule.show ?? rule.hide).conditions));
  return !!rule?.show;
}
// Map item types arrived in Reimagined 3.0.13. A 3.0.12 export has no such types, so the
// validator reports them as warnings there; they are never errors.
const laterTypes = new Set(['mapi', 'mcur']);
const presetTypes = (id: PresetId) => [...new Set(createPreset(id).rules.flatMap(rule => values((rule.show ?? rule.hide)!.conditions?.itemType)))];
describe('conservative starter presets', () => {
  it.each(presets)('$name is valid and every type exists in the exported mod', preset => {
    const validation = M.validateFilter(createPreset(preset.id), catalog);
    expect(validation.errors).toEqual([]);
    const missing = presetTypes(preset.id).filter(type => !catalog.itemTypes.includes(type));
    // A misspelled or retired type fails here; only types newer than the export may be absent.
    expect(missing.filter(type => !laterTypes.has(type))).toEqual([]);
    const warned = (type: string) => validation.warnings.some(warning => warning.includes(`itemType “${type}”`));
    expect(validation.warnings.every(warning => missing.some(type => warning.includes(`itemType “${type}”`)))).toBe(true);
    expect(missing.every(warned)).toBe(true);
    expect(createPreset(preset.id).rules.at(-1)).toEqual({ show: { ruleName: 'Keep everything else visible' } });
  });
  it('strictness progressively reduces ordinary equipment while protecting valuable categories', () => {
    expect(['starter', 'semi-strict', 'strict'].map(id => visible(id as PresetId, 'hax'))).toEqual([true, false, false]);
    expect(['starter', 'semi-strict', 'strict'].map(id => visible(id as PresetId, 'hax', 'magic'))).toEqual([true, true, false]);
    for (const id of presets.map(p => p.id)) {
      for (const rarity of ['rare', 'unique', 'set']) expect(visible(id, 'hax', rarity)).toBe(true);
      expect(visible(id, 'hax', 'normal', 3)).toBe(true);
      expect(visible(id, 'hax', 'normal', 0, true)).toBe(true);
      for (const code of ['mor', 'md1', 'r39', 's39', 'gpv', 'cm1', 'jew', 'cjw', 'box', 'rin', 'amu', 'hp1', 'gld', 'UNKNOWN']) expect(visible(id, code)).toBe(true);
    }
  });
  it('keeps every misc item and all unique/set/rare drops visible across the real catalog', () => {
    for (const item of catalog.baseItems) {
      for (const id of presets.map(p => p.id)) {
        if (item.kind === 'misc') expect(visible(id, item.code!), `${id}:${item.code}`).toBe(true);
        for (const rarity of ['unique', 'set', 'rare']) expect(visible(id, item.code!, rarity)).toBe(true);
      }
    }
  });
  it('creates independent copies without changing templates or another filter', () => {
    const first = createPreset('starter'), second = createPreset('starter');
    first.rules[0].show!.ruleName = 'Edited';
    expect(second.rules[0].show!.ruleName).toBe('Uniques and sets');
  });
});
