import type { TemplateArg } from '../utilities/format-template';

export const catalogSlugs = [
  'uniques',
  'sets',
  'runewords',
  'bases',
  'affixes',
  'cube-recipes'
] as const;

export type CatalogSlug = (typeof catalogSlugs)[number];

export interface KeyedLine {
  key: string;
  args?: TemplateArg[];
  perLevel?: boolean;
  qualifier?: 'weapon' | 'shield' | 'armor';
  itemsRequired?: number;
  fullSet?: boolean;
  classOnly?: string;
  chance?: number;
  pickMode?: string;
  code?: string;
  children?: KeyedLine[];
}

export interface DamageType {
  Type: number;
  AverageDamage?: number;
  Lines?: KeyedLine[];
}

export interface Equipment {
  EquipmentType?: number;
  NameKey?: string;
  RequiredClass?: string;
  DamageTypes?: DamageType[];
  Lines?: KeyedLine[];
}

export interface CatalogItem {
  Index?: string | number;
  NameKey?: string;
  Type?: string | { Name?: string; Index?: string; Class?: string };
  Vanilla?: string;
  RequiredLevel?: number;
  ItemLevel?: number;
  Rarity?: number;
  RequiredClass?: string;
  ClassSpecific?: string;
  PType?: string;
  Group?: number;
  Level?: number;
  MaxLevel?: number;
  Code?: string;
  NormCode?: string;
  UberCode?: string;
  UltraCode?: string;
  GemSockets?: number | string;
  Lines?: KeyedLine[];
  Equipment?: Equipment;
  DamageTypes?: DamageType[];
  SetItems?: CatalogItem[];
  PartialBonuses?: KeyedLine[];
  FullBonuses?: KeyedLine[];
  SetBonuses?: KeyedLine[][];
  Runes?: Array<{ NameKey?: string }>;
  Types?: Array<string | { Name?: string; Index?: string; Class?: string }>;
  Inputs?: Array<{ Name?: KeyedLine; Quantity?: number; Qualifiers?: KeyedLine[] }>;
  Outputs?: Record<string, { Name?: KeyedLine; Quantity?: number; Qualifiers?: KeyedLine[]; Lines?: KeyedLine[] }>;
  Notes?: KeyedLine[];
  Description?: string;
  source?: 'armor' | 'weapon' | 'prefix' | 'suffix';
  [key: string]: unknown;
}

export interface CatalogDefinition {
  slug: CatalogSlug;
  title: string;
  description: string;
}

/**
 * One line of a skill's in-game description. Same `key` + positional-args contract as
 * `KeyedLine`, except the numeric arguments arrive as one table per argument, indexed by
 * `level - 1` — the same line reads differently at every skill level.
 *
 * The exporter drops a table's constant tail, so a line that stops scaling ships fewer
 * entries than the skill has levels; clamp the index to the last element.
 */
export interface SkillDescriptionLine {
  key: string;
  /** Damage family whose source skillcalc synergy percentage applies to this line. */
  scale?: SkillDamageScale;
  /** Plural template, chosen whenever the rendered value is not exactly 1. */
  pluralKey?: string;
  /** Leading string arguments — translation keys, typically a bonus-granting skill name. */
  args?: string[];
  /** One table per numeric argument, each indexed by `level - 1`. */
  values?: number[][];
}

export type SkillDamageScale = 'physical' | 'elemental' | 'elementalLength';

export interface SkillCalculation {
  /** skills.txt Param1..Param20, parsed with the game's integer semantics. */
  Params: Record<number, number>;
  /** skills.txt Calc1..Calc10, retained for cross-skill clcN references. */
  Calcs: Record<number, string>;
  /** skills.txt DmgSymPerCalc. */
  PhysicalDamage?: string;
  /** skills.txt EDmgSymPerCalc. */
  ElementalDamage?: string;
  /** skills.txt ELenSymPerCalc. */
  ElementalLength?: string;
}

export interface SkillDescriptionSet {
  /** Highest level the value tables cover — the skill cap plus +skills headroom. */
  MaxLevel: number;
  /** Main tooltip stats: damage, duration, radius, … */
  Stats: SkillDescriptionLine[];
  /** Supplementary lines: mana cost, casting delay, … */
  Details: SkillDescriptionLine[];
  /** The "Receives Bonuses From" synergy list. */
  Synergies: SkillDescriptionLine[];
}

export interface Skill {
  Id: number;
  Code: string;
  NameKey: string;
  ElementType?: string;
  ShortDescriptionKey?: string;
  DescriptionKey?: string;
  Icon?: string;
  Row: number;
  Column: number;
  RequiredLevel: number;
  MaxLevel: number;
  PrerequisiteIds: number[];
  Calculation?: SkillCalculation;
  Descriptions?: SkillDescriptionSet;
}

export interface SkillTab {
  Page: number;
  NameKey: string;
  Skills: Skill[];
}

export interface SkillClass {
  Class: string;
  ClassCode: string;
  NameKey: string;
  Tabs: SkillTab[];
}

export const skillPlannerDefinition = {
  slug: 'skills',
  title: 'Skill Planner',
  description: 'Preview every class skill tree and plan your point allocation with requirements and prerequisites.'
} as const;

export const catalogDefinitions: Record<CatalogSlug, CatalogDefinition> = {
  uniques: {
    slug: 'uniques',
    title: 'Unique Items',
    description: 'Search every unique item in D2R Reimagined, including equipment requirements and complete property rolls.'
  },
  sets: {
    slug: 'sets',
    title: 'Set Items',
    description: 'Explore complete item sets, their individual pieces, partial bonuses, and full-set rewards.'
  },
  runewords: {
    slug: 'runewords',
    title: 'Runewords',
    description: 'Find compatible bases, rune orders, level requirements, and modifiers for every runeword.'
  },
  bases: {
    slug: 'bases',
    title: 'Item Bases',
    description: 'Compare armor and weapon bases, sockets, requirements, defenses, and damage ranges.'
  },
  affixes: {
    slug: 'affixes',
    title: 'Magic Affixes',
    description: 'Browse prefixes and suffixes by item type, level, class restriction, and property.'
  },
  'cube-recipes': {
    slug: 'cube-recipes',
    title: 'Cube Recipes',
    description: 'Search the full Horadric Cube recipe catalog, including inputs, outputs, properties, and notes.'
  }
};
