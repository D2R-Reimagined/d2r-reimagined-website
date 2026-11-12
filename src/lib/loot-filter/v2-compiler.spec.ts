import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import M from './model.js';
import { fromExport } from './catalog.js';
import {
  BASE_SLOT_FILTERS,
  BUILD_ARCHETYPES,
  BUILD_CLASSES,
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
  extractV2ConfigWithMeta,
  findParentGroupForBase,
  generateLootsplosion,
  getGroupDisplayInfo,
  isBaseCardHardHidden,
  isBaseCardSoftHiddenByStrictness,
  reconcileGroupSplits,
  resolveTierableItemBases,
  sanitizeFilterFilename,
  selectArchetypeForBuild,
  selectClassForBuild,
  simulateItemDrop,
  syncDisabledFamiliesFromOverrides,
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
    expect(new Set(TIERABLE_ITEMS.map(i => i.id)).size).toBe(TIERABLE_ITEMS.length);

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
    expect(TIERABLE_ITEMS.find(x => x.id === 'curr-chaos-onyx')).toBeUndefined();
    const gemStacks = TIERABLE_ITEMS.find(x => x.id === 'gem-stacks-all');
    const reimaginedUnstacked = TIERABLE_ITEMS.find(x => x.id === 'gem-reimagined-unstacked');
    expect(gemStacks?.codes).toContain('1so');
    expect(gemStacks?.defaultTier).toBe('B');
    expect(reimaginedUnstacked?.codes).toContain('gmo');
    expect(reimaginedUnstacked?.defaultTier).toBe('B');
    const defaultFilter = compileV2Filter(createDefaultV2Config('semi-strict'));
    const chaosOnyxSim = simulateItemDrop(defaultFilter, catalog, {
      id: 'gmo-test',
      code: 'gmo',
      name: 'Chaos Onyx',
      kind: 'misc',
      rarity: 'normal',
      sockets: 0,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    const amethystSim = simulateItemDrop(defaultFilter, catalog, {
      id: 'gmm-test',
      code: 'gmm',
      name: 'Amethyst',
      kind: 'misc',
      rarity: 'normal',
      sockets: 0,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    expect(chaosOnyxSim.matchedRuleName).toBe(amethystSim.matchedRuleName);
    expect(chaosOnyxSim.matchedRuleName).toContain('Gems · Tier B');

    // All Charms (Small cm1, Large cm2, Grand cm3) are always shown across all strictness levels and all rarities
    expect(TIERABLE_ITEMS.find(i => i.id === 'charm-large')).toBeUndefined();
    const magicCharmsItem = TIERABLE_ITEMS.find(i => i.id === 'charm-small-grand')!;
    expect(magicCharmsItem.itemTypes).toEqual(['scha', 'mcha', 'lcha']);
    expect(resolveTierableItemBases(magicCharmsItem, catalog).map(b => b.code)).toEqual(['cm1', 'cm2', 'cm3']);
    for (const code of ['cm1', 'cm2', 'cm3']) {
      for (const rarity of ['magic', 'rare', 'crafted', 'set', 'unique'] as const) {
        expect(
          resultsFor({
            id: `charm-${code}-${rarity}`,
            code,
            name: code === 'cm1' ? 'Small Charm' : code === 'cm2' ? 'Large Charm' : 'Grand Charm',
            kind: 'misc',
            rarity,
            sockets: 0,
            ethereal: false,
            identified: false,
            itemLevel: 85,
            quantity: 1
          })
        ).toEqual([true, true, true, true, true]);
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

  it('generates lootsplosion scenarios and evaluates every item cleanly across rerolls', () => {
    const filter = compileV2Filter(createDefaultV2Config('semi-strict', 'filterblade'));
    for (const scenario of ['endgame-map', 'hell-boss', 'rune-currency', 'campaign'] as const) {
      const drops0 = generateLootsplosion(scenario, 0);
      const drops1 = generateLootsplosion(scenario, 1);
      const drops2 = generateLootsplosion(scenario, 2);
      expect(drops0.length).toBeGreaterThan(8);
      expect(drops1.length).toBe(drops0.length);
      // Rerolling changes the rolled item names/codes within the rule slots
      expect(drops1.map(d => d.name).join('|')).not.toBe(drops0.map(d => d.name).join('|'));
      expect(drops2.map(d => d.name).join('|')).not.toBe(drops1.map(d => d.name).join('|'));
      for (const drop of [...drops0, ...drops1, ...drops2]) {
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
    expect(amaCfg.itemOverrides['base-javelins']).toBe('A');
    expect(amaCfg.itemOverrides['base-spears']).toBe('A');
    expect(amaCfg.itemOverrides['equip-class-amazon']).toBe('A');
    expect(amaCfg.itemOverrides['equip-weap-bows']).toBe('B');
    expect(amaCfg.itemOverrides['base-sin-claws']).toBe('HIDE');
    expect(amaCfg.itemOverrides['base-paladin-shields']).toBe('HIDE');
    expect(amaCfg.itemOverrides['equip-class-assassin']).toBe('HIDE');
    expect(amaCfg.itemOverrides['equip-class-sorceress']).toBe('HIDE');
    expect(amaCfg.itemOverrides['equip-weap-swords']).toBe('HIDE');

    // Every single base and equipment group shown in Customize Tiers & Bases must be shown in-game,
    // and every group in HIDE must be hidden in-game (zero hidden discrepancy)
    const amaFilter = compileV2Filter(amaCfg);
    expect(
      simulateItemDrop(amaFilter, catalog, {
        id: 'sim-ama-jav',
        code: 'amf',
        name: 'Matriarchal Javelin',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(true);
    expect(
      simulateItemDrop(amaFilter, catalog, {
        id: 'sim-sin-claw',
        code: '7tw',
        name: 'Runic Talons',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(amaFilter, catalog, {
        id: 'sim-pally-shield',
        code: 'pab',
        name: 'Sacred Targe',
        kind: 'armor',
        tier: 'elite',
        rarity: 'normal',
        sockets: 4,
        ethereal: false,
        identified: true,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(false);

    // Moving a hidden base group out of HIDE in Customize Tiers & Bases immediately shows it in-game
    amaCfg.itemOverrides['base-paladin-shields'] = 'A';
    syncDisabledFamiliesFromOverrides(amaCfg);
    expect(amaCfg.buildProfile.disabledFamilies).not.toContain('paladin-shield');
    expect(
      simulateItemDrop(compileV2Filter(amaCfg), catalog, {
        id: 'sim-pally-shield-2',
        code: 'pab',
        name: 'Sacred Targe',
        kind: 'armor',
        tier: 'elite',
        rarity: 'normal',
        sockets: 4,
        ethereal: false,
        identified: true,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(true);

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

  it('resolves individual catalog bases for grouped tier items and overrides parent group rules when split into customBases', () => {
    for (const slot of BASE_SLOT_FILTERS) {
      for (const type of slot.typeCodes) {
        expect(catalog.itemTypeMap.has(type), `Unknown itemType "${type}" in slot "${slot.id}"`).toBe(true);
      }
    }

    const eliteBodyItem = TIERABLE_ITEMS.find(i => i.id === 'base-elite-body')!;
    const eliteBodyBases = resolveTierableItemBases(eliteBodyItem, catalog);
    expect(eliteBodyBases.length).toBeGreaterThanOrEqual(4);
    expect(eliteBodyBases.map(b => b.code)).toContain('utp'); // Archon Plate
    expect(eliteBodyBases.map(b => b.code)).toContain('uar'); // Sacred Armor

    const rareCircletsItem = TIERABLE_ITEMS.find(i => i.id === 'jewelry-rare-crafted')!;
    const circletBases = resolveTierableItemBases(rareCircletsItem, catalog);
    expect(circletBases.map(b => b.code)).toEqual(expect.arrayContaining(['ci0', 'ci1', 'ci2', 'ci3']));

    // Split Sacred Armor ('uar') to HIDE and Archon Plate ('utp') to S while keeping base-elite-body in Tier A
    const cfg = createDefaultV2Config('semi-strict', 'reimagined');
    cfg.customBases.push(
      {
        id: 'split-utp-s',
        code: 'utp',
        label: 'Archon Plate',
        tier: 'S',
        minSockets: 3,
        etherealOnly: false,
        mode: 'runeword'
      },
      {
        id: 'split-uar-hide',
        code: 'uar',
        label: 'Sacred Armor',
        tier: 'HIDE',
        minSockets: 0,
        etherealOnly: false,
        mode: 'runeword'
      },
      {
        id: 'split-ci3-s',
        code: 'ci3',
        label: 'Diadem',
        tier: 'S',
        minSockets: 0,
        etherealOnly: false,
        mode: 'rare'
      }
    );

    const compiled = compileV2Filter(cfg);
    expect(M.validateFilter(compiled, catalog).errors).toEqual([]);

    const utpSim = simulateItemDrop(compiled, catalog, {
      id: 'sim-utp',
      code: 'utp',
      name: 'Archon Plate',
      kind: 'armor',
      tier: 'elite',
      rarity: 'normal',
      sockets: 3,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    const uarSim = simulateItemDrop(compiled, catalog, {
      id: 'sim-uar',
      code: 'uar',
      name: 'Sacred Armor',
      kind: 'armor',
      tier: 'elite',
      rarity: 'normal',
      sockets: 4,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    const ci3Sim = simulateItemDrop(compiled, catalog, {
      id: 'sim-ci3',
      code: 'ci3',
      name: 'Diadem',
      kind: 'armor',
      tier: 'elite',
      rarity: 'rare',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 85,
      quantity: 1
    });

    expect(utpSim.show).toBe(true);
    expect(utpSim.matchedRuleName).toContain('Archon Plate');
    expect(uarSim.show).toBe(false);
    expect(ci3Sim.show).toBe(true);
    expect(ci3Sim.matchedRuleName).toContain('Diadem');

    // Verify dynamic group naming when pulling a base out and automatic rejoin when put back into the same tier
    const splitCfg = createDefaultV2Config('semi-strict', 'reimagined');
    expect(getGroupDisplayInfo(eliteBodyItem, splitCfg, catalog).label).toBe(
      'Archon Plate, Dusk Shroud, Wyrmhide, Scarab Husk, Sacred Armor & Mage Plate'
    );

    // Pull Archon Plate ('utp') out of Tier A into Tier S
    splitCfg.customBases = [
      {
        id: 'base-utp-runeword',
        code: 'utp',
        label: 'Archon Plate',
        tier: 'S',
        mode: 'runeword',
        parentItemId: 'base-elite-body'
      }
    ];
    reconcileGroupSplits(splitCfg, catalog);
    const afterPullInfo = getGroupDisplayInfo(eliteBodyItem, splitCfg, catalog);
    expect(afterPullInfo.label).toBe('Dusk Shroud, Wyrmhide, Scarab Husk, Sacred Armor & Mage Plate');
    expect(afterPullInfo.subtitle).toBe(
      'uui, uea, ula, uar, xtp · Premier light & endgame Enigma/Fortitude/CoH armors'
    );

    // Put Archon Plate ('utp') back into Tier A (where base-elite-body lives) -> rejoins group & restores group name
    splitCfg.customBases[0]!.tier = 'A';
    reconcileGroupSplits(splitCfg, catalog);
    expect(splitCfg.customBases).toHaveLength(0);
    const afterRejoinInfo = getGroupDisplayInfo(eliteBodyItem, splitCfg, catalog);
    expect(afterRejoinInfo.label).toBe(
      'Archon Plate, Dusk Shroud, Wyrmhide, Scarab Husk, Sacred Armor & Mage Plate'
    );
    expect(afterRejoinInfo.subtitle).toBe(
      'utp, uui, uea, ula, uar, xtp · Premier light & endgame Enigma/Fortitude/CoH armors'
    );

    // Pull Archon Plate to Tier S, then move the parent group itself to Tier S -> also rejoins & restores group name
    splitCfg.customBases = [
      {
        id: 'base-utp-runeword',
        code: 'utp',
        label: 'Archon Plate',
        tier: 'S',
        mode: 'runeword',
        parentItemId: 'base-elite-body'
      }
    ];
    splitCfg.itemOverrides['base-elite-body'] = 'S';
    reconcileGroupSplits(splitCfg, catalog);
    expect(splitCfg.customBases).toHaveLength(0);
    expect(getGroupDisplayInfo(eliteBodyItem, splitCfg, catalog).label).toBe(
      'Archon Plate, Dusk Shroud, Wyrmhide, Scarab Husk, Sacred Armor & Mage Plate'
    );
  });

  it('hides magic gear in later strictness presets and keeps Magic item colors distinct from Uniques across all themes', () => {
    const magicClassJavelin = {
      id: 'sim-magic-jav',
      code: 'amf',
      name: 'Magic Matriarchal Javelin',
      kind: 'weapon' as const,
      tier: 'elite' as const,
      rarity: 'magic' as const,
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 85,
      quantity: 1
    };

    // Non-charm/non-jewel Magic items are visible ONLY in Soft (Starter) and hidden in Regular, Semi-Strict, Strict, and Endgame
    const magicJavVisibility = (['soft', 'regular', 'semi-strict', 'strict', 'endgame'] as StrictnessId[]).map(s => {
      const cfg = createDefaultV2Config(s, 'filterblade');
      return simulateItemDrop(compileV2Filter(cfg), catalog, magicClassJavelin).show;
    });
    expect(magicJavVisibility).toEqual([true, false, false, false, false]);

    // Selecting Amazon promotes Rare Amazon gear to Tier A while keeping Magic Amazon gear hidden in Semi-Strict+
    const amaCfg = createDefaultV2Config('semi-strict', 'filterblade');
    selectClassForBuild(amaCfg, 'Amazon');
    const amaFilter = compileV2Filter(amaCfg);
    expect(simulateItemDrop(amaFilter, catalog, magicClassJavelin).show).toBe(false);
    expect(
      simulateItemDrop(amaFilter, catalog, {
        ...magicClassJavelin,
        rarity: 'rare'
      }).show
    ).toBe(true);

    // Across every theme (including Reimagined Classic and FilterBlade), Magic items never share textColor/borderColor with Uniques
    for (const theme of Object.keys(THEME_PRESETS) as ThemeId[]) {
      const softCfg = createDefaultV2Config('soft', theme);
      const softFilter = compileV2Filter(softCfg);

      const magicCharmSim = simulateItemDrop(softFilter, catalog, {
        id: 'sim-m-charm',
        code: 'cm1',
        name: 'Small Charm',
        kind: 'misc',
        rarity: 'magic',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });
      const magicGearSim = simulateItemDrop(softFilter, catalog, magicClassJavelin);
      const uniqueEliteSim = simulateItemDrop(softFilter, catalog, {
        id: 'sim-u-shako',
        code: 'uap',
        name: 'Shako',
        kind: 'armor',
        tier: 'elite',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });
      const uniqueExceptionalSim = simulateItemDrop(softFilter, catalog, {
        id: 'sim-u-viper',
        code: 'xea',
        name: 'Serpentskin Armor',
        kind: 'armor',
        tier: 'exceptional',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });
      const setArmorSim = simulateItemDrop(softFilter, catalog, {
        id: 'sim-s-tal',
        code: 'uth',
        name: 'Lacquered Plate',
        kind: 'armor',
        tier: 'elite',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });

      expect(magicCharmSim.textColor).not.toBe(uniqueEliteSim.textColor);
      expect(magicCharmSim.textColor).not.toBe(uniqueExceptionalSim.textColor);
      expect(magicGearSim.textColor).not.toBe(uniqueEliteSim.textColor);
      expect(magicGearSim.textColor).not.toBe(uniqueExceptionalSim.textColor);
      expect(uniqueExceptionalSim.textColor).not.toBe(setArmorSim.textColor);
    }
  });

  it('hides every non-jewel, non-charm Magic item in all filters beyond Starter even with a Class or Archetype selected, and migrates legacy quiver overrides', () => {
    const nonCharmNonJewelMagics = [
      { id: 'm-weap-norm', code: 'crs', name: 'Magic Crystal Sword', kind: 'weapon' as const, tier: 'normal' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 30, quantity: 1 },
      { id: 'm-weap-exc', code: '9bs', name: 'Magic Battle Sword', kind: 'weapon' as const, tier: 'exceptional' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 55, quantity: 1 },
      { id: 'm-weap-eli', code: '7cr', name: 'Magic Phase Blade', kind: 'weapon' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-weap-eth', code: '7s8', name: 'Ethereal Magic Thresher', kind: 'weapon' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 0, ethereal: true, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-armo-sock', code: 'uit', name: '3os Magic Monarch', kind: 'armor' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 3, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-class-ama', code: 'amf', name: 'Magic Matriarchal Javelin', kind: 'weapon' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-class-sorc', code: 'obf', name: 'Magic Dimensional Shard', kind: 'weapon' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-ring', code: 'rin', name: 'Magic Ring', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-amul', code: 'amu', name: 'Magic Amulet', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-circ', code: 'ci3', name: 'Magic Diadem', kind: 'armor' as const, tier: 'elite' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-aqv', code: 'aqv', name: 'Magic Arrows', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-cqv', code: 'cqv', name: 'Magic Bolts', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-z01', code: 'z01', name: 'Magic Bow Quiver', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-z02', code: 'z02', name: 'Magic Crossbow Quiver', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 }
    ];

    const keptMagicCharmsAndJewels = [
      { id: 'm-sc', code: 'cm1', name: 'Small Charm', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-gc', code: 'cm3', name: 'Grand Charm', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 },
      { id: 'm-jew', code: 'jew', name: 'Jewel', kind: 'misc' as const, rarity: 'magic' as const, sockets: 0, ethereal: false, identified: false, itemLevel: 85, quantity: 1 }
    ];

    const beyondStarter: StrictnessId[] = ['regular', 'semi-strict', 'strict', 'endgame'];

    for (const strictness of beyondStarter) {
      // 1. Default (All Classes)
      const baseCfg = createDefaultV2Config(strictness, 'reimagined');
      const baseFilter = compileV2Filter(baseCfg);
      for (const drop of nonCharmNonJewelMagics) {
        expect(simulateItemDrop(baseFilter, catalog, drop).show, `${strictness} default should hide ${drop.name}`).toBe(false);
      }
      for (const drop of keptMagicCharmsAndJewels) {
        expect(simulateItemDrop(baseFilter, catalog, drop).show, `${strictness} default should show ${drop.name}`).toBe(true);
      }

      // 2. Every Class preset (including Amazon)
      for (const cls of BUILD_CLASSES) {
        const clsCfg = createDefaultV2Config(strictness, 'reimagined');
        selectClassForBuild(clsCfg, cls.id);
        const clsFilter = compileV2Filter(clsCfg);
        for (const drop of nonCharmNonJewelMagics) {
          expect(
            simulateItemDrop(clsFilter, catalog, drop).show,
            `${strictness} + ${cls.id} should hide ${drop.name}`
          ).toBe(false);
        }
        for (const drop of keptMagicCharmsAndJewels) {
          expect(
            simulateItemDrop(clsFilter, catalog, drop).show,
            `${strictness} + ${cls.id} should show ${drop.name}`
          ).toBe(true);
        }
      }

      // 3. Every Archetype preset (including Ranged)
      for (const arch of BUILD_ARCHETYPES) {
        const archCfg = createDefaultV2Config(strictness, 'reimagined');
        selectArchetypeForBuild(archCfg, arch.id);
        const archFilter = compileV2Filter(archCfg);
        for (const drop of nonCharmNonJewelMagics) {
          expect(
            simulateItemDrop(archFilter, catalog, drop).show,
            `${strictness} + ${arch.id} should hide ${drop.name}`
          ).toBe(false);
        }
      }
    }

    // Quest campaign weapons (like Wirt's Leg & Horadric Staff) remain visible even when clubs/staves are disabled
    const zonStrictCfg = createDefaultV2Config('strict', 'reimagined');
    selectClassForBuild(zonStrictCfg, 'Amazon');
    const zonStrictFilter = compileV2Filter(zonStrictCfg);
    for (const [code, name] of [['leg', "Wirt's Leg"], ['hst', 'Horadric Staff'], ['hdm', 'Horadric Malus'], ['qf2', "Khalim's Will"]] as const) {
      expect(
        simulateItemDrop(zonStrictFilter, catalog, {
          id: `quest-${code}`,
          code,
          name,
          kind: 'weapon',
          rarity: 'normal',
          sockets: 0,
          ethereal: false,
          identified: true,
          itemLevel: 30,
          quantity: 1
        }).show,
        `Quest item ${name} should stay visible`
      ).toBe(true);
    }

    // Legacy saved filter migration: pre-m:1 'My Semi-Strict Filter (Zon)' with "misc-magic-quivers": "A"
    const legacyZonCfg = createDefaultV2Config('semi-strict', 'reimagined');
    selectClassForBuild(legacyZonCfg, 'Amazon');
    delete legacyZonCfg.itemOverrides['equip-rare-quivers'];
    legacyZonCfg.itemOverrides['misc-magic-quivers'] = 'A';
    const legacyFilterDoc = compileV2Filter(legacyZonCfg);
    const lastRuleBlock = legacyFilterDoc.rules[legacyFilterDoc.rules.length - 1]!.show!;
    const rawTagB64 = lastRuleBlock.ruleName!.slice('Keep everything else visible [PyreV2:'.length, -1);
    const legacyTagObj = JSON.parse(Buffer.from(rawTagB64, 'base64').toString('utf8'));
    delete legacyTagObj.m;
    lastRuleBlock.ruleName = `Keep everything else visible [PyreV2:${Buffer.from(JSON.stringify(legacyTagObj), 'utf8').toString('base64')}]`;

    const migratedMeta = extractV2ConfigWithMeta(legacyFilterDoc)!;
    expect(migratedMeta.migrated).toBe(true);
    const migratedCfg = migratedMeta.config;
    expect(migratedCfg).not.toBeNull();
    const magicQuiversCard = TIERABLE_ITEMS.find(i => i.id === 'misc-magic-quivers')!;
    const rareQuiversCard = TIERABLE_ITEMS.find(i => i.id === 'equip-rare-quivers')!;
    expect(effectiveItemTier(magicQuiversCard, migratedCfg)).toBe('HIDE');
    expect(effectiveItemTier(rareQuiversCard, migratedCfg)).toBe('A');

    const migratedCompiled = compileV2Filter(migratedCfg);
    expect(
      simulateItemDrop(migratedCompiled, catalog, {
        id: 'mig-magic-quiv',
        code: 'z01',
        name: 'Magic Bow Quiver',
        kind: 'misc',
        rarity: 'magic',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(migratedCompiled, catalog, {
        id: 'mig-rare-quiv',
        code: 'z01',
        name: 'Rare Bow Quiver',
        kind: 'misc',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(true);
  });

  it('sanitizes active filter names into safe cross-platform .json download filenames', () => {
    expect(sanitizeFilterFilename('My Semi-Strict Filter (Zon)')).toBe('My Semi-Strict Filter (Zon).json');
    expect(sanitizeFilterFilename('Strict-v2')).toBe('Strict-v2.json');
    expect(sanitizeFilterFilename('Sorceress · Nova / Elemental: v2*?')).toBe('Sorceress - Nova - Elemental - v2.json');
    expect(sanitizeFilterFilename('My Filter.json')).toBe('My Filter.json');
    expect(sanitizeFilterFilename('../../../etc/passwd')).toBe('etc - passwd.json');
    expect(sanitizeFilterFilename('CON')).toBe('filter.json');
    expect(sanitizeFilterFilename('aux.txt')).toBe('filter.json');
    expect(sanitizeFilterFilename('   ***???   ')).toBe('filter.json');
    expect(sanitizeFilterFilename('')).toBe('filter.json');
    expect(sanitizeFilterFilename(null)).toBe('filter.json');
  });

  it('keeps Runeword & Crafting Bases (cool white/silver) visually distinct from Uniques (warm antique gold) across all themes and tiers', () => {
    for (const theme of Object.keys(THEME_PRESETS) as ThemeId[]) {
      const cfg = createDefaultV2Config('semi-strict', theme);
      selectClassForBuild(cfg, 'Amazon');
      // Pin a Tier S runeword base as well so S/A/B/C are all exercised
      cfg.customBases = [
        { id: 'pin-s-base', code: '7s8', label: 'Thresher', tier: 'S', mode: 'runeword', minSockets: 4 }
      ];
      const filter = compileV2Filter(cfg);

      const uniqueHeraldic = simulateItemDrop(filter, catalog, {
        id: 'u-heraldic',
        code: 'pa3',
        name: 'Heraldic Shield',
        kind: 'armor',
        tier: 'normal',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 80,
        quantity: 1
      });
      const uniqueShako = simulateItemDrop(filter, catalog, {
        id: 'u-shako',
        code: 'uap',
        name: 'Shako',
        kind: 'armor',
        tier: 'elite',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });
      const uniqueDiademS = simulateItemDrop(filter, catalog, {
        id: 'u-diadem',
        code: 'ci3',
        name: 'Diadem',
        kind: 'armor',
        tier: 'elite',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      });

      const baseGorgonCrossbow = simulateItemDrop(filter, catalog, {
        id: 'b-gorgon',
        code: '6mx',
        name: 'Superior Gorgon Crossbow',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'superior',
        sockets: 4,
        ethereal: false,
        identified: true,
        itemLevel: 80,
        quantity: 1
      });
      const baseSupElite = simulateItemDrop(filter, catalog, {
        id: 'b-sup-elite',
        code: 'uui',
        name: 'Superior Dusk Shroud',
        kind: 'armor',
        tier: 'elite',
        rarity: 'superior',
        sockets: 3,
        ethereal: false,
        identified: true,
        itemLevel: 85,
        quantity: 1
      });
      const basePinnedS = simulateItemDrop(filter, catalog, {
        id: 'b-thresher-s',
        code: '7s8',
        name: 'Thresher',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 4,
        ethereal: true,
        identified: true,
        itemLevel: 85,
        quantity: 1
      });

      for (const baseSim of [baseGorgonCrossbow, baseSupElite, basePinnedS]) {
        expect(baseSim.show).toBe(true);
        // Bases must be neutral/cool white-silver (B >= R), whereas Uniques are warm gold (R > G > B)
        const bText = M.parseRgba(baseSim.textColor)!;
        expect(bText.b, `${theme} base textColor should be cool/neutral white-silver`).toBeGreaterThanOrEqual(bText.r);

        for (const uniqSim of [uniqueHeraldic, uniqueShako]) {
          const uText = M.parseRgba(uniqSim.textColor)!;
          expect(uText.r, `${theme} unique textColor should be warm gold`).toBeGreaterThan(uText.b + 80);
          expect(baseSim.textColor).not.toBe(uniqSim.textColor);
          expect(baseSim.borderColor).not.toBe(uniqSim.borderColor);
          expect(baseSim.backgroundColor).not.toBe(uniqSim.backgroundColor);
        }
      }

      expect(basePinnedS.backgroundColor).not.toBe(uniqueDiademS.backgroundColor);
      expect(basePinnedS.borderColor).not.toBe(uniqueDiademS.borderColor);
    }
  });

  it('handles Uber Strict elite rares/bases, surgical family toggles, partial style/mute overrides, and single-rarity customBases cleanly', () => {
    // 1. Uber Strict keeps Elite Rare weapons & 3+os/Ethereal Elite Crossbows/Daggers while hiding Exceptional Rares & unsocketed Crossbows
    const uberCfg = createDefaultV2Config('endgame', 'reimagined');
    syncDisabledFamiliesFromOverrides(uberCfg);
    expect(uberCfg.buildProfile.disabledFamilies).toEqual([]);

    const uberFilter = compileV2Filter(uberCfg);
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-elite-rare-sword',
        code: '7cr',
        name: 'Rare Phase Blade',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-exc-rare-sword',
        code: '9cr',
        name: 'Rare Dimensional Blade',
        kind: 'weapon',
        tier: 'exceptional',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-4os-xbow',
        code: '6hx',
        name: '4os Colossus Crossbow',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 4,
        ethereal: false,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-0os-xbow',
        code: '6hx',
        name: '0os Colossus Crossbow',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(false);

    // Explicitly disabling xbow-quiver hides even 4os Colossus Crossbows
    toggleEquipmentFamily(uberCfg, 'xbow-quiver');
    expect(
      simulateItemDrop(compileV2Filter(uberCfg), catalog, {
        id: 'uber-4os-xbow-disabled',
        code: '6hx',
        name: '4os Colossus Crossbow',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 4,
        ethereal: false,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(false);

    // 2. Amazon spear/bow/javelin independence & surgical toggleEquipmentFamily + selectArchetypeForBuild(null)
    const buildCfg = createDefaultV2Config('semi-strict', 'reimagined');
    selectArchetypeForBuild(buildCfg, 'melee');
    const meleeFilter = compileV2Filter(buildCfg);
    expect(
      simulateItemDrop(meleeFilter, catalog, {
        id: 'melee-ama-spear',
        code: 'ame',
        name: 'Rare Matriarchal Pike',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(true);
    expect(
      simulateItemDrop(meleeFilter, catalog, {
        id: 'melee-ama-bow',
        code: 'amb',
        name: 'Rare Matriarchal Bow',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'rare',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(false);

    selectClassForBuild(buildCfg, 'Sorceress');
    buildCfg.itemOverrides['base-monarch-shields'] = 'S';
    toggleEquipmentFamily(buildCfg, 'bow-quiver');
    expect(buildCfg.itemOverrides['base-monarch-shields']).toBe('S');
    expect(buildCfg.itemOverrides['base-ama-weapons']).not.toBe('HIDE');

    selectArchetypeForBuild(buildCfg, null);
    expect(buildCfg.buildProfile.selectedClass).toBeNull();
    expect(buildCfg.buildProfile.archetype).toBeNull();
    expect(buildCfg.buildProfile.disabledFamilies).toEqual([]);

    // 3. Partial style overrides (muting dropSound & disabling minimapIcon) preserve rarity colors & round-trip cleanly
    const styleCfg = createDefaultV2Config('semi-strict', 'reimagined');
    styleCfg.tierStyleOverrides.A = { dropSound: '', minimapIcon: null };
    styleCfg.customPriorityRules = [{ hide: { ruleName: 'Incomplete empty rule' } }];
    const styledFilter = compileV2Filter(styleCfg);
    expect(extractV2ConfigWithMeta(styledFilter)?.migrated).toBe(false);

    const extractedStyleCfg = extractV2ConfigFromFilter(styledFilter)!;
    expect(extractedStyleCfg.tierStyleOverrides.A).toEqual({ dropSound: '', minimapIcon: null });

    const shakoMuted = simulateItemDrop(styledFilter, catalog, {
      id: 'muted-shako',
      code: 'uap',
      name: 'Shako',
      kind: 'armor',
      tier: 'elite',
      rarity: 'unique',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 85,
      quantity: 1
    });
    const monarchMuted = simulateItemDrop(styledFilter, catalog, {
      id: 'muted-monarch',
      code: 'uit',
      name: '4os Monarch',
      kind: 'armor',
      tier: 'elite',
      rarity: 'normal',
      sockets: 4,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    expect(shakoMuted.show).toBe(true);
    expect(shakoMuted.dropSound).toBeUndefined();
    expect(shakoMuted.minimapIcon).toBeUndefined();
    expect(shakoMuted.textColor).not.toBe(monarchMuted.textColor);

    // 4. Single-rarity customBases (mode: 'unique' on 'uth') preserves Set 'uth' in uniq-drop-only, plus cs1 & vip coverage
    const splitUniqCfg = createDefaultV2Config('semi-strict', 'reimagined');
    splitUniqCfg.customBases = [
      { id: 'u-uth-a', code: 'uth', label: 'Lacquered Plate', tier: 'A', mode: 'unique' }
    ];
    const splitUniqFilter = compileV2Filter(splitUniqCfg);
    const uniqUthSim = simulateItemDrop(splitUniqFilter, catalog, {
      id: 'sim-u-uth',
      code: 'uth',
      name: 'Lacquered Plate',
      kind: 'armor',
      tier: 'elite',
      rarity: 'unique',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 85,
      quantity: 1
    });
    const setUthSim = simulateItemDrop(splitUniqFilter, catalog, {
      id: 'sim-s-uth',
      code: 'uth',
      name: 'Lacquered Plate',
      kind: 'armor',
      tier: 'elite',
      rarity: 'set',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 85,
      quantity: 1
    });
    expect(uniqUthSim.matchedRuleName).toContain('[Base] Lacquered Plate (Unique) · Tier A');
    expect(uniqUthSim.matchedCategory).toBe('uniques');
    expect(setUthSim.matchedRuleName).toContain('Tier A: Elite Sets');
    expect(setUthSim.dropSound).toBe('Filter02');

    expect(
      simulateItemDrop(splitUniqFilter, catalog, {
        id: 'sim-sunder-cs1',
        code: 'cs1',
        name: 'Cold Rupture',
        kind: 'misc',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 85,
        quantity: 1
      }).matchedRuleName
    ).toContain('Colossal Jewels, Sunder Charms & Torches');
    expect(
      simulateItemDrop(splitUniqFilter, catalog, {
        id: 'sim-viper-amu',
        code: 'vip',
        name: 'Amulet of the Viper',
        kind: 'misc',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 25,
        quantity: 1
      }).show
    ).toBe(true);
  });

  it('separates Unique (Gold) and Set (Emerald) placards across Tiers S–D (Option 1B), unbundles Set tiers across presets, and supports individual rarityTierStyleOverrides', () => {
    // 1. Across every theme, Tier S Uniques and Tier S Sets share the theme's S-plate background by default (1B)
    //    while keeping distinct Sanctuary Gold vs. Emerald Green borders, text hues, and minimap stars!
    for (const theme of Object.keys(THEME_PRESETS) as ThemeId[]) {
      const cfg = createDefaultV2Config('strict', theme);
      const filter = compileV2Filter(cfg);

      const tierSUnique = simulateItemDrop(filter, catalog, {
        id: 's-uniq',
        code: '7gd',
        name: 'Colossus Blade',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      });
      const tierSSet = simulateItemDrop(filter, catalog, {
        id: 's-set',
        code: 'ful',
        name: 'Full Plate Mail',
        kind: 'armor',
        tier: 'normal',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      });
      const tierAUnique = simulateItemDrop(filter, catalog, {
        id: 'a-uniq',
        code: 'uap',
        name: 'Shako',
        kind: 'armor',
        tier: 'elite',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 86,
        quantity: 1
      });
      const tierASet = simulateItemDrop(filter, catalog, {
        id: 'a-set',
        code: 'uth',
        name: 'Lacquered Plate',
        kind: 'armor',
        tier: 'elite',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 86,
        quantity: 1
      });
      const normalUnique = simulateItemDrop(filter, catalog, {
        id: 'n-uniq',
        code: 'bal',
        name: 'Balanced Axe',
        kind: 'weapon',
        tier: 'normal',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 86,
        quantity: 1
      });
      const normalSet = simulateItemDrop(filter, catalog, {
        id: 'n-set',
        code: 'brs',
        name: 'Breast Plate',
        kind: 'armor',
        tier: 'normal',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 86,
        quantity: 1
      });

      // Option 1B: Tier S shares plate background, but Gold vs Emerald border/text/icon fill never collide
      expect(tierSUnique.backgroundColor).toBe(tierSSet.backgroundColor);
      expect(tierSUnique.borderColor).not.toBe(tierSSet.borderColor);
      expect(tierSUnique.textColor).not.toBe(tierSSet.textColor);
      expect(tierSUnique.minimapIcon?.fillColor).not.toBe(tierSSet.minimapIcon?.fillColor);

      const uSBorder = M.parseRgba(tierSUnique.borderColor)!;
      const sSBorder = M.parseRgba(tierSSet.borderColor)!;
      expect(uSBorder.r).toBeGreaterThan(uSBorder.b + 120); // Gold
      expect(sSBorder.g).toBeGreaterThan(sSBorder.r + 120); // Emerald

      // Tier A Elite Uniques vs Elite Sets & Normal Uniques (Balanced Axe) vs Normal Sets (Breast Plate) never share colors
      expect(tierAUnique.borderColor).not.toBe(tierASet.borderColor);
      expect(tierAUnique.textColor).not.toBe(tierASet.textColor);
      expect(normalUnique.textColor).not.toBe(normalSet.textColor);
    }

    // 2. Solution 2 progression across Soft -> Uber Strict:
    //    - Normal-tier Sets (Isenhart's Breast Plate 'brs') visible in Soft..Strict, hidden in Uber Strict
    //    - Set Rings/Amulets ('rin'/'amu') stay visible (Tier A/B) even in Uber Strict
    //    - Drop-only Warlord's Set bases ('ful') stay Tier S even in Uber Strict
    const presetOrder: StrictnessId[] = ['soft', 'regular', 'semi-strict', 'strict', 'endgame'];
    const normalSetVis = presetOrder.map(s =>
      simulateItemDrop(compileV2Filter(createDefaultV2Config(s)), catalog, {
        id: 'brs-set',
        code: 'brs',
        name: 'Breast Plate',
        kind: 'armor',
        tier: 'normal',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 86,
        quantity: 1
      }).show
    );
    expect(normalSetVis).toEqual([true, true, true, true, false]);

    const uberFilter = compileV2Filter(createDefaultV2Config('endgame'));
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-set-amu',
        code: 'amu',
        name: 'Amulet',
        kind: 'misc',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);
    expect(
      simulateItemDrop(uberFilter, catalog, {
        id: 'uber-warlord-set',
        code: 'ful',
        name: 'Full Plate Mail',
        kind: 'armor',
        tier: 'normal',
        rarity: 'set',
        sockets: 0,
        ethereal: false,
        identified: false,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);

    // 3. Individual rarityTierStyleOverrides customize Set independently of Unique (even on Tier S!) and round-trip cleanly
    const customRarityCfg = createDefaultV2Config('strict', 'filterblade');
    customRarityCfg.rarityTierStyleOverrides = {
      set: {
        S: {
          backgroundColor: 'RGBA(4, 38, 16, 0.96)',
          borderColor: 'RGBA(60, 255, 120, 1)',
          textColor: 'RGBA(210, 255, 225, 1)'
        }
      }
    };
    const customCompiled = compileV2Filter(customRarityCfg);
    expect(M.validateFilter(customCompiled, catalog).errors).toEqual([]);

    const roundTripped = extractV2ConfigFromFilter(customCompiled)!;
    expect(roundTripped.rarityTierStyleOverrides.set?.S).toEqual({
      backgroundColor: 'RGBA(4, 38, 16, 0.96)',
      borderColor: 'RGBA(60, 255, 120, 1)',
      textColor: 'RGBA(210, 255, 225, 1)'
    });

    const customUniqueS = simulateItemDrop(customCompiled, catalog, {
      id: 'cu-s',
      code: '7gd',
      name: 'Colossus Blade',
      kind: 'weapon',
      tier: 'elite',
      rarity: 'unique',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 88,
      quantity: 1
    });
    const customSetS = simulateItemDrop(customCompiled, catalog, {
      id: 'cs-s',
      code: 'ful',
      name: 'Full Plate Mail',
      kind: 'armor',
      tier: 'normal',
      rarity: 'set',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 88,
      quantity: 1
    });
    expect(customSetS.backgroundColor).toBe('RGBA(4, 38, 16, 0.96)');
    expect(customUniqueS.backgroundColor).toBe('RGBA(250, 250, 250, 0.95)');

    // 4. Setting only backgroundColor on Set · Tier S on a light-plate theme automatically adapts default text contrast
    const autoContrastCfg = createDefaultV2Config('strict', 'filterblade');
    autoContrastCfg.rarityTierStyleOverrides = {
      set: { S: { backgroundColor: 'RGBA(4, 38, 16, 0.96)' } }
    };
    const autoContrastSetS = simulateItemDrop(compileV2Filter(autoContrastCfg), catalog, {
      id: 'auto-s',
      code: 'ful',
      name: 'Full Plate Mail',
      kind: 'armor',
      tier: 'normal',
      rarity: 'set',
      sockets: 0,
      ethereal: false,
      identified: false,
      itemLevel: 88,
      quantity: 1
    });
    expect(M.parseRgba(autoContrastSetS.textColor)!.g).toBeGreaterThan(220);

    // 5. Unique campaign quest drops (e.g. Staff of Kings 'msf', Khalim's Will 'qf2') stay Tier A even if uniq-normal is HIDE
    const hideNormUniqCfg = createDefaultV2Config('endgame', 'reimagined');
    hideNormUniqCfg.itemOverrides['uniq-normal'] = 'HIDE';
    const hideNormUniqFilter = compileV2Filter(hideNormUniqCfg);
    for (const qCode of ['msf', 'hst', 'qf2', 'hfh', 'vip'] as const) {
      const qSim = simulateItemDrop(hideNormUniqFilter, catalog, {
        id: `q-${qCode}`,
        code: qCode,
        name: qCode,
        kind: qCode === 'vip' ? 'misc' : 'weapon',
        rarity: 'unique',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 25,
        quantity: 1
      });
      expect(qSim.show, `Unique quest item ${qCode} must stay visible`).toBe(true);
      expect(qSim.matchedCategory).toBe('misc');
    }

    // 6. baseSettings rules honor rarityTierStyleOverrides.base, and resolveTierableItemBases filters Set bases accurately
    const baseStyleCfg = createDefaultV2Config('strict', 'reimagined');
    baseStyleCfg.rarityTierStyleOverrides = {
      base: { C: { textColor: 'RGBA(212, 234, 255, 1)' } }
    };
    const wireFleeceSim = simulateItemDrop(compileV2Filter(baseStyleCfg), catalog, {
      id: 'sim-utu',
      code: 'utu',
      name: 'Wire Fleece',
      kind: 'armor',
      tier: 'elite',
      rarity: 'normal',
      sockets: 3,
      ethereal: false,
      identified: true,
      itemLevel: 85,
      quantity: 1
    });
    expect(wireFleeceSim.textColor).toBe('RGBA(212, 234, 255, 1)');

    const setDropOnlyItem = TIERABLE_ITEMS.find(i => i.id === 'set-drop-only')!;
    const setDropOnlyBases = resolveTierableItemBases(setDropOnlyItem, catalog);
    expect(setDropOnlyBases.every(b => b.notableNames && !b.notableNames.includes('Goldskin') && !b.notableNames.includes('Frostburn'))).toBe(true);
    const setJewelryItem = TIERABLE_ITEMS.find(i => i.id === 'set-jewelry')!;
    const setJewelryCodes = resolveTierableItemBases(setJewelryItem, catalog).map(b => b.code);
    expect(setJewelryCodes).not.toContain('vip');
    expect(setJewelryCodes).not.toContain('cm1');

    // 7. m:1 filter migration carries over split Amazon class overrides and pre-split uniq-* overrides
    const m1Cfg = createDefaultV2Config('strict', 'reimagined');
    selectClassForBuild(m1Cfg, 'Sorceress');
    delete m1Cfg.itemOverrides['equip-class-amazon-bows'];
    delete m1Cfg.itemOverrides['equip-class-amazon-spears'];
    m1Cfg.itemOverrides['uniq-elite'] = 'S';
    const m1Doc = compileV2Filter(m1Cfg);
    const lastBlock = m1Doc.rules[m1Doc.rules.length - 1]!.show!;
    const m1Obj = JSON.parse(
      Buffer.from(lastBlock.ruleName!.slice('Keep everything else visible [PyreV2:'.length, -1), 'base64').toString('utf8')
    );
    m1Obj.m = 1;
    delete m1Obj.io['set-elite'];
    lastBlock.ruleName = `Keep everything else visible [PyreV2:${Buffer.from(JSON.stringify(m1Obj), 'utf8').toString('base64')}]`;

    const migratedM1 = extractV2ConfigWithMeta(m1Doc)!;
    expect(migratedM1.migrated).toBe(true);
    expect(migratedM1.config.itemOverrides['equip-class-amazon-bows']).toBe('HIDE');
    expect(migratedM1.config.itemOverrides['equip-class-amazon-spears']).toBe('HIDE');
    expect(migratedM1.config.itemOverrides['set-elite']).toBe('S');
  });

  it('covers 100% of Reimagined Elite bases at 0+ sockets, promotes 0-socket Superior/Ethereal Elites, and migrates m:3 disabled families', () => {
    // 1. Every Elite base item in the exported Reimagined catalog (169/169) is covered by a category='bases' card with zero duplicates
    const baseCategoryCards = TIERABLE_ITEMS.filter(i => i.category === 'bases');
    const allAssignedBaseCodes = baseCategoryCards.flatMap(i => i.codes ?? []);
    expect(new Set(allAssignedBaseCodes).size).toBe(allAssignedBaseCodes.length);

    const assignedCodeSet = new Set(allAssignedBaseCodes);
    const catalogEliteBases = catalog.baseItems.filter(b => b.tier === 'elite');
    expect(catalogEliteBases.length).toBeGreaterThanOrEqual(169);
    for (const eb of catalogEliteBases) {
      expect(
        assignedCodeSet.has(eb.code!),
        `Elite catalog base "${eb.displayName ?? eb.name}" (${eb.code}) is missing from category='bases'`
      ).toBe(true);
    }

    // 2. Unsocketed (0os) Premier Chase bases show across all 5 strictness presets (for Jewel Socket Punch / Orb of Socketing)
    const presetOrder: StrictnessId[] = ['soft', 'regular', 'semi-strict', 'strict', 'endgame'];
    const premierZeroSocketSamples: { code: string; name: string; kind: 'armor' | 'weapon' }[] = [
      { code: 'uea', name: 'Wyrmhide', kind: 'armor' },
      { code: 'uh9', name: 'Bone Visage', kind: 'armor' },
      { code: 'urg', name: 'Hyperion', kind: 'armor' },
      { code: '6lb', name: 'Shadow Bow', kind: 'weapon' },
      { code: '7bt', name: 'Decapitator', kind: 'weapon' },
      { code: '7gs', name: 'Balrog Blade', kind: 'weapon' },
      { code: '7br', name: 'Mancatcher', kind: 'weapon' },
      { code: 'amd', name: 'Matriarchal Spear', kind: 'weapon' },
      { code: '7qs', name: 'Seraph Rod', kind: 'weapon' },
      { code: '7qr', name: 'Scissors Suwayyah', kind: 'weapon' },
      { code: '7ts', name: 'Winged Harpoon', kind: 'weapon' }
    ];

    for (const s of presetOrder) {
      const compiled = compileV2Filter(createDefaultV2Config(s));
      for (const sample of premierZeroSocketSamples) {
        const sim = simulateItemDrop(compiled, catalog, {
          id: `prem-${s}-${sample.code}`,
          code: sample.code,
          name: sample.name,
          kind: sample.kind,
          tier: 'elite',
          rarity: 'normal',
          sockets: 0,
          ethereal: false,
          identified: true,
          itemLevel: 85,
          quantity: 1
        });
        expect(sim.show, `Premier 0os base ${sample.name} (${sample.code}) should show in ${s}`).toBe(true);
      }
    }

    // 3. Secondary Elite bases (e.g. Colossus Voulge '7vo', Boneweave 'uhn', Hydraskull 'ukp'):
    //    - Plain white 0os shows in Soft..Strict (Tier C) and hides in Uber Strict ('endgame')
    //    - 0-socket Superior (+ED) and 0-socket Ethereal promote to Tier B across ALL presets (including Uber Strict!)
    for (const sample of [
      { code: '7vo', name: 'Colossus Voulge', kind: 'weapon' as const },
      { code: 'uhn', name: 'Boneweave', kind: 'armor' as const },
      { code: 'ukp', name: 'Hydraskull', kind: 'armor' as const },
      { code: '7b8', name: 'Winged Axe', kind: 'weapon' as const }
    ]) {
      const plainVis = presetOrder.map(s =>
        simulateItemDrop(compileV2Filter(createDefaultV2Config(s)), catalog, {
          id: `sec-plain-${s}-${sample.code}`,
          code: sample.code,
          name: sample.name,
          kind: sample.kind,
          tier: 'elite',
          rarity: 'normal',
          sockets: 0,
          ethereal: false,
          identified: true,
          itemLevel: 85,
          quantity: 1
        }).show
      );
      expect(plainVis).toEqual([true, true, true, true, false]);

      for (const s of ['semi-strict', 'strict', 'endgame'] as StrictnessId[]) {
        const compiled = compileV2Filter(createDefaultV2Config(s));
        const supZeroSock = simulateItemDrop(compiled, catalog, {
          id: `sec-sup0-${s}-${sample.code}`,
          code: sample.code,
          name: sample.name,
          kind: sample.kind,
          tier: 'elite',
          rarity: 'superior',
          sockets: 0,
          ethereal: false,
          identified: true,
          itemLevel: 85,
          quantity: 1
        });
        expect(supZeroSock.show).toBe(true);
        expect(supZeroSock.matchedRuleName).toContain('Superior Elite Equipment');
        expect(supZeroSock.dropSound).toBe('Filter03'); // Tier B chime

        const ethZeroSock = simulateItemDrop(compiled, catalog, {
          id: `sec-eth0-${s}-${sample.code}`,
          code: sample.code,
          name: sample.name,
          kind: sample.kind,
          tier: 'elite',
          rarity: 'normal',
          sockets: 0,
          ethereal: true,
          identified: true,
          itemLevel: 85,
          quantity: 1
        });
        expect(ethZeroSock.show).toBe(true);
        expect(ethZeroSock.matchedRuleName).toContain('Ethereal Elite Equipment');
        expect(ethZeroSock.dropSound).toBe('Filter03'); // Tier B chime
      }
    }

    // 4. White Elite Gloves, Boots & Belts (0 sockets, Infusion/Conversion bases):
    //    - Show at Tier C in Soft..Semi-Strict (even if requireSocketsOnBases is true, and never false-promoted to Tier B)
    //    - Hide in Strict & Uber Strict (even if Superior or Ethereal) unless overridden/pinned
    for (const code of ['ulc', 'uhb', 'uvg'] as const) {
      const gbbVis = presetOrder.map(s => {
        const cfg = createDefaultV2Config(s);
        cfg.baseSettings.requireSocketsOnBases = true;
        cfg.baseSettings.minSocketsOnBases = 4;
        return simulateItemDrop(compileV2Filter(cfg), catalog, {
          id: `gbb-${s}-${code}`,
          code,
          name: code,
          kind: 'armor',
          tier: 'elite',
          rarity: 'superior',
          sockets: 0,
          ethereal: true,
          identified: true,
          itemLevel: 85,
          quantity: 1
        });
      });
      expect(gbbVis.map(r => r.show)).toEqual([true, true, true, false, false]);
      expect(gbbVis[2]!.dropSound).toBeUndefined(); // Tier C, not Tier B
    }

    // 5. Hiding only a Secondary family card hides its codes (even Ethereal/Superior) without hiding its Premier sibling
    const partialHideCfg = createDefaultV2Config('semi-strict', 'reimagined');
    partialHideCfg.itemOverrides['base-polearms-secondary'] = 'HIDE';
    const partialHideFilter = compileV2Filter(partialHideCfg);
    expect(
      simulateItemDrop(partialHideFilter, catalog, {
        id: 'cv-eth',
        code: '7vo',
        name: 'Colossus Voulge',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'superior',
        sockets: 4,
        ethereal: true,
        identified: true,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(partialHideFilter, catalog, {
        id: 'thresher-white',
        code: '7s8',
        name: 'Thresher',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 0,
        ethereal: false,
        identified: true,
        itemLevel: 85,
        quantity: 1
      }).show
    ).toBe(true);

    // 6. m:3 saved filters with disabledFamilies or hidden primary base cards migrate HIDE to newly added secondary cards
    const m3Cfg = createDefaultV2Config('semi-strict', 'reimagined');
    selectClassForBuild(m3Cfg, 'Amazon');
    for (const k of Object.keys(m3Cfg.itemOverrides)) {
      if (k.endsWith('-secondary')) delete m3Cfg.itemOverrides[k];
    }
    const m3Doc = compileV2Filter(m3Cfg);
    const tailBlock = m3Doc.rules[m3Doc.rules.length - 1]!.show!;
    const m3Payload = JSON.parse(
      Buffer.from(tailBlock.ruleName!.slice('Keep everything else visible [PyreV2:'.length, -1), 'base64').toString('utf8')
    );
    m3Payload.m = 3;
    for (const k of Object.keys(m3Payload.io ?? {})) {
      if (k.endsWith('-secondary')) delete m3Payload.io[k];
    }
    tailBlock.ruleName = `Keep everything else visible [PyreV2:${Buffer.from(JSON.stringify(m3Payload), 'utf8').toString('base64')}]`;

    const migratedM3 = extractV2ConfigWithMeta(m3Doc)!;
    expect(migratedM3.migrated).toBe(true);
    expect(migratedM3.config.itemOverrides['base-axes-secondary']).toBe('HIDE');
    expect(migratedM3.config.itemOverrides['base-swords-secondary']).toBe('HIDE');
    expect(migratedM3.config.itemOverrides['base-sin-claws-secondary']).toBe('HIDE');
    expect(migratedM3.config.itemOverrides['base-bows-secondary']).toBeUndefined(); // bow-quiver is enabled for Amazon
    expect(migratedM3.config.itemOverrides['base-polearms-secondary']).toBeUndefined(); // polearm is enabled for Amazon

    // 7. EQUIPMENT_FAMILIES.linkedTierableIds stays 1-to-1 with TIERABLE_ITEMS.equipmentFamilies
    for (const fam of EQUIPMENT_FAMILIES) {
      const actualLinked = TIERABLE_ITEMS.filter(i => i.equipmentFamilies?.includes(fam.id))
        .map(i => i.id)
        .sort();
      expect([...(fam.linkedTierableIds ?? [])].sort(), `linkedTierableIds mismatch on ${fam.id}`).toEqual(
        actualLinked
      );
    }

    // 8. Uber Strict ('endgame') partial family hides, soft-hide vs hard-hide splits, Tier C override ordering, and universal/moved-code m:3 migration
    const uberPoleCfg = createDefaultV2Config('endgame', 'reimagined');
    uberPoleCfg.itemOverrides['base-elite-polearms'] = 'HIDE';
    uberPoleCfg.itemOverrides['equip-weap-polearms'] = 'HIDE';
    syncDisabledFamiliesFromOverrides(uberPoleCfg);
    expect(uberPoleCfg.buildProfile.disabledFamilies).not.toContain('polearm');

    const uberPoleFilter = compileV2Filter(uberPoleCfg);
    // Thresher ('7s8') is hard-hidden, while Colossus Voulge ('7vo') stays soft-hidden (4os/Eth/Sup still show!)
    expect(
      simulateItemDrop(uberPoleFilter, catalog, {
        id: 'uber-thresher-4os',
        code: '7s8',
        name: 'Thresher',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'superior',
        sockets: 4,
        ethereal: true,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(uberPoleFilter, catalog, {
        id: 'uber-cv-4os',
        code: '7vo',
        name: 'Colossus Voulge',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'superior',
        sockets: 4,
        ethereal: true,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);

    // Individual hard-hide on '7vo' in Uber Strict survives reconcileGroupSplits and hides Ethereal/Superior/4os '7vo' while keeping '7o7'
    const uberSplitHideCfg = createDefaultV2Config('endgame', 'reimagined');
    const secPoleCard = TIERABLE_ITEMS.find(i => i.id === 'base-polearms-secondary')!;
    expect(isBaseCardSoftHiddenByStrictness(secPoleCard, uberSplitHideCfg)).toBe(true);
    expect(isBaseCardHardHidden(secPoleCard, uberSplitHideCfg)).toBe(false);

    uberSplitHideCfg.customBases = [
      {
        id: 'base-7vo-runeword',
        code: '7vo',
        label: 'Colossus Voulge',
        tier: 'HIDE',
        mode: 'runeword',
        parentItemId: 'base-polearms-secondary'
      }
    ];
    reconcileGroupSplits(uberSplitHideCfg, catalog);
    expect(uberSplitHideCfg.customBases).toHaveLength(1);
    expect(getGroupDisplayInfo(secPoleCard, uberSplitHideCfg, catalog).splitBases).toHaveLength(1);

    const uberSplitHideFilter = compileV2Filter(uberSplitHideCfg);
    expect(
      simulateItemDrop(uberSplitHideFilter, catalog, {
        id: 'uber-cv-hard-hide',
        code: '7vo',
        name: 'Colossus Voulge',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'superior',
        sockets: 4,
        ethereal: true,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(false);
    expect(
      simulateItemDrop(uberSplitHideFilter, catalog, {
        id: 'uber-ogre-axe-eth',
        code: '7o7',
        name: 'Ogre Axe',
        kind: 'weapon',
        tier: 'elite',
        rarity: 'normal',
        sockets: 3,
        ethereal: true,
        identified: true,
        itemLevel: 88,
        quantity: 1
      }).show
    ).toBe(true);

    // Hard-hiding both members ('7vo' and '7o7') collapses into an explicit hard-hide override on the parent card
    uberSplitHideCfg.customBases.unshift({
      id: 'base-7o7-runeword',
      code: '7o7',
      label: 'Ogre Axe',
      tier: 'HIDE',
      mode: 'runeword',
      parentItemId: 'base-polearms-secondary'
    });
    reconcileGroupSplits(uberSplitHideCfg, catalog);
    expect(uberSplitHideCfg.itemOverrides['base-polearms-secondary']).toBe('HIDE');
    expect(isBaseCardHardHidden(secPoleCard, uberSplitHideCfg)).toBe(true);
    expect(uberSplitHideCfg.customBases).toHaveLength(0);

    // Promoting a Secondary card to Tier C in Uber Strict shows 0os white at Tier C while still promoting Superior/Ethereal to Tier B
    const uberPromoteCCfg = createDefaultV2Config('endgame', 'reimagined');
    uberPromoteCCfg.itemOverrides['base-polearms-secondary'] = 'C';
    const uberPromoteCFilter = compileV2Filter(uberPromoteCCfg);
    const plainCvC = simulateItemDrop(uberPromoteCFilter, catalog, {
      id: 'cv-plain-c',
      code: '7vo',
      name: 'Colossus Voulge',
      kind: 'weapon',
      tier: 'elite',
      rarity: 'normal',
      sockets: 0,
      ethereal: false,
      identified: true,
      itemLevel: 88,
      quantity: 1
    });
    const supCvB = simulateItemDrop(uberPromoteCFilter, catalog, {
      id: 'cv-sup-b',
      code: '7vo',
      name: 'Colossus Voulge',
      kind: 'weapon',
      tier: 'elite',
      rarity: 'superior',
      sockets: 0,
      ethereal: false,
      identified: true,
      itemLevel: 88,
      quantity: 1
    });
    expect(plainCvC.show).toBe(true);
    expect(plainCvC.dropSound).toBeUndefined(); // Tier C
    expect(supCvB.show).toBe(true);
    expect(supCvB.dropSound).toBe('Filter03'); // Promoted to Tier B by Superior Elite rule

    // Universal body/helm hide & moved customBases parentItemId migration from m:3 -> m:4
    expect(findParentGroupForBase('6sb', 'runeword', catalog, 'base-ama-weapons')?.id).toBe('base-bows-secondary');
    m3Payload.io = {
      'base-elite-body': 'HIDE',
      'base-elite-helms': 'HIDE'
    };
    m3Payload.cb = [
      { id: 'cb-6sb', code: '6sb', label: 'Spider Bow', tier: 'S', mode: 'runeword', parentItemId: 'base-ama-weapons' },
      { id: 'cb-7ja', code: '7ja', label: 'Hyperion Javelin', tier: 'A', mode: 'runeword', parentItemId: 'base-javelins' },
      { id: 'cb-7tr', code: '7tr', label: 'Stygian Pike', tier: 'A', mode: 'runeword', parentItemId: 'base-spears' }
    ];
    tailBlock.ruleName = `Keep everything else visible [PyreV2:${Buffer.from(JSON.stringify(m3Payload), 'utf8').toString('base64')}]`;
    const migratedUniversalM3 = extractV2ConfigWithMeta(m3Doc)!;
    expect(migratedUniversalM3.config.itemOverrides['base-elite-body-secondary']).toBe('HIDE');
    expect(migratedUniversalM3.config.itemOverrides['base-elite-helms-secondary']).toBe('HIDE');
    expect(migratedUniversalM3.config.customBases.map(cb => cb.parentItemId)).toEqual([
      'base-bows-secondary',
      'base-javelins-secondary',
      'base-spears-secondary'
    ]);
  });
});
