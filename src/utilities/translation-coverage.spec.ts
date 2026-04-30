// Language-coverage test.
//
// Goal: every translation key referenced by shipped data should resolve in
// every language. "Resolve" mirrors the runtime fallback chain in
// `translation-store.lookup`:
//
//     <lang>.json  ∪  UI_STRINGS[lang]  ∪  UI_STRINGS.enUS
//
// References are collected from:
//   - every `IKeyedLine` (`{ key, args, classOnly? }`) found by recursively
//     walking each JSON under `static/data/keyed/`,
//   - the literal keys hard-coded in `format()` (perLevel suffix, qualifier
//     scopes, partial/full-set wrappers).
//
// The test runs in Node (no fetch / DOM), so it reads the bundles directly
// off disk via `fs`.

import { FALLBACK_LANGUAGE, LanguageCode,LANGUAGES } from './i-keyed-line';
import { stripGenderTagsInPlace } from './strip-gender-tags';
import { UI_STRINGS } from './ui-strings.js';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Repo paths (cwd is the project root when vitest runs).
const KEYED_DIR = join('static', 'data', 'keyed');
const STRINGS_DIR = join('static', 'data', 'strings');

// Hard-coded keys consumed by `format()` itself. Keep in sync with
// `translation-store.format()`.
const FORMAT_LITERAL_KEYS = [
    'strPerCharacterLevelSuffix',
    'strRuneScopeWeapon',
    'strRuneScopeShield',
    'strRuneScopeArmor',
    'strPartialSetBonus',
    'strFullSetBonus',
];

// Keys that are referenced from shipped data but currently have no entry in
// any language bundle or `UI_STRINGS`. Each entry is a real coverage gap to
// be addressed in the source-data export pipeline (or by adding to
// UI_STRINGS). Listing them here lets the rest of the suite enforce 100%
// coverage; the stale-entry check below makes sure entries are removed once
// the gap is closed.
const KNOWN_MISSING: ReadonlyArray<string> = [
    // Affix-name keys emitted by `magicprefix.json` for six new mod affixes.
    'Virulent-Affix1', 'Virulent-Affix2',
    'Gelid-Affix1', 'Gelid-Affix2',
    'Magnetic-Affix1', 'Magnetic-Affix2',
    'Incendiary-Affix1', 'Incendiary-Affix2',
    'Breaching-Affix1', 'Breaching-Affix2',
    'Mystical-Affix1', 'Mystical-Affix2',
];

type KeyedLineLike = { key: string; args: unknown[]; classOnly?: unknown };

function isKeyedLineLike(value: unknown): value is KeyedLineLike {
    if (!value || typeof value !== 'object') return false;
    const v = value as { key?: unknown; args?: unknown };
    return typeof v.key === 'string' && Array.isArray(v.args);
}

// Numeric / range / sign literals such as `"21-23"`, `"+12"`, `"3.5"` are
// substituted verbatim by `format-template.ts` (`lookupSilent` on a non-key
// passes the input through unchanged), so they are not translation keys and
// must not be counted as coverage references. Empty strings are likewise
// pure literals (e.g. the empty `classOnly` slot in `strSkillTabBonusClassOnly`).
const NON_KEY_LITERAL = /^[+\-]?\d+(?:[.\-]\d+)?%?$/;

function isLikelyKey(s: string): boolean {
    if (s === '') return false;
    return !NON_KEY_LITERAL.test(s);
}

function collectRefs(node: unknown, into: Set<string>): void {
    if (Array.isArray(node)) {
        for (const child of node) collectRefs(child, into);
        return;
    }
    if (node && typeof node === 'object') {
        if (isKeyedLineLike(node)) {
            // Pool-parent rows ship with `key: ""` (their `children` carry
            // the actual translation keys); skip the empty literal so it
            // doesn't get flagged as an unresolved reference.
            if (isLikelyKey(node.key)) into.add(node.key);
            for (const a of node.args) {
                if (typeof a === 'string' && isLikelyKey(a)) into.add(a);
            }
            if (typeof node.classOnly === 'string' && isLikelyKey(node.classOnly)) {
                into.add(node.classOnly);
            }
        }
        for (const k of Object.keys(node)) {
            collectRefs((node as Record<string, unknown>)[k], into);
        }
    }
}

function loadKeyedRefs(): Set<string> {
    const refs = new Set<string>();
    for (const file of readdirSync(KEYED_DIR)) {
        if (!file.endsWith('.json')) continue;
        const raw = readFileSync(join(KEYED_DIR, file), 'utf8');
        collectRefs(JSON.parse(raw), refs);
    }
    for (const k of FORMAT_LITERAL_KEYS) refs.add(k);
    return refs;
}

function loadLanguageBundle(lang: LanguageCode): Record<string, string> {
    const raw = readFileSync(join(STRINGS_DIR, `${lang}.json`), 'utf8');
    const map = JSON.parse(raw) as Record<string, string>;
    // Mirror the runtime normalization so a value made up entirely of empty
    // gender variants doesn't fool the membership check.
    stripGenderTagsInPlace(map);
    return map;
}

function resolves(
    key: string,
    bundle: Record<string, string>,
    lang: LanguageCode,
): boolean {
    if (key in bundle) return true;
    if (UI_STRINGS[lang]?.[key] !== undefined) return true;
    if (UI_STRINGS[FALLBACK_LANGUAGE]?.[key] !== undefined) return true;
    return false;
}

const REFS = loadKeyedRefs();
const KNOWN_MISSING_SET = new Set(KNOWN_MISSING);

describe('translation coverage', () => {
    it('every shipped language has every referenced key (allow-list aside)', () => {
        const gaps: Record<string, string[]> = {};
        for (const lang of LANGUAGES) {
            const bundle = loadLanguageBundle(lang);
            const missing: string[] = [];
            for (const key of REFS) {
                if (KNOWN_MISSING_SET.has(key)) continue;
                if (!resolves(key, bundle, lang)) missing.push(key);
            }
            if (missing.length > 0) gaps[lang] = missing.sort();
        }
        // Stringify so the failure report lists each language's gaps inline.
        expect(gaps).toEqual({});
    });

    it('KNOWN_MISSING contains no stale entries (every entry is still missing in enUS)', () => {
        // If an allow-listed key now resolves, the entry should be removed
        // so the suite enforces the closed gap going forward.
        const enUS = loadLanguageBundle(FALLBACK_LANGUAGE);
        const stale = KNOWN_MISSING.filter((k) => resolves(k, enUS, FALLBACK_LANGUAGE));
        expect(stale).toEqual([]);
    });

    it('KNOWN_MISSING only lists keys that are actually referenced', () => {
        // Catches typos in the allow-list itself.
        const unreferenced = KNOWN_MISSING.filter((k) => !REFS.has(k));
        expect(unreferenced).toEqual([]);
    });
});
