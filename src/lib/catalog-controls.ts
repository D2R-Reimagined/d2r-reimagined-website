import type { CatalogItem, DamageType, KeyedLine } from './types';

export interface SearchToken {
  term: string;
  negated: boolean;
}

export type SearchGroups = SearchToken[][];

export type WeaponSortMode =
  | ''
  | 'avg-1h-phys-descending'
  | 'avg-1h-phys-ascending'
  | 'avg-2h-phys-descending'
  | 'avg-2h-phys-ascending'
  | 'avg-throw-phys-descending'
  | 'avg-throw-phys-ascending'
  | 'avg-non-phys-descending'
  | 'avg-non-phys-ascending';

export const weaponSortOptions: Array<{ value: WeaponSortMode; label: string }> = [
  { value: '', label: 'Default order' },
  { value: 'avg-1h-phys-descending', label: '1H physical — highest first' },
  { value: 'avg-1h-phys-ascending', label: '1H physical — lowest first' },
  { value: 'avg-2h-phys-descending', label: '2H physical — highest first' },
  { value: 'avg-2h-phys-ascending', label: '2H physical — lowest first' },
  { value: 'avg-throw-phys-descending', label: 'Throw physical — highest first' },
  { value: 'avg-throw-phys-ascending', label: 'Throw physical — lowest first' },
  { value: 'avg-non-phys-descending', label: 'Elemental — highest first' },
  { value: 'avg-non-phys-ascending', label: 'Elemental — lowest first' }
];

const affixPropertyGroups: Record<string, number[]> = {
  prop_group_absorbs: [3],
  prop_group_attributes: [17, 23, 31, 42],
  prop_group_attack_rating: [110, 200],
  prop_group_auto_repair: [37],
  prop_group_block_chance: [8],
  prop_group_charges: [44],
  prop_group_ctc_level_up: [79],
  prop_group_ctc_when_striking: [78],
  prop_group_ctc_when_struck: [77],
  prop_group_damage: [14, 15, 61, 103, 104, 105, 111, 143, 206],
  prop_group_defense: [61, 101],
  prop_group_demon_damage: [123],
  prop_group_elemental_effect_defense: [11, 29],
  prop_group_elemental_skill_effect: [82, 83, 209, 214, 215],
  prop_group_elemental_weapon_damage: [10, 12, 13, 16, 137, 138, 139, 140, 141, 203],
  prop_group_equip_aura: [207],
  prop_group_experience: [204],
  prop_group_gold_find: [21],
  prop_group_indestructible: [39],
  prop_group_kick_damage: [205],
  prop_group_life: [19, 26, 41, 80, 134],
  prop_group_life_leech: [27, 60],
  prop_group_light_radius: [25, 112],
  prop_group_magic_find: [22, 114],
  prop_group_mana: [107, 115, 121, 131],
  prop_group_mana_leech: [28, 60],
  prop_group_reanimate: [66],
  prop_group_requirements: [30],
  prop_group_resistances: [1, 2, 43, 67, 102, 116, 117, 118, 119, 120, 130, 133],
  prop_group_skill_levels: [125, 201, 213],
  prop_group_skill_special_effects: [81],
  prop_group_sockets: [122],
  prop_group_speeds: [7, 9, 18, 32, 35, 211, 212],
  prop_group_thorns: [6, 210],
  prop_group_undead_damage: [142],
  prop_group_vendor_prices: [63],
  prop_group_weapon_effects: [4, 5, 20, 24, 64, 65, 113, 202, 212]
};

export const affixPropertyOptions = Object.keys(affixPropertyGroups);

// The itemtypes.txt relationships used by the legacy filters. Keeping this
// graph here preserves broad selections such as Any Weapon, Armor, and class
// item families while still supporting the old Exact toggle.
const typeParents: Record<string, string[]> = {
  meleitype: ['weapitype'], missitype: ['weapitype'], shlditype: ['armoitype'],
  torsitype: ['armoitype'], helmitype: ['armoitype'], glovitype: ['armoitype'],
  bootitype: ['armoitype'], beltitype: ['armoitype'], circitype: ['helmitype'],
  shieitype: ['shlditype'], cloaitype: ['torsitype', 'assnitype'],
  charitype: ['miscitype'], schaitype: ['charitype'], mchaitype: ['charitype'],
  lchaitype: ['charitype'], cschitype: ['charitype'], sockitype: ['miscitype'],
  jewlitype: ['sockitype'], cjwlitype: ['jewlitype'], runeitype: ['sockitype'],
  gemitype: ['sockitype'], axeitype: ['meleitype', 'weapitype'],
  clubitype: ['blunitype', 'meleitype', 'weapitype'], hammitype: ['blunitype', 'meleitype', 'weapitype'],
  maceitype: ['blunitype', 'meleitype', 'weapitype'], poleitype: ['spplitype', 'meleitype', 'weapitype'],
  scepitype: ['roditype', 'meleitype', 'weapitype'], stafitype: ['roditype', 'meleitype', 'weapitype'],
  speaitype: ['spplitype', 'meleitype', 'weapitype'], sworitype: ['bldeitype', 'meleitype', 'weapitype'],
  wanditype: ['roditype', 'meleitype', 'weapitype'], bowitype: ['missitype', 'weapitype'],
  xbowitype: ['missitype', 'weapitype'], knifitype: ['bldeitype', 'meleitype', 'weapitype'],
  javeitype: ['meleitype', 'throitype', 'weapitype'], tkniitype: ['combitype', 'knifitype'],
  taxeitype: ['combitype', 'axeitype'], bldeitype: ['meleitype'],
  spplitype: ['meleitype'], blunitype: ['meleitype'], roditype: ['blunitype'],
  throitype: ['weapitype'], combitype: ['meleitype', 'throitype'],
  amazitype: ['clasitype'], barbitype: ['clasitype'], necritype: ['clasitype'],
  palaitype: ['clasitype'], sorcitype: ['clasitype'], assnitype: ['clasitype'],
  druiitype: ['clasitype'], warlitype: ['clasitype'],
  abowitype: ['amazitype', 'bowitype', 'missitype', 'weapitype'],
  aspeitype: ['amazitype', 'speaitype', 'meleitype', 'weapitype'],
  ajavitype: ['amazitype', 'javeitype', 'meleitype', 'weapitype'],
  h2hitype: ['assnitype', 'meleitype', 'weapitype'], orbitype: ['sorcitype', 'weapitype'],
  phlmitype: ['barbitype', 'helmitype'], peltitype: ['druiitype', 'helmitype'],
  headitype: ['necritype', 'shlditype'], ashditype: ['palaitype', 'shlditype'],
  grimitype: ['warlitype', 'shlditype'], tpotitype: ['throitype']
};

function typeChain(code: string, seen = new Set<string>()): Set<string> {
  if (!code || seen.has(code)) return seen;
  seen.add(code);
  for (const parent of typeParents[code] ?? []) typeChain(parent, seen);
  return seen;
}

export function matchesItemType(itemTypes: string[], selectedType: string, exact: boolean, applicability = false): boolean {
  if (!selectedType) return true;
  if (exact) return itemTypes.includes(selectedType);
  // Only applicability lists (runewords/affixes) may match a selected subtype
  // through a broader allowed type. A Helm item is not itself a Druid Pelt.
  const selectedChain = applicability ? typeChain(selectedType) : new Set<string>();
  return itemTypes.some((itemType) => typeChain(itemType).has(selectedType) || selectedChain.has(itemType));
}

export function tokenizeSearch(input: string | undefined | null): SearchGroups {
  const raw = (input ?? '').trim().toLowerCase();
  if (!raw) return [];
  return raw
    .split(/[,|]/)
    .map((group) => {
      const tokens: SearchToken[] = [];
      for (const segment of group.split('+')) {
        for (const part of segment.trim().split(/\s+(?=[-!]\S)/)) {
          const value = part.trim();
          if (!value) continue;
          const negated = /^[-!]\S/.test(value);
          const term = negated ? value.slice(1).trim() : value;
          if (term) tokens.push({ term, negated });
        }
      }
      return tokens;
    })
    .filter((group) => group.length > 0);
}

export function matchesSearch(haystack: string, groups: SearchGroups): boolean {
  if (!groups.length) return true;
  return groups.some((group) => group.every(({ term, negated }) =>
    negated ? !haystack.includes(term) : haystack.includes(term)
  ));
}

export function baseTier(item: CatalogItem): 'Normal' | 'Exceptional' | 'Elite' | '' {
  const code = String(item.Code ?? item.NameKey ?? '').toLowerCase();
  if (code && code === String(item.NormCode ?? '').toLowerCase()) return 'Normal';
  if (code && code === String(item.UberCode ?? '').toLowerCase()) return 'Exceptional';
  if (code && code === String(item.UltraCode ?? '').toLowerCase()) return 'Elite';
  const translatedMarker = String(item.NameKey ?? '').match(/\[(N|X|E)\]/i)?.[1]?.toUpperCase();
  return translatedMarker === 'N' ? 'Normal' : translatedMarker === 'X' ? 'Exceptional' : translatedMarker === 'E' ? 'Elite' : '';
}

export function baseHasSockets(item: CatalogItem, count: number): boolean {
  if (!count) return true;
  if (typeof item.GemSockets === 'number') return item.GemSockets === count;
  return [...String(item.GemSockets ?? '').matchAll(/:\s*(\d+)/g)]
    .some((match) => Number(match[1]) === count);
}

export function affixMatchesProperty(item: CatalogItem, property: string): boolean {
  if (!property) return true;
  return affixPropertyGroups[property]?.includes(Number(item.Group)) ?? false;
}

export function sortModifierLines(lines: KeyedLine[] | undefined): KeyedLine[] {
  if (!lines) return [];
  return lines
    .map((line, index) => ({ line, index, priority: line.children?.length && Number(line.pickMode ?? 0) !== 0 ? 1 : 0 }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .map(({ line }) => line);
}

function damageTypesFor(item: CatalogItem): DamageType[] {
  if (item.DamageTypes?.length) return item.DamageTypes;
  if (item.Equipment?.DamageTypes?.length) return item.Equipment.DamageTypes;
  if (item.SetItems?.length) return item.SetItems.flatMap((setItem) => setItem.Equipment?.DamageTypes ?? []);
  return [];
}

export function passesHandFilter(item: CatalogItem, mode: string): boolean {
  if (!mode) return true;
  if (item.SetItems?.length) return item.SetItems.some((setItem) => passesHandFilter(setItem, mode));
  const damageTypes = damageTypesFor(item);
  const hasTwoHand = damageTypes.some((damage) => damage.Type === 1);
  return mode === '1h' ? !hasTwoHand : mode === '2h' ? hasTwoHand : true;
}

export function weaponDamageValue(item: CatalogItem, mode: WeaponSortMode): number {
  if (item.SetItems?.length) {
    return Math.max(0, ...item.SetItems.map((setItem) => weaponDamageValue(setItem, mode)));
  }
  const damageTypes = damageTypesFor(item);
  if (mode.includes('1h-phys')) {
    return damageTypes.find((damage) => damage.Type === 3 || damage.Type === 0)?.AverageDamage ?? 0;
  }
  if (mode.includes('2h-phys')) return damageTypes.find((damage) => damage.Type === 1)?.AverageDamage ?? 0;
  if (mode.includes('throw-phys')) return damageTypes.find((damage) => damage.Type === 2)?.AverageDamage ?? 0;
  if (mode.includes('non-phys')) {
    return damageTypes.filter((damage) => damage.Type === 4).reduce((sum, damage) => sum + (damage.AverageDamage ?? 0), 0);
  }
  return 0;
}

export function sortByWeaponDamage(items: CatalogItem[], mode: WeaponSortMode): CatalogItem[] {
  if (!mode) return items;
  const ascending = mode.includes('ascending');
  return items
    .map((item, index) => ({ item, index, value: weaponDamageValue(item, mode) }))
    .sort((a, b) => {
      if (a.value === 0 && b.value !== 0) return 1;
      if (a.value !== 0 && b.value === 0) return -1;
      return (ascending ? a.value - b.value : b.value - a.value) || a.index - b.index;
    })
    .map(({ item }) => item);
}

export function recipeType(item: CatalogItem): string[] {
  return (item.Notes ?? []).map((note) => note.key).filter(Boolean);
}
