// @ts-nocheck
// Reimagined integration for Pyre Loot Filter Builder. GPL-3.0-or-later.
import model from './model.js';

const HIDDEN_ITEM_TYPES = new Set(['none', 'cloa', 'afwe', 'h2h2']);

const ITEM_TYPE_LABELS = {
  weap: 'Weapon',
  helm: 'Helm',
  merc: 'Mercenary Equipment',
  tors: 'Body Armor',
  misl: 'Arrows / Bolts',
  bowq: 'Bow Quiver',
  xboq: 'Crossbow Quiver',
  mboq: 'Magic Bow Quiver',
  mxbq: 'Magic Crossbow Quiver',
  tpot: 'Throwing Potion',
  rpot: 'Rejuvenation Potion',
  mcha: 'Large Charm',
  lcha: 'Grand Charm',
  h2h: 'Assassin Claw',
  orb: 'Sorceress Orb',
  head: 'Necromancer Head',
  ashd: 'Paladin Auric Shield',
  phlm: 'Barbarian Primal Helm',
  pelt: 'Druid Pelt',
  grim: 'Warlock Grimoire',
  pgem: 'Unstacked Gem',
  rod: 'Staves and Rods'
};

const ITEM_TYPE_SEARCH_TERMS = {
  misl: 'arrow arrows bolt bolts quiver quivers ammo missile',
  bowq: 'arrow arrows bow quiver ammo',
  xboq: 'bolt bolts crossbow quiver xbow ammo',
  mboq: 'magic arrow arrows bow quiver ammo',
  mxbq: 'magic bolt bolts crossbow quiver xbow ammo',
  miss: 'bow crossbow ranged weapon',
  tpot: 'throwing potion gas oil fulminating exploding rancid choking strangling missile potion',
  tors: 'armor body chest torso',
  helm: 'helm helmet head',
  merc: 'mercenary equip gear',
  h2h: 'assassin claw katar hand to hand',
  head: 'necromancer shrunken voodoo head trophy',
  ashd: 'paladin auric shield targe rondache',
  phlm: 'barbarian primal helm',
  pelt: 'druid pelt',
  grim: 'warlock grimoire book tome codex compendium',
  mcha: 'large charm medium charm',
  lcha: 'grand charm large charm',
  rpot: 'rejuvenation rejuv potion'
};

export function fromExport(bundle, strings) {
    if (bundle?.SchemaVersion !== 1 || bundle.FilterVersion !== 3 ||
        !['BaseItems', 'ItemTypes', 'UniqueItems', 'SetItems'].every(key => Array.isArray(bundle[key]))) {
      throw new Error('Unsupported Reimagined catalog. Please refresh or try again later.');
    }
    const translate = key => String(strings[key] || key || '').replace(/ÿc./g, '').replace(/\[\/?.*?\]/g, '').trim();
    const detectTier = key => {
      const raw = String(strings[key] || '');
      if (raw.includes('[E]')) return 'elite';
      if (raw.includes('[X]')) return 'exceptional';
      if (raw.includes('[N]')) return 'normal';
      return undefined;
    };
    const bases = kind => ({ rows: bundle.BaseItems.filter(x => x.Kind === kind).map(x => ({
      code: x.Code, name: kind === 'misc' ? translate(x.NameKey) : x.BaseNameSelector, type: x.TypeCode, type2: x.TypeCode2
    })) });
    const enrichment = rows => ({ nameCol: 'name', baseCol: 'code', rows: rows.map(x => ({ name: translate(x.NameKey), code: x.Code })) });
    const catalog = model.buildCatalog({
      weapons: bases('weapon'), armor: bases('armor'), misc: bases('misc'),
      itemtypes: { rows: bundle.ItemTypes.map(x => ({ Code: x.Code, ItemType: x.TypeNameSelector, Equiv1: x.ParentCode, Equiv2: x.ParentCode2 })) },
      uniques: enrichment(bundle.UniqueItems), sets: enrichment(bundle.SetItems)
    });
    catalog.itemTypes = catalog.itemTypes.filter(code => !HIDDEN_ITEM_TYPES.has(code));
    catalog.itemTypeSearchTerms = new Map();
    catalog.itemTypeAliases = new Map();
    for (const row of bundle.ItemTypes) {
      const code = String(row.Code || '').trim();
      if (!code) continue;
      const rawName = String(row.TypeNameSelector || '');
      const trimmedRaw = rawName.trim();
      const itypeKey = `${code}itype`;
      const localized = strings?.[itypeKey] ? translate(itypeKey) : '';
      const display = ITEM_TYPE_LABELS[code] || localized || trimmedRaw || code;
      catalog.itemTypeNames.set(code, display);
      if (rawName && !catalog.itemTypeNames.has(rawName)) catalog.itemTypeNames.set(rawName, display);
      if (trimmedRaw && !catalog.itemTypeNames.has(trimmedRaw)) catalog.itemTypeNames.set(trimmedRaw, display);
      if (rawName && (!catalog.itemTypeAliases.has(rawName) || code === 'gem')) catalog.itemTypeAliases.set(rawName, code);
      if (trimmedRaw && (!catalog.itemTypeAliases.has(trimmedRaw) || code === 'gem')) catalog.itemTypeAliases.set(trimmedRaw, code);
      const extraSearch = [trimmedRaw, ITEM_TYPE_SEARCH_TERMS[code]].filter(Boolean).join(' ');
      if (extraSearch) catalog.itemTypeSearchTerms.set(code, extraSearch);
    }
    const names = new Map(bundle.BaseItems.map(x => [`${x.Kind}:${x.Code}`, translate(x.NameKey)]));
    const tiers = new Map(bundle.BaseItems.map(x => [`${x.Kind}:${x.Code}`, detectTier(x.NameKey)]));
    catalog.baseItems.forEach(item => {
      item.displayName = names.get(`${item.kind}:${item.code}`) || item.name || item.code;
      const tier = tiers.get(`${item.kind}:${item.code}`);
      if (tier) item.tier = tier;
    });
    return catalog;
  }
