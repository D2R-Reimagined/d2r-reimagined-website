import { formatTemplate } from './format-template';

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
});
