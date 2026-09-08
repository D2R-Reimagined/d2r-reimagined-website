import {describe, expect, it} from 'vitest';
import dataset from '../../static/data/keyed/health-calculator.json';
import {calculateHealth, healthInputs, levelScale, type HealthData, type HealthInputs} from './health-calculator';

const data = dataset as HealthData;
const monster = (id: string) => data.Monsters.find(m => m.Id === id)!;
const fixture: HealthInputs = {level: 1, min: 101, max: 181, scale: 7, noRatio: false,
    playerPercent: 50, typePercent: 0, extraPercent: 0, flatLife: 0};

describe('monster health', () => {
    it('rounds base values before scaling from one to eight players', () => {
        expect(calculateHealth(data, fixture, 1)).toMatchObject({min: 7, max: 12});
        expect(calculateHealth(data, fixture, 2)).toMatchObject({min: 10, max: 18});
        expect(calculateHealth(data, fixture, 8)).toMatchObject({min: 31, max: 54});
    });
    it('keeps noRatio life absolute and does not player-scale allies', () => {
        expect(calculateHealth(data, {...fixture, noRatio: true}, 2)).toMatchObject({min: 151, max: 271});
        expect(calculateHealth(data, {...fixture, noRatio: true, scale: NaN}, 2)).toMatchObject({min: 151, max: 271});
        const ally = {...monster('fallen1'), Align: 1};
        expect(healthInputs(data, ally, 2, 0, 'LHP', 'normal').playerPercent).toBe(0);
    });
    it('uses area levels only for non-boss, ratio-based monsters in Nightmare/Hell', () => {
        const fallen = monster('fallen1');
        const area = data.Areas.find(a => a.Id === 2)!;
        expect(healthInputs(data, fallen, 2, 2, 'LHP', 'normal').level).toBe(area.Levels[2]);
        expect(healthInputs(data, fallen, 0, 2, 'LHP', 'normal').level).toBe(fallen.Stats[0].Level);
        for (const row of [{...fallen, NoRatio: true}, {...fallen, Boss: true}]) {
            expect(healthInputs(data, row, 2, 2, 'LHP', 'normal').level).toBe(row.Stats[2].Level);
        }
    });
    it('reads mod-specific elite bonuses without increasing the health lookup level', () => {
        expect(data.Bonuses.Champion).toEqual([200, 150, 100]);
        const regular = healthInputs(data, monster('fallen1'), 2, 2, 'LHP', 'normal');
        const champion = healthInputs(data, monster('fallen1'), 2, 2, 'LHP', 'champion');
        expect(champion.level).toBe(regular.level);
        expect(champion.typePercent).toBe(100);
        expect(calculateHealth(data, {...fixture, typePercent: 200}, 2)).toMatchObject({min: 30, max: 54});
    });
    it('preserves fixed-point elite percentage rounding', () => {
        expect(calculateHealth(data, {...fixture, min: 5001, max: 5001, noRatio: true, typePercent: 75}, 1).min).toBe(8751);
    });
    it('matches exported Hell Diablo values and additional-player scaling', () => {
        const setup = healthInputs(data, monster('diablo'), 2, 108, 'LHP', 'normal');
        expect(setup).toMatchObject({level: 96, min: 10800, max: 10800, scale: 7447});
        expect(calculateHealth(data, setup, 1).min).toBe(804276);
        expect(calculateHealth(data, setup, 8).min).toBe(3619242);
    });
    it('caps player scaling but refuses elite overflow', () => {
        const big = {...fixture, min: 8000000, max: 8000000, noRatio: true};
        expect(calculateHealth(data, big, 8)).toMatchObject({min: 8388607, capped: true});
        expect(calculateHealth(data, {...big, typePercent: 100}, 8).error).toContain('overflow');
        expect(calculateHealth(data, {...big, noRatio: false, scale: 2147483647}, 1).error).toContain('integer range');
    });
    it.each([NaN, Infinity, -1, 1.5])('rejects invalid minimum %s', min => {
        expect(calculateHealth(data, {...fixture, min}, 1).error).toBeTruthy();
    });
    it('rejects reversed ranges and invalid player counts', () => {
        expect(calculateHealth(data, {...fixture, max: 1}, 1).error).toBeTruthy();
        expect(calculateHealth(data, fixture, 9).error).toBeTruthy();
        expect(calculateHealth(data, fixture, 0).error).toBeTruthy();
    });
    it('uses each HP column family and clamps high lookup levels', () => {
        const last = Math.max(...data.Levels.map(l => l.Level));
        expect(levelScale(data, last + 1, 2, 'LHP')).toBe(levelScale(data, last, 2, 'LHP'));
        expect(levelScale(data, 1, 2, 'HP')).toBe(830);
        expect(levelScale(data, 1, 2, 'LHP')).toBe(1107);
    });
});
