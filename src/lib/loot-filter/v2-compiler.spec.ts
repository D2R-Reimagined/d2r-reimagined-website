import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import M from './model.js';
import { fromExport } from './catalog.js';
import {
  CATEGORIES,
  CURATED_BUILD_PRESETS,
  EQUIPMENT_FAMILIES,
  STRICTNESS_PRESETS,
  THEME_PRESETS,
  TIERABLE_ITEMS,
  applyCuratedBuildPreset,
  applySiteBuildToConfig,
  compileV2Filter,
  createDefaultV2Config,
  effectiveItemTier,
  extractV2ConfigFromFilter,
  generateLootsplosion,
  selectArchetypeForBuild,
  selectClassForBuild,
  simulateItemDrop,
  toggleEquipmentFamily,
  type StrictnessId,
  type ThemeId
} from './v2-compiler.js';

const bundle = JSON.parse(readFileSync(new URL('../../../static/data/keyed/loot-filter.json', import.meta.url), 'utf8'));
const strings = JSON.parse(readFileSync(new URL('../../../static/data/strings/enUS.json', import.meta.url), 'utf8'));
const catalog = fromExport(bundle, strings);
const knownCodes = new Set(catalog.baseItems.map(item => item.code!));

describe('FilterBlade v2 compiler & customizer model', () => {
  it('validates every item code and itemType in TIERABLE_ITEMS against the exported Reimagined catalog', () => {
    expect(CATEGORIES.length).toBe(9);
    expect(TIERABLE_ITEMS.length).toBeGreaterThan(80);

    for (const item of TIERABLE_ITEMS) {
      for (const code of item.codes ?? []) {
        expect(knownCodes.has(code), `Unknown code "${code}" in item "${item.id}"`).toBe(true);
      }
      for (const type of item.itemTypes ?? []) {
        expect(catalog.itemTypeMap.has(type), `Unknown itemType "${type}" in item "${item.id}"`).toBe(true);
      }
    }
  });

  it.each(STRICTNESS_PRESETS)('compiles valid schema-v3 JSON with zero errors and zero warnings for strictness "$id"', preset => {
    for (const theme of Object.keys(THEME_PRESETS) as ThemeId[]) {
      const config = createDefaultV2Config(preset.id, theme);
      const filter = compileV2Filter(config);
      const result = M.validateFilter(filter, catalog);
      expect(result.errors, `${preset.id}:${theme} errors`).toEqual([]);
      expect(result.warnings, `${preset.id}:${theme} warnings`).toEqual([]);
    }
  });

  it('round-trips V2Config state losslessly through the compiled v3 filter.json document', () => {
    const config = createDefaultV2Config('strict', 'neon');
    config.itemOverrides['rune-r01'] = 'S';
    config.itemOverrides['curr-ooc-corrupt'] = 'HIDE';
    config.tierStyleOverrides.S = { dropSound: 'Filter12', textColor: 'RGBA(255, 255, 255, 1)' };
    config.baseSettings.requireSocketsOnBases = true;
    config.baseSettings.minSocketsOnBases = 4;
    config.customBases.push({
      id: 'cb-1',
      code: 'uit',
      label: 'Monarch',
      tier: 'S',
      mode: 'runeword',
      minSockets: 4,
      etherealOnly: false
    });
    config.customPriorityRules.push({
      show: {
        ruleName: 'My Personal Rule',
        conditions: { code: 'r33' },
        dropSound: 'Filter01'
      }
    });

    const compiled = compileV2Filter(config);
    expect(M.validateFilter(compiled, catalog).errors).toEqual([]);

    const extracted = extractV2ConfigFromFilter(compiled);
    expect(extracted).not.toBeNull();
    expect(extracted!.strictness).toBe('strict');
    expect(extracted!.theme).toBe('neon');
    expect(extracted!.itemOverrides).toEqual({
      'rune-r01': 'S',
      'curr-ooc-corrupt': 'HIDE'
    });
    expect(extracted!.tierStyleOverrides.S).toEqual({
      dropSound: 'Filter12',
      textColor: 'RGBA(255, 255, 255, 1)'
    });
    expect(extracted!.baseSettings.requireSocketsOnBases).toBe(true);
    expect(extracted!.baseSettings.minSocketsOnBases).toBe(4);
    expect(extracted!.customBases).toHaveLength(1);
    expect(extracted!.customBases[0].code).toBe('uit');
    expect(extracted!.customPriorityRules).toHaveLength(1);
    expect(extracted!.customPriorityRules[0].show?.ruleName).toBe('My Personal Rule');
  });

  it('preserves user tier overrides when switching strictness levels (FilterBlade diff behavior)', () => {
    const config = createDefaultV2Config('soft', 'reimagined');
    const elRune = TIERABLE_ITEMS.find(x => x.id === 'rune-r01')!;
    expect(effectiveItemTier(elRune, config)).toBe('D');

    // Raising strictness to strict hides El Rune by default
    config.strictness = 'strict';
    expect(effectiveItemTier(elRune, config)).toBe('HIDE');

    // User promotes El Rune to Tier A; changing strictness to endgame keeps it in Tier A
    config.itemOverrides['rune-r01'] = 'A';
    config.strictness = 'endgame';
    expect(effectiveItemTier(elRune, config)).toBe('A');

    const filter = compileV2Filter(config);
    const sim = simulateItemDrop(filter, catalog, {
      id: 'test-el',
      code: 'r01',
      name: 'El Rune (#1)',
      kind: 'misc',
      rarity: 'normal',
      sockets: 0,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    expect(sim.show).toBe(true);
    expect(sim.matchedCategory).toBe('runes');
  });

  it('progressively filters clutter across strictness levels in the simulator', () => {
    const resultsFor = (item: Parameters<typeof simulateItemDrop>[2]) =>
      (['soft', 'regular', 'semi-strict', 'strict', 'endgame'] as StrictnessId[]).map(s => {
        const filter = compileV2Filter(createDefaultV2Config(s));
        return simulateItemDrop(filter, catalog, item).show;
      });

    // Unsocketed normal Hand Axe: shown in Soft, hidden in Regular+
    expect(
      resultsFor({
        id: '1',
        code: 'hax',
        name: 'Hand Axe',
        kind: 'weapon',
        tier: 'normal',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 80,
        quantity: 1
      })
    ).toEqual([true, false, false, false, false]);

    // Flawed Amethyst (and all gems): always shown across all strictness levels for the in-game Gem Bag
    expect(
      resultsFor({
        id: '2',
        code: 'gfv',
        name: 'Flawed Amethyst',
        kind: 'misc',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 80,
        quantity: 1
      })
    ).toEqual([true, true, true, true, true]);
    for (const gemItem of TIERABLE_ITEMS.filter(x => x.category === 'gems')) {
      expect(gemItem.id).not.toContain('chipped');
      for (const s of ['soft', 'regular', 'semi-strict', 'strict', 'endgame'] as StrictnessId[]) {
        expect(effectiveItemTier(gemItem, createDefaultV2Config(s))).not.toBe('HIDE');
      }
    }

    // El Rune: shown in Soft, Regular, Semi-Strict; hidden in Strict & Endgame
    expect(
      resultsFor({
        id: '3',
        code: 'r01',
        name: 'El Rune (#1)',
        kind: 'misc',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 80,
        quantity: 1
      })
    ).toEqual([true, true, true, false, false]);

    // Jah Rune: always shown at every strictness
    expect(
      resultsFor({
        id: '4',
        code: 'r31',
        name: 'Jah Rune (#31)',
        kind: 'misc',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 85,
        quantity: 1
      })
    ).toEqual([true, true, true, true, true]);
  });

  it('generates lootsplosion scenarios and evaluates every item cleanly', () => {
    const filter = compileV2Filter(createDefaultV2Config('semi-strict', 'filterblade'));
    for (const scenario of ['endgame-map', 'hell-boss', 'rune-currency', 'campaign'] as const) {
      const drops = generateLootsplosion(scenario);
      expect(drops.length).toBeGreaterThan(8);
      for (const drop of drops) {
        const res = simulateItemDrop(filter, catalog, drop);
        expect(res.matchedRuleIndex).toBeGreaterThanOrEqual(0);
        expect(res.displayLabel.length).toBeGreaterThan(0);
      }
    }
  });

  it('auto-adjusts for archetype, single-select class, weapon toggles, signature presets, and site builds with valid schema-v3 output', () => {
    for (const fam of EQUIPMENT_FAMILIES) {
      for (const type of fam.itemTypes) {
        expect(catalog.itemTypeMap.has(type), `Unknown itemType "${type}" in family "${fam.id}"`).toBe(true);
      }
    }

    for (const preset of CURATED_BUILD_PRESETS) {
      const cfg = createDefaultV2Config('semi-strict', 'reimagined');
      const applied = applyCuratedBuildPreset(cfg, preset.id);
      expect(applied).not.toBeNull();
      expect(cfg.buildProfile.selectedClass).toBe(preset.characterClass);
      expect(cfg.customBases.length).toBe(preset.pinnedBases.length);

      const compiled = compileV2Filter(cfg);
      const val = M.validateFilter(compiled, catalog);
      expect(val.errors, `preset ${preset.id} errors`).toEqual([]);
      expect(val.warnings, `preset ${preset.id} warnings`).toEqual([]);

      const roundTripped = extractV2ConfigFromFilter(compiled);
      expect(roundTripped?.buildProfile.presetId).toBe(preset.id);
      expect(roundTripped?.buildProfile.selectedClass).toBe(preset.characterClass);
    }

    // Verify selecting Amazon enables Spear / Javelin / Bow + Quiver / Crossbow + Bolt (+ Shield/Polearm) and disables the rest
    const amaCfg = createDefaultV2Config('semi-strict', 'reimagined');
    selectClassForBuild(amaCfg, 'Amazon');
    expect(amaCfg.buildProfile.selectedClass).toBe('Amazon');
    expect(amaCfg.buildProfile.archetype).toBe('ranged');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('bow-quiver');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('xbow-quiver');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('javelin');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('spear');
    expect(amaCfg.buildProfile.disabledFamilies).toContain('sword');
    expect(amaCfg.buildProfile.disabledFamilies).toContain('wand');
    expect(amaCfg.buildProfile.disabledFamilies).toContain('claws');
    expect(amaCfg.itemOverrides['base-ama-weapons']).toBe('A');
    expect(amaCfg.itemOverrides['base-sin-claws']).toBe('HIDE');

    // User can then toggle individual weapon types on/off (e.g. enable Swords for Call to Arms / Spirit)
    toggleEquipmentFamily(amaCfg, 'sword');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('sword');
    toggleEquipmentFamily(amaCfg, 'xbow-quiver');
    expect(amaCfg.buildProfile.disabledFamilies).toContain('xbow-quiver');

    // Verify archetype selection works standalone too
    selectArchetypeForBuild(amaCfg, 'caster');
    expect(amaCfg.buildProfile.archetype).toBe('caster');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('sorc-orb');
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('warlock-grimoire');
    expect(amaCfg.buildProfile.disabledFamilies).toContain('bow-quiver');

    // Verify Warlock uses daggers (not wands), Druid uses clubs (not maces), and Barbarian shows shields
    const clsCheckCfg = createDefaultV2Config('semi-strict', 'reimagined');
    selectClassForBuild(clsCheckCfg, 'Warlock');
    expect(clsCheckCfg.buildProfile.disabledFamilies).not.toContain('dagger');
    expect(clsCheckCfg.buildProfile.disabledFamilies).toContain('wand');

    selectClassForBuild(clsCheckCfg, 'Druid');
    expect(clsCheckCfg.buildProfile.disabledFamilies).not.toContain('club');
    expect(clsCheckCfg.buildProfile.disabledFamilies).toContain('mace');

    selectClassForBuild(clsCheckCfg, 'Barbarian');
    expect(clsCheckCfg.buildProfile.disabledFamilies).not.toContain('standard-shield');
    expect(clsCheckCfg.buildProfile.disabledFamilies).not.toContain('throwing');

    // Verify site build import resolves catalog items, full Set prefixes, character snapshots, and plain-text prose
    const warlockCfg = createDefaultV2Config('semi-strict', 'reimagined');
    const sampleUnique = catalog.uniqueItems[0]!;
    const siteRes = applySiteBuildToConfig(
      warlockCfg,
      {
        id: 'build-123',
        title: 'Test Warlock Guide',
        characterClass: 'Warlock',
        itemKeys: [
          { catalog: 'uniques', key: sampleUnique.name },
          { catalog: 'bases', key: 'uit' }
        ],
        snapshotItems: [
          { code: 'utp', baseName: 'Archon Plate', quality: 'Superior', sockets: 3, isRuneword: true }
        ],
        proseText: 'This build also works great with [[item:sets:Immortal King]] or a Harlequin Crest.'
      },
      catalog
    );
    expect(siteRes.pinnedCount).toBeGreaterThanOrEqual(8);
    expect(warlockCfg.buildProfile.selectedClass).toBe('Warlock');
    expect(warlockCfg.buildProfile.linkedBuildId).toBe('build-123');
    expect(M.validateFilter(compileV2Filter(warlockCfg), catalog).errors).toEqual([]);
  });
});
