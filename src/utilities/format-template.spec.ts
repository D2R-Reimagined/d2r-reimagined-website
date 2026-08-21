import { countNumericSlots, formatTemplate } from './format-template';

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
        expect(formatTemplate('%+d%% Damage Reduction', [-1.5])).toBe('-1.5% Damage Reduction');
        // Whole numbers are unchanged, so every item property renders as before.
        expect(formatTemplate('Mana Cost: %d', [7])).toBe('Mana Cost: 7');
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
