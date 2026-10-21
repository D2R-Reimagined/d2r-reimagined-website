import { countNumericSlots, formatTemplate } from './format-template';
import skills from '../../static/data/keyed/skills.json';

import { describe, expect, it } from 'vitest';

describe('formatTemplate', () => {
    it('substitutes sequential numeric and string tokens', () => {
        expect(formatTemplate('+%d%% Enhanced Damage', [150])).toBe('+150% Enhanced Damage');
        expect(formatTemplate('Level %d %s', [5, 'Teleport'])).toBe('Level 5 Teleport');
    });

    it('collapses a leading ranged numeric token to min-max', () => {
        expect(formatTemplate('+%d%% Enhanced Damage', [150, 250])).toBe('+150-250% Enhanced Damage');
        // Surplus range with trailing skill name (descfunc 16/20/28).
        expect(formatTemplate('Level %d %s', [5, 10, 'Teleport'])).toBe('Level 5-10 Teleport');
    });

    it('resolves indexed templates without a ranged surplus', () => {
        // ItemExpansiveChanc1: [chance, level, skill] -> %0/%1/%2.
        expect(
            formatTemplate('%0%% chance to cast level %1 %2 on attack', [10, 10, 'Arc']),
        ).toBe('10% chance to cast level 10 Arc on attack');
    });

    it('collapses a ranged numeric slot in an indexed template', () => {
        // Moditemreanimas: exporter ships chance as [min, max] before the monster
        // name, so args are [5, 10, "Voltshade"] for `%0%% Reanimate as: %1`.
        expect(
            formatTemplate('%0%% Reanimate as: %1', [5, 10, 'Voltshade']),
        ).toBe('5-10% Reanimate as: Voltshade');
    });

    it('collapses an indexed range that equals min/max to a single number', () => {
        expect(
            formatTemplate('%0%% Reanimate as: %1', [7, 7, 'Voltshade']),
        ).toBe('7% Reanimate as: Voltshade');
    });

    it('keeps the fraction on skill values the game itself prints with a decimal', () => {
        // Fire Bolt's mana cost is 640/256 — truncating it to 2 would misstate the skill.
        expect(formatTemplate('Mana Cost: %d', [2.5])).toBe('Mana Cost: 2.5');
        expect(formatTemplate('Cold Length: %d seconds', [4.8])).toBe('Cold Length: 4.8 seconds');
        expect(formatTemplate('Casting Delay: %d seconds', [0.6])).toBe('Casting Delay: 0.6 seconds');
        expect(formatTemplate('%+d%% Damage Reduction', [-1.5])).toBe('-1.5% Damage Reduction');
        // Whole numbers are unchanged, so every item property renders as before.
        expect(formatTemplate('Mana Cost: %d', [7])).toBe('Mana Cost: 7');
    });

    it('renders every exported skill value exactly as the one-decimal formatter did', () => {
        const values = new Set<number>();
        const walk = (node: unknown): void => {
            if (typeof node === 'number') values.add(node);
            else if (node && typeof node === 'object') Object.values(node).forEach(walk);
        };
        walk(skills);
        const fractional = [...values].filter((value) => !Number.isInteger(value));
        expect(fractional.length).toBeGreaterThan(0);
        for (const value of fractional) {
            const previous = Number(value.toFixed(1)).toString();
            expect(formatTemplate('%d', [value])).toBe(previous);
            expect(formatTemplate('%+d%%', [value])).toBe(`${value >= 0 ? '+' : ''}${previous}%`);
        }
    });

    it('keeps every exported decimal place without trailing zeros', () => {
        expect(formatTemplate('Value: %d', [1.5])).toBe('Value: 1.5');
        expect(formatTemplate('Value: %d', [0.12])).toBe('Value: 0.12');
        expect(formatTemplate('Value: %d', [10.24])).toBe('Value: 10.24');
        expect(formatTemplate('Value: %d', [0.375])).toBe('Value: 0.375');
        expect(formatTemplate('Value: %d', [0.625])).toBe('Value: 0.625');
        expect(formatTemplate('Value: %d', [0.0625])).toBe('Value: 0.0625');
        expect(formatTemplate('Value: %D', [2.125])).toBe('Value: 2.125');
        expect(formatTemplate('Value: %i', [3.0625])).toBe('Value: 3.0625');
        expect(formatTemplate('Value: %d', [0.5000])).toBe('Value: 0.5');
    });

    it('suppresses floating-point artifacts', () => {
        expect(formatTemplate('Value: %d', [0.1 + 0.2])).toBe('Value: 0.3');
        expect(formatTemplate('Value: %d', [0.30000000000000004])).toBe('Value: 0.3');
        expect(formatTemplate('Value: %d', [1.1 * 3])).toBe('Value: 3.3');
        expect(formatTemplate('Value: %d', [0.7 + 0.1])).toBe('Value: 0.8');
        expect(formatTemplate('%+d%% Value', [-(0.1 + 0.2)])).toBe('-0.3% Value');
        // Noise that lands next to a whole number collapses to that integer.
        expect(formatTemplate('Value: %d', [0.1 * 3 * 10])).toBe('Value: 3');
    });

    it('signs fractional, negative and zero values', () => {
        expect(formatTemplate('%+d%% Deadly Strike', [0.375])).toBe('+0.375% Deadly Strike');
        expect(formatTemplate('%+d%% Deadly Strike', [-0.375])).toBe('-0.375% Deadly Strike');
        expect(formatTemplate('%+d to Life', [-7.5])).toBe('-7.5 to Life');
        expect(formatTemplate('%+d to Life', [0])).toBe('+0 to Life');
        expect(formatTemplate('Value: %d', [0])).toBe('Value: 0');
        expect(formatTemplate('Value: %d', [-0.625])).toBe('Value: -0.625');
        expect(formatTemplate('%d%% Chance', [12.5])).toBe('12.5% Chance');
    });

    it('keeps whole and large numbers in plain integer form', () => {
        expect(formatTemplate('%+d to Strength', [20])).toBe('+20 to Strength');
        expect(formatTemplate('%+d to Strength', [-20])).toBe('-20 to Strength');
        expect(formatTemplate('Defense: %d', [123456789])).toBe('Defense: 123456789');
        expect(formatTemplate('Value: %d', [123456.789])).toBe('Value: 123456.789');
    });

    it('keeps fractional precision on both halves of a range', () => {
        expect(formatTemplate('Cold Length: %d seconds', [3, 10.24])).toBe('Cold Length: 3-10.24 seconds');
        expect(formatTemplate('%+d%% Cold Resistance', [0.375, 0.625])).toBe('+0.375-0.625% Cold Resistance');
        expect(formatTemplate('%+d%% Cold Resistance', [0.625, 0.625])).toBe('+0.625% Cold Resistance');
        expect(formatTemplate('%0%% Reanimate as: %1', [2.5, 7.125, 'Voltshade'])).toBe('2.5-7.125% Reanimate as: Voltshade');
    });

    it('fills four-slot roll templates in order', () => {
        expect(formatTemplate('Adds %d-%d fire damage, rolls %d-%d', [10, 20, 30, 40])).toBe('Adds 10-20 fire damage, rolls 30-40');
        expect(formatTemplate('Adds %d-%d fire damage, rolls %d-%d', [1.5, 2.25, 3, 4.125])).toBe('Adds 1.5-2.25 fire damage, rolls 3-4.125');
    });

    it('leaves plain indexed slots on their natural number form', () => {
        expect(formatTemplate('%0%% chance to cast level %1 %2 on attack', [0.375, 10, 'Arc'])).toBe('0.375% chance to cast level 10 Arc on attack');
        // ruRU reorders the arguments by index.
        expect(formatTemplate('«%1» %0-го уровня (%2/%3 зарядов)', [5, 'Огненный шар', 10, 20])).toBe('«Огненный шар» 5-го уровня (10/20 зарядов)');
    });
});

describe('countNumericSlots', () => {
    it('counts the numeric tokens a template can place', () => {
        expect(countNumericSlots('Fire Damage: %d-%d')).toBe(2);
        expect(countNumericSlots('Defense: %d')).toBe(1);
        expect(countNumericSlots('Bound demons gain Extra Strong')).toBe(0);
        // Leading %s slots belong to the string args, not the numbers.
        expect(countNumericSlots('%s: %+d%% Fire Damage per Level', 1)).toBe(1);
    });

    it('resolves indexed templates against their highest index', () => {
        expect(countNumericSlots('%0%% chance to cast level %1 %2 on attack', 1)).toBe(2);
    });
});
