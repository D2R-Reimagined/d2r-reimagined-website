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
  Inputs?: Array<{ Name?: KeyedLine; Quantity?: number; Qualifiers?: string[] }>;
  Outputs?: Record<string, { Name?: KeyedLine; Quantity?: number; Qualifiers?: string[]; Lines?: KeyedLine[] }>;
  Notes?: KeyedLine[];
  Description?: string;
  source?: 'armor' | 'weapon' | 'prefix' | 'suffix';
  [key: string]: unknown;
}

export interface CatalogDefinition {
  slug: CatalogSlug;
  title: string;
  eyebrow: string;
  description: string;
}

export interface Skill {
  Id: number;
  Code: string;
  NameKey: string;
  ShortDescriptionKey?: string;
  DescriptionKey?: string;
  Row: number;
  Column: number;
  RequiredLevel: number;
  MaxLevel: number;
  PrerequisiteIds: number[];
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
  eyebrow: 'Shape your hero',
  description: 'Preview every class skill tree and plan your point allocation with requirements and prerequisites.'
} as const;

export const catalogDefinitions: Record<CatalogSlug, CatalogDefinition> = {
  uniques: {
    slug: 'uniques',
    title: 'Unique Items',
    eyebrow: 'The rarest spoils',
    description: 'Search every unique item in D2R Reimagined, including equipment requirements and complete property rolls.'
  },
  sets: {
    slug: 'sets',
    title: 'Set Items',
    eyebrow: 'Greater than the sum',
    description: 'Explore complete item sets, their individual pieces, partial bonuses, and full-set rewards.'
  },
  runewords: {
    slug: 'runewords',
    title: 'Runewords',
    eyebrow: 'Power written in stone',
    description: 'Find compatible bases, rune orders, level requirements, and modifiers for every runeword.'
  },
  bases: {
    slug: 'bases',
    title: 'Item Bases',
    eyebrow: 'Choose the foundation',
    description: 'Compare armor and weapon bases, sockets, requirements, defenses, and damage ranges.'
  },
  affixes: {
    slug: 'affixes',
    title: 'Magic Affixes',
    eyebrow: 'Know what can roll',
    description: 'Browse prefixes and suffixes by item type, level, class restriction, and property.'
  },
  'cube-recipes': {
    slug: 'cube-recipes',
    title: 'Cube Recipes',
    eyebrow: 'Transmute with purpose',
    description: 'Search the full Horadric Cube recipe catalog, including inputs, outputs, properties, and notes.'
  }
};
