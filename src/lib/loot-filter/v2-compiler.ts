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
export type ThemeId = 'reimagined' | 'filterblade' | 'neon' | 'bloodmoon' | 'frost' | 'minimalist';
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
  dropSound?: string | null;
  minimapIcon?: {
    shape: string;
    size: number;
    borderColor: string;
    fillColor: string;
  } | null;
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
  equipmentFamilies?: EquipmentFamilyId[];
  defaultTier: TierRank;
  strictnessTiers?: Partial<Record<StrictnessId, TierRank>>;
}

export interface CustomBaseRule {
  id: string;
  code: string;
  label: string;
  tier: TierRank;
  mode:
    | 'runeword'
    | 'unique'
    | 'set'
    | 'unique-set'
    | 'rare'
    | 'rare-crafted'
    | 'magic'
    | 'crafted'
    | 'any';
  minSockets?: number;
  etherealOnly?: boolean;
  parentItemId?: string;
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

export type ItemRarityStyleKind = 'base' | 'magic' | 'unique' | 'set' | 'rare' | 'crafted';

export interface V2Config {
  version: 2;
  strictness: StrictnessId;
  theme: ThemeId;
  itemOverrides: Record<string, TierRank>;
  tierStyleOverrides: Partial<Record<TierRank, Partial<TierStyle>>>;
  categoryTierStyleOverrides: Partial<Record<CategoryId, Partial<Record<TierRank, Partial<TierStyle>>>>>;
  rarityTierStyleOverrides: Partial<Record<ItemRarityStyleKind, Partial<Record<TierRank, Partial<TierStyle>>>>>;
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
    description: 'Hides all blue Magic items (except Charms & Jewels), broken/inferior trash, unsocketed Normal-tier white gear, and tiny Act 1 HP/MP potions.',
    hidesSummary: 'All Magic items except Charms & Jewels, inferior gear, unsocketed non-ethereal Normal white gear, and Minor/Light HP/MP potions.',
    keepsSummary: 'All Exceptional/Elite bases, socketed or ethereal white bases, Charms & Jewels, all Rare/Set/Unique/Crafted items, all gems and runes.',
    recommendedFor: 'Late Normal & Nightmare once you move past early starter blue items.'
  },
  {
    id: 'semi-strict',
    name: 'Semi-Strict',
    shortLabel: 'Semi-Strict',
    badge: 'Early Hell',
    description: 'The sweet spot for entering Hell and early farming. Hides unsocketed Normal/Exceptional white gear, all Magic items (except Charms & Jewels), and low potions while keeping all gems visible for your Gem Bag.',
    hidesSummary: 'All Magic items except Charms & Jewels, unsocketed Normal/Exceptional white gear, ordinary Arrows/Bolts, and standard HP/MP potions.',
    keepsSummary: 'All Runes, all Gems & Gem Stacks (for the Gem Bag), all Rares/Uniques/Sets/Crafted, Charms & Jewels, Chase & Elite Runeword bases, and Ethereal/Socketed bases.',
    recommendedFor: 'Hell campaign, Terror Zones, and early endgame gearing.'
  },
  {
    id: 'strict',
    name: 'Strict',
    shortLabel: 'Strict',
    badge: 'Hell Farming',
    description: 'Streamlines your screen for fast Hell and early Map runs. Hides low runes (El–Ith), all Magic items (except Charms & Jewels), and Normal-tier Rares.',
    hidesSummary: 'El–Ith runes, all Magic items except Charms & Jewels, Normal-tier Rares, and Greater HP/MP potions.',
    keepsSummary: 'Tal+ Runes, all Gems & Gem Stacks, Orbs, Maps, Exceptional/Elite Rares, Charms & Jewels, Chase & Elite Runeword bases, Super/Rejuv potions.',
    recommendedFor: 'Established Hell builds farming bosses, Chaos/Baal, and Tier 1–3 Maps.'
  },
  {
    id: 'endgame',
    name: 'Uber Strict (Endgame)',
    shortLabel: 'Uber Strict',
    badge: 'Endgame Maps',
    description: 'Built for high-density Tier 4–6 Maps. Shows valuable runes/currencies, all Gems for your Gem Bag, Elite & Chase bases, high-tier Rares, Charms & Jewels, Uniques/Sets, and Full Rejuvs.',
    hidesSummary: 'El–Dol runes (keeps Ral/Amn/Sol/Shael/Hel+ for crafting), all Magic items except Charms & Jewels, Normal-tier non-jewelry Sets, Normal/Exceptional Rares, non-Elite ordinary bases, and regular HP/MP potions.',
    keepsSummary: 'Mid/High & Crafting Runes, Orbs, all Gems & Gem Stacks, Maps, Uniques, Exceptional/Elite & Set Jewelry/Chase Sets, Charms & Jewels, Elite Rares/Circlets/Jewelry/Gloves/Boots/Belts, Chase Runeword bases, Full Rejuvs & Buff potions.',
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
    description: 'Rich dark-fantasy royal purple, molten ember, sanctuary gold, and warm parchment tuned for D2R Reimagined.',
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
        backgroundColor: 'RGBA(48, 16, 4, 0.93)',
        borderColor: 'RGBA(255, 120, 25, 1)',
        textColor: 'RGBA(255, 188, 115, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'star', size: 20, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 120, 25, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(36, 14, 6, 0.9)',
        borderColor: 'RGBA(238, 105, 38, 0.95)',
        textColor: 'RGBA(255, 172, 115, 1)',
        dropSound: 'Filter03',
        minimapIcon: { shape: 'diamond', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(238, 105, 38, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(18, 18, 22, 0.85)',
        borderColor: 'RGBA(145, 150, 162, 0.72)',
        textColor: 'RGBA(226, 226, 230, 1)'
      },
      D: {
        textColor: 'RGBA(172, 174, 180, 0.9)'
      }
    }
  },
  filterblade: {
    id: 'filterblade',
    name: 'High-Contrast Crimson',
    description: 'Iconic white-and-crimson S-Tier callouts, fiery orange A/B-Tier currency, and clean crisp bases.',
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
        backgroundColor: 'RGBA(38, 16, 6, 0.9)',
        borderColor: 'RGBA(245, 115, 35, 1)',
        textColor: 'RGBA(255, 180, 110, 1)',
        dropSound: 'Filter04',
        minimapIcon: { shape: 'circle', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(245, 115, 35, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(18, 18, 22, 0.85)',
        borderColor: 'RGBA(148, 152, 164, 0.75)',
        textColor: 'RGBA(228, 228, 232, 1)'
      },
      D: {
        textColor: 'RGBA(168, 162, 155, 0.88)'
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
  bloodmoon: {
    id: 'bloodmoon',
    name: 'Blood Moon',
    description: 'Deep crimson, molten gold, and scarlet borders inspired by sanctuary blood rites.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(62, 8, 14, 0.95)',
        borderColor: 'RGBA(255, 200, 75, 1)',
        textColor: 'RGBA(255, 232, 165, 1)',
        dropSound: 'Filter01',
        minimapIcon: { shape: 'star', size: 25, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 55, 55, 1)' },
        namePrefix: '★ {name} ★'
      },
      A: {
        backgroundColor: 'RGBA(42, 6, 10, 0.92)',
        borderColor: 'RGBA(255, 65, 65, 1)',
        textColor: 'RGBA(255, 165, 165, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'star', size: 21, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(255, 95, 60, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(32, 14, 10, 0.9)',
        borderColor: 'RGBA(235, 125, 70, 1)',
        textColor: 'RGBA(255, 195, 155, 1)',
        dropSound: 'Filter03',
        minimapIcon: { shape: 'diamond', size: 18, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(235, 125, 70, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(20, 12, 14, 0.85)',
        borderColor: 'RGBA(175, 115, 115, 0.75)',
        textColor: 'RGBA(235, 200, 200, 1)'
      },
      D: {
        textColor: 'RGBA(175, 155, 155, 0.88)'
      }
    }
  },
  frost: {
    id: 'frost',
    name: 'Glacial Frost',
    description: 'Crisp arctic white, glacier cyan, and aurora teal for cool high-contrast readability.',
    tiers: {
      S: {
        backgroundColor: 'RGBA(10, 32, 48, 0.95)',
        borderColor: 'RGBA(120, 245, 255, 1)',
        textColor: 'RGBA(235, 252, 255, 1)',
        dropSound: 'Filter01',
        minimapIcon: { shape: 'star', size: 25, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(90, 235, 255, 1)' },
        namePrefix: '★ {name} ★'
      },
      A: {
        backgroundColor: 'RGBA(14, 24, 46, 0.92)',
        borderColor: 'RGBA(95, 165, 255, 1)',
        textColor: 'RGBA(195, 225, 255, 1)',
        dropSound: 'Filter02',
        minimapIcon: { shape: 'diamond', size: 21, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(95, 165, 255, 1)' }
      },
      B: {
        backgroundColor: 'RGBA(10, 28, 28, 0.9)',
        borderColor: 'RGBA(80, 225, 190, 1)',
        textColor: 'RGBA(185, 248, 230, 1)',
        dropSound: 'Filter03',
        minimapIcon: { shape: 'circle', size: 17, borderColor: 'RGBA(255, 255, 255, 1)', fillColor: 'RGBA(80, 225, 190, 1)' }
      },
      C: {
        backgroundColor: 'RGBA(14, 18, 24, 0.85)',
        borderColor: 'RGBA(135, 165, 195, 0.75)',
        textColor: 'RGBA(210, 225, 240, 1)'
      },
      D: {
        textColor: 'RGBA(155, 170, 185, 0.88)'
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
  { id: 'currency', name: 'Orbs & Upgrade Materials', subtitle: 'Power Orbs, Gem Clusters, Pliers, Bags & Grabbers', icon: '◈' },
  { id: 'bosses', name: 'Boss Keys, Organs & Tokens', subtitle: 'Uber Keys, Boss Souls, Animus/Calamity/Ire, Worldstone Shards & Essences', icon: '☠' },
  { id: 'maps', name: 'Endgame Maps & Sextants', subtitle: 'Tier 1–6 Maps and Map Currency (Sextant, Astrolabe, Vizjerei Prism)', icon: '🗺' },
  { id: 'gems', name: 'Gems & Gem Stacks', subtitle: 'Gem Stacks, Reimagined Unstacked Gems (incl. Chaos Onyx), Perfect, Flawless, Standard & Flawed Gems (Always visible for Gem Bag)', icon: '❖' },
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

export const DROP_ONLY_UNIQUE_CODES = [
  'cm1', 'cjw', '7gd', '7fb', '7gs', '7wa', 'obb', 'pae', 'paf', 'ned', 'nee', 'bae', 'uul', 'uth',
  'utp', 'upl', 'uhn', 'urs', 'aqv', 'cqv', 'ame', 'amf', 'amb', 'drb', 'drf', '7ar', '7cs', '7wb'
];

export const DROP_ONLY_SET_CODES = ['hgl', 'ghm', 'ful', 'hbt', 'hbl'];

export const DROP_ONLY_UNIQUE_SET_CODES = [...DROP_ONLY_UNIQUE_CODES, ...DROP_ONLY_SET_CODES];

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

  { id: 'gem-stacks-all', label: 'Gem Stacks (Amethyst, Ruby, Sapphire, Emerald, Topaz, Diamond, Skull, Chaos Onyx)', subtitle: '1am, 1rb, 1sa, 1em, 1tp, 1di, 1sk, 1so', category: 'gems', codes: ['1am', '1rb', '1sa', '1em', '1tp', '1di', '1sk', '1so'], defaultTier: 'B' },
  { id: 'gem-reimagined-unstacked', label: 'Reimagined Unstacked Gems (Amethyst–Skull & Chaos Onyx)', subtitle: 'gmm, gmr, gms, gme, gmt, gmd, gmk, gmo', category: 'gems', codes: ['gmm', 'gmr', 'gms', 'gme', 'gmt', 'gmd', 'gmk', 'gmo'], defaultTier: 'B' },
  { id: 'gem-perfect', label: 'Perfect Gems (All 7 Types)', subtitle: 'gpv, gpr, gpb, gpg, gpy, gpw, skz', category: 'gems', codes: ['gpv', 'gpr', 'gpb', 'gpg', 'gpy', 'gpw', 'skz'], defaultTier: 'B' },
  { id: 'gem-flawless', label: 'Flawless Gems (All 7 Types)', subtitle: 'gzv, glr, glb, glg, gly, glw, skl', category: 'gems', codes: ['gzv', 'glr', 'glb', 'glg', 'gly', 'glw', 'skl'], defaultTier: 'C' },
  { id: 'gem-normal', label: 'Standard Gems (All 7 Types)', subtitle: 'gsv, gsr, gsb, gsg, gsy, gsw, sku', category: 'gems', codes: ['gsv', 'gsr', 'gsb', 'gsg', 'gsy', 'gsw', 'sku'], defaultTier: 'C', strictnessTiers: { strict: 'D', endgame: 'D' } },
  { id: 'gem-flawed', label: 'Flawed Gems (All 7 Types)', subtitle: 'gfv, gfr, gfb, gfg, gfy, gfw, skf', category: 'gems', codes: ['gfv', 'gfr', 'gfb', 'gfg', 'gfy', 'gfw', 'skf'], defaultTier: 'D' },

  // 6. Uniques, Sets, Charms & Jewelry (Unbundled Unique vs. Set cards across all presets)
  { id: 'uniq-pinnacle-charms', label: 'Colossal Jewels, Sunder Charms & Torches', subtitle: 'cjw, cs1, cs2, tch, cm4, cm5 · All rarities', category: 'uniques', codes: ['cjw', 'cs1', 'cs2', 'tch', 'cm4', 'cm5'], defaultTier: 'S' },
  { id: 'uniq-drop-only', label: 'Drop-Only Chase Uniques (lvl 100+)', subtitle: '27 pinnacle Reimagined drop-only unique equipment & charm bases', category: 'uniques', codes: DROP_ONLY_UNIQUE_CODES.filter(c => c !== 'cjw'), rarities: ['unique'], defaultTier: 'S' },
  { id: 'set-drop-only', label: "Drop-Only Chase Sets (Warlord's Glory)", subtitle: 'hgl, ghm, ful, hbt, hbl (Set) · Protected Hell Herald set bases', category: 'uniques', codes: DROP_ONLY_SET_CODES, rarities: ['set'], defaultTier: 'S' },
  { id: 'uniq-jewelry-charms', label: 'Unique Rings, Amulets, Circlets, Charms & Jewels', subtitle: 'ring, amul, circ, char, jewl (Unique)', category: 'uniques', itemTypes: ['ring', 'amul', 'char', 'jewl', 'circ'], rarities: ['unique'], defaultTier: 'S' },
  { id: 'set-jewelry', label: 'Set Rings, Amulets, Circlets & Charms', subtitle: "ring, amul, circ, char, jewl (Set) · Tal Rasha's, Angelic & Reimagined set jewelry/charms", category: 'uniques', itemTypes: ['ring', 'amul', 'char', 'jewl', 'circ'], rarities: ['set'], defaultTier: 'A', strictnessTiers: { 'semi-strict': 'B', strict: 'B', endgame: 'B' } },
  { id: 'uniq-elite', label: 'Elite Uniques', subtitle: 'All Elite-tier unique weapons, armor & offhands', category: 'uniques', tiers: ['elite'], rarities: ['unique'], defaultTier: 'A' },
  { id: 'set-elite', label: 'Elite Sets', subtitle: "All Elite-tier set equipment (Tal's Armor, IK Soul Cage, M'avina's, Natalya's, etc.)", category: 'uniques', tiers: ['elite'], rarities: ['set'], defaultTier: 'A', strictnessTiers: { endgame: 'B' } },
  { id: 'uniq-exceptional', label: 'Exceptional Uniques', subtitle: 'All Exceptional-tier unique weapons, armor & offhands', category: 'uniques', tiers: ['exceptional'], rarities: ['unique'], defaultTier: 'B', strictnessTiers: { endgame: 'C' } },
  { id: 'set-exceptional', label: 'Exceptional Sets', subtitle: "All Exceptional-tier set equipment (Laying of Hands, Guillaume's Face, Trang's, etc.)", category: 'uniques', tiers: ['exceptional'], rarities: ['set'], defaultTier: 'B', strictnessTiers: { strict: 'C', endgame: 'C' } },
  { id: 'uniq-normal', label: 'Normal-Tier & Other Uniques', subtitle: 'All remaining Normal-tier unique equipment', category: 'uniques', rarities: ['unique'], defaultTier: 'B', strictnessTiers: { 'semi-strict': 'C', strict: 'C', endgame: 'D' } },
  { id: 'set-normal', label: 'Normal-Tier Sets', subtitle: "Early-game set equipment (Sigon's, Isenhart's, Arctic, Cathan's armor · Hidden in Uber Strict)", category: 'uniques', rarities: ['set'], defaultTier: 'B', strictnessTiers: { regular: 'C', 'semi-strict': 'C', strict: 'D', endgame: 'HIDE' } },
  { id: 'charm-jewel-rare', label: 'Rare & Crafted Charms & Jewels', subtitle: 'scha, mcha, lcha, jewl (Rare/Crafted) · High-roll rare charms, crafted skillers & rare jewels', category: 'uniques', itemTypes: ['scha', 'mcha', 'lcha', 'jewl'], rarities: ['rare', 'crafted'], defaultTier: 'B' },
  { id: 'jewelry-rare-crafted', label: 'Rare & Crafted Rings, Amulets & Circlets', subtitle: 'ring, amul, circ (Rare/Crafted)', category: 'uniques', itemTypes: ['ring', 'amul', 'circ'], rarities: ['rare', 'crafted'], defaultTier: 'B' },
  { id: 'charm-small-grand', label: 'Magic Charms (Small, Large & Grand)', subtitle: 'scha, mcha, lcha (Magic) · All magic Small, Large & Grand charms', category: 'uniques', itemTypes: ['scha', 'mcha', 'lcha'], rarities: ['magic'], defaultTier: 'C' },
  { id: 'jewel-all', label: 'Magic Jewels', subtitle: 'jewl (Magic) · Crafting & socket jewels', category: 'uniques', itemTypes: ['jewl'], rarities: ['magic'], defaultTier: 'C' },

  { id: 'jewelry-magic', label: 'Magic Rings, Amulets & Circlets', subtitle: 'ring, amul, circ (Magic · Starter only, hidden in Regular+)', category: 'uniques', itemTypes: ['ring', 'amul', 'circ'], rarities: ['magic'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },

  // 7. Runeword & Crafting Bases (Normal/Superior rarity — 100% Elite base coverage via Premier Chase + Secondary Elite groups)
  // Universal Body Armor, Circlets & Helms
  { id: 'base-elite-body', label: 'Archon Plate, Dusk Shroud, Wyrmhide, Scarab Husk, Sacred Armor & Mage Plate', subtitle: 'utp, uui, uea, ula, uar, xtp · Premier light & endgame Enigma/Fortitude/CoH armors', category: 'bases', codes: ['utp', 'uui', 'uea', 'ula', 'uar', 'xtp'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-elite-body-secondary', label: 'Wire Fleece, Great Hauberk, Boneweave, Balrog Skin, Kraken Shell & Heavy Elite Armors', subtitle: 'utu, urs, uhn, upl, uld, uth, uul, ung, ucl, ult · Remaining 4os Elite body armors', category: 'bases', codes: ['utu', 'urs', 'uhn', 'upl', 'uld', 'uth', 'uul', 'ung', 'ucl', 'ult'], rarities: ['normal', 'superior'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-diadem-tiara', label: 'Diadem & Tiara (White/Socketed Bases)', subtitle: 'ci3, ci2 · 3–4os Dream/Flickering Flame/Faith & Imbue/Infusion headgear', category: 'bases', codes: ['ci3', 'ci2'], rarities: ['normal', 'superior'], defaultTier: 'A' },
  { id: 'base-elite-helms', label: 'Bone Visage, Demonhead, Corona, Spired Helm & Shako (4os Elite Helms)', subtitle: 'uh9, usk, urn, uhm, uap · Premier 4os Dream/Cure/Flickering Flame/Metamorphosis helms', category: 'bases', codes: ['uh9', 'usk', 'urn', 'uhm', 'uap'], rarities: ['normal', 'superior'], defaultTier: 'B' },
  { id: 'base-elite-helms-secondary', label: 'Hydraskull, Armet & Giant Conch (Secondary 4os Elite Helms)', subtitle: 'ukp, ulm, uhl · Remaining 4os Elite helms', category: 'bases', codes: ['ukp', 'ulm', 'uhl'], rarities: ['normal', 'superior'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },

  // Shields & Class Offhands / Helms
  { id: 'base-monarch-shields', label: 'Monarch, Hyperion, Troll Nest, Ward & Aegis (4os Standard Shields)', subtitle: 'uit, urg, ush, uts, uow · All 4os Reimagined Spirit/Phoenix/Dragon standard shields', category: 'bases', codes: ['uit', 'urg', 'ush', 'uts', 'uow'], rarities: ['normal', 'superior'], equipmentFamilies: ['standard-shield'], defaultTier: 'A' },
  { id: 'base-shields-secondary', label: 'Blade Barrier, Heater & Luna (2–3os Elite Shields)', subtitle: 'upk, uuc, uml · Rhyme/Splendor/Sanctuary/Dream 2–3os Elite shields', category: 'bases', codes: ['upk', 'uuc', 'uml'], rarities: ['normal', 'superior'], equipmentFamilies: ['standard-shield'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-paladin-shields', label: 'Sacred Targe, Sacred Rondache, Vortex, Ancient & Zakarum Shields', subtitle: 'pab, pac, paf, pad, pae · Paladin Spirit/Exile/Phoenix shields', category: 'bases', codes: ['pab', 'pac', 'paf', 'pad', 'pae'], rarities: ['normal', 'superior'], equipmentFamilies: ['paladin-shield'], defaultTier: 'A' },
  { id: 'base-warlock-grimoires', label: 'Blasphemous Grimoire, Blasphemous Compendium & Occult Codex', subtitle: 'waf, wae, wad · Premier 3–4os +skill Elite Warlock grimoires', category: 'bases', codes: ['waf', 'wae', 'wad'], rarities: ['normal', 'superior'], equipmentFamilies: ['warlock-grimoire'], defaultTier: 'B' },
  { id: 'base-warlock-grimoires-secondary', label: 'Occult Tome & Forgotten Volume (Secondary 3os Grimoires)', subtitle: 'wac, wab · Remaining 3os +skill Elite Warlock grimoires', category: 'bases', codes: ['wac', 'wab'], rarities: ['normal', 'superior'], equipmentFamilies: ['warlock-grimoire'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-sorc-orbs', label: 'Dimensional Shard, Vortex Orb & Demon Heart', subtitle: 'obf, obe, obd · Premier 2–3os +skill Elite Sorceress orbs', category: 'bases', codes: ['obf', 'obe', 'obd'], rarities: ['normal', 'superior'], equipmentFamilies: ['sorc-orb'], defaultTier: 'B' },
  { id: 'base-sorc-orbs-secondary', label: 'Eldritch Orb & Heavenly Stone (Secondary 2os Sorceress Orbs)', subtitle: 'obc, obb · Remaining 2os +skill Elite Sorceress orbs', category: 'bases', codes: ['obc', 'obb'], rarities: ['normal', 'superior'], equipmentFamilies: ['sorc-orb'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-necro-heads', label: 'Succubus Skull, Bloodlord Skull & Overseer Skull', subtitle: 'nee, nef, ned · Premier 3–4os Splendor/Rhyme/+3 skill Necromancer heads', category: 'bases', codes: ['nee', 'nef', 'ned'], rarities: ['normal', 'superior'], equipmentFamilies: ['necro-head'], defaultTier: 'B' },
  { id: 'base-necro-heads-secondary', label: 'Hellspawn Skull & Minion Skull (Secondary 3os Necromancer Heads)', subtitle: 'neg, neb · Remaining 3os +skill Elite Necromancer heads', category: 'bases', codes: ['neg', 'neb'], rarities: ['normal', 'superior'], equipmentFamilies: ['necro-head'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-druid-pelts', label: 'Dream Spirit, Blood Spirit & Earth Spirit', subtitle: 'drf, drb, drd · Premier 4os Flickering Flame/Metamorphosis/+3 Tornado pelts', category: 'bases', codes: ['drf', 'drb', 'drd'], rarities: ['normal', 'superior'], equipmentFamilies: ['druid-pelt'], defaultTier: 'B' },
  { id: 'base-druid-pelts-secondary', label: 'Sky Spirit & Sun Spirit (Secondary 4os Druid Pelts)', subtitle: 'dre, drc · Remaining 4os +skill Elite Druid pelts', category: 'bases', codes: ['dre', 'drc'], rarities: ['normal', 'superior'], equipmentFamilies: ['druid-pelt'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-barb-helms', label: 'Conqueror Crown, Guardian Crown & Destroyer Helm', subtitle: 'bae, baf, bad · Premier 4os Bulwark/Cure/Delirium/+3 BO Barbarian helms', category: 'bases', codes: ['bae', 'baf', 'bad'], rarities: ['normal', 'superior'], equipmentFamilies: ['barb-helm'], defaultTier: 'B' },
  { id: 'base-barb-helms-secondary', label: 'Fury Visor & Carnage Helm (Secondary 4os Barbarian Helms)', subtitle: 'bac, bab · Remaining 4os +skill Elite Barbarian primal helms', category: 'bases', codes: ['bac', 'bab'], rarities: ['normal', 'superior'], equipmentFamilies: ['barb-helm'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },

  // Weapons (Melee, Ranged, Thrown & Caster)
  { id: 'base-phase-zerker', label: 'Phase Blade, Colossus Blade, Colossal Sword, Balrog Blade, Cryptic & Crystal Sword', subtitle: '7cr, 7gd, 7fb, 7gs, 7ls, crs · Grief/Death/BoTD/Oath/CTA/Spirit swords', category: 'bases', codes: ['7cr', '7gd', '7fb', '7gs', '7ls', 'crs'], rarities: ['normal', 'superior'], equipmentFamilies: ['sword'], defaultTier: 'A' },
  { id: 'base-swords-secondary', label: 'Legend, Champion, Highland, Conquest, Mythical & Secondary Elite Swords', subtitle: '72h, 7b7, 7cm, 7bs, 7wd, 7fc, 7sb, 7sm, 7ss · Remaining 2–4os Elite swords', category: 'bases', codes: ['72h', '7b7', '7cm', '7bs', '7wd', '7fc', '7sb', '7sm', '7ss'], rarities: ['normal', 'superior'], equipmentFamilies: ['sword'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-zerker-axes', label: 'Berserker Axe, Ettin Axe, Decapitator, Champion Axe & Glorious Axe', subtitle: '7wa, 72a, 7bt, 7ga, 7gi · Premier 5–6os Beast/Doom/Death/BoTD/Grief axes', category: 'bases', codes: ['7wa', '72a', '7bt', '7ga', '7gi'], rarities: ['normal', 'superior'], equipmentFamilies: ['axe'], defaultTier: 'A' },
  { id: 'base-axes-secondary', label: 'Silver-Edged Axe, Feral Axe, Small Crescent, War Spike & Tomahawk', subtitle: '7ba, 7la, 7ax, 7mp, 7ha · Oath & secondary 2–6os Elite axes', category: 'bases', codes: ['7ba', '7la', '7ax', '7mp', '7ha'], rarities: ['normal', 'superior'], equipmentFamilies: ['axe'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-flails-maces', label: 'Flail, Scourge, Thunder Maul, Ogre Maul & Legendary Mallet', subtitle: 'fla, 7fl, 7gm, 7m7, 7wh · HOTO/CTA flails & 4–6os Elite hammers/mauls', category: 'bases', codes: ['fla', '7fl', '7gm', '7m7', '7wh'], rarities: ['normal', 'superior'], equipmentFamilies: ['mace'], defaultTier: 'B' },
  { id: 'base-maces-secondary', label: 'Devil Star & Reinforced Mace (Secondary Elite Maces)', subtitle: '7mt, 7ma · Remaining 2–3os 1H Elite maces', category: 'bases', codes: ['7mt', '7ma'], rarities: ['normal', 'superior'], equipmentFamilies: ['mace'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-elite-polearms', label: 'Thresher, Giant Thresher, Great Poleaxe & Cryptic Axe', subtitle: '7s8, 7wc, 7h7, 7pa · Premier 5–6os Infinity/Insight/Pride/Doom polearms', category: 'bases', codes: ['7s8', '7wc', '7h7', '7pa'], rarities: ['normal', 'superior'], equipmentFamilies: ['polearm'], defaultTier: 'A' },
  { id: 'base-polearms-secondary', label: 'Colossus Voulge & Ogre Axe (3–4os Elite Polearms)', subtitle: '7vo, 7o7 · 4os Insight/Infinity Colossus Voulge & 3os Hustle/Crescent Moon Ogre Axe', category: 'bases', codes: ['7vo', '7o7'], rarities: ['normal', 'superior'], equipmentFamilies: ['polearm'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-spears', label: 'Mancatcher, Matriarchal Pike, Matriarchal Spear, Ghost Spear & War Pike', subtitle: '7br, ame, amd, 7st, 7p7 · Premier 5–6os Infinity/BoTD/Pride & +skill spear bases', category: 'bases', codes: ['7br', 'ame', 'amd', '7st', '7p7'], rarities: ['normal', 'superior'], equipmentFamilies: ['spear'], defaultTier: 'B' },
  { id: 'base-spears-secondary', label: 'Stygian Pike & Hyperion Spear (3–4os Elite Spears)', subtitle: '7tr, 7sr · 4os Stygian Pike & 3os Hyperion Spear bases', category: 'bases', codes: ['7tr', '7sr'], rarities: ['normal', 'superior'], equipmentFamilies: ['spear'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-ama-weapons', label: 'Matriarchal, Grand Matron, Shadow, Diamond, Great & Hydra Bows', subtitle: 'amb, amc, 6lb, 6s7, 6cb, 6lw · Premier Faith/Mist/Ice/Brand/Wrath bow bases', category: 'bases', codes: ['amb', 'amc', '6lb', '6s7', '6cb', '6lw'], rarities: ['normal', 'superior'], equipmentFamilies: ['bow-quiver'], defaultTier: 'B' },
  { id: 'base-bows-secondary', label: 'Blade Bow, Spider Bow, Ward Bow & Crusader Bow', subtitle: '6hb, 6sb, 6sw, 6l7 · Remaining 3–6os Elite bow bases', category: 'bases', codes: ['6hb', '6sb', '6sw', '6l7'], rarities: ['normal', 'superior'], equipmentFamilies: ['bow-quiver'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-crossbows', label: 'Colossus, Demon, Gorgon & Pellet Crossbows', subtitle: '6hx, 6rx, 6mx, 6lx · All 3–6os Elite crossbow bases', category: 'bases', codes: ['6hx', '6rx', '6mx', '6lx'], rarities: ['normal', 'superior'], equipmentFamilies: ['xbow-quiver'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-javelins', label: 'Matriarchal Javelin, Ceremonial Javelin, Winged Harpoon & Ghost Glaive', subtitle: 'amf, ama, 7ts, 7gl · 3os Reimagined runeword, Imbue & Infusion javelin bases', category: 'bases', codes: ['amf', 'ama', '7ts', '7gl'], rarities: ['normal', 'superior'], equipmentFamilies: ['javelin'], defaultTier: 'B' },
  { id: 'base-javelins-secondary', label: 'Balrog Spear, Hyperion Javelin & Stygian Pilum', subtitle: '7s7, 7ja, 7pi · Remaining 3os Elite javelin bases', category: 'bases', codes: ['7s7', '7ja', '7pi'], rarities: ['normal', 'superior'], equipmentFamilies: ['javelin'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-throwing', label: 'Winged Axe, Winged Knife, Flying Axe, Flying Knife, War Dart & Francisca', subtitle: '7b8, 7bk, 7ta, 7tk, 9bk, 9ta · 2–3os Reimagined throwing runeword, Imbue & Infusion bases', category: 'bases', codes: ['7b8', '7bk', '7ta', '7tk', '9bk', '9ta'], rarities: ['normal', 'superior'], equipmentFamilies: ['throwing'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-daggers', label: 'Bone Knife, Fanged Knife, Legend Spike & Mithral Point', subtitle: '7dg, 7kr, 7bl, 7di · Caster & melee dagger bases', category: 'bases', codes: ['7dg', '7kr', '7bl', '7di'], rarities: ['normal', 'superior'], equipmentFamilies: ['dagger'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-clubs', label: 'Tyrant Club, Truncheon & Barbed Club', subtitle: '7sp, 7cl, 9sp · Club runeword & crafting bases', category: 'bases', codes: ['7sp', '7cl', '9sp'], rarities: ['normal', 'superior'], equipmentFamilies: ['club'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-scepters', label: 'Caduceus, Seraph Rod, Mighty Scepter, Divine Scepter & War Scepter', subtitle: '7ws, 7qs, 7sc, 9ws, wsp · Rift/Holy Thunder/CTA/Beast +skill Paladin scepters', category: 'bases', codes: ['7ws', '7qs', '7sc', '9ws', 'wsp'], rarities: ['normal', 'superior'], equipmentFamilies: ['scepter'], defaultTier: 'B' },
  { id: 'base-wands', label: 'Lich Wand, Unearthed Wand, Polished Wand, Ghost Wand & Bone Wand', subtitle: '7bw, 7gw, 7wn, 7yw, bwn · White/+3 Spear/Spirit Necromancer wands', category: 'bases', codes: ['7bw', '7gw', '7wn', '7yw', 'bwn'], rarities: ['normal', 'superior'], equipmentFamilies: ['wand'], defaultTier: 'B' },
  { id: 'base-staves', label: 'Archon Staff, Elder Staff & Shillelagh', subtitle: '6ws, 6cs, 6bs · 4–6os Obsession/Memory/Insight/BoTD +skill 2H staves', category: 'bases', codes: ['6ws', '6cs', '6bs'], rarities: ['normal', 'superior'], equipmentFamilies: ['staff'], defaultTier: 'B' },
  { id: 'base-staves-secondary', label: 'Stalagmite & Walking Stick (2–3os Elite Staves)', subtitle: '6ls, 6ss · 2–3os Leaf/Plague/Splendor-tier +skill Elite staves', category: 'bases', codes: ['6ls', '6ss'], rarities: ['normal', 'superior'], equipmentFamilies: ['staff'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'base-sin-claws', label: 'Runic Talons, Greater Talons, Feral Claws, Suwayyah & Scissors Suwayyah', subtitle: '7tw, 9tw, 7lw, 7ar, 7qr · Premier 3os Mosaic/Chaos/Plague/+3 Trap claws', category: 'bases', codes: ['7tw', '9tw', '7lw', '7ar', '7qr'], rarities: ['normal', 'superior'], equipmentFamilies: ['claws'], defaultTier: 'B' },
  { id: 'base-sin-claws-secondary', label: 'Wrist Sword, Scissors Quhab, Battle Cestus & War Fist', subtitle: '7wb, 9qr, 7cs, 7xf · Remaining 2–3os Assassin claw bases', category: 'bases', codes: ['7wb', '9qr', '7cs', '7xf'], rarities: ['normal', 'superior'], equipmentFamilies: ['claws'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },

  // Optional 0-Socket Elite Gloves, Boots & Belts (for Orb of Infusion -> Conversion / Assemblage)
  { id: 'base-elite-gloves-boots-belts', label: 'White Elite Gloves, Boots & Belts (Infusion / Conversion Bases)', subtitle: '15 Elite glov, boot & belt bases (0 sockets · For Orb of Infusion -> Conversion/Assemblage; hidden in Strict+)', category: 'bases', codes: ['ulc', 'uvc', 'umc', 'utc', 'uhc', 'ulb', 'uvb', 'umb', 'utb', 'uhb', 'ulg', 'uvg', 'umg', 'utg', 'uhg'], rarities: ['normal', 'superior'], defaultTier: 'C', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },

  // 8. Rares, Crafted & Magic Equipment (mapped 1-to-1 with class & weapon families)
  { id: 'equip-crafted', label: 'Crafted Equipment (All Slots)', subtitle: 'All crafted weapons, armor, and accessories', category: 'equipment', rarities: ['crafted'], defaultTier: 'A' },
  { id: 'equip-rare-gloves-boots-belts', label: 'Rare Gloves, Boots & Belts', subtitle: 'glov, boot, belt · Tri-res boots & 2/20 gloves', category: 'equipment', itemTypes: ['glov', 'boot', 'belt'], rarities: ['rare'], defaultTier: 'B' },
  { id: 'equip-class-amazon', label: 'Rare Amazon Javelins', subtitle: 'ajav (Rare) · Class-specific Amazon javelin rare drops', category: 'equipment', itemTypes: ['ajav'], rarities: ['rare'], equipmentFamilies: ['javelin'], defaultTier: 'B' },
  { id: 'equip-class-amazon-bows', label: 'Rare Amazon Bows', subtitle: 'abow (Rare) · Class-specific Amazon bow rare drops', category: 'equipment', itemTypes: ['abow'], rarities: ['rare'], equipmentFamilies: ['bow-quiver'], defaultTier: 'B' },
  { id: 'equip-class-amazon-spears', label: 'Rare Amazon Spears & Pikes', subtitle: 'aspe (Rare) · Class-specific Amazon spear & pike rare drops', category: 'equipment', itemTypes: ['aspe'], rarities: ['rare'], equipmentFamilies: ['spear'], defaultTier: 'B' },
  { id: 'equip-class-assassin', label: 'Rare Assassin Claws (Hand-to-Hand)', subtitle: 'h2h (Rare) · Katar & talon rare drops', category: 'equipment', itemTypes: ['h2h'], rarities: ['rare'], equipmentFamilies: ['claws'], defaultTier: 'B' },
  { id: 'equip-class-barbarian', label: 'Rare Barbarian Primal Helms', subtitle: 'phlm (Rare) · Barbarian primal helm rare drops', category: 'equipment', itemTypes: ['phlm'], rarities: ['rare'], equipmentFamilies: ['barb-helm'], defaultTier: 'B' },
  { id: 'equip-class-druid', label: 'Rare Druid Pelts', subtitle: 'pelt (Rare) · Druid spirit mask & pelt rare drops', category: 'equipment', itemTypes: ['pelt'], rarities: ['rare'], equipmentFamilies: ['druid-pelt'], defaultTier: 'B' },
  { id: 'equip-class-necromancer', label: 'Rare Necromancer Shrunken Heads', subtitle: 'head (Rare) · Necromancer trophy offhand rare drops', category: 'equipment', itemTypes: ['head'], rarities: ['rare'], equipmentFamilies: ['necro-head'], defaultTier: 'B' },
  { id: 'equip-class-paladin', label: 'Rare Paladin Auric Shields', subtitle: 'ashd (Rare) · Paladin targe & shield rare drops', category: 'equipment', itemTypes: ['ashd'], rarities: ['rare'], equipmentFamilies: ['paladin-shield'], defaultTier: 'B' },
  { id: 'equip-class-sorceress', label: 'Rare Sorceress Orbs', subtitle: 'orb (Rare) · Sorceress orb rare drops', category: 'equipment', itemTypes: ['orb'], rarities: ['rare'], equipmentFamilies: ['sorc-orb'], defaultTier: 'B' },
  { id: 'equip-class-warlock', label: 'Rare Warlock Grimoires', subtitle: 'grim (Rare) · Warlock tome & codex rare drops', category: 'equipment', itemTypes: ['grim'], rarities: ['rare'], equipmentFamilies: ['warlock-grimoire'], defaultTier: 'B' },
  { id: 'equip-rare-quivers', label: 'Rare Bow & Crossbow Quivers', subtitle: 'bowq, xboq (Rare) · Rare arrows & bolts', category: 'equipment', itemTypes: ['bowq', 'xboq'], rarities: ['rare'], equipmentFamilies: ['bow-quiver', 'xbow-quiver'], defaultTier: 'B' },
  { id: 'equip-weap-bows', label: 'Rare Bows', subtitle: 'bow (Rare) · Elite & Exceptional bow drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['bow'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['bow-quiver'], defaultTier: 'C' },
  { id: 'equip-weap-xbows', label: 'Rare Crossbows', subtitle: 'xbow (Rare) · Elite & Exceptional crossbow drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['xbow'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['xbow-quiver'], defaultTier: 'C' },
  { id: 'equip-weap-javelins', label: 'Rare Javelins', subtitle: 'jave (Rare) · Elite & Exceptional javelin drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['jave'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['javelin'], defaultTier: 'C' },
  { id: 'equip-weap-spears', label: 'Rare Spears & Pikes', subtitle: 'spea (Rare) · Elite & Exceptional 2H spear drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['spea'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['spear'], defaultTier: 'C' },
  { id: 'equip-weap-throwing', label: 'Rare Throwing Knives & Axes', subtitle: 'tkni, taxe (Rare) · Elite & Exceptional throwing weapon drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['tkni', 'taxe'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['throwing'], defaultTier: 'C' },
  { id: 'equip-weap-swords', label: 'Rare Swords', subtitle: 'swor (Rare) · Elite & Exceptional sword drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['swor'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['sword'], defaultTier: 'C' },
  { id: 'equip-weap-axes', label: 'Rare Axes', subtitle: 'axe (Rare) · Elite & Exceptional axe drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['axe'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['axe'], defaultTier: 'C' },
  { id: 'equip-weap-maces', label: 'Rare Maces, Flails & Hammers', subtitle: 'mace, hamm (Rare) · Elite & Exceptional mace/hammer drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['mace', 'hamm'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['mace'], defaultTier: 'C' },
  { id: 'equip-weap-clubs', label: 'Rare Clubs', subtitle: 'club (Rare) · Elite & Exceptional club drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['club'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['club'], defaultTier: 'C' },
  { id: 'equip-weap-polearms', label: 'Rare Polearms', subtitle: 'pole (Rare) · Elite & Exceptional polearm drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['pole'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['polearm'], defaultTier: 'C' },
  { id: 'equip-weap-daggers', label: 'Rare Daggers & Knives', subtitle: 'knif (Rare) · Elite & Exceptional dagger drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['knif'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['dagger'], defaultTier: 'C' },
  { id: 'equip-weap-scepters', label: 'Rare Scepters', subtitle: 'scep (Rare) · Elite & Exceptional scepter drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['scep'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['scepter'], defaultTier: 'C' },
  { id: 'equip-weap-wands', label: 'Rare Wands', subtitle: 'wand (Rare) · Elite & Exceptional wand drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['wand'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['wand'], defaultTier: 'C' },
  { id: 'equip-weap-staves', label: 'Rare Staves', subtitle: 'staf (Rare) · Elite & Exceptional staff drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['staf'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['staff'], defaultTier: 'C' },
  { id: 'equip-shields-standard', label: 'Rare Standard Shields (Monarch / Troll Nest)', subtitle: 'shie (Rare) · Elite & Exceptional shield drops (Elite only in Uber Strict)', category: 'equipment', itemTypes: ['shie'], tiers: ['elite', 'exceptional'], rarities: ['rare'], equipmentFamilies: ['standard-shield'], defaultTier: 'C' },
  { id: 'equip-rare-elite', label: 'Rare Elite Body Armor & Helms', subtitle: 'tors, helm · All Elite-tier rare body armor & headgear', category: 'equipment', itemTypes: ['tors', 'helm'], tiers: ['elite'], rarities: ['rare'], defaultTier: 'C' },
  { id: 'equip-rare-exceptional', label: 'Rare Exceptional Body Armor & Helms', subtitle: 'tors, helm · All Exceptional-tier rare body armor & headgear', category: 'equipment', itemTypes: ['tors', 'helm'], tiers: ['exceptional'], rarities: ['rare'], defaultTier: 'C', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'equip-rare-normal', label: 'Rare Normal-Tier Equipment (Enabled Types)', subtitle: 'All Normal-tier rare gear for enabled weapon & armor types', category: 'equipment', tiers: ['normal'], rarities: ['rare'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'equip-magic-elite', label: 'Magic Elite Equipment (Weapons, Armor & Class Gear)', subtitle: 'Magic elite gear (Starter only, hidden in Regular+)', category: 'equipment', tiers: ['elite'], rarities: ['magic'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'equip-magic-normal-exceptional', label: 'Magic Normal & Exceptional Equipment', subtitle: 'Early-game magic weapons, armor & class gear (Starter only, hidden in Regular+)', category: 'equipment', tiers: ['normal', 'exceptional'], rarities: ['magic'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },

  // 9. Potions, Scrolls, Quivers & Misc
  { id: 'misc-quest', label: 'Quest Items (Cube, Staff, Khalim, Malus, Scrolls)', subtitle: 'itemType: ques · Protected campaign items', category: 'misc', itemTypes: ['ques'], defaultTier: 'A' },
  { id: 'misc-quest-weapons', label: "Campaign Quest Weapons & Viper Amulet (Wirt's Leg, Horadric Staff, Malus, Khalim, Hellforge)", subtitle: 'leg, hdm, hfh, hst, msf, qf1, qf2, g33, d33, vip · Always protected', category: 'misc', codes: ['leg', 'hdm', 'hfh', 'hst', 'msf', 'qf1', 'qf2', 'g33', 'd33', 'vip'], defaultTier: 'A' },
  { id: 'misc-buff-potions', label: 'Buff & Sunder Potions (MF, XP, Fire/Cold/Light/Poison/Magic/Phys Sunder)', subtitle: 'mfp, xpp, fsp, csp, lsp, psp, msp, php', category: 'misc', codes: ['mfp', 'xpp', 'fsp', 'csp', 'lsp', 'psp', 'msp', 'php'], defaultTier: 'B' },
  { id: 'misc-full-rejuv', label: 'Full Rejuvenation Potions', subtitle: 'rvl · 100% Instant Heal & Mana', category: 'misc', codes: ['rvl'], defaultTier: 'C' },
  { id: 'misc-small-rejuv', label: 'Regular Rejuvenation Potions (35%)', subtitle: 'rvs · Small purple potions', category: 'misc', codes: ['rvs'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-super-pots', label: 'Super Healing & Super Mana Potions (HP5 / MP5)', subtitle: 'hp5, mp5, hpf, mpf', category: 'misc', codes: ['hp5', 'mp5', 'hpf', 'mpf'], defaultTier: 'D', strictnessTiers: { endgame: 'HIDE' } },
  { id: 'misc-greater-pots', label: 'Greater Healing & Greater Mana Potions (HP4 / MP4)', subtitle: 'hp4, mp4', category: 'misc', codes: ['hp4', 'mp4'], defaultTier: 'D', strictnessTiers: { strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-low-pots', label: 'Minor, Light & Standard HP/MP + Utility Potions', subtitle: 'hp1–hp3, mp1–mp3, vps, yps, wms', category: 'misc', codes: ['hp1', 'hp2', 'hp3', 'mp1', 'mp2', 'mp3', 'hpo', 'mpo', 'rps', 'rpl', 'bps', 'bpl', 'vps', 'yps', 'wms'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-magic-quivers', label: 'Magic Bow & Crossbow Quivers', subtitle: 'bowq, xboq (Magic) · Starter only, hidden in Regular+', category: 'misc', itemTypes: ['bowq', 'xboq'], rarities: ['magic'], equipmentFamilies: ['bow-quiver', 'xbow-quiver'], defaultTier: 'D', strictnessTiers: { regular: 'HIDE', 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
  { id: 'misc-normal-quivers', label: 'Ordinary Arrows & Bolts', subtitle: 'aqv, cqv (Normal/Superior)', category: 'misc', codes: ['aqv', 'cqv'], rarities: ['inferior', 'normal', 'superior'], equipmentFamilies: ['bow-quiver', 'xbow-quiver'], defaultTier: 'D', strictnessTiers: { 'semi-strict': 'HIDE', strict: 'HIDE', endgame: 'HIDE' } },
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
    subtitle: 'Bows, Amazon Bows, Arrows & Rare/Unique Quivers',
    group: 'Ranged & Thrown',
    itemTypes: ['bow', 'abow', 'bowq', 'mboq'],
    linkedTierableIds: [
      'base-ama-weapons',
      'base-bows-secondary',
      'equip-class-amazon-bows',
      'equip-rare-quivers',
      'equip-weap-bows',
      'misc-magic-quivers',
      'misc-normal-quivers'
    ]
  },
  {
    id: 'xbow-quiver',
    name: 'Crossbows + Bolts',
    subtitle: 'Crossbows, Bolts & Rare/Unique Crossbow Quivers',
    group: 'Ranged & Thrown',
    itemTypes: ['xbow', 'xboq', 'mxbq'],
    linkedTierableIds: [
      'base-crossbows',
      'equip-rare-quivers',
      'equip-weap-xbows',
      'misc-magic-quivers',
      'misc-normal-quivers'
    ]
  },
  {
    id: 'javelin',
    name: 'Javelins',
    subtitle: 'Javelins & Amazon Javelins',
    group: 'Ranged & Thrown',
    itemTypes: ['jave', 'ajav'],
    linkedTierableIds: ['base-javelins', 'base-javelins-secondary', 'equip-class-amazon', 'equip-weap-javelins']
  },
  {
    id: 'spear',
    name: 'Spears & Pikes',
    subtitle: '2H Spears & Amazon Spears/Pikes',
    group: 'Ranged & Thrown',
    itemTypes: ['spea', 'aspe'],
    linkedTierableIds: ['base-spears', 'base-spears-secondary', 'equip-class-amazon-spears', 'equip-weap-spears']
  },
  {
    id: 'throwing',
    name: 'Throwing Knives & Axes',
    subtitle: 'Winged Knives, Winged Axes & Flying Axes',
    group: 'Ranged & Thrown',
    itemTypes: ['tkni', 'taxe'],
    linkedTierableIds: ['base-throwing', 'equip-weap-throwing']
  },

  // Melee Weapons
  {
    id: 'sword',
    name: 'Swords',
    subtitle: 'Phase Blades, Crystal Swords & Colossus Blades',
    group: 'Melee Weapons',
    itemTypes: ['swor'],
    linkedTierableIds: ['base-phase-zerker', 'base-swords-secondary', 'equip-weap-swords']
  },
  {
    id: 'axe',
    name: 'Axes',
    subtitle: 'Berserker Axes, Ettin Axes & Glorious Axes',
    group: 'Melee Weapons',
    itemTypes: ['axe'],
    linkedTierableIds: ['base-zerker-axes', 'base-axes-secondary', 'equip-weap-axes']
  },
  {
    id: 'mace',
    name: 'Maces, Flails & Hammers',
    subtitle: 'Flails, Scourges, Ogre Mauls & Thunder Mauls',
    group: 'Melee Weapons',
    itemTypes: ['mace', 'hamm'],
    linkedTierableIds: ['base-flails-maces', 'base-maces-secondary', 'equip-weap-maces']
  },
  {
    id: 'club',
    name: 'Clubs',
    subtitle: 'Clubs, Spiked Clubs, Cudgels, Truncheons & Tyrant Clubs',
    group: 'Melee Weapons',
    itemTypes: ['club'],
    linkedTierableIds: ['base-clubs', 'equip-weap-clubs']
  },
  {
    id: 'polearm',
    name: 'Polearms (Merc & 2H)',
    subtitle: 'Threshers, Giant Threshers, Cryptic Axes & Great Poleaxes',
    group: 'Melee Weapons',
    itemTypes: ['pole'],
    linkedTierableIds: ['base-elite-polearms', 'base-polearms-secondary', 'equip-weap-polearms']
  },
  {
    id: 'dagger',
    name: 'Daggers & Knives',
    subtitle: 'Bone Knives, Fanged Knives & Poignards',
    group: 'Melee Weapons',
    itemTypes: ['knif'],
    linkedTierableIds: ['base-daggers', 'equip-weap-daggers']
  },
  {
    id: 'claws',
    name: 'Assassin Claws (Hand-to-Hand)',
    subtitle: 'Runic Talons, Greater Talons, Suwayyahs & Feral Claws',
    group: 'Melee Weapons',
    itemTypes: ['h2h'],
    linkedTierableIds: ['base-sin-claws', 'base-sin-claws-secondary', 'equip-class-assassin']
  },

  // Caster, Shields & Class Gear
  {
    id: 'scepter',
    name: 'Scepters',
    subtitle: 'Caduceus, Divine Scepters & War Scepters',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['scep'],
    linkedTierableIds: ['base-scepters', 'equip-weap-scepters']
  },
  {
    id: 'wand',
    name: 'Wands',
    subtitle: 'Lich Wands, Unearthed Wands & Bone Wands',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['wand'],
    linkedTierableIds: ['base-wands', 'equip-weap-wands']
  },
  {
    id: 'staff',
    name: 'Staves',
    subtitle: 'Archon Staves, Elder Staves & Gnarled Staves',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['staf'],
    linkedTierableIds: ['base-staves', 'base-staves-secondary', 'equip-weap-staves']
  },
  {
    id: 'sorc-orb',
    name: 'Sorceress Orbs',
    subtitle: 'Dimensional Shards, Vortex Orbs & Eldritch Orbs',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['orb'],
    linkedTierableIds: ['base-sorc-orbs', 'base-sorc-orbs-secondary', 'equip-class-sorceress']
  },
  {
    id: 'warlock-grimoire',
    name: 'Warlock Grimoires',
    subtitle: 'Blasphemous Grimoires, Compendiums & Occult Codices',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['grim'],
    linkedTierableIds: ['base-warlock-grimoires', 'base-warlock-grimoires-secondary', 'equip-class-warlock']
  },
  {
    id: 'necro-head',
    name: 'Necromancer Shrunken Heads',
    subtitle: 'Succubus Skulls, Bloodlord Skulls & Overseer Skulls',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['head'],
    linkedTierableIds: ['base-necro-heads', 'base-necro-heads-secondary', 'equip-class-necromancer']
  },
  {
    id: 'paladin-shield',
    name: 'Paladin Auric Shields',
    subtitle: 'Sacred Targes, Sacred Rondaches & Vortex Shields',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['ashd'],
    linkedTierableIds: ['base-paladin-shields', 'equip-class-paladin']
  },
  {
    id: 'standard-shield',
    name: 'Standard Shields (Monarch, etc.)',
    subtitle: 'Monarchs, Troll Nests, Aegis & Ward Shields',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['shie'],
    linkedTierableIds: ['base-monarch-shields', 'base-shields-secondary', 'equip-shields-standard']
  },
  {
    id: 'barb-helm',
    name: 'Barbarian Primal Helms',
    subtitle: 'Conqueror Crowns, Guardian Crowns & Destroyer Helms',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['phlm'],
    linkedTierableIds: ['base-barb-helms', 'base-barb-helms-secondary', 'equip-class-barbarian']
  },
  {
    id: 'druid-pelt',
    name: 'Druid Pelts',
    subtitle: 'Dream Spirits, Blood Spirits & Earth Spirits',
    group: 'Caster, Shields & Class Gear',
    itemTypes: ['pelt'],
    linkedTierableIds: ['base-druid-pelts', 'base-druid-pelts-secondary', 'equip-class-druid']
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
  promoteTierBIds?: string[];
}

export const BUILD_CLASSES: readonly BuildClassMetadata[] = [
  {
    id: 'Amazon',
    name: 'Amazon',
    subtitle: 'Selects Spear, Javelin, Bow + Quiver, Crossbow + Bolt, Shields & Merc Polearms',
    defaultArchetype: 'ranged',
    enabledFamilies: ['bow-quiver', 'xbow-quiver', 'javelin', 'spear', 'standard-shield', 'polearm'],
    promoteBaseIds: [
      'base-ama-weapons',
      'base-javelins',
      'base-spears',
      'equip-rare-quivers',
      'base-diadem-tiara',
      'base-monarch-shields',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-amazon',
      'equip-class-amazon-bows',
      'equip-class-amazon-spears'
    ],
    promoteTierBIds: ['base-crossbows', 'equip-weap-bows', 'equip-weap-xbows', 'equip-weap-javelins', 'equip-weap-spears']
  },
  {
    id: 'Assassin',
    name: 'Assassin',
    subtitle: 'Selects Claws, Daggers, Swords, Standard Shields & Merc Polearms',
    defaultArchetype: 'melee',
    enabledFamilies: ['claws', 'dagger', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: [
      'base-sin-claws',
      'base-phase-zerker',
      'base-diadem-tiara',
      'base-monarch-shields',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-assassin'
    ],
    promoteTierBIds: ['base-flails-maces', 'base-daggers', 'equip-weap-daggers', 'equip-weap-swords']
  },
  {
    id: 'Barbarian',
    name: 'Barbarian',
    subtitle: 'Selects Swords, Axes, Maces/Hammers, Clubs, Polearms, Spears, Throwing, Shields & Primal Helms',
    defaultArchetype: 'melee',
    enabledFamilies: ['sword', 'axe', 'mace', 'club', 'polearm', 'spear', 'throwing', 'standard-shield', 'barb-helm'],
    promoteBaseIds: [
      'base-barb-helms',
      'base-phase-zerker',
      'base-zerker-axes',
      'base-elite-polearms',
      'base-spears',
      'base-monarch-shields',
      'base-elite-body',
      'equip-class-barbarian'
    ],
    promoteTierBIds: [
      'base-flails-maces',
      'base-throwing',
      'base-clubs',
      'equip-weap-swords',
      'equip-weap-axes',
      'equip-weap-maces',
      'equip-weap-polearms',
      'equip-weap-spears',
      'equip-weap-throwing',
      'equip-weap-clubs'
    ]
  },
  {
    id: 'Druid',
    name: 'Druid',
    subtitle: 'Selects Druid Pelts, Clubs, Polearms, Axes, Staves, Swords & Standard Shields',
    defaultArchetype: 'caster',
    enabledFamilies: ['druid-pelt', 'club', 'polearm', 'axe', 'staff', 'sword', 'standard-shield'],
    promoteBaseIds: [
      'base-druid-pelts',
      'base-monarch-shields',
      'base-elite-polearms',
      'base-phase-zerker',
      'base-zerker-axes',
      'base-elite-body',
      'equip-class-druid'
    ],
    promoteTierBIds: ['base-staves', 'base-clubs', 'equip-weap-staves', 'equip-weap-clubs', 'equip-weap-polearms', 'equip-weap-axes']
  },
  {
    id: 'Necromancer',
    name: 'Necromancer',
    subtitle: 'Selects Wands, Shrunken Heads, Daggers, Swords/Flails, Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['wand', 'necro-head', 'dagger', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: [
      'base-necro-heads',
      'base-wands',
      'base-monarch-shields',
      'base-phase-zerker',
      'base-flails-maces',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-necromancer'
    ],
    promoteTierBIds: ['base-daggers', 'equip-weap-wands', 'equip-weap-daggers']
  },
  {
    id: 'Paladin',
    name: 'Paladin',
    subtitle: 'Selects Scepters, Paladin Shields, Swords, Maces/Flails, Axes & Merc Polearms',
    defaultArchetype: 'melee',
    enabledFamilies: ['scepter', 'paladin-shield', 'sword', 'mace', 'axe', 'polearm'],
    promoteBaseIds: [
      'base-paladin-shields',
      'base-scepters',
      'base-phase-zerker',
      'base-flails-maces',
      'base-zerker-axes',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-paladin'
    ],
    promoteTierBIds: ['equip-weap-scepters', 'equip-weap-swords', 'equip-weap-maces', 'equip-weap-axes']
  },
  {
    id: 'Sorceress',
    name: 'Sorceress',
    subtitle: 'Selects Sorceress Orbs, Staves, Swords/Flails, Standard Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['sorc-orb', 'staff', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: [
      'base-sorc-orbs',
      'base-staves',
      'base-diadem-tiara',
      'base-monarch-shields',
      'base-phase-zerker',
      'base-flails-maces',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-sorceress'
    ],
    promoteTierBIds: ['equip-weap-staves']
  },
  {
    id: 'Warlock',
    name: 'Warlock',
    subtitle: 'Selects Warlock Grimoires, Daggers, Staves, Swords/Flails, Shields & Merc Polearms',
    defaultArchetype: 'caster',
    enabledFamilies: ['warlock-grimoire', 'dagger', 'staff', 'sword', 'mace', 'standard-shield', 'polearm'],
    promoteBaseIds: [
      'base-warlock-grimoires',
      'base-daggers',
      'base-staves',
      'base-diadem-tiara',
      'base-monarch-shields',
      'base-phase-zerker',
      'base-flails-maces',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-warlock'
    ],
    promoteTierBIds: ['equip-weap-daggers', 'equip-weap-staves']
  }
] as const;

export const BUILD_ARCHETYPES: readonly {
  id: BuildArchetypeId;
  name: string;
  subtitle: string;
  enabledFamilies: EquipmentFamilyId[];
  promoteIds: string[];
  promoteTierBIds?: string[];
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
    promoteIds: [
      'base-warlock-grimoires',
      'base-sorc-orbs',
      'base-necro-heads',
      'base-druid-pelts',
      'base-paladin-shields',
      'base-monarch-shields',
      'base-diadem-tiara',
      'base-phase-zerker',
      'base-flails-maces',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-sorceress',
      'equip-class-warlock',
      'equip-class-necromancer',
      'equip-class-druid',
      'equip-class-paladin'
    ],
    promoteTierBIds: [
      'base-wands',
      'base-staves',
      'base-scepters',
      'base-daggers',
      'equip-weap-wands',
      'equip-weap-staves',
      'equip-weap-scepters',
      'equip-weap-daggers'
    ]
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
    promoteIds: [
      'base-phase-zerker',
      'base-zerker-axes',
      'base-flails-maces',
      'base-elite-polearms',
      'base-spears',
      'base-sin-claws',
      'base-barb-helms',
      'base-druid-pelts',
      'base-paladin-shields',
      'base-monarch-shields',
      'base-elite-body',
      'equip-class-assassin',
      'equip-class-barbarian',
      'equip-class-druid',
      'equip-class-paladin'
    ],
    promoteTierBIds: [
      'base-scepters',
      'base-clubs',
      'base-daggers',
      'equip-weap-swords',
      'equip-weap-axes',
      'equip-weap-maces',
      'equip-weap-polearms',
      'equip-weap-spears',
      'equip-class-amazon-spears',
      'equip-weap-scepters',
      'equip-weap-clubs',
      'equip-weap-daggers'
    ]
  },
  {
    id: 'ranged',
    name: 'Ranged (Bow / Crossbow / Javelin / Throw)',
    subtitle: 'Bows + Quivers, Crossbows + Bolts, Javelins, Spears, Throwing Weapons, Shields & Merc Polearms',
    enabledFamilies: ['bow-quiver', 'xbow-quiver', 'javelin', 'spear', 'throwing', 'standard-shield', 'polearm'],
    promoteIds: [
      'base-ama-weapons',
      'base-javelins',
      'base-spears',
      'base-crossbows',
      'base-throwing',
      'equip-rare-quivers',
      'base-diadem-tiara',
      'base-monarch-shields',
      'base-elite-polearms',
      'base-elite-body',
      'equip-class-amazon',
      'equip-class-amazon-bows',
      'equip-class-amazon-spears'
    ],
    promoteTierBIds: [
      'equip-weap-bows',
      'equip-weap-xbows',
      'equip-weap-javelins',
      'equip-weap-spears',
      'equip-weap-throwing'
    ]
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

export function syncBuildProfileOverrides(config: V2Config): void {
  const profile = config.buildProfile;
  const disabledSet = new Set<EquipmentFamilyId>(profile.disabledFamilies ?? []);
  const enabledSet = new Set<EquipmentFamilyId>(
    ALL_EQUIPMENT_FAMILY_IDS.filter(id => !disabledSet.has(id))
  );

  const nextOverrides = { ...config.itemOverrides };
  for (const item of TIERABLE_ITEMS) {
    if (
      (item.equipmentFamilies && item.equipmentFamilies.length > 0) ||
      item.id === 'base-elite-body' ||
      item.id === 'base-diadem-tiara'
    ) {
      delete nextOverrides[item.id];
    }
  }

  // If everything is enabled and no class/archetype is selected, leave defaults
  if (!profile.selectedClass && !profile.archetype && disabledSet.size === 0) {
    config.itemOverrides = nextOverrides;
    return;
  }

  // Promote primary bases & equipment for selected class or archetype
  const promotedTierA = new Set<string>();
  const promotedTierB = new Set<string>();

  if (profile.selectedClass) {
    const cls = BUILD_CLASSES.find(c => c.id === profile.selectedClass);
    if (cls) {
      for (const id of cls.promoteBaseIds) promotedTierA.add(id);
      for (const id of cls.promoteTierBIds ?? []) promotedTierB.add(id);
    }
  } else if (profile.archetype) {
    const arch = BUILD_ARCHETYPES.find(a => a.id === profile.archetype);
    if (arch) {
      for (const id of arch.promoteIds) promotedTierA.add(id);
      for (const id of arch.promoteTierBIds ?? []) promotedTierB.add(id);
    }
  }

  for (const id of promotedTierB) {
    const item = TIERABLE_ITEMS.find(x => x.id === id);
    if (!item) continue;
    const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
    if (defaultForStrictness !== 'B') {
      nextOverrides[id] = 'B';
    }
  }

  for (const id of promotedTierA) {
    const item = TIERABLE_ITEMS.find(x => x.id === id);
    if (!item) continue;
    const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
    if (defaultForStrictness !== 'A') {
      nextOverrides[id] = 'A';
    }
  }

  // Move any base, equipment, or quiver group whose underlying equipment families are all disabled into HIDE
  for (const item of TIERABLE_ITEMS) {
    if (item.equipmentFamilies && item.equipmentFamilies.length > 0) {
      const anyEnabled = item.equipmentFamilies.some(famId => enabledSet.has(famId));
      if (!anyEnabled) {
        nextOverrides[item.id] = 'HIDE';
      }
    }
  }

  config.itemOverrides = nextOverrides;
}

function promotedTierForBuildProfile(itemId: string, profile: BuildProfile): TierRank | undefined {
  if (profile.selectedClass) {
    const cls = BUILD_CLASSES.find(c => c.id === profile.selectedClass);
    if (cls?.promoteBaseIds.includes(itemId)) return 'A';
    if (cls?.promoteTierBIds?.includes(itemId)) return 'B';
  } else if (profile.archetype) {
    const arch = BUILD_ARCHETYPES.find(a => a.id === profile.archetype);
    if (arch?.promoteIds.includes(itemId)) return 'A';
    if (arch?.promoteTierBIds?.includes(itemId)) return 'B';
  }
  return undefined;
}

export function isFamilyExplicitlyHidden(item: TierableItem, config: V2Config): boolean {
  if (!item.equipmentFamilies?.length) return false;
  if (effectiveItemTier(item, config) !== 'HIDE') return false;
  if (config.itemOverrides[item.id] === 'HIDE') return true;
  const disabled = config.buildProfile?.disabledFamilies ?? [];
  return item.equipmentFamilies.every(famId => disabled.includes(famId));
}

export function isBaseCardHardHidden(item: TierableItem, config: V2Config): boolean {
  if (effectiveItemTier(item, config) !== 'HIDE') return false;
  if (item.category !== 'bases' || item.id === 'base-elite-gloves-boots-belts') return true;
  return config.itemOverrides[item.id] === 'HIDE' || isFamilyExplicitlyHidden(item, config);
}

export function isBaseCardSoftHiddenByStrictness(item: TierableItem, config: V2Config): boolean {
  return (
    item.category === 'bases' &&
    effectiveItemTier(item, config) === 'HIDE' &&
    !isBaseCardHardHidden(item, config)
  );
}

export function isWholeBaseFamilyExplicitlyHidden(item: TierableItem, config: V2Config): boolean {
  if (item.category !== 'bases' || !item.equipmentFamilies?.length) return false;
  if (!isFamilyExplicitlyHidden(item, config)) return false;
  return item.equipmentFamilies.every(famId => {
    const famBaseItems = TIERABLE_ITEMS.filter(
      x => x.category === 'bases' && x.equipmentFamilies?.includes(famId)
    );
    return famBaseItems.length > 0 && famBaseItems.every(x => isFamilyExplicitlyHidden(x, config));
  });
}

export function syncDisabledFamiliesFromOverrides(config: V2Config): void {
  const prevDisabled = new Set<EquipmentFamilyId>(config.buildProfile?.disabledFamilies ?? []);
  const nextDisabled: EquipmentFamilyId[] = [];
  for (const famId of ALL_EQUIPMENT_FAMILY_IDS) {
    const linkedItems = TIERABLE_ITEMS.filter(
      item =>
        (item.category === 'bases' || item.category === 'equipment') &&
        item.equipmentFamilies?.includes(famId)
    );
    if (linkedItems.length > 0 && linkedItems.every(item => config.itemOverrides[item.id] === 'HIDE')) {
      nextDisabled.push(famId);
    }
  }
  const nextDisabledSet = new Set<EquipmentFamilyId>(nextDisabled);
  // If a quiver family was re-enabled via Tab 2, lift any build-imposed HIDE on misc quivers
  for (const qFam of ['bow-quiver', 'xbow-quiver'] as const) {
    if (prevDisabled.has(qFam) && !nextDisabledSet.has(qFam)) {
      for (const qId of ['misc-normal-quivers', 'misc-magic-quivers']) {
        if (config.itemOverrides[qId] === 'HIDE') {
          delete config.itemOverrides[qId];
        }
      }
    }
  }
  config.buildProfile = {
    ...config.buildProfile,
    disabledFamilies: nextDisabled
  };
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
  const nextDisabled = ALL_EQUIPMENT_FAMILY_IDS.filter(id => currentDisabled.has(id));
  const enabledSet = new Set<EquipmentFamilyId>(ALL_EQUIPMENT_FAMILY_IDS.filter(id => !currentDisabled.has(id)));
  config.buildProfile = {
    ...config.buildProfile,
    disabledFamilies: nextDisabled,
    presetId: undefined
  };

  // Surgically update only items belonging to the toggled family so unrelated Tab 2 overrides stay intact
  const nextOverrides = { ...config.itemOverrides };
  for (const item of TIERABLE_ITEMS) {
    if (!item.equipmentFamilies?.includes(familyId)) continue;
    const anyEnabled = item.equipmentFamilies.some(f => enabledSet.has(f));
    if (!anyEnabled) {
      nextOverrides[item.id] = 'HIDE';
    } else if (nextOverrides[item.id] === 'HIDE') {
      const promoted = promotedTierForBuildProfile(item.id, config.buildProfile);
      const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
      if (promoted && promoted !== defaultForStrictness) {
        nextOverrides[item.id] = promoted;
      } else {
        delete nextOverrides[item.id];
      }
    }
  }
  config.itemOverrides = nextOverrides;
}

export function enableAllFamiliesForBuild(config: V2Config): void {
  config.buildProfile = {
    ...config.buildProfile,
    disabledFamilies: [],
    presetId: undefined
  };
  const nextOverrides = { ...config.itemOverrides };
  for (const item of TIERABLE_ITEMS) {
    if (item.equipmentFamilies?.length && nextOverrides[item.id] === 'HIDE') {
      const promoted = promotedTierForBuildProfile(item.id, config.buildProfile);
      const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
      if (promoted && promoted !== defaultForStrictness) {
        nextOverrides[item.id] = promoted;
      } else {
        delete nextOverrides[item.id];
      }
    }
  }
  config.itemOverrides = nextOverrides;
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
    rarityTierStyleOverrides: {},
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

const WINDOWS_RESERVED_FILENAME_RE = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;

export function sanitizeFilterFilename(rawName?: string | null, fallbackStem = 'filter'): string {
  let stem = (rawName ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/(?:\.json)+$/i, '')
    .replace(/[/\\|:·•—–]+/g, ' - ')
    .replace(/[^A-Za-z0-9 _().-]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/(?:\s*-\s*){2,}/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/^[.\s-]+|[.\s-]+$/g, '')
    .slice(0, 80)
    .replace(/[.\s-]+$/g, '');

  if (!stem || WINDOWS_RESERVED_FILENAME_RE.test(stem)) {
    stem = fallbackStem;
  }
  return `${stem}.json`;
}

export interface BaseSlotFilter {
  id: string;
  label: string;
  group: 'All' | 'Armor & Offhands' | 'Weapons & Quivers';
  typeCodes: string[];
}

export const BASE_SLOT_FILTERS: readonly BaseSlotFilter[] = [
  { id: 'all', label: 'All Equipment (523)', group: 'All', typeCodes: [] },
  // Armor & Offhands
  { id: 'tors', label: 'Body Armor', group: 'Armor & Offhands', typeCodes: ['tors'] },
  { id: 'helm', label: 'Helms', group: 'Armor & Offhands', typeCodes: ['helm'] },
  { id: 'circ', label: 'Circlets', group: 'Armor & Offhands', typeCodes: ['circ'] },
  { id: 'shie', label: 'Standard Shields', group: 'Armor & Offhands', typeCodes: ['shie'] },
  { id: 'glov', label: 'Gloves', group: 'Armor & Offhands', typeCodes: ['glov'] },
  { id: 'boot', label: 'Boots', group: 'Armor & Offhands', typeCodes: ['boot'] },
  { id: 'belt', label: 'Belts', group: 'Armor & Offhands', typeCodes: ['belt'] },
  { id: 'grim', label: 'Warlock Grimoires', group: 'Armor & Offhands', typeCodes: ['grim'] },
  { id: 'pelt', label: 'Druid Pelts', group: 'Armor & Offhands', typeCodes: ['pelt'] },
  { id: 'phlm', label: 'Barb Helms', group: 'Armor & Offhands', typeCodes: ['phlm'] },
  { id: 'ashd', label: 'Paladin Shields', group: 'Armor & Offhands', typeCodes: ['ashd'] },
  { id: 'head', label: 'Necro Heads', group: 'Armor & Offhands', typeCodes: ['head'] },
  // Weapons & Quivers
  { id: 'swor', label: 'Swords', group: 'Weapons & Quivers', typeCodes: ['swor'] },
  { id: 'axe', label: 'Axes', group: 'Weapons & Quivers', typeCodes: ['axe'] },
  { id: 'mace-hamm', label: 'Maces & Hammers', group: 'Weapons & Quivers', typeCodes: ['mace', 'hamm'] },
  { id: 'club', label: 'Clubs', group: 'Weapons & Quivers', typeCodes: ['club'] },
  { id: 'pole', label: 'Polearms', group: 'Weapons & Quivers', typeCodes: ['pole'] },
  { id: 'spea', label: 'Spears', group: 'Weapons & Quivers', typeCodes: ['spea', 'aspe'] },
  { id: 'bow', label: 'Bows & Quivers', group: 'Weapons & Quivers', typeCodes: ['bow', 'abow', 'bowq', 'mboq'] },
  { id: 'xbow', label: 'Crossbows & Bolts', group: 'Weapons & Quivers', typeCodes: ['xbow', 'xboq', 'mxbq'] },
  { id: 'jave', label: 'Javelins', group: 'Weapons & Quivers', typeCodes: ['jave', 'ajav'] },
  { id: 'thro', label: 'Throwing', group: 'Weapons & Quivers', typeCodes: ['tkni', 'taxe'] },
  { id: 'knif', label: 'Daggers', group: 'Weapons & Quivers', typeCodes: ['knif'] },
  { id: 'h2h', label: 'Assassin Claws', group: 'Weapons & Quivers', typeCodes: ['h2h', 'h2h2'] },
  { id: 'scep', label: 'Scepters', group: 'Weapons & Quivers', typeCodes: ['scep'] },
  { id: 'wand', label: 'Wands', group: 'Weapons & Quivers', typeCodes: ['wand'] },
  { id: 'staf', label: 'Staves', group: 'Weapons & Quivers', typeCodes: ['staf'] },
  { id: 'orb', label: 'Sorceress Orbs', group: 'Weapons & Quivers', typeCodes: ['orb'] }
] as const;

export interface ResolvedBaseEntry {
  code: string;
  label: string;
  tier?: 'normal' | 'exceptional' | 'elite';
  kind: string;
  mode: CustomBaseRule['mode'];
  notableNames?: string;
}

export interface GroupDisplayInfo {
  label: string;
  subtitle?: string;
  allBases: ResolvedBaseEntry[];
  activeBases: ResolvedBaseEntry[];
  splitBases: { entry: ResolvedBaseEntry; rule: CustomBaseRule }[];
}

export function defaultBaseModeForItem(item: TierableItem): CustomBaseRule['mode'] {
  if (item.category === 'bases') return 'runeword';
  if (item.rarities?.length) {
    const r = item.rarities;
    if (r.includes('unique') && r.includes('set')) return 'unique-set';
    if (r.includes('unique')) return 'unique';
    if (r.includes('set')) return 'set';
    if (r.includes('rare') && r.includes('crafted')) return 'rare-crafted';
    if (r.includes('rare')) return 'rare';
    if (r.includes('magic')) return 'magic';
    if (r.includes('crafted')) return 'crafted';
  }
  return 'any';
}

export function modesMatchGroupMode(
  ruleMode: CustomBaseRule['mode'],
  groupMode: CustomBaseRule['mode']
): boolean {
  if (ruleMode === groupMode) return true;
  if (groupMode === 'unique-set' && (ruleMode === 'unique' || ruleMode === 'set')) return true;
  if (groupMode === 'rare-crafted' && (ruleMode === 'rare' || ruleMode === 'crafted')) return true;
  return false;
}

export function modeCoversGroupMode(
  ruleMode: CustomBaseRule['mode'],
  groupMode: CustomBaseRule['mode']
): boolean {
  return ruleMode === groupMode || ruleMode === 'any';
}

function cleanCatalogItemLabel(b: {
  code?: string;
  name: string;
  displayName?: string;
  kind: string;
}): string {
  if (b.code === 'cjw') return 'Colossal Jewel';
  if (b.code === 'cs1') return 'Sunder Grand Charm';
  if (b.code === 'cs2') return 'Renewed Sunder Charm';
  if (b.code === 'cm4') return "Collin's Small Charm";
  if (b.code === 'cm5') return "Collin's Destruction Charm";
  if (b.kind === 'weapon' || b.kind === 'armor') {
    return (b.displayName || b.name || b.code || '').split(/\r?\n/)[0]!.trim();
  }
  const raw = b.displayName || b.name || b.code || '';
  if (!raw.includes('\n')) return raw.trim();
  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  return lines[lines.length - 1] || lines[0] || b.code || '';
}

export function formatNaturalBaseList(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
}

export function resolveTierableItemBases(
  item: TierableItem,
  catalog: Catalog
): ResolvedBaseEntry[] {
  if (item.category === 'runes' || item.subtitle?.includes('(Stack)')) {
    return [];
  }
  if (!catalog.baseItems.length) return [];

  const mode = defaultBaseModeForItem(item);
  const matchedBases: Catalog['baseItems'] = [];

  if (item.codes && item.codes.length > 1) {
    for (const code of item.codes) {
      const b = catalog.baseItems.find(x => x.code === code);
      if (b) matchedBases.push(b);
    }
  } else if (!item.codes?.length && (item.baseNames?.length || item.itemTypes?.length)) {
    for (const b of catalog.baseItems) {
      if (!b.code) continue;
      if (b.code === 'cjw' || b.code === 'cs1' || b.code === 'cs2' || b.code === 'tch' || b.code === 'cm4' || b.code === 'cm5') continue;
      if (item.baseNames?.length) {
        const matchesName =
          item.baseNames.includes(b.name) || (b.displayName != null && item.baseNames.includes(b.displayName));
        if (!matchesName) continue;
      }
      if (item.itemTypes?.length) {
        const matchesType = item.itemTypes.some(t => catalog.itemTypeMap.get(t)?.has(b.code!));
        if (!matchesType) continue;
      }
      if (item.tiers?.length) {
        if (!b.tier || !item.tiers.includes(b.tier)) continue;
      }
      if (mode === 'set' && catalog.setItems.length > 0) {
        if (!catalog.setItems.some(s => s.baseCode === b.code)) continue;
      } else if (mode === 'unique' && catalog.uniqueItems.length > 0) {
        if (!catalog.uniqueItems.some(u => u.baseCode === b.code)) continue;
      }
      matchedBases.push(b);
    }
  }

  if (matchedBases.length <= 1) return [];

  return matchedBases.map(b => {
    const code = b.code!;
    const label = cleanCatalogItemLabel(b) || code;
    let notableNames: string | undefined;
    if (mode === 'unique' || mode === 'set' || mode === 'unique-set' || (mode === 'any' && item.category === 'uniques')) {
      const uNames = mode !== 'set' ? catalog.uniqueItems.filter(u => u.baseCode === code).map(u => u.name) : [];
      const sNames = mode !== 'unique' ? catalog.setItems.filter(s => s.baseCode === code).map(s => s.name) : [];
      const combined = [...new Set([...uNames, ...sNames])];
      if (combined.length > 0) {
        notableNames = combined.slice(0, 3).join(', ') + (combined.length > 3 ? ` +${combined.length - 3}` : '');
      }
    }
    return {
      code,
      label,
      tier: b.tier,
      kind: b.kind,
      mode,
      notableNames
    };
  });
}

export function findParentGroupForBase(
  code: string,
  mode: CustomBaseRule['mode'],
  catalog?: Catalog,
  parentItemId?: string
): TierableItem | undefined {
  if (parentItemId) {
    const byId = TIERABLE_ITEMS.find(i => i.id === parentItemId);
    if (byId && (!byId.codes?.length || byId.codes.includes(code))) return byId;
  }

  // 1. Prioritize explicit multi-code groups (such as base-elite-body, base-monarch-shields, etc.)
  for (const item of TIERABLE_ITEMS) {
    if (item.category === 'runes' || item.subtitle?.includes('(Stack)')) continue;
    if (item.codes && item.codes.length > 1 && item.codes.includes(code)) {
      if (modesMatchGroupMode(mode, defaultBaseModeForItem(item))) {
        return item;
      }
    }
  }

  // 2. Fall back to itemTypes / baseNames groups if catalog is available
  if (catalog) {
    for (const item of TIERABLE_ITEMS) {
      if (item.codes?.length) continue;
      if (!modesMatchGroupMode(mode, defaultBaseModeForItem(item))) continue;
      const bases = resolveTierableItemBases(item, catalog);
      if (bases.some(b => b.code === code)) {
        return item;
      }
    }
  }

  return undefined;
}

export function getGroupDisplayInfo(
  item: TierableItem,
  config: V2Config,
  catalog: Catalog
): GroupDisplayInfo {
  const allBases = resolveTierableItemBases(item, catalog);
  if (allBases.length <= 1) {
    return {
      label: item.label,
      subtitle: item.subtitle,
      allBases,
      activeBases: allBases,
      splitBases: []
    };
  }

  const groupTier = effectiveItemTier(item, config);
  const parentSoftHidden = isBaseCardSoftHiddenByStrictness(item, config);
  const groupMode = defaultBaseModeForItem(item);
  const activeBases: ResolvedBaseEntry[] = [];
  const splitBases: { entry: ResolvedBaseEntry; rule: CustomBaseRule }[] = [];

  for (const entry of allBases) {
    const matchingRule = config.customBases.find(
      cb =>
        cb.code === entry.code &&
        modeCoversGroupMode(cb.mode, groupMode) &&
        (cb.parentItemId === item.id ||
          ((!cb.parentItemId ||
            !TIERABLE_ITEMS.find(x => x.id === cb.parentItemId)?.codes?.includes(cb.code)) &&
            findParentGroupForBase(cb.code, cb.mode, catalog)?.id === item.id))
    );

    if (
      matchingRule &&
      (matchingRule.tier !== groupTier ||
        (matchingRule.tier === 'HIDE' && parentSoftHidden) ||
        matchingRule.minSockets ||
        matchingRule.etherealOnly)
    ) {
      splitBases.push({ entry, rule: matchingRule });
    } else {
      activeBases.push(entry);
    }
  }

  if (splitBases.length === 0) {
    return {
      label: item.label,
      subtitle: item.subtitle,
      allBases,
      activeBases,
      splitBases
    };
  }

  let label = item.label;
  let subtitle = item.subtitle;

  if (activeBases.length === 0) {
    label = `${item.label} (All split to other tiers)`;
  } else if (allBases.length <= 6 || activeBases.length <= 4) {
    const joined = formatNaturalBaseList(activeBases.map(b => b.label));
    if (item.id === 'base-diadem-tiara') {
      label = `${joined} (White/Socketed Bases)`;
    } else {
      label = joined;
    }

    if (item.subtitle?.includes(' · ')) {
      const desc = item.subtitle.split(' · ').slice(1).join(' · ');
      subtitle = `${activeBases.map(b => b.code).join(', ')} · ${desc}`;
    } else if (item.codes && item.codes.length > 1) {
      subtitle = activeBases.map(b => b.code).join(', ');
    }
  } else {
    const cleanParentTitle = item.label.replace(/\s*\(All \d+.*?\)/i, '');
    const removedPreview =
      splitBases
        .slice(0, 3)
        .map(s => s.entry.label)
        .join(', ') + (splitBases.length > 3 ? ` +${splitBases.length - 3} more` : '');
    label = `${cleanParentTitle} (minus ${removedPreview})`;
  }

  return {
    label,
    subtitle,
    allBases,
    activeBases,
    splitBases
  };
}

/**
 * Reconciles individual split bases with their parent TierableItem groups:
 * 1. If every member of a group has been split out (0 active bases left in the group's old tier),
 *    moves the parent group itself to the tier of the newly moved member so no empty ghost group remains.
 * 2. Any split base that is now in the SAME tier as its parent group (with no custom socket/ethereal filter)
 *    automatically rejoins its parent group and restores the group's dynamic name.
 */
export function reconcileGroupSplits(config: V2Config, catalog: Catalog): void {
  // Pass 1: If a group has had all of its members moved out to other tiers, move the group to the target tier
  for (const item of TIERABLE_ITEMS) {
    const allBases = resolveTierableItemBases(item, catalog);
    if (allBases.length <= 1) continue;
    const groupMode = defaultBaseModeForItem(item);
    const memberRules = allBases.map(entry =>
      config.customBases.find(
        cb =>
          cb.code === entry.code &&
          !cb.minSockets &&
          !cb.etherealOnly &&
          modeCoversGroupMode(cb.mode, groupMode) &&
          (cb.parentItemId === item.id ||
            ((!cb.parentItemId ||
              !TIERABLE_ITEMS.find(x => x.id === cb.parentItemId)?.codes?.includes(cb.code)) &&
              findParentGroupForBase(cb.code, cb.mode, catalog)?.id === item.id))
      )
    );

    if (memberRules.every(r => r !== undefined)) {
      // Find the most recently added/updated rule in config.customBases (index 0 or first matching)
      const firstMatch = config.customBases.find(cb => memberRules.includes(cb));
      const newGroupTier = firstMatch?.tier ?? memberRules[0]!.tier;
      const defaultForStrictness = item.strictnessTiers?.[config.strictness] ?? item.defaultTier;
      const requiresExplicitHardHide =
        newGroupTier === 'HIDE' &&
        item.category === 'bases' &&
        item.id !== 'base-elite-gloves-boots-belts' &&
        defaultForStrictness === 'HIDE';
      if (newGroupTier === defaultForStrictness && !requiresExplicitHardHide) {
        delete config.itemOverrides[item.id];
      } else {
        config.itemOverrides[item.id] = newGroupTier;
      }
    }
  }

  // Pass 2: Any split base that sits in the same tier as its parent group (without special socket/eth rules) rejoins the group
  config.customBases = config.customBases.filter(cb => {
    if (cb.minSockets || cb.etherealOnly) return true;
    const parentGroup = findParentGroupForBase(cb.code, cb.mode, catalog, cb.parentItemId);
    if (!parentGroup) return true;
    if (!modeCoversGroupMode(cb.mode, defaultBaseModeForItem(parentGroup))) return true;
    if (cb.tier === 'HIDE' && isBaseCardSoftHiddenByStrictness(parentGroup, config)) {
      return true;
    }
    const groupTier = effectiveItemTier(parentGroup, config);
    return cb.tier !== groupTier;
  });

  config.itemOverrides = { ...config.itemOverrides };
}

function defaultBaseCategoryTierStyle(
  tier: Exclude<TierRank, 'HIDE'>,
  themeBase: TierStyle
): TierStyle {
  // Runeword & Crafting Bases (Normal/Superior/Ethereal white & grey items) use crisp Pure White & Cool Steel-Silver
  // on dark cool slate so they NEVER resemble warm Unique Gold, Rare Yellow, or Rune Orange on the ground.
  if (tier === 'S') {
    return {
      backgroundColor: 'RGBA(12, 22, 38, 0.95)',
      borderColor: 'RGBA(215, 240, 255, 1)',
      textColor: 'RGBA(255, 255, 255, 1)',
      dropSound: themeBase.dropSound ?? 'Filter01',
      minimapIcon: {
        shape: 'star',
        size: 24,
        borderColor: 'RGBA(45, 70, 100, 1)',
        fillColor: 'RGBA(245, 250, 255, 1)'
      },
      namePrefix: themeBase.namePrefix ?? '★ {name} ★'
    };
  }
  if (tier === 'A') {
    return {
      backgroundColor: 'RGBA(14, 20, 30, 0.93)',
      borderColor: 'RGBA(240, 247, 255, 1)',
      textColor: 'RGBA(255, 255, 255, 1)',
      dropSound: themeBase.dropSound ?? 'Filter02',
      minimapIcon: {
        shape: 'diamond',
        size: 20,
        borderColor: 'RGBA(55, 75, 100, 1)',
        fillColor: 'RGBA(240, 247, 255, 1)'
      }
    };
  }
  if (tier === 'B') {
    return {
      backgroundColor: 'RGBA(14, 18, 25, 0.89)',
      borderColor: 'RGBA(180, 200, 224, 0.92)',
      textColor: 'RGBA(236, 243, 252, 1)',
      dropSound: themeBase.dropSound ?? 'Filter03',
      minimapIcon: {
        shape: 'circle',
        size: 16,
        borderColor: 'RGBA(50, 68, 90, 1)',
        fillColor: 'RGBA(198, 214, 232, 1)'
      }
    };
  }
  if (tier === 'C') {
    return {
      backgroundColor: 'RGBA(12, 15, 20, 0.85)',
      borderColor: 'RGBA(125, 142, 165, 0.75)',
      textColor: 'RGBA(208, 218, 230, 1)'
    };
  }
  return {
    textColor: 'RGBA(168, 178, 190, 0.9)'
  };
}

export function effectiveTierStyle(
  tier: Exclude<TierRank, 'HIDE'>,
  config: V2Config,
  category?: CategoryId
): TierStyle {
  const themeBase = THEME_PRESETS[config.theme]?.tiers[tier] ?? THEME_PRESETS.reimagined.tiers[tier];
  const base = category === 'bases' ? defaultBaseCategoryTierStyle(tier, themeBase) : themeBase;
  const globalOverride = config.tierStyleOverrides[tier] ?? {};
  const catOverride = (category && config.categoryTierStyleOverrides[category]?.[tier]) ?? {};
  return {
    ...base,
    ...globalOverride,
    ...catOverride
  };
}

export const EDITABLE_RARITY_STYLES: readonly {
  id: ItemRarityStyleKind;
  label: string;
  shortLabel: string;
  sampleDrop: string;
  badgeClass: string;
}[] = [
  { id: 'unique', label: 'Uniques (Sanctuary Gold)', shortLabel: 'Unique', sampleDrop: 'Shako [E] (86)', badgeClass: 'border-amber-400/50 bg-amber-950/60 text-amber-200' },
  { id: 'set', label: 'Sets (Emerald Green)', shortLabel: 'Set', sampleDrop: 'Lacquered Plate [E] (86)', badgeClass: 'border-emerald-400/50 bg-emerald-950/60 text-emerald-300' },
  { id: 'base', label: 'Runeword & Crafting Bases', shortLabel: 'Base', sampleDrop: 'Monarch [E] (86)', badgeClass: 'border-slate-300/45 bg-slate-900/80 text-slate-100' },
  { id: 'rare', label: 'Rares (Canary Yellow)', shortLabel: 'Rare', sampleDrop: 'Diadem [E] (86)', badgeClass: 'border-yellow-400/50 bg-yellow-950/60 text-yellow-200' },
  { id: 'crafted', label: 'Crafted Gear (Blood-Orange)', shortLabel: 'Crafted', sampleDrop: 'Vampirebone Gloves [E] (88)', badgeClass: 'border-orange-400/50 bg-orange-950/60 text-orange-300' },
  { id: 'magic', label: 'Magic Charms & Jewels (Cobalt Blue)', shortLabel: 'Magic', sampleDrop: 'Grand Charm (85)', badgeClass: 'border-blue-400/50 bg-blue-950/60 text-blue-300' }
] as const;

function isLightPlateColor(rgbaStr: string | undefined): boolean {
  const parsed = M.parseRgba(rgbaStr);
  if (!parsed) return false;
  const lum = 0.299 * parsed.r + 0.587 * parsed.g + 0.114 * parsed.b;
  return lum > 165 && parsed.a >= 0.5;
}

function defaultRarityTierStyleFromTheme(
  tier: Exclude<TierRank, 'HIDE'>,
  themeBase: TierStyle,
  rarityKind?: ItemRarityStyleKind,
  sharedTierSBackground?: string
): TierStyle {
  if (!rarityKind) return themeBase;
  if (rarityKind === 'base') return defaultBaseCategoryTierStyle(tier, themeBase);
  const base = themeBase;

  // Magic items must NEVER use Unique gold, Rare yellow, Set green, Base white, or high-rune orange/purple colors
  if (rarityKind === 'magic') {
    if (tier === 'S') {
      return {
        ...base,
        backgroundColor: 'RGBA(12, 26, 62, 0.94)',
        borderColor: 'RGBA(110, 180, 255, 1)',
        textColor: 'RGBA(205, 232, 255, 1)',
        minimapIcon: base.minimapIcon
          ? { ...base.minimapIcon, fillColor: 'RGBA(95, 165, 255, 1)' }
          : undefined
      };
    }
    if (tier === 'A') {
      return {
        backgroundColor: 'RGBA(12, 24, 54, 0.92)',
        borderColor: 'RGBA(95, 160, 255, 1)',
        textColor: 'RGBA(175, 212, 255, 1)',
        dropSound: base.dropSound,
        minimapIcon: base.minimapIcon
          ? { ...base.minimapIcon, fillColor: 'RGBA(95, 160, 255, 1)' }
          : undefined
      };
    }
    if (tier === 'B') {
      return {
        backgroundColor: 'RGBA(12, 20, 42, 0.88)',
        borderColor: 'RGBA(80, 140, 245, 0.9)',
        textColor: 'RGBA(140, 185, 255, 1)',
        minimapIcon: {
          shape: 'circle',
          size: 16,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(80, 140, 245, 1)'
        }
      };
    }
    if (tier === 'C') {
      return {
        backgroundColor: 'RGBA(12, 16, 30, 0.84)',
        borderColor: 'RGBA(75, 120, 215, 0.7)',
        textColor: 'RGBA(115, 155, 255, 1)'
      };
    }
    return {
      textColor: 'RGBA(105, 140, 235, 0.92)'
    };
  }

  // Option 1B for Tier S Uniques & Sets: share the active Theme's (or global Tier S's) jackpot plate background,
  // while keeping distinct Sanctuary Gold vs. Emerald Green borders, text hues, and minimap star symbols!
  if (tier === 'S') {
    const plateBg = sharedTierSBackground || base.backgroundColor || 'RGBA(34, 12, 48, 0.95)';
    const lightPlate = isLightPlateColor(plateBg);
    if (rarityKind === 'unique') {
      return {
        backgroundColor: plateBg,
        borderColor: lightPlate ? 'RGBA(235, 170, 25, 1)' : 'RGBA(245, 190, 48, 1)',
        textColor: lightPlate ? 'RGBA(155, 92, 8, 1)' : 'RGBA(255, 226, 142, 1)',
        dropSound: base.dropSound ?? 'Filter01',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 24,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(255, 210, 75, 1)'
        },
        namePrefix: base.namePrefix
      };
    }
    if (rarityKind === 'set') {
      return {
        backgroundColor: plateBg,
        borderColor: lightPlate ? 'RGBA(18, 215, 78, 1)' : 'RGBA(45, 235, 95, 1)',
        textColor: lightPlate ? 'RGBA(8, 120, 42, 1)' : 'RGBA(150, 255, 178, 1)',
        dropSound: base.dropSound ?? 'Filter01',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 24,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(55, 255, 115, 1)'
        },
        namePrefix: base.namePrefix
      };
    }
    if (rarityKind === 'rare') {
      return {
        backgroundColor: plateBg,
        borderColor: lightPlate ? 'RGBA(215, 180, 15, 1)' : 'RGBA(255, 238, 75, 1)',
        textColor: lightPlate ? 'RGBA(135, 105, 0, 1)' : 'RGBA(255, 248, 145, 1)',
        dropSound: base.dropSound ?? 'Filter01',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 24,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(255, 238, 75, 1)'
        },
        namePrefix: base.namePrefix
      };
    }
    if (rarityKind === 'crafted') {
      return {
        backgroundColor: plateBg,
        borderColor: 'RGBA(255, 140, 25, 1)',
        textColor: lightPlate ? 'RGBA(175, 72, 0, 1)' : 'RGBA(255, 200, 115, 1)',
        dropSound: base.dropSound ?? 'Filter01',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 24,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(255, 140, 25, 1)'
        },
        namePrefix: base.namePrefix
      };
    }
    return base;
  }

  if (rarityKind === 'unique') {
    if (tier === 'A') {
      return {
        backgroundColor: 'RGBA(48, 28, 6, 0.94)',
        borderColor: 'RGBA(242, 178, 58, 1)',
        textColor: 'RGBA(255, 212, 118, 1)',
        dropSound: base.dropSound ?? 'Filter02',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 21,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(242, 178, 58, 1)'
        }
      };
    }
    if (tier === 'B') {
      return {
        backgroundColor: 'RGBA(38, 22, 6, 0.91)',
        borderColor: 'RGBA(214, 152, 48, 0.95)',
        textColor: 'RGBA(238, 190, 98, 1)',
        dropSound: base.dropSound ?? 'Filter03',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'diamond',
          size: base.minimapIcon?.size ?? 18,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(214, 152, 48, 1)'
        }
      };
    }
    if (tier === 'C') {
      return {
        backgroundColor: 'RGBA(30, 18, 5, 0.88)',
        borderColor: 'RGBA(190, 132, 42, 0.85)',
        textColor: 'RGBA(224, 174, 86, 1)'
      };
    }
    return {
      textColor: 'RGBA(208, 160, 78, 0.94)'
    };
  }

  if (rarityKind === 'set') {
    if (tier === 'A') {
      return {
        backgroundColor: 'RGBA(8, 36, 16, 0.92)',
        borderColor: 'RGBA(45, 230, 90, 1)',
        textColor: 'RGBA(145, 255, 170, 1)',
        dropSound: base.dropSound ?? 'Filter02',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'star',
          size: base.minimapIcon?.size ?? 20,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(45, 230, 90, 1)'
        }
      };
    }
    if (tier === 'B') {
      return {
        backgroundColor: 'RGBA(8, 28, 12, 0.88)',
        borderColor: 'RGBA(35, 200, 75, 0.9)',
        textColor: 'RGBA(110, 240, 135, 1)',
        dropSound: base.dropSound ?? 'Filter03',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'diamond',
          size: base.minimapIcon?.size ?? 17,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(35, 200, 75, 1)'
        }
      };
    }
    if (tier === 'C') {
      return {
        backgroundColor: 'RGBA(8, 20, 10, 0.84)',
        borderColor: 'RGBA(35, 165, 65, 0.72)',
        textColor: 'RGBA(85, 220, 110, 1)'
      };
    }
    return {
      textColor: 'RGBA(0, 215, 60, 0.9)'
    };
  }

  if (rarityKind === 'rare') {
    if (tier === 'A') {
      return {
        backgroundColor: 'RGBA(36, 32, 6, 0.92)',
        borderColor: 'RGBA(255, 235, 70, 1)',
        textColor: 'RGBA(255, 248, 140, 1)',
        dropSound: base.dropSound ?? 'Filter02',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'diamond',
          size: base.minimapIcon?.size ?? 20,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(255, 235, 70, 1)'
        }
      };
    }
    if (tier === 'B') {
      return {
        backgroundColor: 'RGBA(26, 24, 8, 0.88)',
        borderColor: 'RGBA(235, 215, 65, 0.88)',
        textColor: 'RGBA(255, 238, 105, 1)',
        dropSound: base.dropSound,
        minimapIcon: base.minimapIcon
          ? { ...base.minimapIcon, fillColor: 'RGBA(235, 215, 65, 1)' }
          : undefined
      };
    }
    if (tier === 'C') {
      return {
        backgroundColor: 'RGBA(18, 18, 10, 0.84)',
        borderColor: 'RGBA(185, 170, 55, 0.65)',
        textColor: 'RGBA(245, 228, 95, 1)'
      };
    }
    return {
      textColor: 'RGBA(230, 210, 85, 0.9)'
    };
  }

  if (rarityKind === 'crafted') {
    if (tier === 'A') {
      return {
        backgroundColor: 'RGBA(46, 18, 4, 0.92)',
        borderColor: 'RGBA(255, 145, 30, 1)',
        textColor: 'RGBA(255, 195, 110, 1)',
        dropSound: base.dropSound ?? 'Filter02',
        minimapIcon: {
          shape: base.minimapIcon?.shape ?? 'diamond',
          size: base.minimapIcon?.size ?? 20,
          borderColor: 'RGBA(255, 255, 255, 1)',
          fillColor: 'RGBA(255, 145, 30, 1)'
        }
      };
    }
    if (tier === 'B') {
      return {
        backgroundColor: 'RGBA(34, 14, 4, 0.88)',
        borderColor: 'RGBA(230, 130, 30, 0.9)',
        textColor: 'RGBA(255, 180, 95, 1)',
        dropSound: base.dropSound
      };
    }
    if (tier === 'C') {
      return {
        backgroundColor: 'RGBA(24, 12, 6, 0.84)',
        borderColor: 'RGBA(190, 105, 25, 0.7)',
        textColor: 'RGBA(240, 165, 80, 1)'
      };
    }
    return {
      textColor: 'RGBA(230, 150, 65, 0.9)'
    };
  }

  return base;
}

export function effectiveRarityTierStyle(
  tier: Exclude<TierRank, 'HIDE'>,
  config: V2Config,
  category: CategoryId | undefined,
  rarityKind?: ItemRarityStyleKind
): TierStyle {
  const effectiveCategory = rarityKind === 'base' ? 'bases' : category;
  if (!rarityKind) {
    return effectiveTierStyle(tier, config, effectiveCategory);
  }
  const themeBase = THEME_PRESETS[config.theme]?.tiers[tier] ?? THEME_PRESETS.reimagined.tiers[tier];
  const globalOverride = config.tierStyleOverrides[tier] ?? {};
  const rarityOverride = config.rarityTierStyleOverrides?.[rarityKind]?.[tier];
  const sharedSPlate = tier === 'S' ? (rarityOverride?.backgroundColor ?? globalOverride.backgroundColor) : undefined;
  const rarityDefault = defaultRarityTierStyleFromTheme(tier, themeBase, rarityKind, sharedSPlate);

  // Inherit shared tier urgency (sound, prefix, minimap icon shape/size/mute) without clobbering rarity colors
  const merged: TierStyle = { ...rarityDefault };
  if (globalOverride.dropSound !== undefined) merged.dropSound = globalOverride.dropSound;
  if (globalOverride.namePrefix !== undefined) merged.namePrefix = globalOverride.namePrefix;
  if (globalOverride.minimapIcon === null) {
    merged.minimapIcon = null;
  } else if (globalOverride.minimapIcon !== undefined) {
    merged.minimapIcon = {
      ...globalOverride.minimapIcon,
      fillColor: rarityDefault.minimapIcon?.fillColor ?? globalOverride.minimapIcon.fillColor
    };
  }

  // Category-level overrides: full style for single-rarity 'bases', urgency-only for multi-rarity categories
  const catOverride = (effectiveCategory && config.categoryTierStyleOverrides[effectiveCategory]?.[tier]) ?? {};
  if (effectiveCategory === 'bases') {
    Object.assign(merged, catOverride);
  } else {
    if (catOverride.dropSound !== undefined) merged.dropSound = catOverride.dropSound;
    if (catOverride.namePrefix !== undefined) merged.namePrefix = catOverride.namePrefix;
    if (catOverride.minimapIcon === null) {
      merged.minimapIcon = null;
    } else if (catOverride.minimapIcon !== undefined) {
      merged.minimapIcon = {
        ...catOverride.minimapIcon,
        fillColor: merged.minimapIcon?.fillColor ?? catOverride.minimapIcon.fillColor
      };
    }
  }

  // Individual Rarity Style Overrides (Unique, Set, Rare, Crafted, Magic, Base) layer cleanly on top!
  if (rarityOverride) {
    Object.assign(merged, rarityOverride);
  }
  return merged;
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
  m?: number;
  s: StrictnessId;
  t: ThemeId;
  io?: Record<string, TierRank>;
  tso?: V2Config['tierStyleOverrides'];
  ctso?: V2Config['categoryTierStyleOverrides'];
  rtso?: V2Config['rarityTierStyleOverrides'];
  cb?: CustomBaseRule[];
  bs?: Partial<BaseFilterSettings>;
  bp?: BuildProfile;
}

export function serializeV2StateTag(config: V2Config): string {
  const diff: CompactV2Diff = {
    m: 4,
    s: config.strictness,
    t: config.theme
  };
  if (Object.keys(config.itemOverrides).length > 0) diff.io = config.itemOverrides;
  if (Object.keys(config.tierStyleOverrides).length > 0) diff.tso = config.tierStyleOverrides;
  if (Object.keys(config.categoryTierStyleOverrides).length > 0) diff.ctso = config.categoryTierStyleOverrides;
  if (config.rarityTierStyleOverrides && Object.keys(config.rarityTierStyleOverrides).length > 0) {
    diff.rtso = config.rarityTierStyleOverrides;
  }
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

export function extractV2ConfigWithMeta(
  filter: Filter
): { config: V2Config; migrated: boolean } | null {
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
        const cfg: V2Config = {
          version: 2,
          strictness: parsed.s || 'semi-strict',
          theme: parsed.t || 'reimagined',
          itemOverrides: parsed.io ?? {},
          tierStyleOverrides: parsed.tso ?? {},
          categoryTierStyleOverrides: parsed.ctso ?? {},
          rarityTierStyleOverrides: parsed.rtso ?? {},
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
        const isPreSplitSchema = (parsed.m ?? 0) < 2;
        const isPreChaosOnyxMerge = (parsed.m ?? 0) < 3;
        const isPreExpandedBases = (parsed.m ?? 0) < 4;
        if (!parsed.m) {
          const hasBuildSelection =
            Boolean(cfg.buildProfile.selectedClass) ||
            Boolean(cfg.buildProfile.archetype) ||
            cfg.buildProfile.disabledFamilies.length > 0;
          const hasNewEquipOverrides = Object.keys(cfg.itemOverrides).some(
            k => k.startsWith('equip-class-') || k.startsWith('equip-weap-')
          );
          // Migrate legacy build-promoted misc-magic-quivers ('A'/'B') to equip-rare-quivers so magic quivers stay hidden in Regular+
          if (
            hasBuildSelection &&
            (cfg.itemOverrides['misc-magic-quivers'] === 'A' || cfg.itemOverrides['misc-magic-quivers'] === 'B')
          ) {
            const oldTier = cfg.itemOverrides['misc-magic-quivers'];
            delete cfg.itemOverrides['misc-magic-quivers'];
            const quiversEnabled =
              !cfg.buildProfile.disabledFamilies.includes('bow-quiver') ||
              !cfg.buildProfile.disabledFamilies.includes('xbow-quiver');
            if (quiversEnabled && !cfg.itemOverrides['equip-rare-quivers']) {
              cfg.itemOverrides['equip-rare-quivers'] = oldTier;
            }
          }
          if (hasBuildSelection && !hasNewEquipOverrides) {
            const userNonBuildOverrides: Record<string, TierRank> = {};
            for (const [k, v] of Object.entries(cfg.itemOverrides)) {
              const item = TIERABLE_ITEMS.find(x => x.id === k);
              if (item && !item.equipmentFamilies?.length) {
                userNonBuildOverrides[k] = v;
              }
            }
            syncBuildProfileOverrides(cfg);
            cfg.itemOverrides = { ...cfg.itemOverrides, ...userNonBuildOverrides };
          }
        }
        if (isPreSplitSchema) {
          // 1. Carry over pre-split Unique+Set card overrides onto their newly unbundled Set counterparts
          const uniqToSetPairs: readonly [string, string][] = [
            ['uniq-drop-only', 'set-drop-only'],
            ['uniq-jewelry-charms', 'set-jewelry'],
            ['uniq-elite', 'set-elite'],
            ['uniq-exceptional', 'set-exceptional'],
            ['uniq-normal', 'set-normal']
          ];
          for (const [uId, sId] of uniqToSetPairs) {
            if (cfg.itemOverrides[uId] !== undefined && cfg.itemOverrides[sId] === undefined) {
              cfg.itemOverrides[sId] = cfg.itemOverrides[uId];
            }
          }
          // 2. Migrate split Amazon class items (equip-class-amazon-bows & equip-class-amazon-spears) on m:1 filters
          const disabledSet = new Set(cfg.buildProfile.disabledFamilies ?? []);
          if (cfg.itemOverrides['equip-class-amazon-bows'] === undefined) {
            if (disabledSet.has('bow-quiver')) {
              cfg.itemOverrides['equip-class-amazon-bows'] = 'HIDE';
            } else if (cfg.itemOverrides['equip-class-amazon'] === 'A') {
              cfg.itemOverrides['equip-class-amazon-bows'] = 'A';
            }
          }
          if (cfg.itemOverrides['equip-class-amazon-spears'] === undefined) {
            if (disabledSet.has('spear')) {
              cfg.itemOverrides['equip-class-amazon-spears'] = 'HIDE';
            } else if (cfg.itemOverrides['equip-class-amazon'] === 'A') {
              cfg.itemOverrides['equip-class-amazon-spears'] = 'A';
            }
          }
          // 3. Re-point any customBase split from uniq-drop-only on a Warlord's Set base to set-drop-only
          cfg.customBases = cfg.customBases.map(cb =>
            cb.parentItemId === 'uniq-drop-only' &&
            DROP_ONLY_SET_CODES.includes(cb.code) &&
            (cb.mode === 'set' || cb.mode === 'unique-set')
              ? { ...cb, parentItemId: 'set-drop-only' }
              : cb.parentItemId === 'charm-large' ? { ...cb, parentItemId: 'charm-small-grand' } : cb.parentItemId === 'charm-jewel-rare' && cb.mode === 'rare' ? { ...cb, mode: 'rare-crafted' } : cb
          );
        }
        if (isPreChaosOnyxMerge) {
          delete cfg.itemOverrides['curr-chaos-onyx'];
          delete cfg.itemOverrides['charm-large'];
          for (const id of ['charm-small-grand', 'jewel-all'] as const) {
            const item = TIERABLE_ITEMS.find(x => x.id === id);
            const defTier = item ? (item.strictnessTiers?.[cfg.strictness] ?? item.defaultTier) : undefined;
            if (defTier && cfg.itemOverrides[id] === defTier) {
              delete cfg.itemOverrides[id];
            }
          }
          cfg.customBases = cfg.customBases.map(cb =>
            cb.parentItemId === 'curr-chaos-onyx'
              ? {
                  ...cb,
                  parentItemId: cb.code === '1so' ? 'gem-stacks-all' : 'gem-reimagined-unstacked'
                }
              : cb.parentItemId === 'charm-large' ? { ...cb, parentItemId: 'charm-small-grand' } : cb.parentItemId === 'charm-jewel-rare' && cb.mode === 'rare' ? { ...cb, mode: 'rare-crafted' } : cb
          );
        }
        if (isPreExpandedBases) {
          if (
            cfg.itemOverrides['base-elite-body'] === 'HIDE' &&
            cfg.itemOverrides['base-elite-body-secondary'] === undefined
          ) {
            cfg.itemOverrides['base-elite-body-secondary'] = 'HIDE';
          }
          if (
            cfg.itemOverrides['base-elite-helms'] === 'HIDE' &&
            cfg.itemOverrides['base-elite-helms-secondary'] === undefined
          ) {
            cfg.itemOverrides['base-elite-helms-secondary'] = 'HIDE';
          }
          const disabledSet = new Set<EquipmentFamilyId>(cfg.buildProfile.disabledFamilies ?? []);
          for (const item of TIERABLE_ITEMS) {
            if (item.category !== 'bases' || !item.id.endsWith('-secondary') || !item.equipmentFamilies?.length) {
              continue;
            }
            if (cfg.itemOverrides[item.id] !== undefined) continue;
            const allDisabled = item.equipmentFamilies.every(f => disabledSet.has(f));
            const siblingPrimaryHidden = TIERABLE_ITEMS.some(
              other =>
                other.category === 'bases' &&
                !other.id.endsWith('-secondary') &&
                other.equipmentFamilies?.some(f => item.equipmentFamilies!.includes(f)) &&
                cfg.itemOverrides[other.id] === 'HIDE'
            );
            if (allDisabled || siblingPrimaryHidden) {
              cfg.itemOverrides[item.id] = 'HIDE';
            }
          }
          cfg.customBases = cfg.customBases.map(cb => {
            if (!modeCoversGroupMode(cb.mode, 'runeword')) return cb;
            if (cb.code === '6sb' && cb.parentItemId === 'base-ama-weapons') {
              return { ...cb, parentItemId: 'base-bows-secondary' };
            }
            if ((cb.code === '7ja' || cb.code === '7s7') && cb.parentItemId === 'base-javelins') {
              return { ...cb, parentItemId: 'base-javelins-secondary' };
            }
            if (cb.code === '7tr' && cb.parentItemId === 'base-spears') {
              return { ...cb, parentItemId: 'base-spears-secondary' };
            }
            return cb;
          });
        }
        return { config: cfg, migrated: isPreExpandedBases };
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function extractV2ConfigFromFilter(filter: Filter): V2Config | null {
  return extractV2ConfigWithMeta(filter)?.config ?? null;
}

export function compileV2Filter(config: V2Config): Filter {
  const rules: Rule[] = [];

  // 0. User's Custom Priority Rules (from Advanced tab)
  for (const custom of config.customPriorityRules) {
    const copy = M.clone(custom) as Rule;
    const b = blockOf(copy);
    if (!b.conditions || Object.keys(b.conditions).length === 0) continue;
    const baseLabel = (b.ruleName || 'Custom rule').replace(/^\[Custom\]\s*/, '');
    b.ruleName = `[Custom] ${baseLabel}`.slice(0, 120);
    rules.push(copy);
  }

  // Note: Class & Archetype curation now updates the Customize Tiers & Bases items directly
  // so that every shown/hidden weapon, offhand, and class item group in the UI matches in-game behavior.

  // 1. Custom Base Overrides (Unique / Set / Rare / Magic / Crafted / Runeword bases added by user)
  for (const cb of config.customBases) {
    const conditions: Conditions = { code: cb.code };
    if (cb.mode === 'unique') conditions.rarity = 'unique';
    else if (cb.mode === 'set') conditions.rarity = 'set';
    else if (cb.mode === 'unique-set') conditions.rarity = ['unique', 'set'];
    else if (cb.mode === 'rare') conditions.rarity = 'rare';
    else if (cb.mode === 'rare-crafted') conditions.rarity = ['rare', 'crafted'];
    else if (cb.mode === 'magic') conditions.rarity = 'magic';
    else if (cb.mode === 'crafted') conditions.rarity = 'crafted';
    else if (cb.mode === 'runeword') {
      conditions.rarity = ['normal', 'superior'];
      if (cb.minSockets && cb.minSockets > 0) conditions.sockets = { gte: cb.minSockets };
      if (cb.etherealOnly) conditions.ethereal = true;
    }
    const modeLabel =
      cb.mode === 'runeword'
        ? 'Runeword Base'
        : cb.mode === 'unique-set'
          ? 'Unique/Set'
          : cb.mode === 'rare-crafted'
            ? 'Rare/Crafted'
            : cb.mode === 'any'
              ? 'All Rarities'
              : cb.mode.charAt(0).toUpperCase() + cb.mode.slice(1);
    const ruleTitle = `[Base] ${cb.label} (${modeLabel}) · ${cb.tier === 'HIDE' ? 'Hide' : `Tier ${cb.tier}`}`;
    const parentGroup = findParentGroupForBase(cb.code, cb.mode, undefined, cb.parentItemId);
    const cat: CategoryId =
      parentGroup?.category ??
      (cb.mode === 'runeword'
        ? 'bases'
        : cb.mode === 'rare' || cb.mode === 'rare-crafted' || cb.mode === 'magic' || cb.mode === 'crafted'
          ? 'equipment'
          : 'uniques');
    if (cb.tier === 'HIDE') {
      rules.push({ hide: { ruleName: ruleTitle, conditions } });
    } else if (cb.mode === 'unique-set') {
      const uniqueBlock: RuleBlock = { ruleName: `${ruleTitle} (Unique)`, conditions: { ...conditions, rarity: 'unique' } };
      applyStyleToBlock(uniqueBlock, effectiveRarityTierStyle(cb.tier, config, cat, 'unique'), false);
      rules.push({ show: uniqueBlock });

      const setBlock: RuleBlock = { ruleName: `${ruleTitle} (Set)`, conditions: { ...conditions, rarity: 'set' } };
      applyStyleToBlock(setBlock, effectiveRarityTierStyle(cb.tier, config, cat, 'set'), false);
      rules.push({ show: setBlock });
    } else if (cb.mode === 'rare-crafted') {
      const craftedBlock: RuleBlock = { ruleName: `${ruleTitle} (Crafted)`, conditions: { ...conditions, rarity: 'crafted' } };
      applyStyleToBlock(craftedBlock, effectiveRarityTierStyle(cb.tier, config, cat, 'crafted'), false);
      rules.push({ show: craftedBlock });

      const rareBlock: RuleBlock = { ruleName: `${ruleTitle} (Rare)`, conditions: { ...conditions, rarity: 'rare' } };
      applyStyleToBlock(rareBlock, effectiveRarityTierStyle(cb.tier, config, cat, 'rare'), false);
      rules.push({ show: rareBlock });
    } else {
      const block: RuleBlock = { ruleName: ruleTitle, conditions };
      const cbRarityKind: ItemRarityStyleKind | undefined =
        cb.mode === 'runeword' || cat === 'bases'
          ? 'base'
          : cb.mode === 'magic'
            ? 'magic'
            : cb.mode === 'unique'
              ? 'unique'
              : cb.mode === 'set'
                ? 'set'
                : cb.mode === 'rare'
                  ? 'rare'
                  : cb.mode === 'crafted'
                    ? 'crafted'
                    : cat === 'uniques'
                      ? 'unique'
                      : undefined;
      applyStyleToBlock(block, effectiveRarityTierStyle(cb.tier, config, cat, cbRarityKind), false);
      rules.push({ show: block });
    }
  }

  const emittedHiddenFamilyTypes = new Set<string>();

  // Helper to emit rules for a category, merging pure-code items of the same tier into compact rules
  const emitCategoryRules = (
    categoryId: CategoryId,
    categoryTitle: string,
    itemFilter?: (item: TierableItem) => boolean
  ) => {
    const catItems = TIERABLE_ITEMS.filter(
      item => item.category === categoryId && (!itemFilter || itemFilter(item))
    );
    const pureCodeBuckets = new Map<TierRank, { codes: string[]; labels: string[] }>();
    const complexItems: { item: TierableItem; tier: TierRank; activeCodes?: string[] }[] = [];

    for (const item of catItems) {
      const tier = effectiveItemTier(item, config);
      const parentSoftHidden = isBaseCardSoftHiddenByStrictness(item, config);
      const groupMode = defaultBaseModeForItem(item);
      const activeCodes = item.codes
        ? item.codes.filter(code => {
            if (item.category === 'runes' || item.subtitle?.includes('(Stack)')) return true;
            const splitRule = config.customBases.find(
              cb =>
                cb.code === code &&
                !cb.minSockets &&
                !cb.etherealOnly &&
                (cb.tier !== tier || (cb.tier === 'HIDE' && parentSoftHidden)) &&
                modeCoversGroupMode(cb.mode, groupMode) &&
                (cb.parentItemId === item.id ||
                  !cb.parentItemId ||
                  !TIERABLE_ITEMS.find(x => x.id === cb.parentItemId)?.codes?.includes(code))
            );
            return !splitRule;
          })
        : undefined;

      if (item.codes && item.codes.length > 0 && (!activeCodes || activeCodes.length === 0)) {
        continue;
      }

      const isPureCode =
        activeCodes &&
        activeCodes.length > 0 &&
        categoryId !== 'uniques' &&
        item.id !== 'misc-magic-quivers' &&
        !item.baseNames &&
        !item.itemTypes &&
        !item.rarities &&
        !item.tiers &&
        !item.sockets &&
        item.ethereal === undefined;

      if (isPureCode) {
        const bucket = pureCodeBuckets.get(tier) ?? { codes: [], labels: [] };
        bucket.codes.push(...activeCodes);
        bucket.labels.push(item.label.replace(/\s*\(.*?\)\s*/g, ''));
        pureCodeBuckets.set(tier, bucket);
      } else {
        complexItems.push({ item, tier, activeCodes });
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
    for (const { item, tier, activeCodes } of complexItems) {
      const conditions: Conditions = {};
      const codesToUse = activeCodes ?? item.codes;

      if (isBaseCardSoftHiddenByStrictness(item, config)) {
        // Strictness-only non-chase base default (e.g. Uber Strict secondary/off-meta Elite bases):
        // skip emitting a pre-baseSettings hide so Ethereal Elite / Superior Elite / 3+ Socket Elite rules still apply,
        // while plain unsocketed white bases are hidden by the Strictness baseline rule below.
        continue;
      }

      if (categoryId === 'bases' && tier === 'HIDE' && isWholeBaseFamilyExplicitlyHidden(item, config)) {
        // When an entire weapon/class base family is disabled or moved to Hide, hide all white/superior
        // items of that equipment family once so generic fallback base rules do not re-show them.
        const allFamilyTypes = [
          ...new Set(
            EQUIPMENT_FAMILIES.filter(f => item.equipmentFamilies!.includes(f.id))
              .flatMap(f => f.itemTypes)
              .filter(t => t !== 'bowq' && t !== 'mboq' && t !== 'xboq' && t !== 'mxbq')
          )
        ];
        const unemittedFamilyTypes = allFamilyTypes.filter(t => !emittedHiddenFamilyTypes.has(t));
        if (allFamilyTypes.length > 0 && unemittedFamilyTypes.length === 0) {
          continue;
        }
        for (const t of unemittedFamilyTypes) emittedHiddenFamilyTypes.add(t);
        if (unemittedFamilyTypes.length > 0) {
          conditions.itemType =
            unemittedFamilyTypes.length === 1 ? unemittedFamilyTypes[0] : unemittedFamilyTypes.slice(0, 64);
        } else if (codesToUse?.length) {
          conditions.code = codesToUse.length === 1 ? codesToUse[0] : codesToUse.slice(0, 64);
        }
        conditions.rarity = ['inferior', 'normal', 'superior'];
      } else if (
        categoryId === 'equipment' &&
        tier === 'HIDE' &&
        item.itemTypes?.length &&
        isFamilyExplicitlyHidden(item, config)
      ) {
        // When a weapon/class equipment family is explicitly disabled or moved to Hide, hide both rare and magic
        // drops across all quality tiers (normal, exceptional, elite).
        conditions.itemType = item.itemTypes.length === 1 ? item.itemTypes[0] : item.itemTypes.slice(0, 64);
        conditions.rarity = ['magic', 'rare'];
      } else {
        if (codesToUse?.length) conditions.code = codesToUse.length === 1 ? codesToUse[0] : codesToUse.slice(0, 64);
        if (item.baseNames?.length) conditions.baseName = item.baseNames.length === 1 ? item.baseNames[0] : item.baseNames.slice(0, 64);
        if (item.itemTypes?.length) conditions.itemType = item.itemTypes.length === 1 ? item.itemTypes[0] : item.itemTypes.slice(0, 64);
        if (categoryId === 'bases' && tier === 'HIDE') {
          conditions.rarity = ['inferior', 'normal', 'superior'];
        } else if (item.rarities?.length) {
          conditions.rarity = item.rarities.length === 1 ? item.rarities[0] : item.rarities;
        }
        if (item.tiers?.length) {
          const effectiveTiers =
            categoryId === 'equipment' &&
            config.strictness === 'endgame' &&
            item.tiers.length === 2 &&
            item.tiers.includes('elite') &&
            item.tiers.includes('exceptional')
              ? (['elite'] as const)
              : item.tiers;
          conditions.tier = effectiveTiers.length === 1 ? effectiveTiers[0] : [...effectiveTiers];
        }
        if (item.sockets) conditions.sockets = { ...item.sockets };
        if (item.ethereal !== undefined) conditions.ethereal = item.ethereal;

        if (categoryId === 'bases') {
          if (
            tier !== 'HIDE' &&
            item.id !== 'base-elite-gloves-boots-belts' &&
            config.baseSettings.requireSocketsOnBases &&
            config.baseSettings.minSocketsOnBases > 0 &&
            !conditions.sockets
          ) {
            conditions.sockets = { gte: config.baseSettings.minSocketsOnBases };
          }
        }
      }

      if ((item.id === 'set-normal' || item.id === 'uniq-normal') && tier === 'HIDE' && !conditions.tier) {
        conditions.tier = 'normal';
      }

      const ruleName = `${categoryTitle} · ${ tier === 'HIDE' ? 'Hide' : `Tier ${tier}` }: ${item.label}`;
      if (tier === 'HIDE') {
        rules.push({ hide: { ruleName, conditions } });
      } else if (
        item.rarities?.length === 2 &&
        item.rarities.includes('unique') &&
        item.rarities.includes('set')
      ) {
        const uniqueBlock: RuleBlock = {
          ruleName: `${ruleName} (Unique)`,
          conditions: { ...conditions, rarity: 'unique' }
        };
        applyStyleToBlock(uniqueBlock, effectiveRarityTierStyle(tier, config, categoryId, 'unique'), false);
        rules.push({ show: uniqueBlock });

        const setBlock: RuleBlock = {
          ruleName: `${ruleName} (Set)`,
          conditions: { ...conditions, rarity: 'set' }
        };
        applyStyleToBlock(setBlock, effectiveRarityTierStyle(tier, config, categoryId, 'set'), false);
        rules.push({ show: setBlock });
      } else if (
        item.rarities?.length === 2 &&
        item.rarities.includes('rare') &&
        item.rarities.includes('crafted')
      ) {
        const craftedBlock: RuleBlock = {
          ruleName: `${ruleName} (Crafted)`,
          conditions: { ...conditions, rarity: 'crafted' }
        };
        applyStyleToBlock(craftedBlock, effectiveRarityTierStyle(tier, config, categoryId, 'crafted'), false);
        rules.push({ show: craftedBlock });

        const rareBlock: RuleBlock = {
          ruleName: `${ruleName} (Rare)`,
          conditions: { ...conditions, rarity: 'rare' }
        };
        applyStyleToBlock(rareBlock, effectiveRarityTierStyle(tier, config, categoryId, 'rare'), false);
        rules.push({ show: rareBlock });
      } else {
        const rarityKind: ItemRarityStyleKind | undefined =
          categoryId === 'bases'
            ? 'base'
            : item.id === 'misc-magic-quivers' || (item.rarities?.length === 1 && item.rarities[0] === 'magic')
              ? 'magic'
              : item.id === 'uniq-pinnacle-charms' || (item.rarities?.length === 1 && item.rarities[0] === 'unique')
              ? 'unique'
              : item.rarities?.length === 1 && item.rarities[0] === 'set'
                ? 'set'
                : item.rarities?.length === 1 && item.rarities[0] === 'rare'
                  ? 'rare'
                  : item.rarities?.length === 1 && item.rarities[0] === 'crafted'
                    ? 'crafted'
                    : undefined;
        const block: RuleBlock = { ruleName, conditions };
        applyStyleToBlock(block, effectiveRarityTierStyle(tier, config, categoryId, rarityKind), false);
        rules.push({ show: block });
      }
    }
  };

  // Emit categories in safe precedence order:
  // 1. Boss Keys, Organs & Tokens (pure codes — before general `ques` rule)
  emitCategoryRules('bosses', 'Boss & Endgame');
  // 2. Orbs, Storage & Upgrade Materials (pure codes — ensures Unique misc items like Gem Bag/Keychain/Pliers match Currency & Orbs)
  emitCategoryRules('currency', 'Currency & Orbs');
  // 3. Runes & Rune Stacks (pure codes)
  emitCategoryRules('runes', 'Runes');
  // 4. Maps & Map Currency (pure codes)
  emitCategoryRules('maps', 'Maps');
  // 5. Gems & Gem Stacks (pure codes)
  emitCategoryRules('gems', 'Gems');
  // 6. Campaign Quest Items & Weapons (emitted before Uniques so rarity:'unique' quest drops like Staff of Kings/Khalim's keep Tier A!)
  const isQuestMisc = (item: TierableItem) => item.id === 'misc-quest' || item.id === 'misc-quest-weapons';
  emitCategoryRules('misc', 'Misc & Potions', isQuestMisc);
  // 7. Uniques, Sets, Charms & Jewelry (separate Gold Unique vs. Emerald Set rules across Tiers S–D)
  emitCategoryRules('uniques', 'Uniques & Charms');
  // 8. Remaining Potions, Scrolls, Quivers & Misc
  emitCategoryRules('misc', 'Misc & Potions', item => !isQuestMisc(item));

  // 8. Rares, Crafted & Magic Equipment
  emitCategoryRules('equipment', 'Equipment');
  // 9a. Runeword & Crafting Bases — Explicit Hides, Tier S/A/B Premier Bases & Infusion Gloves/Boots/Belts
  const isPreFallbackBaseItem = (item: TierableItem): boolean => {
    const tier = effectiveItemTier(item, config);
    if (tier === 'HIDE' || tier === 'S' || tier === 'A' || tier === 'B') return true;
    return item.id === 'base-elite-gloves-boots-belts';
  };
  emitCategoryRules('bases', 'Runeword Bases', isPreFallbackBaseItem);

  // 9b. General Tier B Base Highlights (Ethereal Elite & Superior 0+ Socket Elite Equipment — promotes Secondary Elites to Tier B)
  if (config.baseSettings.highlightEthEliteBases) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · Ethereal Elite Equipment',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: ['normal', 'superior'], ethereal: true }
    };
    applyStyleToBlock(block, effectiveRarityTierStyle('B', config, 'bases', 'base'), false);
    rules.push({ show: block });
  }
  if (config.baseSettings.highlightSupEliteBases) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · Superior Elite Equipment',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: 'superior' }
    };
    applyStyleToBlock(block, effectiveRarityTierStyle('B', config, 'bases', 'base'), false);
    rules.push({ show: block });
  }

  // 9c. Secondary Elite Bases (Default Tier C/D — shown at 0+ sockets in Soft..Strict, skipped in Uber Strict)
  emitCategoryRules('bases', 'Runeword Bases', item => !isPreFallbackBaseItem(item));
  if (config.baseSettings.show3PlusSocketElite) {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · 3+ Socket Elite Bases',
      conditions: { itemType: ['weap', 'armo'], tier: 'elite', rarity: ['normal', 'superior'], sockets: { gte: 3 } }
    };
    applyStyleToBlock(block, effectiveRarityTierStyle('C', config, 'bases', 'base'), false);
    rules.push({ show: block });
  }
  if (config.baseSettings.show4PlusSocketExceptional && config.strictness !== 'endgame') {
    const block: RuleBlock = {
      ruleName: 'Runeword Bases · 4+ Socket Exceptional Bases',
      conditions: { itemType: ['weap', 'armo'], tier: 'exceptional', rarity: ['normal', 'superior'], sockets: { gte: 4 } }
    };
    applyStyleToBlock(block, effectiveRarityTierStyle('D', config, 'bases', 'base'), false);
    rules.push({ show: block });
  }
  if (config.strictness === 'soft' || config.strictness === 'regular' || config.strictness === 'semi-strict') {
    // Keep any remaining socketed or ethereal non-magic bases visible in Soft..Semi-Strict
    rules.push({
      show: {
        ruleName: 'Runeword Bases · Keep Ethereal White Bases Visible',
        conditions: { rarity: ['inferior', 'normal', 'superior'], ethereal: true }
      }
    });
    rules.push({
      show: {
        ruleName: 'Runeword Bases · Keep Socketed White Bases Visible',
        conditions: { rarity: ['normal', 'superior'], sockets: { gte: 2 } }
      }
    });
  }

  // Strictness Baseline Equipment Clutter Hiding
  // In all filters beyond Soft (Starter), hide all remaining Magic items (Charms, Jewels & Quest items are already matched above)
  if (config.strictness !== 'soft') {
    rules.push({
      hide: {
        ruleName: 'Strictness · Hide Remaining Non-Charm / Non-Jewel Magic Items',
        conditions: {
          rarity: 'magic'
        }
      }
    });
  }

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
        ruleName: 'Strictness (Semi-Strict) · Hide Unsocketed White Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior'],
          sockets: { eq: 0 },
          ethereal: false
        }
      }
    });
  } else if (config.strictness === 'strict') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Strict) · Hide Remaining Normal-Tier Rare Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          tier: 'normal',
          rarity: 'rare'
        }
      }
    });
    rules.push({
      hide: {
        ruleName: 'Strictness (Strict) · Hide Unentered Ordinary White Equipment',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior']
        }
      }
    });
  } else if (config.strictness === 'endgame') {
    rules.push({
      hide: {
        ruleName: 'Strictness (Uber Strict) · Hide Remaining Normal & Exceptional Rare Gear',
        conditions: {
          itemType: ['weap', 'armo'],
          tier: ['normal', 'exceptional'],
          rarity: 'rare'
        }
      }
    });
    rules.push({
      hide: {
        ruleName: 'Strictness (Uber Strict) · Hide All Non-Chase White Equipment',
        conditions: {
          itemType: ['weap', 'armo'],
          rarity: ['inferior', 'normal', 'superior']
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
  else if (cleanRuleName.startsWith('Runeword Bases')) matchedCategory = 'bases';
  else if (cleanRuleName.startsWith('[Base]')) {
    if (cleanRuleName.includes('(Runeword Base)')) matchedCategory = 'bases';
    else if (cleanRuleName.includes('(Unique') || cleanRuleName.includes('(Set')) matchedCategory = 'uniques';
    else matchedCategory = 'equipment';
  }
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

function pickFromPool<T>(pool: readonly T[], slotIdx: number, rollSeed: number): T {
  if (rollSeed <= 0) return pool[0]!;
  const idx = (rollSeed + slotIdx * 3) % pool.length;
  return pool[idx]!;
}

export function generateLootsplosion(scenario: LootsplosionScenario, rollSeed = 0): SimulatedItem[] {
  if (scenario === 'rune-currency') {
    const pools: readonly (readonly SimulatedItem[])[] = [
      [
        { id: 'sim-1', code: 'r31', name: 'Jah Rune (#31)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-1', code: 'r33', name: 'Zod Rune (#33)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-1', code: 'r39', name: 'Hev Rune (#39)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-1', code: 'r34', name: 'Brak Rune (#34)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-2', code: 's30', name: 'Stack: Ber Rune (#30)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 2 },
        { id: 'sim-2', code: 's29', name: 'Stack: Sur Rune (#29)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 3 },
        { id: 'sim-2', code: 's28', name: 'Stack: Lo Rune (#28)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 2 }
      ],
      [
        { id: 'sim-3', code: 'ka3', name: 'Orb of Corruption', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-3', code: 'ooa', name: 'Orb of Assemblage', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-3', code: '1ka', name: 'Stack: Orb of Corruption', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 2 }
      ],
      [
        { id: 'sim-4', code: '1gc', name: 'Gem Cluster', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }


      ],
      [
        { id: 'sim-5', code: 'r24', name: 'Ist Rune (#24)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-5', code: 'r26', name: 'Vex Rune (#26)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-5', code: 'r27', name: 'Ohm Rune (#27)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-5', code: 'r22', name: 'Um Rune (#22)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-6', code: 'oos', name: 'Orb of Socketing', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-6', code: 'ooi', name: 'Orb of Infusion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-6', code: 'ooc', name: 'Orb of Conversion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-6', code: 'toa', name: 'Token of Absolution', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-7', code: 'r15', name: 'Hel Rune (#15)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-7', code: 'r18', name: 'Ko Rune (#18)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-7', code: 'r17', name: 'Lum Rune (#17)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-8', code: 'r08', name: 'Ral Rune (#8)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-8', code: 'r12', name: 'Sol Rune (#12)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-8', code: 'r11', name: 'Amn Rune (#11)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-8', code: 'r13', name: 'Shael Rune (#13)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-9', code: 'r09', name: 'Ort Rune (#9)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-9', code: 'r10', name: 'Thul Rune (#10)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-9', code: 'r14', name: 'Dol Rune (#14)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-10', code: 'r01', name: 'El Rune (#1)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-10', code: 'r02', name: 'Eld Rune (#2)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-10', code: 'r03', name: 'Tir Rune (#3)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-11', code: '1am', name: 'Stack: Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 5 },
        { id: 'sim-11', code: '1rb', name: 'Stack: Ruby', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 4 },
        { id: 'sim-11', code: '1sa', name: 'Stack: Sapphire', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 6 },
        { id: 'sim-11', code: '1di', name: 'Stack: Diamond', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 3 },
        { id: 'sim-11', code: '1so', name: 'Stack: Chaos Onyx', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 2 }
      ],
      [
        { id: 'sim-12', code: 'gpv', name: 'Perfect Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-12', code: 'gpr', name: 'Perfect Ruby', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-12', code: 'gpy', name: 'Perfect Topaz', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-12', code: 'skz', name: 'Perfect Skull', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-12', code: 'gmo', name: 'Chaos Onyx', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-13', code: 'gzv', name: 'Flawless Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-13', code: 'glr', name: 'Flawless Ruby', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-13', code: 'glb', name: 'Flawless Sapphire', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ],
      [
        { id: 'sim-14', code: 'gfv', name: 'Flawed Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-14', code: 'gfr', name: 'Flawed Ruby', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 },
        { id: 'sim-14', code: 'gsv', name: 'Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 85, quantity: 1 }
      ]
    ];
    return pools.map((pool, i) => ({ ...pickFromPool(pool, i, rollSeed) }));
  }

  if (scenario === 'hell-boss') {
    const pools: readonly (readonly SimulatedItem[])[] = [
      [
        { id: 'sim-b1', code: 'mpa', name: "Mephisto's Animus", kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 90, quantity: 1 },
        { id: 'sim-b1', code: 'blc', name: "Baal's Calamity", kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 90, quantity: 1 },
        { id: 'sim-b1', code: 'dia', name: "Diablo's Ire", kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 90, quantity: 1 }
      ],
      [
        { id: 'sim-b2', code: 'utp', name: 'Archon Plate', baseName: 'Archon Plate', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b2', code: '7gd', name: 'Colossus Blade', baseName: 'Colossus Blade', kind: 'weapon', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b2', code: 'paf', name: 'Vortex Shield', baseName: 'Vortex Shield', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b3', code: 'uap', name: 'Shako', baseName: 'Shako', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b3', code: 'ulc', name: 'Spiderweb Sash', baseName: 'Spiderweb Sash', kind: 'armor', tier: 'elite', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b3', code: 'uar', name: 'Sacred Armor', baseName: 'Sacred Armor', kind: 'armor', tier: 'elite', rarity: 'set', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b4', code: 'pk3', name: 'Key of Destruction', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b4', code: 'pk1', name: 'Key of Terror', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b4', code: 'mbr', name: "Mephisto's Brain", kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b5', code: 'fed', name: 'Festering Essence of Destruction', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b5', code: 'bet', name: 'Burning Essence of Terror', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b5', code: 'ceh', name: 'Charged Essence of Hatred', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b6', code: 'ci3', name: 'Diadem', baseName: 'Diadem', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b6', code: 'ci2', name: 'Tiara', baseName: 'Tiara', kind: 'armor', tier: 'exceptional', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b6', code: 'drf', name: 'Dream Spirit', baseName: 'Dream Spirit', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b7', code: 'uit', name: 'Monarch (4 Sockets)', baseName: 'Monarch', kind: 'armor', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b7', code: '7cr', name: 'Phase Blade (5 Sockets)', baseName: 'Phase Blade', kind: 'weapon', tier: 'elite', rarity: 'normal', sockets: 5, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b7', code: 'pab', name: 'Sacred Targe (4 Sockets)', baseName: 'Sacred Targe', kind: 'armor', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b8', code: '9ha', name: 'Military Pick', baseName: 'Military Pick', kind: 'weapon', tier: 'exceptional', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b8', code: '9bs', name: 'Battle Sword', baseName: 'Battle Sword', kind: 'weapon', tier: 'exceptional', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 },
        { id: 'sim-b8', code: 'xar', name: 'Embossed Plate', baseName: 'Embossed Plate', kind: 'armor', tier: 'exceptional', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b9', code: 'hax', name: 'Hand Axe', baseName: 'Hand Axe', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b9', code: 'ssd', name: 'Short Sword', baseName: 'Short Sword', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b9', code: 'buc', name: 'Buckler', baseName: 'Buckler', kind: 'armor', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b10', code: 'rvl', name: 'Full Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b10', code: 'rvs', name: 'Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b11', code: 'hp4', name: 'Greater Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 },
        { id: 'sim-b11', code: 'mp4', name: 'Greater Mana Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 1 }
      ],
      [
        { id: 'sim-b12', code: 'gld', name: 'Gold', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 42500 },
        { id: 'sim-b12', code: 'gld', name: 'Gold', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 68400 },
        { id: 'sim-b12', code: 'gld', name: 'Gold', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 88, quantity: 31200 }
      ]
    ];
    return pools.map((pool, i) => ({ ...pickFromPool(pool, i, rollSeed) }));
  }

  if (scenario === 'campaign') {
    const pools: readonly (readonly SimulatedItem[])[] = [
      [
        { id: 'sim-c1', code: 'box', name: 'Horadric Cube', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 20, quantity: 1 },
        { id: 'sim-c1', code: 'msf', name: 'Staff of Kings', kind: 'weapon', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 20, quantity: 1 },
        { id: 'sim-c1', code: 'hdm', name: 'Horadric Malus', kind: 'weapon', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 15, quantity: 1 }
      ],
      [
        { id: 'sim-c2', code: 'r07', name: 'Tal Rune (#7)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
        { id: 'sim-c2', code: 'r08', name: 'Ral Rune (#8)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
        { id: 'sim-c2', code: 'r09', name: 'Ort Rune (#9)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 }
      ],
      [
        { id: 'sim-c3', code: 'r05', name: 'Eth Rune (#5)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
        { id: 'sim-c3', code: 'r06', name: 'Ith Rune (#6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 },
        { id: 'sim-c3', code: 'r04', name: 'Nef Rune (#4)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 25, quantity: 1 }
      ],
      [
        { id: 'sim-c4', code: 'crs', name: 'Crystal Sword (4 Sockets)', baseName: 'Crystal Sword', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 28, quantity: 1 },
        { id: 'sim-c4', code: 'fla', name: 'Flail (4 Sockets)', baseName: 'Flail', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 28, quantity: 1 },
        { id: 'sim-c4', code: 'bsd', name: 'Broad Sword (4 Sockets)', baseName: 'Broad Sword', kind: 'weapon', tier: 'normal', rarity: 'normal', sockets: 4, ethereal: false, identified: true, itemLevel: 28, quantity: 1 }
      ],
      [
        { id: 'sim-c5', code: 'rin', name: 'Ring', kind: 'misc', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
        { id: 'sim-c5', code: 'amu', name: 'Amulet', kind: 'misc', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
        { id: 'sim-c5', code: 'ci0', name: 'Circlet', baseName: 'Circlet', kind: 'armor', tier: 'normal', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 }
      ],
      [
        { id: 'sim-c6', code: 'cm1', name: 'Small Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
        { id: 'sim-c6', code: 'cm2', name: 'Large Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
        { id: 'sim-c6', code: 'cm3', name: 'Grand Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 },
        { id: 'sim-c6', code: 'jew', name: 'Jewel', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 25, quantity: 1 }
      ],
      [
        { id: 'sim-c7', code: 'hax', name: 'Crude Hand Axe', baseName: 'Hand Axe', kind: 'weapon', tier: 'normal', rarity: 'inferior', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c7', code: 'sbw', name: 'Cracked Short Bow', baseName: 'Short Bow', kind: 'weapon', tier: 'normal', rarity: 'inferior', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c7', code: 'cap', name: 'Damaged Cap', baseName: 'Cap', kind: 'armor', tier: 'normal', rarity: 'inferior', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 }
      ],
      [
        { id: 'sim-c8', code: 'qui', name: 'Quilted Armor (Unsocketed)', baseName: 'Quilted Armor', kind: 'armor', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c8', code: 'hla', name: 'Hard Leather Armor (Unsocketed)', baseName: 'Hard Leather Armor', kind: 'armor', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 14, quantity: 1 },
        { id: 'sim-c8', code: 'lbl', name: 'Sash (Unsocketed)', baseName: 'Sash', kind: 'armor', tier: 'normal', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 }
      ],
      [
        { id: 'sim-c9', code: 'gfv', name: 'Flawed Amethyst', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c9', code: 'gfy', name: 'Flawed Topaz', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c9', code: 'gfr', name: 'Flawed Ruby', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 }
      ],
      [
        { id: 'sim-c10', code: 'hp1', name: 'Minor Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 10, quantity: 1 },
        { id: 'sim-c10', code: 'mp1', name: 'Minor Mana Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 10, quantity: 1 },
        { id: 'sim-c10', code: 'hp2', name: 'Light Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 14, quantity: 1 }
      ],
      [
        { id: 'sim-c11', code: 'tsc', name: 'Scroll of Town Portal', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 },
        { id: 'sim-c11', code: 'isc', name: 'Scroll of Identify', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 12, quantity: 1 }
      ]
    ];
    return pools.map((pool, i) => ({ ...pickFromPool(pool, i, rollSeed) }));
  }

  // Default: 'endgame-map'
  const pools: readonly (readonly SimulatedItem[])[] = [
    [
      { id: 'sim-m1', code: 'md6', name: 'Sandswept Tomb Map (Tier 6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m1', code: 'mk6', name: 'Kurast Undercity Map (Tier 6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m1', code: 'mc5', name: 'Crystalline Passage Map (Tier 5)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 90, quantity: 1 },
      { id: 'sim-m1', code: 'mh6', name: 'Chaos Sanctuary Map (Tier 6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m2', code: 'mrl', name: 'Vizjerei Prism', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m2', code: 'mws', name: 'Horadric Astrolabe', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m2', code: 'mor', name: 'Horadric Sextant', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m3', code: 'cjw', name: 'Colossal Jewel', kind: 'misc', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m3', code: 'cm2', name: 'Hellfire Torch', kind: 'misc', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m3', code: 'cm3', name: 'Sunder Grand Charm', kind: 'misc', rarity: 'unique', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m4', code: 'r28', name: 'Lo Rune (#28)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m4', code: 'r30', name: 'Ber Rune (#30)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m4', code: 'r29', name: 'Sur Rune (#29)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m4', code: 'r32', name: 'Cham Rune (#32)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m5', code: 'ka3', name: 'Orb of Corruption', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m5', code: 'ooa', name: 'Orb of Assemblage', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m5', code: 'oos', name: 'Orb of Socketing', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m6', code: '7s8', name: 'Ethereal Thresher (4 Sockets)', baseName: 'Thresher', kind: 'weapon', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: true, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m6', code: '7wc', name: 'Ethereal Giant Thresher (4 Sockets)', baseName: 'Giant Thresher', kind: 'weapon', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: true, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m6', code: '7h7', name: 'Ethereal Great Poleaxe (4 Sockets)', baseName: 'Great Poleaxe', kind: 'weapon', tier: 'elite', rarity: 'normal', sockets: 4, ethereal: true, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m7', code: 'utp', name: 'Superior Archon Plate (3 Sockets)', baseName: 'Archon Plate', kind: 'armor', tier: 'elite', rarity: 'superior', sockets: 3, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m7', code: 'uui', name: 'Dusk Shroud (3 Sockets)', baseName: 'Dusk Shroud', kind: 'armor', tier: 'elite', rarity: 'normal', sockets: 3, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m7', code: 'xtp', name: 'Mage Plate (3 Sockets)', baseName: 'Mage Plate', kind: 'armor', tier: 'exceptional', rarity: 'superior', sockets: 3, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m8', code: 'cm3', name: 'Grand Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m8', code: 'cm1', name: 'Small Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m8', code: 'cm2', name: 'Large Charm', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m8', code: 'jew', name: 'Jewel', kind: 'misc', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m9', code: 'mfp', name: 'Magic Find Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m9', code: 'xpp', name: 'Experience Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m9', code: 'fsp', name: 'Fire Sunder Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m10', code: 'uhg', name: 'Ogre Gauntlets', baseName: 'Ogre Gauntlets', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m10', code: 'uhb', name: 'Myrmidon Greaves', baseName: 'Myrmidon Greaves', kind: 'armor', tier: 'elite', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m10', code: 'uvc', name: 'Vampirefang Belt', baseName: 'Vampirefang Belt', kind: 'armor', tier: 'elite', rarity: 'crafted', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m11', code: '9sw', name: 'Rune Sword', baseName: 'Rune Sword', kind: 'weapon', tier: 'exceptional', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m11', code: 'xh9', name: 'Grim Helm', baseName: 'Grim Helm', kind: 'armor', tier: 'exceptional', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m11', code: '9tw', name: 'Greater Talons', baseName: 'Greater Talons', kind: 'weapon', tier: 'exceptional', rarity: 'rare', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m12', code: '7cr', name: 'Magic Phase Blade', baseName: 'Phase Blade', kind: 'weapon', tier: 'elite', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m12', code: '7tw', name: 'Magic Runic Talons', baseName: 'Runic Talons', kind: 'weapon', tier: 'elite', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 },
      { id: 'sim-m12', code: 'amf', name: 'Magic Matriarchal Javelin', baseName: 'Matriarchal Javelin', kind: 'weapon', tier: 'elite', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m13', code: 'r04', name: 'Nef Rune (#4)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m13', code: 'r06', name: 'Ith Rune (#6)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m13', code: 'r05', name: 'Eth Rune (#5)', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m14', code: 'hp5', name: 'Super Healing Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m14', code: 'mp5', name: 'Super Mana Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m15', code: 'rvl', name: 'Full Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m15', code: 'rvs', name: 'Rejuvenation Potion', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 }
    ],
    [
      { id: 'sim-m16', code: 'aqv', name: 'Arrows', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m16', code: 'cqv', name: 'Bolts', kind: 'misc', rarity: 'normal', sockets: 0, ethereal: false, identified: true, itemLevel: 92, quantity: 1 },
      { id: 'sim-m16', code: 'z01', name: 'Magic Bow Quiver', kind: 'misc', rarity: 'magic', sockets: 0, ethereal: false, identified: false, itemLevel: 92, quantity: 1 }
    ]
  ];
  return pools.map((pool, i) => ({ ...pickFromPool(pool, i, rollSeed) }));
}
