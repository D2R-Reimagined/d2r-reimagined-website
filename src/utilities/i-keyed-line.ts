// Shared types for the key-based wire format produced by d2r-multi-export-tool.
// Every property line on every keyed bundle is a `IKeyedLine`: a translation
// key plus the post-math args ready to be splatted into the active-language
// template.

import type { TemplateArg } from './format-template';

/** A single post-math line: translation key + ordered args. */
export interface IKeyedLine {
    key: string;
    args: TemplateArg[];
    /** Optional flag to append strPerCharacterLevelSuffix after rendering. */
    perLevel?: boolean;
    /** Optional itype scope (runeword rune-contributed lines only) */
    qualifier?: 'weapon' | 'shield' | 'armor';
    /** 2..5 — set partial-bonus / per-item set-bonus only */
    itemsRequired?: number;
    /** true → set full-bonus only (mutually exclusive with itemsRequired) */
    fullSet?: boolean;
    /** Optional class-restriction string key (e.g. `AssOnly`, `DruOnly`, `SorOnly`).
     *  When set, the renderer appends the looked-up suffix (e.g. "(Assassin Only)")
     *  with a leading space after the main template is rendered. */
    classOnly?: string;
    /** Optional descPriority kept for stable ordering; not required for render. */
    priority?: number;
    /** Pool-child weight. Present only on entries inside a group's `children`
     *  array; the displayed percentage for the row is
     *  `chance / sum(siblings.chance) * 100`. Children without `chance`
     *  default to a weight of `1`. */
    chance?: number;
    /** Crafted-recipe pool selector. Present only on group parent rows
     *  (entries with empty `key` and a populated `children` array).
     *  - `"0"`         → all children always apply (guaranteed group).
     *  - any non-zero  → exactly one child is rolled from the pool;
     *                    rows render with their `chance` percentage.
     *  Today's data ships only `"1"` and `"2"` (uniques.json). */
    pickMode?: string;
    /** Group identifier (e.g. `"Gelid-Affix4"`, `"skilltab-war"`).
     *  Used as the bordered-box header on pooled groups; falls back to
     *  the literal code when no translation entry exists. */
    code?: string;
    /** Group children. When present, this row is a pool parent — its own
     *  `key`/`args` are ignored and the renderer walks `children` instead. */
    children?: IKeyedLine[];
}

/** Flat translation map for a single language (`{ "ModStr3a": "...", ... }`). */
export type StringMap = Readonly<Record<string, string>>;

/** Languages shipped by D2R; matches the exporter's `strings/{code}.json`. */
export type LanguageCode =
    | 'enUS'
    | 'zhTW'
    | 'deDE'
    | 'esES'
    | 'frFR'
    | 'itIT'
    | 'koKR'
    | 'plPL'
    | 'esMX'
    | 'jaJP'
    | 'ptBR'
    | 'ruRU'
    | 'zhCN';

export const LANGUAGES: ReadonlyArray<LanguageCode> = [
    'enUS', 'zhTW', 'deDE', 'esES', 'frFR', 'itIT',
    'koKR', 'plPL', 'esMX', 'jaJP', 'ptBR', 'ruRU', 'zhCN',
];

export const FALLBACK_LANGUAGE: LanguageCode = 'enUS';

export function isKeyedLine(value: unknown): value is IKeyedLine {
    if (!value || typeof value !== 'object') return false;
    const v = value as { key?: unknown; args?: unknown };
    return typeof v.key === 'string' && Array.isArray(v.args);
}
