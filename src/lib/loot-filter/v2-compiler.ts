import M from './model.js';
import {
  blockOf,
  kindOf,
  values,
  type Catalog,
  type Conditions,
  type Filter,
  type NumberTest,
  type Rule,
  type RuleBlock
} from './types.js';

export type StrictnessId = 'soft' | 'regular' | 'semi-strict' | 'strict' | 'endgame';
export type ThemeId = 'reimagined' | 'filterblade' | 'neon' | 'minimalist';
export type TierRank = 'S' | 'A' | 'B' | 'C' | 'D' | 'HIDE';
export type CategoryId =
  | 'runes'
  | 'currency'
  | 'bosses'
  | 'maps'
  | 'gems'
  | 'uniques'
  | 'bases'
  | 'equipment'
  | 'misc';

export interface TierStyle {
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  dropSound?: string;
  minimapIcon?: {
    shape: string;
    size: number;
    borderColor: string;
    fillColor: string;
  };
  namePrefix?: string;
}

export interface TierableItem {
  id: string;
  label: string;
  subtitle?: string;
  category: CategoryId;
  codes?: string[];
  baseNames?: string[];
  itemTypes?: string[];
  rarities?: string[];
  tiers?: ('normal' | 'exceptional' | 'elite')[];
  sockets?: NumberTest;
  ethereal?: boolean;
  defaultTier: TierRank;
  strictnessTiers?: Partial<Record<StrictnessId, TierRank>>;
}

export interface CustomBaseRule {
  id: string;
  code: string;
  label: string;
  tier: TierRank;
  mode: 'runeword' | 'unique' | 'set' | 'rare';
  minSockets?: number;
  etherealOnly?: boolean;
}

export interface BaseFilterSettings {
  requireSocketsOnBases: boolean;
  minSocketsOnBases: number;
  highlightEthEliteBases: boolean;
  highlightSupEliteBases: boolean;
  show3PlusSocketElite: boolean;
  show4PlusSocketExceptional: boolean;
}

export type BuildClassId =
  | 'Amazon'
  | 'Assassin'
  | 'Barbarian'
  | 'Druid'
  | 'Necromancer'
  | 'Paladin'
  | 'Sorceress'
  | 'Warlock';

export type BuildArchetypeId = 'caster' | 'melee' | 'ranged';

export type EquipmentFamilyId =
  | 'bow-quiver'
  | 'xbow-quiver'
  | 'javelin'
  | 'spear'
  | 'throwing'
  | 'sword'
  | 'axe'
  | 'mace'
  | 'club'
  | 'polearm'
  | 'dagger'
  | 'claws'
  | 'scepter'
  | 'wand'
  | 'staff'
  | 'sorc-orb'
  | 'warlock-grimoire'
  | 'necro-head'
  | 'paladin-shield'
  | 'standard-shield'
  | 'barb-helm'
  | 'druid-pelt';

export interface BuildProfile {
  selectedClass?: BuildClassId | null;
  archetype?: BuildArchetypeId | null;
  disabledFamilies: EquipmentFamilyId[];
  presetId?: string;
  linkedBuildId?: string;
  linkedBuildTitle?: string;
}

export interface V2Config {
  version: 2;
  strictness: StrictnessId;
  theme: ThemeId;
  itemOverrides: Record<string, TierRank>;
  tierStyleOverrides: Partial<Record<TierRank, Partial<TierStyle>>>;
  categoryTierStyleOverrides: Partial<Record<CategoryId, Partial<Record<TierRank, Partial<TierStyle>>>>>;
  customBases: CustomBaseRule[];
  baseSettings: BaseFilterSettings;
  buildProfile: BuildProfile;
  customPriorityRules: Rule[];
}

export interface StrictnessPresetInfo {
  id: StrictnessId;
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
  hidesSummary: string;
  keepsSummary: string;
  recommendedFor: string;
}

export const STRICTNESS_PRESETS: readonly StrictnessPresetInfo[] = [
  {
    id: 'soft',
    name: 'Soft (Starter)',
    shortLabel: 'Soft',
    badge: 'Act I – Normal',
    description: 'Every single drop stays visible. High-value runes, orbs, uniques, sets, and socketed gear receive clear visual and audio callouts.',
    hidesSummary: 'Nothing unless you explicitly move an item into the Hide tier.',
    keepsSummary: 'All equipment, runes, currencies, gems, charms, potions, scrolls, and gold.',
    recommendedFor: 'Fresh characters, Act 1–5 Normal, and players who want zero hidden loot.'
  },
  {
    id: 'regular',
    name: 'Regular',
    shortLabel: 'Regular',
    badge: 'Nightmare',
    description: 'Cuts out broken/inferior trash and unsocketed Normal-tier white weapons/armor, plus tiny Act 1 healing/mana potions.',
    hidesSummary: 'Inferior gear, unsocketed non-ethereal Normal white gear, and Minor/Light HP/MP potions.',
    keepsSummary: 'All Exceptional/Elite bases, all socketed or ethereal items, all Magic/Rare/Set/Unique items, all gems and runes.',
    recommendedFor: 'Nightmare progression once basic starter gear is established.'
  },
  {
    id: 'semi-strict',
    name: 'Semi-Strict',
    shortLabel: 'Semi-Strict',
    badge: 'Early Hell',
    description: 'The sweet spot for entering Hell and early farming. Hides unsocketed white/magic clutter and low potions while keeping all gems visible for your Gem Bag.',
    hidesSummary: 'Unsocketed white gear, Magic Normal/Exceptional weapons & armor, and standard HP/MP potions.',
    keepsSummary: 'All Runes, all Gems & Gem Stacks (for the Gem Bag), all Rares/Uniques/Sets, Chase Runeword bases, and Ethereal/Socketed bases.',
    recommendedFor: 'Hell campaign, Terror Zones, and early endgame gearing.'
  },
  {
    id: 'strict',
    name: 'Strict',
    shortLabel: 'Strict',
    badge: 'Hell Farming',
    description: 'Streamlines your screen for fast Hell and early Map runs. Hides low runes (El–Ith), Magic ordinary gear, and Normal-tier Rares while keeping all gems visible.',
    hidesSummary: 'El–Ith runes, Magic ordinary equipment, Normal-tier Rares, and Greater HP/MP potions.',
    keepsSummary: 'Tal+ Runes, all Gems & Gem Stacks, Orbs, Maps, Exceptional/Elite Rares, Chase & Elite Runeword bases, Super/Rejuv potions.',
    recommendedFor: 'Established Hell builds farming bosses, Chaos/Baal, and Tier 1–3 Maps.'
  },
  {
    id: 'endgame',
    name: 'Uber Strict (Endgame)',
    shortLabel: 'Uber Strict',
    badge: 'Endgame Maps',
    description: 'Built for high-density Tier 4–6 Maps. Shows valuable runes/currencies, all Gems for your Gem Bag, Elite & Chase bases, high-tier Rares, Uniques/Sets, and Full Rejuvs.',
    hidesSummary: 'El–Dol runes (keeps Ral/Amn/Sol/Shael/Hel+ for crafting), Normal/Exceptional Rares, non-Elite ordinary bases, and regular HP/MP potions.',
    keepsSummary: 'Mid/High & Crafting Runes, Orbs, all Gems & Gem Stacks, Maps, Uniques/Sets, Elite Rares/Circlets/Jewelry/Gloves/Boots/Belts, Chase Runeword bases, Full Rejuvs & Buff potions.',
    recommendedFor: 'Endgame characters blasting dense Maps where screen clarity is critical.'
  }
] as const;

export interface ThemePresetInfo {
  id: ThemeId;
  name: string;
  description: string;
  tiers: Record<Exclude<TierRank, 'HIDE'>, TierStyle>;
}

export const THEME_PRESETS: Record<ThemeId, ThemePresetInfo> = {
  reimagined: {
    id: 'reimagined',
    name: 'Reimagined Classic',
    description: 'Rich dark-fantasy gold, ember, royal purple, and arcane blue tuned for D2R Reimagined.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(42, 12, 58, 0.94)',
        borderColor: 'RGBA(235, 135, 255, 1)',
        textColor: 'RGBA(252, 225, 255, 1)',
        dropSound: 'Filter01',
        minimapIcon: { shape: 'star', size: 24, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(235, 135, 255, 1)' },
        namePrefix: '★ {name} ★'
      },
      A: {
        backgroundColor: 'RGBA(48, 20, 6, 0.92)',
        borderColor: 'RGBA(255, 150, 40, 1)',
        textColor: 'RGBA(255, 210, 130, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'star', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 150, 40, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(16, 30, 48, 0.9)',
        borderColor: 'RGBA(110, 200, 255, 1)',
        textColor: 'RGBA(195, 235, 255, 1)',
        dropSound: 'Filter03',
        minimapIcon: { shape: 'diamond', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(110, 200, 255, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(18, 18, 22, 0.85)',
        borderColor: 'RGBA(180, 160, 120, 0.7)',
        textColor: 'RGBA(235, 220, 185, 1)'
      },
      D: {
        textColor: 'RGBA(175, 170, 160, 0.9)'
      }
    }
  },
  filterblade: {
    id: 'filterblade',
    name: 'FilterBlade / Maven',
    description: 'Iconic white-and-crimson S-Tier callouts, bright orange A-Tier currency, and crisp gold B-Tier borders.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(250, 250, 250, 0.95)',
        borderColor: 'RGBA(235, 30, 30, 1)',
        textColor: 'RGBA(220, 15, 15, 1)',
        dropSound: 'Filter01',
        minimapIcon: { shape: 'star', size: 26, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(235, 30, 30, 1)' },
        namePrefix: '★ {name} ★'
      },
      A: {
        backgroundColor: 'RGBA(215, 85, 15, 0.92)',
        borderColor: 'RGBA(255, 235, 200, 1)',
        textColor: 'RGBA(255, 250, 240, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'star', size: 22, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 130, 25, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(32, 26, 12, 0.9)',
        borderColor: 'RGBA(240, 195, 70, 1)',
        textColor: 'RGBA(250, 220, 115, 1)',
        dropSound: 'Filter04',
        minimapIcon: { shape: 'circle', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(240, 195, 70, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(15, 18, 24, 0.85)',
        borderColor: 'RGBA(130, 155, 185, 0.8)',
        textColor: 'RGBA(210, 225, 240, 1)'
      },
      D: {
        textColor: 'RGBA(155, 165, 175, 0.88)'
      }
    }
  },
  neon: {
    id: 'neon',
    name: 'Abyssal Neon',
    description: 'High-contrast electric magenta, cyber cyan, and neon lime over pitch-black backgrounds for maximum map visibility.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(12, 5, 24, 0.95)',
        borderColor: 'RGBA(255, 45, 210, 1)',
        textColor: 'RGBA(255, 145, 240, 1)',
        dropSound: 'Filter06',
        minimapIcon: { shape: 'star', size: 25, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 45, 210, 1)' },
        namePrefix: '>> {name} <<'
      },
      A: {
        backgroundColor: 'RGBA(5, 22, 28, 0.94)',
        borderColor: 'RGBA(0, 245, 255, 1)',
        textColor: 'RGBA(155, 252, 255, 1)',
        dropSound: 'Filter05',
        minimapIcon: { shape: 'spark', size: 22, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(0, 245, 255, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(10, 26, 10, 0.9)',
        borderColor: 'RGBA(90, 255, 90, 1)',
        textColor: 'RGBA(185, 255, 185, 1)',
        dropSound: 'Filter03',
        minimapIcon: { shape: 'diamond', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(90, 255, 90, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(14, 14, 22, 0.85)',
        borderColor: 'RGBA(140, 120, 255, 0.75)',
        textColor: 'RGBA(205, 195, 255, 1)'
      },
      D: {
        textColor: 'RGBA(145, 155, 175, 0.85)'
      }
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Clean Minimal',
    description: 'Compact, low-profile labels with clean borders and subtle backgrounds that preserve D2R ground art.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(20, 12, 28, 0.88)',
        borderColor: 'RGBA(230, 165, 255, 1)',
        textColor: 'RGBA(245, 215, 255, 1)',
        dropSound: 'Filter01',
        minimapIcon: { shape: 'star', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(230, 165, 255, 1)' }
      },
      A: {
        backgroundColor: 'RGBA(24, 16, 8, 0.85)',
        borderColor: 'RGBA(245, 170, 75, 1)',
        textColor: 'RGBA(255, 210, 145, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'diamond', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(245, 170, 75, 1)' }
      },
      B: {
        borderColor: 'RGBA(125, 195, 245, 0.9)',
        textColor: 'RGBA(200, 230, 255, 1)',
        minimapIcon: { shape: 'circle', size: 14, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(125, 195, 245, 1)' }
      },
      C: {
        textColor: 'RGBA(230, 215, 185, 1)'
      },
      D: {
        textColor: 'RGBA(165, 160, 150, 0.85)'
      }
    }
  }
};

export const TIER_RANKS: readonly { id: TierRank; label: string; shortLabel: string; description: string; badgeClass: string }[] = [
  { id: 'S', label: 'Tier S · Chase / Jackpot', shortLabel: 'Tier S', description: 'Maximum alert: star minimap icon, loud drop sound, high-contrast callout box.', badgeClass: 'border-fuchsia-400/60 bg-fuchsia-950/70 text-fuchsia-200' },
  { id: 'A', label: 'Tier A · High Value', shortLabel: 'Tier A', description: 'Strong highlight: bold border, background, minimap icon, and alert sound.', badgeClass: 'border-amber-400/60 bg-amber-950/70 text-amber-200' },
  { id: 'B', label: 'Tier B · Notable / Crafting', shortLabel: 'Tier B', description: 'Medium highlight: clean accent border, small minimap icon, and soft chime.', badgeClass: 'border-sky-400/60 bg-sky-950/70 text-sky-200' },
  { id: 'C', label: 'Tier C · Common / Utility', shortLabel: 'Tier C', description: 'Light highlight: readable text/border without minimap clutter or audio.', badgeClass: 'border-parchment-300/40 bg-abyss-900 text-parchment-100' },
  { id: 'D', label: 'Tier D · Low / Early Game', shortLabel: 'Tier D', description: 'Subtle text only. Visible in Soft–Semi-Strict; hidden automatically in Strict/Endgame unless overridden.', badgeClass: 'border-slate-500/40 bg-slate-900/60 text-slate-300' },
  { id: 'HIDE', label: 'Hide · Filtered Out', shortLabel: 'Hide', description: 'Hidden on ground (hold Ctrl / LB in-game to reveal).', badgeClass: 'border-red-500/50 bg-red-950/50 text-red-300' }
] as const;

export const CATEGORIES: readonly { id: CategoryId; name: string; subtitle: string; icon: string }[] = [
  { id: 'runes', name: 'Runes & Rune Stacks', subtitle: 'All 39 Runes (#1 El – #39 Hev), paired with their stackable variants', icon: 'ᚱ' },
  { id: 'currency', name: 'Orbs & Upgrade Materials', subtitle: 'Power Orbs, Gem Clusters, Chaos Onyx, Pliers, Bags & Grabbers', icon: '◈' },
  { id: 'bosses', name: 'Boss Keys, Organs & Tokens', subtitle: 'Uber Keys, Boss Souls, Animus/Calamity/Ire, Worldstone Shards & Essences', icon: '☠' },
  { id: 'maps', name: 'Endgame Maps & Sextants', subtitle: 'Tier 1–6 Maps and Map Currency (Sextant, Astrolabe, Vizjerei Prism)', icon: '🗺' },
  { id: 'gems', name: 'Gems & Gem Stacks', subtitle: 'Gem Stacks, Reimagined Unstacked Gems, Perfect, Flawless, Standard & Flawed Gems (Always visible for Gem Bag)', icon: '❖' },
  { id: 'uniques', name: 'Uniques, Sets, Charms & Jewelry', subtitle: 'Drop-Only Chase Bases, Uniques/Sets by Tier, Sunder/Colossal/Torches, Charms & Rings', icon: '♛' },
  { id: 'bases', name: 'Runeword & Crafting Bases', subtitle: 'Chase Weapon/Armor Bases, Ethereal Elite Bases, Superior Bases & Socket Thresholds', icon: '⚔' },
  { id: 'equipment', name: 'Rares, Crafted & Magic Gear', subtitle: 'Crafted Items, Rare Circlets/Class Gear/Gloves/Boots/Belts, and Rares/Magics by Tier', icon: '🛡' },
  { id: 'misc', name: 'Potions, Scrolls, Quivers & Misc', subtitle: 'Rejuvenation, Buff/Sunder Potions, HP/MP Tiers, Scrolls, Quivers, Dyes & Gold', icon: '⚗' }
] as const;

const RUNE_NAMES: readonly [number, string, TierRank, Partial<Record<StrictnessId, TierRank>>?][] = [
  [39, 'Hev Rune (#39)', 'S'],
  [38, 'Dem Rune (#38)', 'S'],
  [37, 'Grit Rune (#37)', 'S'],
  [36, 'Myr Rune (#36)', 'S'],
  [35, 'Zeph Rune (#35)', 'S'],
  [34, 'Brak Rune (#34)', 'S'],
  [33, 'Zod Rune (#33)', 'S'],
  [32, 'Cham Rune (#32)', 'S'],
  [31, 'Jah Rune (#31)', 'S'],
  [30, 'Ber Rune (#30)', 'S'],
  [29, 'Sur Rune (#29)', 'S'],
  [28, 'Lo Rune (#28)', 'S'],
  [27, 'Ohm Rune (#27)', 'A'],
  [26, 'Vex Rune (#26)', 'A'],
  [25, 'Gul Rune (#25)', 'A'],
  [24, 'Ist Rune (#24)', 'A'],
  [23, 'Mal Rune (#23)', 'A'],
  [22, 'Um Rune (#22)', 'A'],
  [21, 'Pul Rune (#21)', 'A'],
  [20, 'Lem Rune (#20)', 'A'],
  [19, 'Fal Rune (#19)', 'B'],
  [18, 'Ko Rune (#18)', 'B'],
  [17, 'Lum Rune (#17)', 'B'],
  [16, 'Io Rune (#16)', 'B'],
  [15, 'Hel Rune (#15)', 'B'],
  [14, 'Dol Rune (#14)', 'C', { endgame: 'HIDE' }],
  [13, 'Shael Rune (#13)', 'B'],
  [12, 'Sol Rune (#12)', 'B'],
  [11, 'Amn Rune (#11)', 'B'],
  [10, 'Thul Rune (#10)', 'C', { endgame: 'HIDE' }],
  [9, 'Ort Rune (#9)', 'C', { endgame: 'HIDE' }],
  [8, 'Ral Rune (#8)', 'B'],
  [7, 'Tal Rune (#7)', 'C', { endgame: 'HIDE' }],
  [6, 'Ith Rune (#6)', 'D', { strict: 'HIDE', endgame: 'HIDE' }],
  [5, 'Eth Rune (#5)', 'D', { strict: 'HIDE', endgame: 'HIDE' }],
  [4, 'Nef Rune (#4)', 'D', { strict: 'HIDE', endgame: 'HIDE' }],
  [3, 'Tir Rune (#3)', 'D', { strict: 'HIDE', endgame: 'HIDE' }],
  [2, 'Eld Rune (#2)', 'D', { strict: 'HIDE', endgame: 'HIDE' }],
  [1, 'El Rune (#1)', 'D', { strict: 'HIDE', endgame: 'HIDE' }]
];

export const MAP_CODES_BY_TIER: Record<number, string[]> = {
  6: ['md6', 'mk6', 'mc6', 'mf6', 'mw6', 'ms6', 'mh6', 'mt6', 'me6', 'mi6', 'xd6', 'xk6', 'xc6', 'xf6', 'xw6', 'xs6', 'xh6', 'xt6', 'xe6', 'xi6'],
  5: ['md5', 'mk5', 'mc5', 'mf5', 'mw5', 'ms5', 'mh5', 'mt5', 'me5', 'mi5', 'xd5', 'xk5', 'xc5', 'xf5', 'xw5', 'xs5', 'xh5', 'xt5', 'xe5', 'xi5'],
  4: ['md4', 'mk4', 'mc4', 'mf4', 'mw4', 'ms4', 'mh4', 'mt4', 'me4', 'mi4', 'xd4', 'xk4', 'xc4', 'xf4', 'xw4', 'xs4', 'xh4', 'xt4', 'xe4', 'xi4'],
  3: ['md3', 'mk3', 'mc3', 'mf3', 'mw3', 'ms3', 'mh3', 'mt3', 'me3', 'mi3', 'xd3', 'xk3', 'xc3', 'xf3', 'xw3', 'xs3', 'xh3', 'xt3', 'xe3', 'xi3'],
  2: ['md2', 'mk2', 'mc2', 'mf2', 'mw2', 'ms2', 'mh2', 'mt2', 'me2', 'mi2', 'xd2', 'xk2', 'xc2', 'xf2', 'xw2', 'xs2', 'xh2', 'xt2', 'xe2', 'xi2'],
  1: ['md1', 'mk1', 'mc1', 'mf1', 'mw1', 'ms1', 'mh1', 'mt1', 'me1', 'mi1', 'xd1', 'xk1', 'xc1', 'xf1', 'xw1', 'xs1', 'xh1', 'xt1', 'xe1', 'xi1']
};

export const DROP_ONLY_UNIQUE_SET_CODES = [
  'cm1', 'cjw', '7gd', '7fb', '7gs', '7wa', 'obb', 'pae', 'paf', 'ned', 'nee', 'bae', 'uul', 'uth',
  'utp', 'upl', 'uhn', 'urs', 'aqv', 'cqv', 'ame', 'amf', 'amb', 'drb', 'drf', '7ar', '7cs', '7wb',
  'hgl', 'ghm', 'ful', 'hbt', 'hbl'
];

export const TIERABLE_ITEMS: readonly TierableItem[] = [
  // 1. Runes
  ...RUNE_NAMES.map(([num, label, defaultTier, strictnessTiers]): TierableItem => {
    const pad = String(num).padStart(2, '0');
    return {
      id: `rune-r${pad}`,
      label,
      subtitle: `r${pad} + s${pad} (Stack)`,
      category: 'runes',
      codes: [`r${pad}`, `s${pad}`],
      defaultTier,
      strictnessTiers
    };
  }),

  // 2. Orbs & Upgrade Materials
  { id: 'curr-ooc-corrupt', label: 'Orb of Corruption', subtitle: 'ka3 + 1ka (Stack)', category: 'currency', codes: ['ka3', '1ka'], defaultTier: 'S' },
  { id: 'curr-ooa-assemblage', label: 'Orb of Assemblage', subtitle: 'ooa + 1oa (Stack)', category: 'currency', codes: ['ooa', '1oa'], defaultTier: 'S' },
  { id: 'curr-gem-cluster', label: 'Gem Cluster', subtitle: '1gc · Mass gem currency', category: 'currency', codes: ['1gc'], defaultTier: 'S' },
  { id: 'curr-chaos-onyx', label: 'Chaos Onyx & Stack', subtitle: 'gmo + 1so (Stack)', category: 'currency', codes: ['gmo', '1so'], defaultTier: 'S' },
  { id: 'curr-oos-socket', label: 'Orb of Socketing', subtitle: 'oos + 1os (Stack)', category: 'currency', codes: ['oos', '1os'], defaultTier: 'A' },
  { id: 'curr-ooi-infusion', label: 'Orb of Infusion', subtitle: 'ooi + 1oi (Stack)', category: 'currency', codes: ['ooi', '1oi'], defaultTier: 'A' },
  { id: 'curr-ooc-conversion', label: 'Orb of Conversion', subtitle: 'ooc + 1oc (Stack)', category: 'currency', codes: ['ooc', '1oc'], defaultTier: 'A' },
  { id: 'curr-ooe-shadows', label: 'Orb of Shadows', subtitle: 'ooe + 1oe (Stack)', category: 'currency', codes: ['ooe', '1oe'], defaultTier: 'A' },
  { id: 'curr-oor-renewal', label: 'Orb of Renewal', subtitle: 'oor + 1or (Stack)', category: 'currency', codes: ['oor', '1or'], defaultTier: 'A' },
  { id: 'curr-toa', label: 'Token of Absolution', subtitle: 'toa · Respec token', category: 'currency', codes: ['toa'], defaultTier: 'A' },
  { id: 'curr-pliers', label: 'Rune & Jewel Pliers', subtitle: 'rup + jwp · Socket removal tools', category: 'currency', codes: ['rup', 'jwp'], defaultTier: 'B' },
  { id: 'curr-storage', label: 'Keychain, Gem Bag & Item Grabber', subtitle: 'kch, bag, stt', category: 'currency', codes: ['kch', 'bag', 'stt'], defaultTier: 'B' },
  { id: 'curr-knowledge-elixir', label: 'Scroll of Knowledge & Elixir', subtitle: '0sc + elx', category: 'currency', codes: ['0sc', 'elx'], defaultTier: 'B' },
  { id: 'curr-grabbers', label: 'Gem & Key Grabbers', subtitle: 'Specialized auto-grabbers', category: 'currency', codes: ['agr', 'tgr', 'sgr', 'egr', 'rgr', 'mgr', 'kgr', 'ogr', 'tkg', 'hkg', 'dkg'], defaultTier: 'C' },

  // 3. Boss Keys, Organs & Endgame Tokens
  { id: 'boss-prime-drops', label: "Mephisto's Animus, Baal's Calamity & Diablo's Ire", subtitle: 'mpa, blc, dia · Pinnacle boss drops', category: 'bosses', codes: ['mpa', 'blc', 'dia'], defaultTier: 'S' },
  { id: 'boss-souls', label: "Treehead Woodfist's & Snapchip Shatter's Souls", subtitle: 'tws, scs · Rare boss souls', category: 'bosses', codes: ['tws', 'scs'], defaultTier: 'S' },
  { id: 'boss-special-keys', label: 'Black Tower Key, Forsaken Token & Standard of Terror', subtitle: 'luv, lab, ttd', category: 'bosses', codes: ['luv', 'lab', 'ttd'], defaultTier: 'S' },
  { id: 'boss-uber-organs', label: "Uber Organs (Diablo's Horn, Baal's Eye, Mephisto's Brain)", subtitle: 'dhn, bey, mbr', category: 'bosses', codes: ['dhn', 'bey', 'mbr'], defaultTier: 'A' },
  { id: 'boss-uber-keys', label: 'Uber Keys (Terror, Hate, Destruction)', subtitle: 'pk1, pk2, pk3', category: 'bosses', codes: ['pk1', 'pk2', 'pk3'], defaultTier: 'A' },
  { id: 'boss-worldstone-shards', label: 'Worldstone Shards (Western, Eastern, Southern, Deep, Northern)', subtitle: 'xa1–xa5', category: 'bosses', codes: ['xa1', 'xa2', 'xa3', 'xa4', 'xa5'], defaultTier: 'A' },
  { id: 'boss-ancients-tokens', label: "Ancients & Worusk Tokens (Talic, Korlic, Madawc, Bul-Kathos, Worusk)", subtitle: 'ua1–ua5', category: 'bosses', codes: ['ua1', 'ua2', 'ua3', 'ua4', 'ua5'], defaultTier: 'A' },
  { id: 'boss-guardian-tokens', label: 'Defender, Protector & Guardian Tokens', subtitle: 'um1–um6', category: 'bosses', codes: ['um1', 'um2', 'um3', 'um4', 'um5', 'um6'], defaultTier: 'A' },
  { id: 'boss-essences', label: 'Boss Essences (Suffering, Hatred, Terror, Destruction)', subtitle: 'tes, ceh, bet, fed', category: 'bosses', codes: ['tes', 'ceh', 'bet', 'fed'], defaultTier: 'B' },
  { id: 'boss-std-heroes', label: 'Standard of Heroes', subtitle: 'std · Trophy token', category: 'bosses', codes: ['std'], defaultTier: 'B' },

  // 4. Maps & Map Currency
  { id: 'map-prism', label: 'Vizjerei Prism', subtitle: 'mrl · High-tier map currency', category: 'maps', codes: ['mrl'], defaultTier: 'S' },
  { id: 'map-astrolabe-sextant', label: 'Horadric Astrolabe & Sextant', subtitle: 'mws, mor · Map crafting currency', category: 'maps', codes: ['mws', 'mor'], defaultTier: 'A' },
  { id: 'map-tier-6', label: 'Tier 6 Endgame Maps (All 10 Arenas)', subtitle: 'Highest tier endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[6], defaultTier: 'S' },
  { id: 'map-tier-5', label: 'Tier 5 Endgame Maps (All 10 Arenas)', subtitle: 'High tier endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[5], defaultTier: 'A' },
  { id: 'map-tier-4', label: 'Tier 4 Endgame Maps (All 10 Arenas)', subtitle: 'Mid-high tier endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[4], defaultTier: 'A' },
  { id: 'map-tier-3', label: 'Tier 3 Endgame Maps (All 10 Arenas)', subtitle: 'Mid tier endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[3], defaultTier: 'B' },
  { id: 'map-tier-2', label: 'Tier 2 Endgame Maps (All 10 Arenas)', subtitle: 'Entry-mid tier endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[2], defaultTier: 'B' },
  { id: 'map-tier-1', label: 'Tier 1 Endgame Maps (All 10 Arenas)', subtitle: 'Starter endgame maps', category: 'maps', codes: MAP_CODES_BY_TIER[1], defaultTier: 'B' },

  // 5. Gems & Gem Stacks (Never hidden by default since the in-game Gem Bag stores all gem types)
  { id: 'gem-stacks-all', label: 'Gem Stacks (Amethyst, Ruby, Sapphire, Emerald, Topaz, Diamond, Skull)', subtitle: '1am, 1rb, 1sa, 1em, 1tp, 1di, 1sk', category: 'gems', codes: ['1am', '1rb', '1sa', '1em', '1tp', '1di', '1sk'], defaultTier: 'B' },
  { id: 'gem-reimagined-unstacked', label: 'Reimagined Unstacked Gems (Amethyst–Skull)', subtitle: 'gmm, gmr, gms, gme, gmt, gmd, gmk', category: 'gems', codes: ['gmm', 'gmr', 'gms', 'gme', 'gmt', 'gmd', 'gmk'], defaultTier: 'B' },
  { id: 'gem-perfect', label: 'Perfect Gems (All 7 Types)', subtitle: 'gpv, gpr, gpb, gpg, gpy, gpw, skz', category: 'gems', codes: ['gpv', 'gpr', 'gpb', 'gpg', 'gpy', 'gpw', 'skz'], defaultTier: 'B' },
  { id: 'gem-flawless', label: 'Flawless Gems (All 7 Types)', subtitle: 'gzv, glr, glb, glg, gly, glw, skl', category: 'gems', codes: ['gzv', 'glr', 'glb', 'glg', 'gly', 'glw', 'skl'], defaultTier: 'C' },
  { id: 'gem-normal', label: 'Standard Gems (All 7 Types)', subtitle: 'gsv, gsr, gsb, gsg, gsy, gsw, sku', category: 'gems', codes: ['gsv', 'gsr', 'gsb', 'gsg', 'gsy', 'gsw', 'sku'], defaultTier: 'C', strictnessTiers: { strict: 'D', endgame: 'D' } },
  { id: 'gem-flawed', label: 'Flawed Gems (All 7 Types)', subtitle: 'gfv, gfr, gfb, gfg, gfy, gfw, skf', category: 'gems', codes: ['gfv', 'gfr', 'gfb', 'gfg', 'gfy', 'gfw', 'skf'], defaultTier: 'D' },

  // 6. Uniques, Sets, Charms & Jewelry
  { id: 'uniq-drop-only', label: 'Drop-Only & Chase Unique / Set Bases', subtitle: '33 pinnacle Reimagined unique/set bases', category: 'uniques', codes: DROP_ONLY_UNIQUE_SET_CODES, rarities: ['unique', 'set'], defaultTier: 'S' },
  { id: 'uniq-pinnacle-charms', label: 'Colossal Jewels, Sunder Charms & Torches', subtitle: 'cjwl, csch, torc · All rarities', category: 'uniques', itemTypes: ['cjwl', 'csch', 'torc'], defaultTier: 'S' },
  { id: 'uniq-jewelry-charms', label: 'Unique & Set Rings, Amulets, Charms & Jewels', subtitle: 'ring, amul, char, jewl, circ', category: 'uniques', itemTypes: ['ring', 'amul', 'char', 'jewl', 'circ'], rarities: ['unique', 'set'], defaultTier: 'S' },
  { id: 'uniq-elite', label: 'Elite Uniques & Sets', subtitle: 'All Elite-tier unique and set equipment', category: 'uniques', tiers: ['elite'], rarities: ['unique', 'set'], defaultTier: 'A' },
  { id: 'uniq-exceptional', label: 'Exceptional Uniques & Sets', subtitle: 'All Exceptional-tier unique and set equipment', category: 'uniques', tiers: ['exceptional'], rarities: ['unique', 'set'], defaultTier: 'B' },
  { id: 'uniq-normal', label: 'Normal-Tier & Other Uniques / Sets', subtitle: 'All remaining unique and set equipment', category: 'uniques', rarities: ['unique', 'set'], defaultTier: 'B', strictnessTiers: { endgame: 'C' } },
  { id: 'charm-small-grand', label: 'Small & Grand Charms (Magic/Rare)', subtitle: 'scha, lcha · Skillers & life/res charms', category: 'uniques', itemTypes: ['scha', 'lcha'], defaultTier: 'B' },
  { id: 'charm-large', label: 'Large Charms (Magic/Rare)', subtitle: 'mcha · Medium charms', category: 'uniques', itemTypes: ['mcha'], defaultTier: 'C', strictnessTiers: { endgame: 'D' } },
  { id: 'jewel-all', label: 'Jewels (Magic/Rare)', subtitle: 'jewl · Crafting & socket jewels', category: 'uniques', itemTypes: ['jewl'], defaultTier: 'B' },
  { id: 'jewelry-rare-crafted', label: 'Rare & Crafted Rings, Amulets & Circlets', subtitle: 'ring, amul, circ (Rare/Crafted)', category: 'uniques', itemTypes: ['ring', 'amul', 'circ'], rarities: ['rare', 'crafted'], defaultTier: 'B' },
  { id: 'jewelry-magic', label: 'Magic Rings, Amulets & Circlets', subtitle: 'ring, amul, circ (Magic)', category: 'uniques', itemTypes: ['ring', 'amul', 'circ'], rarities: ['magic'], defaultTier: 'C', strictnessTiers: { strict: 'D', endgame: 'HIDE' } },

  // 7. Runeword & Crafting Bases (Normal/Superior rarity)
  { id: 'base-monarch-shields', label: 'Monarch, Sacred Targe, Sacred Rondache & Vortex Shield', subtitle: 'uit, pab, pac, paf · Top Spirit/Exile/Phoenix shields', category: 'bases', codes: ['uit', 'pab', 'pac', 'paf'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-elite-body', label: 'Archon Plate, Mage Plate, Dusk Shroud & Sacred Armor', subtitle: 'utp, xtp, uui, uar · Top Enigma/Fortitude/CoH armors', category: 'bases', codes: ['utp', 'xtp', 'uui', 'uar'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-phase-zerker', label: 'Phase Blade, Berserker Axe, Colossus Blade & Sword', subtitle: '7cr, 7wa, 7gd, 7fb · Grief/Beast/Death/BoTD bases', category: 'bases', codes: ['7cr', '7wa', '7gd', '7fb'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-elite-polearms', label: 'Thresher, Giant Thresher, Great Poleaxe & Cryptic Axe', subtitle: '7s8, 7wc, 7h7, 7pa · Infinity/Insight/Pride polearms', category: 'bases', codes: ['7s8', '7wc', '7h7', '7pa'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-diadem-tiara', label: 'Diadem & Tiara (White/Socketed Bases)', subtitle: 'ci3, ci2 · Dream/Flickering Flame/Faith headgear', category: 'bases', codes: ['ci3', 'ci2'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-ama-weapons', label: 'Matriarchal Bow, Grand Matron Bow, Mat. Javelin & Pike', subtitle: 'amb, amc, amf, ame · Elite Amazon bases', category: 'bases', codes: ['amb', 'amc', 'amf', 'ame'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-warlock-grimoires', label: 'Blasphemous Grimoire, Compendium & Occult Codex', subtitle: 'waf, wae, wad · Elite Warlock offhands', category: 'bases', codes: ['waf', 'wae', 'wad'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-sorc-necro', label: 'Dimensional Shard, Vortex Orb, Succubus & Bloodlord Skull', subtitle: 'obf, obe, nee, nef · Elite Sorceress & Necro bases', category: 'bases', codes: ['obf', 'obe', 'nee', 'nef'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-sin-claws', label: 'Runic Talons, Greater Talons, Suwayyah & Feral Claws', subtitle: '7tw, 9tw, 7ar, 7lw · Mosaic/Chaos/Plague claws', category: 'bases', codes: ['7tw', '9tw', '7ar', '7lw'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-druid-barb', label: 'Dream Spirit, Blood Spirit, Conqueror & Guardian Crown', subtitle: 'drf, drb, bae, baf · Elite Druid Pelts & Barb Helms', category: 'bases', codes: ['drf', 'drb', 'bae', 'baf'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-caster-starters', label: 'Crystal Sword, Flail & Paladin Kurast/Zakarum Shields', subtitle: 'crs, fla, pad, pae · CTA/HOTO/Spirit bases', category: 'bases', codes: ['crs', 'fla', 'pad', 'pae'], rarities: ['normal', 'superior'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },

  // 8. Rares, Crafted & Magic Equipment
  { id: 'equip-crafted', label: 'Crafted Equipment (All Slots)', subtitle: 'All crafted weapons, armor, and accessories', category: 'equipment', rarities: ['crafted'], defaultTier: 'A' },
  { id: 'equip-rare-class', label: 'Rare Class-Specific Items (Orbs, Claws, Pelts, Helms, Shields, Heads, Grimoires, Ama)', subtitle: 'Class-specific rare drops', category: 'equipment', itemTypes: ['orb', 'h2h', 'pelt', 'phlm', 'ashd', 'head', 'grim', 'abow', 'ajav', 'aspe'], rarities: ['rare'], defaultTier: 'B' },
  { id: 'equip-rare-gloves-boots-belts', label: 'Rare Gloves, Boots & Belts', subtitle: 'glov, boot, belt · Tri-res boots & 2/20 gloves', category: 'equipment', itemTypes: ['glov', 'boot', 'belt'], rarities: ['rare'], defaultTier: 'B' },
  { id: 'equip-rare-elite', label: 'Rare Elite Weapons & Armor', subtitle: 'All Elite-tier rare gear', category: 'equipment', tiers: ['elite'], rarities: ['rare'], defaultTier: 'C' },
  { id: 'equip-rare-exceptional', label: 'Rare Exceptional Weapons & Armor', subtitle: 'All Exceptional-tier rare gear', category: 'equipment', tiers: ['exceptional'], rarities: ['rare'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'equip-rare-normal', label: 'Rare Normal-Tier Weapons & Armor', subtitle: 'All Normal-tier rare gear', category: 'equipment', tiers: ['normal'], rarities: ['rare'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'equip-magic-class', label: 'Magic Class-Specific Gear (Orbs, Claws, Pelts, Javelins, Grimoires)', subtitle: '+6 skill magic chase items', category: 'equipment', itemTypes: ['orb', 'h2h', 'pelt', 'phlm', 'ashd', 'head', 'grim', 'ajav'], rarities: ['magic'], defaultTier: 'C', strictnessTiers: { strict: 'D', endgame: 'HIDE' } },
  { id: 'equip-magic-elite', label: 'Magic Elite Weapons & Armor', subtitle: 'Ordinary magic elite gear', category: 'equipment', tiers: ['elite'], rarities: ['magic'], defaultTier: 'D', strictnessTiers: { 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },

  // 9. Potions, Scrolls, Quivers & Misc
  { id: 'misc-quest', label: 'Quest Items (Cube, Staff, Khalim, Malus, Scrolls)', subtitle: 'itemType: ques · Protected campaign items', category: 'misc', itemTypes: ['ques'], defaultTier: 'A' },
  { id: 'misc-buff-potions', label: 'Buff & Sunder Potions (MF, XP, Fire/Cold/Light/Poison/Magic/Phys Sunder)', subtitle: 'mfp, xpp, fsp, csp, lsp, psp, msp, php', category: 'misc', codes: ['mfp', 'xpp', 'fsp', 'csp', 'lsp', 'psp', 'msp', 'php'], defaultTier: 'B' },
  { id: 'misc-full-rejuv', label: 'Full Rejuvenation Potions', subtitle: 'rvl · 100% Instant Heal & Mana', category: 'misc', codes: ['rvl'], defaultTier: 'C' },
  { id: 'misc-small-rejuv', label: 'Regular Rejuvenation Potions (35%)', subtitle: 'rvs · Small purple potions', category: 'misc', codes: ['rvs'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-super-pots', label: 'Super Healing & Super Mana Potions (HP5 / MP5)', subtitle: 'hp5, mp5, hpf, mpf', category: 'misc', codes: ['hp5', 'mp5', 'hpf', 'mpf'], defaultTier: 'D', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'misc-greater-pots', label: 'Greater Healing & Greater Mana Potions (HP4 / MP4)', subtitle: 'hp4, mp4', category: 'misc', codes: ['hp4', 'mp4'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-low-pots', label: 'Minor, Light & Standard HP/MP + Utility Potions', subtitle: 'hp1–hp3, mp1–mp3, vps, yps, wms', category: 'misc', codes: ['hp1', 'hp2', 'hp3', 'mp1', 'mp2', 'mp3', 'hpo', 'mpo', 'rps', 'rpl', 'bps', 'bpl', 'vps', 'yps', 'wms'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-magic-quivers', label: 'Magic Bow & Crossbow Quivers', subtitle: 'z01, z02 · Magic arrows and bolts', category: 'misc', codes: ['z01', 'z02'], defaultTier: 'C' },
  { id: 'misc-normal-quivers', label: 'Ordinary Arrows & Bolts', subtitle: 'aqv, cqv (Normal/Superior)', category: 'misc', codes: ['aqv', 'cqv'], rarities: ['inferior', 'normal', 'superior'], defaultTier: 'D', strictnessTiers: { 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-scrolls-tomes', label: 'Town Portal & Identify Scrolls / Tomes', subtitle: 'tsc, isc, tbk, ibk', category: 'misc', codes: ['tsc', 'isc', 'tbk', 'ibk'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-dyes', label: 'Armor Dyes & Dye Remover', subtitle: 'dwd, abd, bdd, ird, ngd, cyd, ryd, hod, drm', category: 'misc', codes: ['dwd', 'abd', 'bdd', 'ird', 'ngd', 'cyd', 'ryd', 'hod', 'drm'], defaultTier: 'C' },
  { id: 'misc-keys-body', label: 'Locked Chest Keys & Monster Body Parts', subtitle: 'key, hrt, brz, jaw, eyz, hrn, tal, flg, fng, qll, sol, scz, spe', category: 'misc', codes: ['key', 'hrt', 'brz', 'jaw', 'eyz', 'hrn', 'tal', 'flg', 'fng', 'qll', 'sol', 'scz', 'spe'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-gold', label: 'Gold Piles (Auto-Pickup Always Active)', subtitle: 'gld · Hiding only suppresses ground text; walk-over pickup still works', category: 'misc', codes: ['gld'], defaultTier: 'D' }
];

export const DEFAULT_BASE_SETTINGS: BaseFilterSettings = {
  requireSocketsOnBases: false,
  minSocketsOnBases: 0,
  highlightEthEliteBases: true,
  highlightSupEliteBases: true,
  show3PlusSocketElite: true,
  show4PlusSocketExceptional: true
};

export const DEFAULT_BUILD_PROFILE: BuildProfile = {
  selectedClass: null,
  archetype: null,
  disabledFamilies: []
};

export interface EquipmentFamilyMetadata {
  id: EquipmentFamilyId;
  name: string;
  subtitle: string;
  group: 'Ranged & Thrown' | 'Melee Weapons' | 'Caster, Shields & Class Gear';
  itemTypes: string[];
  linkedTierableIds?: string[];
}

export const EQUIPMENT_FAMILIES: readonly EquipmentFamilyMetadata[] = [
  // Ranged & Thrown
  {
    id: 'bow-quiver',
    name: 'Bows + Bow Quivers',
    subtitle: 'Bows, Amazon Bows, Arrows & Magic Bow Quivers',
    group: 'Ranged & Thrown',
    itemTypes: ['bow', 'abow', 'bowq', 'mboq'],
    linkedTierableIds: ['misc-magic-quivers', 'misc-normal-quivers']
  },
  {
    id: 'xbow-quiver',
    name: 'Crossbows + Bolts',
    subtitle: 'Crossbows, Bolts & Magic Crossbow Quivers',
    group: 'Ranged & Thrown',
    itemTypes: ['xbow', 'xboq', 'mxbq']
  },
  {
    id: 'javelin',
    name: 'Javelins',
    subtitle: 'Javelins & Amazon Javelins',
    group: 'Ranged & Thrown',
    itemTypes: ['jave', 'ajav']
  },
  {
    id: 'spear',
    name: 'Spears & Pikes',
    subtitle: '2H Spears & Amazon Spears/Pikes',
    group: 'Ranged & Thrown',
    itemTypes: ['spea', 'aspe']
  },
  {
    id: 'throwing',
    name: 'Throwing Knives & Axes',
    subtitle: 'Balanced Knives, Winged Harpoons & Flying Axes',
    group: 'Ranged & Thrown',
    itemTypes: ['tkni', 'taxe']
  },

  // Melee Weapons
  {
    id: 'sword',
    name: 'Swords',
    subtitle: 'Phase Blades, Crystal Swords & Colossus Blades',
    group: 'Melee Weapons',
    itemTypes: ['swor']
  },
  {
    id: 'axe',
    name: 'Axes',
    subtitle: 'Berserker Axes, Ettin Axes & Glorious Axes',
    group: 'Melee Weapons',
    itemTypes: ['axe']
  },
  {
    id: 'mace',
    name: 'Maces, Flails & Hammers',
    subtitle: 'Flails, Scourges, Ogre Mauls & Thunder Mauls',
    group: 'Melee Weapons',
    itemTypes: ['mace', 'hamm']
  },
  {
    id: 'club',
    name: 'Clubs',
    subtitle: 'Clubs, Spiked Clubs, Cudgels, Truncheons & Tyrant Clubs',
    group: 'Melee Weapons',
    itemTypes: ['club']
  },
  {
    id: 'polearm',
    name: 'Polearms (Merc & 2H)',
    subtitle: 'Threshers, Giant Threshers, Cryptic Axes & Great Poleaxes',
    group: 'Melee Weapons',
    itemTypes: ['pole'],
    linkedTierableIds: ['base-elite-polearms']
  },
  {
    id: 'dagger',
    name: 'Daggers & Knives',
    subtitle: 'Bone Knives, Fanged Knives & Poignards',
    group: 'Melee Weapons',
    itemTypes: ['knif']
  },
  {
    id: 'claws',
    name: 'Assassin Claws (Hand-to-Hand)',
    subtitle: 'Runic Talons, Greater Talons, Suwayyahs & Feral Claws',
    group: 'Melee Weapons',
    itemTypes: ['h2h'],
    linkedTierableIds: ['base-sin-claws']
  },

  // Caster, Shields & Class Gear
  {
    id: 'scepter',
    name: 'Scepters',
    subtitle: 'Caduceus, Divine Scepters & War Scepters',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['scep']
  },
  {
    id: 'wand',
    name: 'Wands',
    subtitle: 'Lich Wands, Unearthed Wands & Bone Wands',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['wand']
  },
  {
    id: 'staff',
    name: 'Staves',
    subtitle: 'Archon Staves, Elder Staves & Gnarled Staves',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['staf']
  },
  {
    id: 'sorc-orb',
    name: 'Sorceress Orbs',
    subtitle: 'Dimensional Shards, Vortex Orbs & Eldritch Orbs',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['orb']
  },
  {
    id: 'warlock-grimoire',
    name: 'Warlock Grimoires',
    subtitle: 'Blasphemous Grimoires, Compendiums & Occult Codices',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['grim'],
    linkedTierableIds: ['base-warlock-grimoires']
  },
  {
    id: 'necro-head',
    name: 'Necromancer Shrunken Heads',
    subtitle: 'Succubus Skulls, Bloodlord Skulls & Overseer Skulls',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['head']
  },
  {
    id: 'paladin-shield',
    name: 'Paladin Auric Shields',
    subtitle: 'Sacred Targes, Sacred Rondaches & Vortex Shields',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['ashd']
  },
  {
    id: 'standard-shield',
    name: 'Standard Shields (Monarch, etc.)',
    subtitle: 'Monarchs, Troll Nests, Aegis & Ward Shields',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['shie']
  },
  {
    id: 'barb-helm',
    name: 'Barbarian Primal Helms',
    subtitle: 'Conqueror Crowns, Guardian Crowns &Destroyer Helms',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['phlm']
  },
  {
    id: 'druid-pelt',
    name: 'Druid Pelts',
    subtitle: 'Dream Spirits, Blood Spirits & Earth Spirits',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['pelt']
  }
] as const;

export const ALL_EQUIPMENT_FAMILY_IDS: readonly EquipmentFamilyId[] = EQUIPMENT_FAMILIES.map(f => f.id);

export interface BuildClassMetadata {
  id: BuildClassId;
  name: string;
  subtitle: string;
  defaultArchetype: BuildArchetypeId;
  enabledFamilies: EquipmentFamilyId[];
  promoteBaseIds: string[];
}

export const BUILD_CLASSES: readonly BuildClassMetadata[] = [
  {
    id: 'Amazon',
    name: 'Amazon',
    subtitle: 'Selects Spear, Javelin, Bow + Quiver, Crossbow + Bolt, Shields & Merc Polearms',
    defaultArchetype: 'ranged',
    enabledFamilies: ['bow-quiver', 'xbow-quiver', 'javelin', 'spear', 'standard-shield', 'polearm'],
    promoteBaseIds: ['base-ama-weapons', 'misc-magic-quivers', 'base-diadem-tiara', 'base-monarch-shields', 'base-elite-body']
  },
  {
    id: 'Assassin',
    name: 'Assassin',
    subtitle: 'Selects Claws, Daggers, Swords, Standard Shields & Merc Polearms',
    defaultArchetype: 'melee',
    enabledFamilies: ['claws', 'dagger', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: ['base-sin-claws', 'base-diadem-tiara', 'base-monarch-shields', 'base-elite-body']
  },
  {
    id: 'Barbarian',
    name: 'Barbarian',
    subtitle: 'Selects Swords, Axes, Maces/Hammers, Clubs, Polearms, Spears, Throwing, Shields & Primal Helms',
    defaultArchetype: 'melee',
    enabledFamilies: ['sword', 'axe', 'mace', 'club', 'polearm', 'spear', 'throwing', 'standard-shield', 'barb-helm'],
    promoteBaseIds: ['base-druid-barb', 'base-phase-zerker', 'base-elite-polearms', 'base-monarch-shields', 'base-elite-body']
  },
  {
    id: 'Druid',
    name: 'Druid',
    subtitle: 'Selects Druid Pelts, Clubs, Polearms, Axes, Staves, Swords & Standard Shields',
    defaultArchetype: 'caster',
    enabledFamilies: ['druid-pelt', 'club', 'polearm', 'axe', 'staff', 'sword', 'standard-shield'],
    promoteBaseIds: ['base-druid-barb', 'base-monarch-shields', 'base-elite-polearms', 'base-elite-body']
  },
  {
    id: 'Necromancer',
    name: 'Necromancer',
    subtitle: 'Selects Wands, Shrunken Heads, Daggers, Swords/Flails, Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['wand', 'necro-head', 'dagger', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: ['base-sorc-necro', 'base-monarch-shields', 'base-caster-starters', 'base-elite-body']
  },
  {
    id: 'Paladin',
    name: 'Paladin',
    subtitle: 'Selects Scepters, Paladin Shields, Swords, Maces/Flails, Axes & Merc Polearms',
    defaultArchetype: 'melee',
    enabledFamilies: ['scepter', 'paladin-shield', 'sword', 'mace', 'axe', 'polearm'],
    promoteBaseIds: ['base-monarch-shields', 'base-phase-zerker', 'base-caster-starters', 'base-elite-body']
  },
  {
    id: 'Sorceress',
    name: 'Sorceress',
    subtitle: 'Selects Sorceress Orbs, Staves, Swords/Flails, Standard Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['sorc-orb', 'staff', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: ['base-sorc-necro', 'base-diadem-tiara', 'base-monarch-shields', 'base-elite-polearms', 'base-elite-body']
  },
  {
    id: 'Warlock',
    name: 'Warlock',
    subtitle: 'Selects Warlock Grimoires, Daggers, Staves, Swords/Flails, Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['warlock-grimoire', 'dagger', 'staff', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: ['base-warlock-grimoires', 'base-diadem-tiara', 'base-monarch-shields', 'base-caster-starters', 'base-elite-body']
  }
] as const;

export const BUILD_ARCHETYPES: readonly {
  id: BuildArchetypeId;
  name: string;
  subtitle: string;
  enabledFamilies: EquipmentFamilyId[];
  promoteIds: string[];
}[] = [
  {
    id: 'caster',
    name: 'Caster',
    subtitle: 'Orbs, Grimoires, Wands, Staves, Scepters, Clubs, Daggers, Shrunken Heads, Pelts, Shields, Swords/Flails & Merc Polearms',
    enabledFamilies: [
      'sorc-orb',
      'warlock-grimoire',
      'wand',
      'staff',
      'scepter',
      'club',
      'dagger',
      'necro-head',
      'druid-pelt',
      'paladin-shield',
      'standard-shield',
      'sword',
      'mace',
      'polearm'
    ],
    promoteIds: ['base-monarch-shields', 'base-diadem-tiara', 'base-caster-starters', 'base-elite-polearms', 'base-elite-body']
  },
  {
    id: 'melee',
    name: 'Melee',
    subtitle: 'Swords, Axes, Maces/Hammers, Clubs, Polearms, Spears, Daggers, Claws, Scepters, Shields & Barb/Druid Helms',
    enabledFamilies: [
      'sword',
      'axe',
      'mace',
      'club',
      'polearm',
      'spear',
      'dagger',
      'claws',
      'scepter',
      'paladin-shield',
      'standard-shield',
      'barb-helm',
      'druid-pelt'
    ],
    promoteIds: ['base-phase-zerker', 'base-elite-body', 'base-elite-polearms', 'base-sin-claws', 'base-monarch-shields']
  },
  {
    id: 'ranged',
    name: 'Ranged (Bow / Crossbow / Javelin / Throw)',
    subtitle: 'Bows + Quivers, Crossbows + Bolts, Javelins, Spears, Throwing Weapons, Shields & Merc Polearms',
    enabledFamilies: ['bow-quiver', 'xbow-quiver', 'javelin', 'spear', 'throwing', 'standard-shield', 'polearm'],
    promoteIds: ['base-ama-weapons', 'misc-magic-quivers', 'base-diadem-tiara', 'base-elite-body']
  }
] as const;

export interface CuratedBuildPreset {
  id: string;
  title: string;
  characterClass: BuildClassId;
  archetype: BuildArchetypeId;
  summary: string;
  pinnedBases: Omit<CustomBaseRule, 'id'>[];
}

export const CURATED_BUILD_PRESETS: readonly CuratedBuildPreset[] = [
  {
    id: 'warlock-grimoire-caster',
    title: 'Warlock · Abyssal Grimoire Caster',
    characterClass: 'Warlock',
    archetype: 'caster',
    summary: 'Enables Warlock Grimoire & Caster weapon types and pins Blasphemous Grimoire, Compendium, 4os Monarch, and 3os Archon Plate to Tier S.',
    pinnedBases: [
      { code: 'waf', label: 'Blasphemous Grimoire', tier: 'S', mode: 'runeword' },
      { code: 'wae', label: 'Compendium', tier: 'S', mode: 'runeword' },
      { code: 'uit', label: 'Monarch (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4 },
      { code: 'utp', label: 'Archon Plate (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: 'ci3', label: 'Diadem', tier: 'S', mode: 'unique' }
    ]
  },
  {
    id: 'sorc-elemental-caster',
    title: 'Sorceress · Nova / Elemental Mastery',
    characterClass: 'Sorceress',
    archetype: 'caster',
    summary: 'Enables Sorceress Orb & Caster weapon types and pins Dimensional Shard, Diadem, 4os Ethereal Thresher, and 4os Monarch to Tier S.',
    pinnedBases: [
      { code: 'obf', label: 'Dimensional Shard', tier: 'S', mode: 'runeword' },
      { code: 'ci3', label: 'Diadem', tier: 'S', mode: 'unique' },
      { code: '7s8', label: 'Ethereal Thresher (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4, etherealOnly: true },
      { code: 'uit', label: 'Monarch (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4 }
    ]
  },
  {
    id: 'paladin-foth-hammer',
    title: 'Paladin · FoH / Hammerdin & Smiter',
    characterClass: 'Paladin',
    archetype: 'caster',
    summary: 'Enables Paladin Shields, Scepters & Swords/Flails and pins Sacred Targe, Sacred Rondache, 5os Phase Blade, and 3os Mage Plate to Tier S.',
    pinnedBases: [
      { code: 'pab', label: 'Sacred Targe (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: 'pac', label: 'Sacred Rondache (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: '7cr', label: 'Phase Blade (5+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 5 },
      { code: 'xtp', label: 'Mage Plate (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 }
    ]
  },
  {
    id: 'assassin-mosaic-traps',
    title: 'Assassin · Mosaic Martial Arts & Traps',
    characterClass: 'Assassin',
    archetype: 'melee',
    summary: 'Enables Assassin Claws & Swords/Flails and pins 3os Runic Talons, Greater Talons, Suwayyahs, and 3os Archon Plates to Tier S.',
    pinnedBases: [
      { code: '7tw', label: 'Runic Talons (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: '9tw', label: 'Greater Talons (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: '7ar', label: 'Suwayyah (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 },
      { code: 'utp', label: 'Archon Plate (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 }
    ]
  },
  {
    id: 'amazon-jav-bow',
    title: 'Amazon · Lightning Fury & Faith Bowazon',
    characterClass: 'Amazon',
    archetype: 'ranged',
    summary: 'Enables Spear, Javelin, Bow + Quiver & Crossbow + Bolt and pins Matriarchal Javelin, 4os Grand Matron Bow, and Matriarchal Bow to Tier S.',
    pinnedBases: [
      { code: 'amf', label: 'Matriarchal Javelin', tier: 'S', mode: 'rare' },
      { code: 'amc', label: 'Grand Matron Bow (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4 },
      { code: 'amb', label: 'Matriarchal Bow (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4 },
      { code: 'ci3', label: 'Diadem', tier: 'S', mode: 'unique' }
    ]
  },
  {
    id: 'barb-whirlwind-zerker',
    title: 'Barbarian · Whirlwind & Frenzy Berserker',
    characterClass: 'Barbarian',
    archetype: 'melee',
    summary: 'Enables Melee & Throwing weapon types + Primal Helms and pins 5os Phase Blade, Berserker Axe, Ethereal Colossus Blade, and Conqueror Crown to Tier S.',
    pinnedBases: [
      { code: '7cr', label: 'Phase Blade (5+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 5 },
      { code: '7wa', label: 'Berserker Axe (5+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 5 },
      { code: '7gd', label: 'Ethereal Colossus Blade', tier: 'S', mode: 'runeword', etherealOnly: true },
      { code: 'bae', label: 'Conqueror Crown (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 }
    ]
  },
  {
    id: 'druid-elemental-fury',
    title: 'Druid · Tornado Elemental & Fury Shifter',
    characterClass: 'Druid',
    archetype: 'caster',
    summary: 'Enables Druid Pelts, Polearms, Axes, Staves & Shields and pins Dream Spirit, Blood Spirit, 4os Monarch, and Ethereal Thresher to Tier S.',
    pinnedBases: [
      { code: 'drf', label: 'Dream Spirit', tier: 'S', mode: 'runeword' },
      { code: 'drb', label: 'Blood Spirit', tier: 'S', mode: 'rare' },
      { code: 'uit', label: 'Monarch (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4 },
      { code: '7s8', label: 'Ethereal Thresher (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4, etherealOnly: true }
    ]
  },
  {
    id: 'necro-bone-summoner',
    title: 'Necromancer · Bone Spear, CE & Necromancy',
    characterClass: 'Necromancer',
    archetype: 'caster',
    summary: 'Enables Wands, Shrunken Heads, Daggers & Caster Shields and pins Succubus Skull, Bloodlord Skull, Ethereal Thresher, and 3os Mage Plate to Tier S.',
    pinnedBases: [
      { code: 'nee', label: 'Succubus Skull', tier: 'S', mode: 'runeword' },
      { code: 'nef', label: 'Bloodlord Skull', tier: 'S', mode: 'runeword' },
      { code: '7s8', label: 'Ethereal Thresher (4+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 4, etherealOnly: true },
      { code: 'xtp', label: 'Mage Plate (3+ Sockets)', tier: 'S', mode: 'runeword', minSockets: 3 }
    ]
  }
] as const;

const CLASS_SPECIFIC_BASE_IDS = [
  'base-ama-weapons',
  'base-warlock-grimoires',
  'base-sorc-necro',
  'base-sin-claws',
  'base-druid-barb'
] as const;

export function syncBuildProfileOverrides(config: V2Config): void {
  const profile = config.buildProfile;
  const disabledSet = new Set<EquipmentFamilyId>(profile.disabledFamilies ?? []);
  const enabledSet = new Set<EquipmentFamilyId>(
    ALL_EQUIPMENT_FAMILY_IDS.filter(id => !disabledSet.has(id))
  );

  const nextOverrides = { ...config.itemOverrides };
  for (const baseId of [
    ...CLASS_SPECIFIC_BASE_IDS,
    'base-monarch-shields',
    'base-elite-body',
    'base-phase-zerker',
    'base-elite-polearms',
    'base-diadem-tiara',
    'base-caster-starters',
    'misc-magic-quivers',
    'misc-normal-quivers'
  ]) {
    delete nextOverrides[baseId];
  }

  // If everything is enabled and no class/archetype is selected, leave defaults
  if (!profile.selectedClass && !profile.archetype && disabledSet.size === 0) {
    config.itemOverrides = nextOverrides;
    return;
  }

  // Promote bases for selected class or archetype
  const promoted = new Set<string>();
  if (profile.selectedClass) {
    const cls = BUILD_CLASSES.find(c => c.id === profile.selectedClass);
    if (cls) {
      for (const id of cls.promoteBaseIds) promoted.add(id);
    }
  }
  if (profile.archetype) {
    const arch = BUILD_ARCHETYPES.find(a => a.id === profile.archetype);
    if (arch) {
      for (const id of arch.promoteIds) promoted.add(id);
    }
  }
  for (const id of promoted) {
    nextOverrides[id] = 'A';
  }

  // Hide curated base groups whose underlying equipment families are all disabled
  if (!enabledSet.has('bow-quiver') && !enabledSet.has('javelin') && !enabledSet.has('spear')) {
    nextOverrides['base-ama-weapons'] = 'HIDE';
  }
  if (!enabledSet.has('bow-quiver') && !enabledSet.has('xbow-quiver')) {
    nextOverrides['misc-magic-quivers'] = 'HIDE';
    nextOverrides['misc-normal-quivers'] = 'HIDE';
  }
  if (!enabledSet.has('warlock-grimoire')) {
    nextOverrides['base-warlock-grimoires'] = 'HIDE';
  }
  if (!enabledSet.has('sorc-orb') && !enabledSet.has('necro-head')) {
    nextOverrides['base-sorc-necro'] = 'HIDE';
  }
  if (!enabledSet.has('claws')) {
    nextOverrides['base-sin-claws'] = 'HIDE';
  }
  if (!enabledSet.has('druid-pelt') && !enabledSet.has('barb-helm')) {
    nextOverrides['base-druid-barb'] = 'HIDE';
  }
  if (!enabledSet.has('sword') && !enabledSet.has('axe')) {
    nextOverrides['base-phase-zerker'] = 'HIDE';
  }
  if (!enabledSet.has('polearm')) {
    nextOverrides['base-elite-polearms'] = 'HIDE';
  }
  if (!enabledSet.has('standard-shield') && !enabledSet.has('paladin-shield')) {
    nextOverrides['base-monarch-shields'] = 'HIDE';
  }

  config.itemOverrides = nextOverrides;
}

export function selectClassForBuild(config: V2Config, clsId: BuildClassId | null): void {
  if (!clsId) {
    config.buildProfile = {
      selectedClass: null,
      archetype: null,
      disabledFamilies: [],
      presetId: undefined,
      linkedBuildId: undefined,
      linkedBuildTitle: undefined
    };
    syncBuildProfileOverrides(config);
    return;
  }
  const cls = BUILD_CLASSES.find(c => c.id === clsId);
  if (!cls) return;
  const enabled = new Set<EquipmentFamilyId>(cls.enabledFamilies);
  const disabled = ALL_EQUIPMENT_FAMILY_IDS.filter(id => !enabled.has(id));
  config.buildProfile = {
    selectedClass: cls.id,
    archetype: cls.defaultArchetype,
    disabledFamilies: disabled,
    presetId: undefined,
    linkedBuildId: undefined,
    linkedBuildTitle: undefined
  };
  syncBuildProfileOverrides(config);
}

export function selectArchetypeForBuild(config: V2Config, archId: BuildArchetypeId | null): void {
  if (!archId) {
    config.buildProfile = {
      ...config.buildProfile,
      archetype: null,
      disabledFamilies: [],
      presetId: undefined
    };
    syncBuildProfileOverrides(config);
    return;
  }
  const arch = BUILD_ARCHETYPES.find(a => a.id === archId);
  if (!arch) return;
  const enabled = new Set<EquipmentFamilyId>(arch.enabledFamilies);
  const disabled = ALL_EQUIPMENT_FAMILY_IDS.filter(id => !enabled.has(id));
  config.buildProfile = {
    selectedClass: null,
    archetype: arch.id,
    disabledFamilies: disabled,
    presetId: undefined,
    linkedBuildId: undefined,
    linkedBuildTitle: undefined
  };
  syncBuildProfileOverrides(config);
}

export function toggleEquipmentFamily(config: V2Config, familyId: EquipmentFamilyId): void {
  const currentDisabled = new Set<EquipmentFamilyId>(config.buildProfile.disabledFamilies ?? []);
  if (currentDisabled.has(familyId)) {
    currentDisabled.delete(familyId);
  } else {
    currentDisabled.add(familyId);
  }
  config.buildProfile = {
    ...config.buildProfile,
    disabledFamilies: ALL_EQUIPMENT_FAMILY_IDS.filter(id => currentDisabled.has(id))
  };
  syncBuildProfileOverrides(config);
}

export function applyBuildCuration(config: V2Config, profile: BuildProfile): void {
  config.buildProfile = {
    selectedClass: profile.selectedClass ?? null,
    archetype: profile.archetype ?? null,
    disabledFamilies: [...(profile.disabledFamilies ?? [])],
    presetId: profile.presetId,
    linkedBuildId: profile.linkedBuildId,
    linkedBuildTitle: profile.linkedBuildTitle
  };
  syncBuildProfileOverrides(config);
}

export function applyCuratedBuildPreset(config: V2Config, presetId: string): CuratedBuildPreset | null {
  const preset = CURATED_BUILD_PRESETS.find(p => p.id === presetId);
  if (!preset) return null;

  selectClassForBuild(config, preset.characterClass);
  config.buildProfile = {
    ...config.buildProfile,
    archetype: preset.archetype,
    presetId: preset.id,
    linkedBuildId: undefined,
    linkedBuildTitle: preset.title
  };
  syncBuildProfileOverrides(config);

  // Remove prior preset-pinned bases and add the preset's chase bases
  const existingNonBuild = config.customBases.filter(cb => !cb.id.startsWith('build-'));
  const added: CustomBaseRule[] = preset.pinnedBases.map((pb, i) => ({
    ...pb,
    id: `build-${preset.id}-${i}`
  }));
  config.customBases = [...added, ...existingNonBuild];
  return preset;
}

export interface SiteBuildSnapshotItem {
  code: string;
  baseName?: string | null;
  quality?: string | null;
  sockets?: number;
  isRuneword?: boolean;
}

const GENERIC_BASE_WORDS = new Set([
  'dagger',
  'sword',
  'spear',
  'staff',
  'crown',
  'blade',
  'armor',
  'shield',
  'gloves',
  'boots',
  'arrows',
  'bolts',
  'quiver',
  'amulet',
  'jewel',
  'javelin',
  'crossbow',
  'scepter',
  'hammer',
  'halberd',
  'scimitar',
  'buckler',
  'circlet',
  'coronet'
]);

function enableFamiliesForCode(config: V2Config, catalog: Catalog, code: string): void {
  const disabled = new Set<EquipmentFamilyId>(config.buildProfile.disabledFamilies ?? []);
  let changed = false;
  for (const fam of EQUIPMENT_FAMILIES) {
    const matches = fam.itemTypes.some(t => catalog.itemTypeMap.get(t)?.has(code));
    if (matches && disabled.has(fam.id)) {
      disabled.delete(fam.id);
      changed = true;
    }
  }
  if (changed) {
    config.buildProfile.disabledFamilies = ALL_EQUIPMENT_FAMILY_IDS.filter(id => disabled.has(id));
  }
}

export function applySiteBuildToConfig(
  config: V2Config,
  siteBuild: {
    id?: string;
    title: string;
    characterClass?: string;
    itemKeys: { catalog: string; key: string; name?: string }[];
    snapshotItems?: SiteBuildSnapshotItem[];
    proseText?: string;
  },
  catalog: Catalog
): { pinnedCount: number; matchedLabels: string[] } {
  const matchedClass = BUILD_CLASSES.find(
    c => c.id.toLocaleLowerCase() === (siteBuild.characterClass ?? '').trim().toLocaleLowerCase()
  )?.id;

  selectClassForBuild(config, matchedClass ?? null);
  config.buildProfile = {
    ...config.buildProfile,
    presetId: undefined,
    linkedBuildId: siteBuild.id,
    linkedBuildTitle: siteBuild.title
  };

  const existingNonBuild = config.customBases.filter(cb => !cb.id.startsWith('build-'));
  const pinned: CustomBaseRule[] = [];
  const seenKey = new Set<string>();
  const matchedLabels: string[] = [];

  const pinItem = (
    code: string | undefined,
    label: string,
    mode: CustomBaseRule['mode'],
    minSockets?: number
  ) => {
    if (!code || !catalog.baseItems.some(b => b.code === code)) return;
    const dedupeKey = `${mode}:${code}`;
    if (seenKey.has(dedupeKey)) return;
    seenKey.add(dedupeKey);
    pinned.push({
      id: `build-${mode[0]}-${code}`,
      code,
      label,
      tier: 'S',
      mode,
      minSockets: mode === 'runeword' && minSockets && minSockets > 1 ? minSockets : undefined
    });
    matchedLabels.push(label);
    enableFamiliesForCode(config, catalog, code);
  };

  // Combine explicit itemKeys with any inline [[item:catalog:key]] markdown links in proseText
  const allRefs = [...siteBuild.itemKeys];
  if (siteBuild.proseText) {
    const inlineRegex = /\[\[item:(uniques|sets|runewords|bases|cube-recipes):([^\]\n]{1,160})\]\]/gi;
    for (const match of siteBuild.proseText.matchAll(inlineRegex)) {
      allRefs.push({ catalog: match[1].toLocaleLowerCase(), key: match[2].trim() });
    }
  }

  for (const ref of allRefs) {
    const q = (ref.key || ref.name || '').trim().toLocaleLowerCase();
    if (!q) continue;

    if (ref.catalog === 'uniques') {
      const u = catalog.uniqueItems.find(
        x => x.name.toLocaleLowerCase() === q || (ref.name && x.name.toLocaleLowerCase() === ref.name.toLocaleLowerCase())
      );
      if (u?.baseCode) {
        pinItem(u.baseCode, `${u.name} (${u.baseName || u.baseCode})`, 'unique');
      }
    } else if (ref.catalog === 'sets') {
      // Match either an individual set piece OR a full Set prefix (e.g. "Immortal King" -> "Immortal King's ...")
      const matchingSets = catalog.setItems.filter(x => {
        const lower = x.name.toLocaleLowerCase();
        return (
          lower === q ||
          (ref.name && lower === ref.name.toLocaleLowerCase()) ||
          lower.startsWith(`${q}'s `) ||
          lower.startsWith(`${q}’s `) ||
          lower.startsWith(`${q} `)
        );
      });
      for (const s of matchingSets) {
        if (s.baseCode) {
          pinItem(s.baseCode, `${s.name} (${s.baseName || s.baseCode})`, 'set');
        }
      }
    } else if (ref.catalog === 'bases') {
      const b = catalog.baseItems.find(
        x =>
          x.code?.toLocaleLowerCase() === q ||
          x.name.toLocaleLowerCase() === q ||
          (x.displayName && x.displayName.toLocaleLowerCase() === q)
      );
      if (b?.code) {
        pinItem(b.code, b.displayName || b.name || b.code, 'runeword');
      }
    }
  }

  // Extract equipped items from attached Character / Mercenary Save Snapshots
  for (const snap of siteBuild.snapshotItems ?? []) {
    const code = snap.code?.trim();
    if (!code) continue;
    const baseItem = catalog.baseItems.find(b => b.code === code);
    if (!baseItem || baseItem.kind === 'misc') continue;
    const baseLabel = baseItem.displayName || baseItem.name || snap.baseName || code;
    const qual = (snap.quality ?? '').toLocaleLowerCase();

    if (snap.isRuneword || ((qual === 'normal' || qual === 'superior') && (snap.sockets ?? 0) >= 2)) {
      pinItem(code, `${baseLabel} (Runeword Base)`, 'runeword', snap.sockets);
    } else if (qual === 'unique') {
      pinItem(code, `${baseLabel} (Unique)`, 'unique');
    } else if (qual === 'set') {
      pinItem(code, `${baseLabel} (Set)`, 'set');
    } else if (qual === 'rare' || qual === 'crafted') {
      pinItem(code, `${baseLabel} (Rare)`, 'rare');
    } else {
      enableFamiliesForCode(config, catalog, code);
    }
  }

  // Scan plain-text guide prose for Unique names, Set names, and specific Base item names
  if (siteBuild.proseText && siteBuild.proseText.trim().length > 0) {
    const lowerProse = siteBuild.proseText.toLocaleLowerCase();
    const hasPhrase = (phrase: string) => {
      if (phrase.length < 5) return false;
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(lowerProse);
    };

    for (const u of catalog.uniqueItems) {
      const nameLower = u.name.toLocaleLowerCase();
      if (u.baseCode && nameLower.length >= 6 && !GENERIC_BASE_WORDS.has(nameLower) && hasPhrase(nameLower)) {
        pinItem(u.baseCode, `${u.name} (${u.baseName || u.baseCode})`, 'unique');
      }
    }

    for (const s of catalog.setItems) {
      const nameLower = s.name.toLocaleLowerCase();
      if (s.baseCode && nameLower.length >= 6 && hasPhrase(nameLower)) {
        pinItem(s.baseCode, `${s.name} (${s.baseName || s.baseCode})`, 'set');
      }
    }

    for (const b of catalog.baseItems) {
      if (!b.code || b.kind === 'misc') continue;
      const label = (b.displayName || b.name || '').trim();
      const labelLower = label.toLocaleLowerCase();
      if (labelLower.length >= 6 && !GENERIC_BASE_WORDS.has(labelLower) && hasPhrase(labelLower)) {
        pinItem(b.code, label, 'runeword');
      }
    }
  }

  syncBuildProfileOverrides(config);
  config.customBases = [...pinned, ...existingNonBuild];
  return { pinnedCount: pinned.length, matchedLabels };
}

export function createDefaultV2Config(strictness: StrictnessId = 'semi-strict', theme: ThemeId = 'reimagined'): V2Config {
  return {
    version: 2,
    strictness,
    theme,
    itemOverrides: {},
    tierStyleOverrides: {},
    categoryTierStyleOverrides: {},
    customBases: [],
    baseSettings: { ...DEFAULT_BASE_SETTINGS },
    buildProfile: { ...DEFAULT_BUILD_PROFILE, disabledFamilies: [] },
    customPriorityRules: []
  };
}

export function effectiveItemTier(item: TierableItem, config: V2Config): TierRank {
  const override = config.itemOverrides[item.id];
  if (override) return override;
  const strictTier = item.strictnessTiers?.[config.strictness];
  return strictTier ?? item.defaultTier;
}

export function isItemOverridden(item: TierableItem, config: V2Config): boolean {
  return config.itemOverrides[item.id] !== undefined;
}

export function effectiveTierStyle(
  tier: Exclude<TierRank, 'HIDE'>,
  config: V2Config,
  category?: CategoryId
): TierStyle {
  const base = THEME_PRESETS[config.theme]?.tiers[tier] ?? THEME_PRESETS.reimagined.tiers[tier];
  const globalOverride = config.tierStyleOverrides[tier] ?? {};
  const catOverride = (category && config.categoryTierStyleOverrides[category]?.[tier]) ?? {};
  return {
    ...base,
    ...globalOverride,
    ...catOverride
  };
}

function chunkArray<T>(items: T[], maxLen = 64): T[][] {
  if (items.length <= maxLen) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += maxLen) {
    out.push(items.slice(i, i + maxLen));
  }
  return out;
}

function applyStyleToBlock(block: RuleBlock, style: TierStyle, includeNamePrefix = false) {
  const tooltip: NonNullable<RuleBlock['tooltip']> = {};
  if (style.backgroundColor) tooltip.backgroundColor = style.backgroundColor;
  if (style.borderColor) tooltip.borderColor = style.borderColor;
  if (style.textColor) tooltip.textColor = style.textColor;
  if (Object.keys(tooltip).length > 0) block.tooltip = tooltip;
  if (style.dropSound) block.dropSound = style.dropSound;
  if (style.minimapIcon) {
    block.minimapIcon = {
      shape: style.minimapIcon.shape,
      size: style.minimapIcon.size,
      borderColor: style.minimapIcon.borderColor,
      fillColor: style.minimapIcon.fillColor
    };
  }
  if (includeNamePrefix && style.namePrefix && style.namePrefix.trim()) {
    const clean = style.namePrefix.replace(/[^\x20-\x7E\n]/g, '').trim().slice(0, 55);
    if (clean) block.name = clean;
  }
}

const V2_STATE_PREFIX = 'Keep everything else visible [PyreV2:';

function encodeBase64Utf8(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

interface CompactV2Diff {
  s: StrictnessId;
  t: ThemeId;
  io?: Record<string, TierRank>;
  tso?: V2Config['tierStyleOverrides'];
  ctso?: V2Config['categoryTierStyleOverrides'];
  cb?: CustomBaseRule[];
  bs?: Partial<BaseFilterSettings>;
  bp?: BuildProfile;
}

export function serializeV2StateTag(config: V2Config): string {
  const diff: CompactV2Diff = {
    s: config.strictness,
    t: config.theme
  };
  if (Object.keys(config.itemOverrides).length > 0) diff.io = config.itemOverrides;
  if (Object.keys(config.tierStyleOverrides).length > 0) diff.tso = config.tierStyleOverrides;
  if (Object.keys(config.categoryTierStyleOverrides).length > 0) diff.ctso = config.categoryTierStyleOverrides;
  if (config.customBases.length > 0) diff.cb = config.customBases;
  const bsDiff: Partial<BaseFilterSettings> = {};
  for (const k of Object.keys(DEFAULT_BASE_SETTINGS) as (keyof BaseFilterSettings)[]) {
    if (config.baseSettings[k] !== DEFAULT_BASE_SETTINGS[k]) {
      (bsDiff as any)[k] = config.baseSettings[k];
    }
  }
  if (Object.keys(bsDiff).length > 0) diff.bs = bsDiff;
  if (
    config.buildProfile &&
    (config.buildProfile.selectedClass ||
      config.buildProfile.archetype ||
      (config.buildProfile.disabledFamilies && config.buildProfile.disabledFamilies.length > 0) ||
      config.buildProfile.presetId ||
      config.buildProfile.linkedBuildId)
  ) {
    diff.bp = config.buildProfile;
  }
  return `${V2_STATE_PREFIX}${encodeBase64Utf8(JSON.stringify(diff))}]`;
}

export function extractV2ConfigFromFilter(filter: Filter): V2Config | null {
  if (!filter || !Array.isArray(filter.rules)) return null;
  for (let i = filter.rules.length - 1; i >= 0; i--) {
    const rule = filter.rules[i];
    const block = rule?.show ?? rule?.hide;
    const rn = block?.ruleName;
    if (typeof rn === 'string' && rn.startsWith(V2_STATE_PREFIX) && rn.endsWith(']')) {
      try {
        const b64 = rn.slice(V2_STATE_PREFIX.length, -1);
        const parsed = JSON.parse(decodeBase64Utf8(b64)) as CompactV2Diff;
        const customPriorityRules: Rule[] = [];
        for (const r of filter.rules) {
          const b = r?.show ?? r?.hide;
          if (b?.ruleName?.startsWith('[Custom] ')) {
            const copy = M.clone(r) as Rule;
            const cb = blockOf(copy);
            cb.ruleName = cb.ruleName!.slice('[Custom] '.length);
            customPriorityRules.push(copy);
          }
        }
        return {
          version: 2,
          strictness: parsed.s || 'semi-strict',
          theme: parsed.t || 'reimagined',
          itemOverrides: parsed.io ?? {},
          tierStyleOverrides: parsed.tso ?? {},
          categoryTierStyleOverrides: parsed.ctso ?? {},
          customBases: parsed.cb ?? [],
          baseSettings: { ...DEFAULT_BASE_SETTINGS, ...(parsed.bs ?? {}) },
          buildProfile: parsed.bp
            ? {
                ...DEFAULT_BUILD_PROFILE,
                ...parsed.bp,
                disabledFamilies: Array.isArray(parsed.bp.disabledFamilies) ? parsed.bp.disabledFamilies : []
              }
            : { ...DEFAULT_BUILD_PROFILE, disabledFamilies: [] },
          customPriorityRules
        };
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function compileV2Filter(config: V2Config): Filter {
  const rules: Rule[] = [];

  // 0. User's Custom Priority Rules (from Advanced tab)
  for (const custom of config.customPriorityRules) {
    const copy = M.clone(custom) as Rule;
    const b = blockOf(copy);
    const baseLabel = (b.ruleName || 'Custom rule').replace(/^\[Custom\]\s*/, '');
    b.ruleName = `[Custom] ${baseLabel}`.slice(0, 120);
    rules.push(copy);
  }

  // 0.5 Build Curation: Promote Selected Class Rare & Magic Class-Specific Gear
  if (config.buildProfile?.selectedClass) {
    const cls = BUILD_CLASSES.find(c => c.id === config.buildProfile.selectedClass);
    const disabledSet = new Set<EquipmentFamilyId>(config.buildProfile.disabledFamilies ?? []);
    const classSpecificFamilyIds: EquipmentFamilyId[] = [
      'bow-quiver',
      'xbow-quiver',
      'javelin',
      'spear',
      'claws',
      'barb-helm',
      'druid-pelt',
      'necro-head',
      'paladin-shield',
      'sorc-orb',
      'warlock-grimoire'
    ];
    const activeClassFamilies = EQUIPMENT_FAMILIES.filter(
      f =>
        classSpecificFamilyIds.includes(f.id) &&
        cls?.enabledFamilies.includes(f.id) &&
        !disabledSet.has(f.id)
    );
    const selectedItemTypes = [...new Set(activeClassFamilies.flatMap(f => f.itemTypes))];
    if (selectedItemTypes.length > 0) {
      const rareBlock: RuleBlock = {
        ruleName: `Build Curation (${config.buildProfile.selectedClass}) · Tier A Rare Class & Weapon Gear`,
        conditions: {
          itemType: selectedItemTypes.length === 1 ? selectedItemTypes[0] : selectedItemTypes,
          rarity: 'rare'
        }
      };
      applyStyleToBlock(rareBlock, effectiveTierStyle('A', config, 'equipment'), false);
      rules.push({ show: rareBlock });

      const magicBlock: RuleBlock = {
        ruleName: `Build Curation (${config.buildProfile.selectedClass}) · Tier B Magic Class & Weapon Gear`,
        conditions: {
          itemType: selectedItemTypes.length === 1 ? selectedItemTypes[0] : selectedItemTypes,
          rarity: 'magic'
        }
      };
      applyStyleToBlock(magicBlock, effectiveTierStyle('B', config, 'equipment'), false);
      rules.push({ show: magicBlock });
    }
  }

  // 1. Custom Base Overrides (Unique / Set / Rare / Runeword bases added by user)
  for (const cb of config.customBases) {
    const conditions: Conditions = { code: cb.code };
    if (cb.mode === 'unique') conditions.rarity = 'unique';
    else if (cb.mode === 'set') conditions.rarity = 'set';
    else if (cb.mode === 'rare') conditions.rarity = 'rare';
    else {
      conditions.rarity = ['normal', 'superior'];
      if (cb.minSockets && cb.minSockets > 0) conditions.sockets = { gte: cb.minSockets };
      if (cb.etherealOnly) conditions.ethereal = true;
    }
    const ruleTitle = `[Base] ${cb.label} (${cb.mode === 'runeword' ? 'Runeword Base' : cb.mode}) · ${cb.tier === 'HIDE' ? 'Hide' : `Tier ${cb.tier}`}`;
    if (cb.tier === 'HIDE') {
      rules.push({ hide: { ruleName: ruleTitle, conditions } });
    } else {
      const block: RuleBlock = { ruleName: ruleTitle, conditions };
      const cat: CategoryId = cb.mode === 'runeword' ? 'bases' : cb.mode === 'rare' ? 'equipment' : 'uniques';
      applyStyleToBlock(block, effectiveTierStyle(cb.tier, config, cat), false);
      rules.push({ show: block });
    }
  }

  // Helper to emit rules for a category, merging pure-code items of the same tier into compact rules
  const emitCategoryRules = (categoryId: CategoryId, categoryTitle: string) => {
    const catItems = TIERABLE_ITEMS.filter(item => item.category === categoryId);
    const pureCodeBuckets = new Map<TierRank, { codes: string[]; labels: string[] }>();
    const complexItems: { item: TierableItem; tier: TierRank }[] = [];

    for (const item of catItems) {
      const tier = effectiveItemTier(item, config);
      const isPureCode =
        item.codes &&
        item.codes.length > 0 &&
        !item.baseNames &&
        !item.itemTypes &&
        !item.rarities &&
        !item.tiers &&
        !item.sockets &&
        item.ethereal === undefined;

      if (isPureCode) {
        const bucket = pureCodeBuckets.get(tier) ?? { codes: [], labels: [] };
        bucket.codes.push(...item.codes!);
        bucket.labels.push(item.label.replace(/\s*\(.*?\)\s*/g, ''));
        pureCodeBuckets.set(tier, bucket);
      } else {
        complexItems.push({ item, tier });
      }
    }

    // Emit pure-code buckets in tier order: S -> A -> B -> C -> D -> HIDE
    for (const rank of ['S', 'A', 'B', 'C', 'D', 'HIDE'] as TierRank[]) {
      const bucket = pureCodeBuckets.get(rank);
      if (!bucket || bucket.codes.length === 0) continue;
      const uniqueCodes = [...new Set(bucket.codes)];
      const chunks = chunkArray(uniqueCodes, 64);
      chunks.forEach((chunk, idx) => {
        const previewNames = bucket.labels.slice(0, 3).join(', ') + (bucket.labels.length > 3 ? ` +${bucket.labels.length - 3}` : '');
        const partSuffix = chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : '';
        const ruleName = `${categoryTitle} · ${rank === 'HIDE' ? 'Hide' : `Tier ${rank}`}: ${previewNames}${partSuffix}`;
        const conditions: Conditions = { code: chunk.length === 1 ? chunk[0] : chunk };
        if (rank === 'HIDE') {
          rules.push({ hide: { ruleName, conditions } });
        } else {
          const block: RuleBlock = { ruleName, conditions };
          applyStyleToBlock(block, effectiveTierStyle(rank, config, categoryId), false);
          rules.push({ show: block });
        }
      });
    }

    // Emit complex condition items in their defined priority order
    for (const { item, tier } of complexItems) {
      const conditions: Conditions = {};
      if (item.codes?.length) conditions.code = item.codes.length === 1 ? item.codes[0] : item.codes.slice(0, 64);
      if (item.baseNames?.length) conditions.baseName = item.baseNames.length === 1 ? item.baseNames[0] : item.baseNames.slice(0, 64);
      if (item.itemTypes?.length) conditions.itemType = item.itemTypes.length === 1 ? item.itemTypes[0] : item.itemTypes.slice(0, 64);
      if (item.rarities?.length) conditions.rarity = item.rarities.length === 1 ? item.rarities[0] : item.rarities;
      if (item.tiers?.length) conditions.tier = item.tiers.length === 1 ? item.tiers[0] : item.tiers;
      if (item.sockets) conditions.sockets = { ...item.sockets };
      if (item.ethereal !== undefined) conditions.ethereal = item.ethereal;

      if (categoryId === 'bases') {
        if (config.baseSettings.requireSocketsOnBases && config.baseSettings.minSocketsOnBases > 0 && !conditions.sockets) {
          conditions.sockets = { gte: config.baseSettings.minSocketsOnBases };
        }
      }

      const ruleName = `${categoryTitle} · ${ tier === 'HIDE' ? 'Hide' : `Tier ${tier}` }: ${item.label}`;
      if (tier === 'HIDE') {
        rules.push({ hide: { ruleName, conditions } });
      } else {
        const block: RuleBlock = { ruleName, conditions };
        applyStyleToBlock(block, effectiveTierStyle(tier, config, categoryId), false);
        rules.push({ show: block });
      }
    }
  };

  // Emit categories in safe precedence order:
  // 1. Uniques, Sets, Charms & Jewelry (protects Drop-Only bases, Uniques, Sets, Charms, Jewels, Rings/Amulets/Circlets first)
  emitCategoryRules('uniques', 'Uniques & Charms');
  // 2. Boss Keys, Organs & Tokens (before general `ques` rule so Uber Keys/Organs/Essences get their S/A tier alert!)
  emitCategoryRules('bosses', 'Boss & Endgame');
  // 3. Orbs & Upgrade Materials
  emitCategoryRules('currency', 'Currency & Orbs');
  // 4. Runes & Rune Stacks
  emitCategoryRules('runes', 'Runes');
  // 5. Maps & Map Currency
  emitCategoryRules('maps', 'Maps');
  // 6. Gems & Gem Stacks
  emitCategoryRules('gems', 'Gems');
  // 7. Potions, Scrolls, Quest & Misc (protects `ques` weapons like Wirt's Leg / Horadric Staff before weapon/base hiding!)
  emitCategoryRules('misc', 'Misc & Potions');

  // 7.5 Build & Archetype Filter: Hide disabled Weapon, Offhand, Quiver & Class-Specific Item Types (Non-Unique/Non-Set)
  if (config.buildProfile?.disabledFamilies && config.buildProfile.disabledFamilies.length > 0) {
    const disabledSet = new Set<EquipmentFamilyId>(config.buildProfile.disabledFamilies);
    const disabledFamilies = EQUIPMENT_FAMILIES.filter(f => disabledSet.has(f.id));
    const disabledItemTypes = [...new Set(disabledFamilies.flatMap(f => f.itemTypes))];
    if (disabledItemTypes.length > 0) {
      const previewLabels =
        disabledFamilies.slice(0, 3).map(f => f.name).join(', ') +
        (disabledFamilies.length > 3 ? ` +${disabledFamilies.length - 3}` : '');
      rules.push({
        hide: {
          ruleName: `Build Curation · Hide Disabled Weapon & Class Types (${previewLabels})`,
          conditions: {
            itemType: disabledItemTypes.length === 1 ? disabledItemTypes[0] : disabledItemTypes,
            rarity: ['inferior', 'normal', 'superior', 'magic', 'rare']
          }
        }
      });
    }
  }

  // 8. Rares, Crafted & Magic Equipment
  emitCategoryRules('equipment', 'Equipment');
  // 9. Runeword & Crafting Bases
  emitCategoryRules('bases', 'Runeword Bases');

  // General Base Settings Rules (Ethereal Elite, Superior Elite, Socketed Elite/Exceptional)
  if (config.baseSettings.highlightEthEliteBases) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · Ethereal Elite Equipment',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: ['normal', 'superior'], ethereal: true }
    };
    applyStyleToBlock(block, effectiveTierStyle('B', config, 'bases'), false);
    rules.push({ show: block });
  }
  if (config.baseSettings.highlightSupEliteBases) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · Superior Elite Equipment',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: 'superior', sockets: { gte: 3 } }
    };
    applyStyleToBlock(block, effectiveTierStyle('B', config, 'bases'), false);
    rules.push({ show: block });
  }
  if (config.baseSettings.show3PlusSocketElite) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · 3+ Socket Elite Bases',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: ['normal', 'superior'], sockets: { gte: 3 } }
    };
    applyStyleToBlock(block, effectiveTierStyle('C', config, 'bases'), false);
    rules.push({ show: block });
  }
  if (config.baseSettings.show4PlusSocketExceptional && config.strictness !== 'endgame') {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · 4+ Socket Exceptional Bases',
      conditions: { itemType: ['weap', 'armo'], tier: 'exceptional', rarity: ['normal', 'superior'], sockets: { gte: 4 } }
    };
    applyStyleToBlock(block, effectiveTierStyle('D', config, 'bases'), false);
    rules.push({ show: block });
  }
  if (config.strictness === 'soft' || config.strictness === 'regular' || config.strictness === 'semi-strict') {
    // Keep any remaining socketed or ethereal items visible in Soft..Semi-Strict
    rules.push({
      show: {
        ruleName: 'Runeword Bases · Keep Ethereal Gear Visible',
        conditions: { ethereal: true }
      }
    });
    rules.push({
      show: {
        ruleName: 'Runeword Bases · Keep Socketed Gear Visible',
        conditions: { sockets: { gte: 2 } }
      }
    });
  }

  // Strictness Baseline Equipment Clutter Hiding
  if (config.strictness === 'regular') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Regular) · Hide Inferior & Unsocketed Normal-Tier White Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          tier: 'normal',
          rarity: ['inferior', 'normal'],
          sockets: { eq: 0 },
          ethereal: false
        }
      }
    });
  } else if (config.strictness === 'semi-strict') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Semi-Strict) · Hide Unsocketed White & Magic Normal/Exceptional Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior'],
          sockets: { eq: 0 },
          ethereal: false
        }
      }
    });
    rules.push({
      hide: {
        ruleName: 'Strictness (Semi-Strict) · Hide Ordinary Magic Normal/Exceptional Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          tier: ['normal', 'exceptional'],
          rarity: 'magic'
        }
      }
    });
  } else if (config.strictness === 'strict') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Strict) · Hide Unentered Ordinary White & Magic Equipment',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior', 'magic']
        }
      }
    });
  } else if (config.strictness === 'endgame') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Uber Strict) · Hide All Non-Chase White & Magic Equipment',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior', 'magic']
        }
      }
    });
  }

  // Final safety fallback rule (also carries the encoded V2 diff state in ruleName)
  rules.push({
    show: {
      ruleName: serializeV2StateTag(config)
    }
  });

  return { version: 3, rules };
}

export interface SimulatedItem {
  id: string;
  code: string;
  name: string;
  baseName?: string;
  kind: 'weapon' | 'armor' | 'misc';
  tier?: 'normal' | 'exceptional' | 'elite';
  rarity: 'inferior' | 'normal' | 'superior' | 'magic' | 'set' | 'rare' | 'unique' | 'crafted';
  sockets: number;
  ethereal: boolean;
  identified: boolean;
  itemLevel: number;
  quantity: number;
}

export interface SimulationResult {
  show: boolean;
  matchedRuleIndex: number;
  matchedRule?: Rule;
  matchedRuleName: string;
  matchedCategory?: CategoryId;
  displayLabel: string;
  textColor: string;
  borderColor?: string;
  backgroundColor: string;
  dropSound?: string;
  minimapIcon?: RuleBlock['minimapIcon'];
}

function matchesNumberTest(test: NumberTest | undefined, value: number): boolean {
  if (!test) return true;
  if (test.eq !== undefined && value !== test.eq) return false;
  if (test.gt !== undefined && !(value > test.gt)) return false;
  if (test.gte !== undefined && !(value >= test.gte)) return false;
  if (test.lt !== undefined && !(value < test.lt)) return false;
  if (test.lte !== undefined && !(value <= test.lte)) return false;
  return true;
}

export function simulateItemDrop(
  filter: Filter,
  catalog: Catalog,
  item: SimulatedItem
): SimulationResult {
  let show = true;
  let matchedRuleIndex = -1;
  let matchedRule: Rule | undefined;
  let customName: string | undefined;
  let backgroundColor: string | undefined;
  let borderColor: string | undefined;
  let textColor: string | undefined;
  let dropSound: string | undefined;
  let minimapIcon: RuleBlock['minimapIcon'] | undefined;

  for (let i = 0; i < filter.rules.length; i++) {
    const rule = filter.rules[i];
    const isShow = kindOf(rule) === 'show';
    const block = blockOf(rule);
    const c = block.conditions;

    if (c) {
      if (c.code && !values(c.code).includes(item.code)) continue;
      if (c.baseName) {
        const bName = item.baseName ?? catalog.baseItems.find(b => b.code === item.code)?.name ?? '';
        if (!values(c.baseName).includes(bName)) continue;
      }
      if (c.itemType) {
        const types = values(c.itemType);
        const matchesType = types.some(t => catalog.itemTypeMap.get(t)?.has(item.code));
        if (!matchesType) continue;
      }
      if (c.tier) {
        if (!item.tier || !values(c.tier).includes(item.tier)) continue;
      }
      if (c.rarity && !values(c.rarity).includes(item.rarity)) continue;
      if (!matchesNumberTest(c.sockets, item.sockets)) continue;
      if (!matchesNumberTest(c.itemLevel, item.itemLevel)) continue;
      if (!matchesNumberTest(c.quantity, item.quantity)) continue;
      if (c.ethereal !== undefined && c.ethereal !== item.ethereal) continue;
      if (c.identified !== undefined && c.identified !== item.identified) continue;
    }

    matchedRuleIndex = i;
    matchedRule = rule;
    show = isShow;
    if (block.name) customName = block.name;
    if (block.tooltip?.backgroundColor) backgroundColor = block.tooltip.backgroundColor;
    if (block.tooltip?.borderColor) borderColor = block.tooltip.borderColor;
    if (block.tooltip?.textColor) textColor = block.tooltip.textColor;
    if (isShow) {
      if (block.dropSound) dropSound = block.dropSound;
      if (block.minimapIcon) minimapIcon = block.minimapIcon;
    } else {
      dropSound = undefined;
      minimapIcon = undefined;
    }

    if (!block.continue) break;
  }

  const defaultRarityColors: Record<SimulatedItem['rarity'], string> = {
    inferior: 'RGBA(150, 150, 150, 1)',
    normal: 'RGBA(240, 240, 240, 1)',
    superior: 'RGBA(240, 240, 240, 1)',
    magic: 'RGBA(110, 135, 255, 1)',
    set: 'RGBA(0, 225, 0, 1)',
    rare: 'RGBA(255, 235, 95, 1)',
    unique: 'RGBA(205, 165, 100, 1)',
    crafted: 'RGBA(255, 155, 40, 1)'
  };

  const baseDisplay = item.quantity > 1 && item.code !== 'gld'
    ? `${item.quantity}x ${item.name}`
    : item.code === 'gld'
      ? `${item.quantity.toLocaleString()} Gold`
      : item.name;
  const displayLabel = customName ? customName.replaceAll('{name}', baseDisplay) : baseDisplay;
  const rawRuleName = matchedRule ? (blockOf(matchedRule).ruleName || `Rule #${matchedRuleIndex + 1}`) : 'Default Show';
  const cleanRuleName = rawRuleName.startsWith(V2_STATE_PREFIX)
    ? 'Keep remaining loot visible (Fallback)'
    : rawRuleName;

  let matchedCategory: CategoryId | undefined;
  if (cleanRuleName.startsWith('Runes')) matchedCategory = 'runes';
  else if (cleanRuleName.startsWith('Currency & Orbs')) matchedCategory = 'currency';
  else if (cleanRuleName.startsWith('Boss & Endgame')) matchedCategory = 'bosses';
  else if (cleanRuleName.startsWith('Maps')) matchedCategory = 'maps';
  else if (cleanRuleName.startsWith('Gems')) matchedCategory = 'gems';
  else if (cleanRuleName.startsWith('Uniques & Charms')) matchedCategory = 'uniques';
  else if (cleanRuleName.startsWith('Runeword Bases') || cleanRuleName.startsWith('[Base]')) matchedCategory = 'bases';
  else if (cleanRuleName.startsWith('Equipment')) matchedCategory = 'equipment';
  else if (cleanRuleName.startsWith('Misc & Potions')) matchedCategory = 'misc';

  return {
    show,
    matchedRuleIndex,
    matchedRule,
    matchedRuleName: cleanRuleName,
    matchedCategory,
    displayLabel,
    textColor: textColor || defaultRarityColors[item.rarity] || 'RGBA(240, 240, 240, 1)',
    borderColor,
    backgroundColor: backgroundColor || 'RGBA(12, 12, 16, 0.86)',
    dropSound,
    minimapIcon
  };
}

export type LootsplosionScenario = 'endgame-map' | 'hell-boss' | 'rune-currency' | 'campaign';

export function generateLootsplosion(scenario: LootsplosionScenario): SimulatedItem[] {
  if (scenario === 'rune-currency') {
    return [
      { id: 'sim-1', code: 'r31', name: 'Jah Rune (#31)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-2', code: 's30', name: 'Stack: Ber Rune (#30)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 2 },
      { id: 'sim-3', code: 'ka3', name: 'Orb of Corruption', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-4', code: '1gc', name: 'Gem Cluster', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-5', code: 'r24', name: 'Ist Rune (#24)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-6', code: 'oos', name: 'Orb of Socketing', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-7', code: 'r15', name: 'Hel Rune (#15)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-8', code: 'r08', name: 'Ral Rune (#8)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-9', code: 'r09', name: 'Ort Rune (#9)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-10', code: 'r01', name: 'El Rune (#1)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-11', code: '1am', name: 'Stack: Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 5 },
      { id: 'sim-12', code: 'gpv', name: 'Perfect Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-13', code: 'gzv', name: 'Flawless Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
      { id: 'sim-14', code: 'gfv', name: 'Flawed Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
    ];
  }
  if (scenario === 'hell-boss') {
    return [
      { id: 'sim-b1', code: 'mpa', name: "Mephisto's Animus", kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 90, quantity: 1 },
      { id: 'sim-b2', code: 'utp', name: 'Archon Plate', baseName: 'Archon Plate', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
      { id: 'sim-b3', code: 'uap', name: 'Shako', baseName: 'Shako', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
      { id: 'sim-b4', code: 'pk3', name: 'Key of Destruction', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b5', code: 'fed', name: 'Festering Essence of Destruction', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b6', code: 'ci3', name: 'Diadem', baseName: 'Diadem', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
      { id: 'sim-b7', code: 'uit', name: 'Monarch (4 Sockets)', baseName: 'Monarch', kind: 'armor', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b8', code: '9ha', name: 'Military Pick', baseName: 'Military Pick', kind: 'weapon', tier: 'exceptional', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
      { id: 'sim-b9', code: 'hax', name: 'Hand Axe', baseName: 'Hand Axe', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b10', code: 'rvl', name: 'Full Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b11', code: 'hp4', name: 'Greater Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
      { id: 'sim-b12', code: 'gld', name: 'Gold', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 42500 }
    ];
  }
  if (scenario === 'campaign') {
    return [
      { id: 'sim-c1', code: 'box', name: 'Horadric Cube', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 20, quantity: 1 },
      { id: 'sim-c2', code: 'r07', name: 'Tal Rune (#7)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
      { id: 'sim-c3', code: 'r05', name: 'Eth Rune (#5)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
      { id: 'sim-c4', code: 'crs', name: 'Crystal Sword (4 Sockets)', baseName: 'Crystal Sword', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 28, quantity: 1 },
      { id: 'sim-c5', code: 'rin', name: 'Ring', kind: 'misc', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
      { id: 'sim-c6', code: 'cm1', name: 'Small Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
      { id: 'sim-c7', code: 'hax', name: 'Crude Hand Axe', baseName: 'Hand Axe', kind: 'weapon', tier: 'normal', rarity: 'inferior', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
      { id: 'sim-c8', code: 'qui', name: 'Quilted Armor (Unsocketed)', baseName: 'Quilted Armor', kind: 'armor', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
      { id: 'sim-c9', code: 'gfv', name: 'Flawed Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
      { id: 'sim-c10', code: 'hp1', name: 'Minor Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 10, quantity: 1 },
      { id: 'sim-c11', code: 'tsc', name: 'Scroll of Town Portal', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 }
    ];
  }
  // Default: 'endgame-map'
  return [
    { id: 'sim-m1', code: 'md6', name: 'Sandswept Tomb Map (Tier 6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m2', code: 'mrl', name: 'Vizjerei Prism', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m3', code: 'cjw', name: 'Colossal Jewel', kind: 'misc', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
    { id: 'sim-m4', code: 'r28', name: 'Lo Rune (#28)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m5', code: 'ka3', name: 'Orb of Corruption', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m6', code: '7s8', name: 'Ethereal Thresher (4 Sockets)', baseName: 'Thresher', kind: 'weapon', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: true, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m7', code: 'utp', name: 'Superior Archon Plate (3 Sockets)', baseName: 'Archon Plate', kind: 'armor', tier: 'elite', rarity: 'superior', sockets: 3, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m8', code: 'cm3', name: 'Grand Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
    { id: 'sim-m9', code: 'mfp', name: 'Magic Find Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m10', code: 'uhg', name: 'Ogre Gauntlets', baseName: 'Ogre Gauntlets', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
    { id: 'sim-m11', code: '9sw', name: 'Rune Sword', baseName: 'Rune Sword', kind: 'weapon', tier: 'exceptional', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
    { id: 'sim-m12', code: '7cr', name: 'Magic Phase Blade', baseName: 'Phase Blade', kind: 'weapon', tier: 'elite', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
    { id: 'sim-m13', code: 'r04', name: 'Nef Rune (#4)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m14', code: 'hp5', name: 'Super Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m15', code: 'rvl', name: 'Full Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
    { id: 'sim-m16', code: 'aqv', name: 'Arrows', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
  ];
}
