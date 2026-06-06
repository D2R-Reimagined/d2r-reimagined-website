// Type-filter dropdown built from page data: generic class item types must
// still surface their leaf class-armor options, and both data spellings must
// normalize to the same code for Exact matching.

import {
    buildOptionsForPresentTypes,
    normalizeClassItemCode,
    resolveBaseTypeName,
    type_filtering_options,
} from './index';

import { describe, expect, it } from 'vitest';

function optionIds(present: Set<string>): string[] {
    return buildOptionsForPresentTypes(type_filtering_options, present).map((o) => o.id);
}

// Runewords pass includeAncestorMatches=false so broad data types do not surface
// leaf options for items that cannot bear runewords.
function runewordOptionIds(present: Set<string>): string[] {
    return buildOptionsForPresentTypes(type_filtering_options, present, false).map((o) => o.id);
}

describe('buildOptionsForPresentTypes — class-armor options from generic class types', () => {
    it('surfaces Primal Helm from a Barbarian Item type', () => {
        expect(optionIds(new Set(['barbitype']))).toContain('barbarian-helm');
    });

    it('surfaces Druid Pelt from a Druid Item type', () => {
        expect(optionIds(new Set(['druiitype']))).toContain('druid-helm');
    });

    it('surfaces Voodoo Head from a Necromancer Item type', () => {
        expect(optionIds(new Set(['necritype']))).toContain('necromancer-shield');
    });

    it('surfaces Auric Shield from a Paladin Item type', () => {
        expect(optionIds(new Set(['palaitype']))).toContain('paladin-shield');
    });

    it('surfaces Warlock Grimoire from a Warlock Item type', () => {
        expect(optionIds(new Set(['warlitype']))).toContain('warlock-grimoire');
    });

    it('does not pull in unrelated class-armor options for a plain weapon type', () => {
        const ids = optionIds(new Set(['axeitype']));
        expect(ids).toContain('axeitype');
        expect(ids).not.toContain('barbarian-helm');
        expect(ids).not.toContain('druid-helm');
    });
});

describe('buildOptionsForPresentTypes — runewords mode hides leaves of broad-only data', () => {
    const present = new Set(['weapitype', 'meleitype', 'missitype', 'axeitype']);

    it('keeps aggregate options whose base is present', () => {
        const ids = runewordOptionIds(present);
        expect(ids).toContain('any-weapon');
        expect(ids).toContain('melee-weapon');
        expect(ids).toContain('missile-weapon');
        expect(ids).toContain('axeitype');
    });

    it('does not surface leaf options for items with no runeword base type', () => {
        const ids = runewordOptionIds(present);
        expect(ids).not.toContain('javeitype');
        expect(ids).not.toContain('exact-tkniitype');
        expect(ids).not.toContain('exact-taxeitype');
    });

    it('default (ancestor) mode still surfaces those leaves for category data (affixes)', () => {
        const ids = optionIds(new Set(['weapitype']));
        expect(ids).toContain('javeitype');
        expect(ids).toContain('exact-tkniitype');
        expect(ids).toContain('exact-taxeitype');
    });
});

describe('resolveBaseTypeName — canonical Druid Item code', () => {
    it('recognizes the exported druiitype code (graph parity with data/strings)', () => {
        expect(resolveBaseTypeName('druiitype')).toBe('druiitype');
    });
});

describe('normalizeClassItemCode — single-leaf class items collapse to their leaf', () => {
    it('maps each generic single-leaf class item to its concrete armor leaf', () => {
        expect(normalizeClassItemCode('barbitype')).toBe('phlmitype');
        expect(normalizeClassItemCode('druiitype')).toBe('peltitype');
        expect(normalizeClassItemCode('necritype')).toBe('headitype');
        expect(normalizeClassItemCode('palaitype')).toBe('ashditype');
        expect(normalizeClassItemCode('warlitype')).toBe('grimitype');
    });

    it('leaves leaf codes and multi-leaf class items unchanged', () => {
        expect(normalizeClassItemCode('ashditype')).toBe('ashditype');
        expect(normalizeClassItemCode('headitype')).toBe('headitype');
        expect(normalizeClassItemCode('amazitype')).toBe('amazitype');
        expect(normalizeClassItemCode('sorcitype')).toBe('sorcitype');
        expect(normalizeClassItemCode('axeitype')).toBe('axeitype');
    });

    it('surfaces the same leaf option whether data uses the generic or leaf code', () => {
        const fromGeneric = resolveBaseTypeName(normalizeClassItemCode('palaitype'));
        const fromLeaf = resolveBaseTypeName(normalizeClassItemCode('ashditype'));
        expect(fromGeneric).toBe('ashditype');
        expect(fromLeaf).toBe('ashditype');
        expect(optionIds(new Set([fromGeneric]))).toContain('paladin-shield');
    });
});
