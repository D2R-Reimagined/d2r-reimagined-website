// Fixture-driven tests for the `format(line)` decoration pipeline.
//
// `format()` composes five orthogonal modifiers (`perLevel`, `qualifier`,
// `classOnly`, `itemsRequired`, `fullSet`) over a templated string. Each test
// pins one observable behavior so future refactors of the decoration order,
// suffix-key choice, or mutual-exclusion logic break a named test instead of
// silently changing tooltips across uniques / runewords / sets pages.
//
// The bundle below is a minimal hand-built mirror of real D2R templates —
// just enough keys to exercise every branch in `format()` plus the
// string-arg-as-key recursion in `t()`. We stub `globalThis.fetch` so
// `setLanguage('enUS')` resolves without network access.

import { format, setLanguage, t } from './translation-store';

import { beforeAll, describe, expect, it } from 'vitest';

const fixture: Record<string, string> = {
    strModEnhancedDamage: '+%d%% Enhanced Damage',
    ModStr4m: '+%d to Strength',
    strPerCharacterLevelSuffix: ' (Based on Character Level)',
    strRuneScopeWeapon: ' (Weapons)',
    strRuneScopeShield: ' (Shields)',
    strRuneScopeArmor: ' (Body Armor)',
    strPartialSetBonus: '%s (%d Items)',
    strFullSetBonus: '%s (Complete Set)',
    Sorceress: 'Sorceress',
};

beforeAll(async () => {
    // setLanguage caches the bundle for both FALLBACK_LANGUAGE and the active
    // language; serving the same fixture for every URL is sufficient.
    globalThis.fetch = () =>
        Promise.resolve(new Response(JSON.stringify(fixture), { status: 200 }));
    await setLanguage('enUS');
});

describe('format(line) — D2R line decoration', () => {
    it('renders a plain ranged property using min-max args', () => {
        expect(format({ key: 'strModEnhancedDamage', args: [120, 170] }))
            .toBe('+120-170% Enhanced Damage');
    });

    it('renders a single-arg numeric property without range syntax', () => {
        expect(format({ key: 'ModStr4m', args: [15] })).toBe('+15 to Strength');
    });

    it('appends the per-character-level suffix', () => {
        expect(format({ key: 'ModStr4m', args: [2], perLevel: true }))
            .toBe('+2 to Strength (Based on Character Level)');
    });

    it('appends a weapon qualifier after the base line', () => {
        expect(format({ key: 'ModStr4m', args: [10], qualifier: 'weapon' }))
            .toBe('+10 to Strength (Weapons)');
    });

    it('appends a shield qualifier', () => {
        expect(format({ key: 'ModStr4m', args: [10], qualifier: 'shield' }))
            .toBe('+10 to Strength (Shields)');
    });

    it('appends an armor qualifier', () => {
        expect(format({ key: 'ModStr4m', args: [10], qualifier: 'armor' }))
            .toBe('+10 to Strength (Body Armor)');
    });

    it('appends classOnly with a leading space, resolved via lookup', () => {
        expect(format({ key: 'ModStr4m', args: [5], classOnly: 'Sorceress' }))
            .toBe('+5 to Strength Sorceress');
    });

    it('wraps the line in the partial-set bonus when itemsRequired is set', () => {
        expect(format({ key: 'ModStr4m', args: [20], itemsRequired: 3 }))
            .toBe('+20 to Strength (3 Items)');
    });

    it('wraps the line in the full-set bonus when fullSet is true', () => {
        expect(format({ key: 'ModStr4m', args: [50], fullSet: true }))
            .toBe('+50 to Strength (Complete Set)');
    });

    it('itemsRequired wins over fullSet (pins the else-if ordering)', () => {
        expect(format({
            key: 'ModStr4m', args: [50], itemsRequired: 4, fullSet: true,
        })).toBe('+50 to Strength (4 Items)');
    });

    it('composes perLevel + qualifier left-to-right', () => {
        expect(format({
            key: 'ModStr4m', args: [1], perLevel: true, qualifier: 'weapon',
        })).toBe('+1 to Strength (Based on Character Level) (Weapons)');
    });

    it('returns empty string for null lines', () => {
        expect(format(null)).toBe('');
    });

    it('returns empty string for undefined lines', () => {
        expect(format(undefined)).toBe('');
    });
});

describe('t(key, args) — string args resolved as keys', () => {
    it('looks up string args before splatting them into the template', () => {
        // 'Sorceress' is itself a key in the bundle; t() must look it up so
        // class-themed set/runeword bonuses translate the class name.
        expect(t('strFullSetBonus', ['Sorceress'])).toBe('Sorceress (Complete Set)');
    });

    it('passes numeric args through unchanged', () => {
        expect(t('strPartialSetBonus', ['Sorceress', 2])).toBe('Sorceress (2 Items)');
    });
});
