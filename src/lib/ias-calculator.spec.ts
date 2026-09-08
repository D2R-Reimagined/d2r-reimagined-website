import { describe, expect, it } from 'vitest';
import exported from '../../static/data/keyed/ias-calculator.json';
import { calculateIas, itemEias, readIasUrl, writeIasUrl, type IasData, type IasState } from './ias-calculator';

const data = exported as IasData;
function setup(query = '', source = data): IasState {
  return readIasUrl(new URL(`https://example.test/data/ias-calculator?${query}`), source);
}
// A 14-frame, 256-rate bow animation with WSM 0 has independently known
// breakpoints. Keep this fixture independent of future balance changes.
const bowData: IasData = {
  SchemaVersion: 1, Sources: [], Classes: [{ ClassCode: 'ama', Token: 'AM', NameKey: 'Amazon' }],
  FormTokens: {}, StartingFrames: {}, Skills: [], Buffs: [],
  Weapons: [{ Code: 'bow', NameKey: 'Bow', Speed: 0, WeaponClass: 'BOW', TwoHandClass: 'BOW', TwoHanded: true, OneOrTwoHanded: false, Types: ['miss'], ClassCode: '' }],
  Animations: [{ Code: 'AMA1BOW', Frames: 14, AnimationSpeed: 256, ActionFrames: [6] }]
};

describe('attack speed rounding', () => {
  it('matches the complete zero-WSM bow breakpoint table', () => {
    const result = calculateIas(bowData, setup('weapon=bow', bowData));
    expect(result.error).toBeUndefined();
    expect(result.tables[0].rows.map(r => [r.ias, r.total])).toEqual([
      [0, 13], [9, 12], [20, 11], [37, 10], [63, 9], [105, 8], [200, 7]
    ]);
  });
  it('does not promote a setup one IAS below its breakpoint', () => {
    const before = calculateIas(bowData, setup('weapon=bow&ias=62', bowData)).tables[0];
    const reached = calculateIas(bowData, setup('weapon=bow&ias=63', bowData)).tables[0];
    expect(before.current.total).toBe(10);
    expect(before.next?.ias).toBe(63);
    expect(reached.current.total).toBe(9);
  });
  it('combines equipment and weapon IAS before diminishing returns', () => {
    const result = calculateIas(bowData, setup('weapon=bow&ias=43&wias=20', bowData));
    expect(result.tables[0].current.total).toBe(9);
    expect(result.tables[0].rows.find(r => r.total === 9)?.ias).toBe(43);
    expect(itemEias(63)).not.toBe(itemEias(43) + itemEias(20));
  });
  it('caps acceleration and keeps severe slowing finite', () => {
    const fast = calculateIas(bowData, setup('weapon=bow&ias=10000&speed=200', bowData)).tables[0];
    expect(fast.current.total).toBe(7);
    expect(fast.next).toBeUndefined();
    const slow = calculateIas(bowData, setup('weapon=bow&slow=100&chilled=1&speed=-200', bowData)).tables[0];
    expect(slow.current.total).toBe(94);
    expect(slow.current.attacksPerSecond).toBeGreaterThan(0);
  });
});

describe('mod export regression fixtures', () => {
  it('exports diminishing buff curves rather than linear growth', () => {
    const values = (code: string) => data.Buffs.find(b => b.Code === code)!.Values!;
    expect([values('Fanaticism')[0], values('Fanaticism')[19], values('Fanaticism')[59]]).toEqual([14, 35, 40]);
    expect([values('Quickness')[0], values('Quickness')[19]]).toEqual([21, 52]);
    expect(values('Decrepify')[0]).toBe(-25);
    expect(values('Holy Freeze')[19]).toBe(-24);
  });
  it('uses the mod Impale animation and exports Warlock animations', () => {
    expect(data.Skills.find(s => s.Code === 'Impale')?.Mode).toBe('A2');
    expect(data.Animations.some(a => a.Code === 'WKA11HS')).toBe(true);
    expect(data.Animations.find(a => a.Code === 'AMA1BOW')?.ActionFrames).toEqual([6]);
    expect(data.Skills.some(s => s.Code === 'Lightning Fury')).toBe(true);
    expect(data.Skills.some(s => s.Code === 'Throw' && !s.ClassCode)).toBe(true);
  });
  it('includes the Warlock attack’s own level-scaled speed', () => {
    const slow = calculateIas(data, setup('class=war&skill=Cleave&weapon=ssd&level=1'));
    const fast = calculateIas(data, setup('class=war&skill=Cleave&weapon=ssd&level=20'));
    expect(slow.error).toBeUndefined(); expect(fast.error).toBeUndefined();
    expect(slow.tables[0].current.total).toBe(20);
    expect(fast.tables[0].current.total).toBe(17);
  });
  it('uses the claw sequence rate rather than the claw normal-attack rate', () => {
    const result = calculateIas(data, setup('class=ass&skill=Dragon%20Claw&weapon=ktr&secondary=ktr'));
    expect(result.error).toBeUndefined();
    // Katar WSM -10 gives EIAS -20 after the sequence penalty: rate 204,
    // then ceil(16 * 256 / 204) = 21 frames for the two-hit sequence.
    expect(result.tables[0].current.total).toBe(21);
    expect(result.tables[0].current.attacksPerSecond).toBeCloseTo(50 / 21);
  });
  it('rejects stale or incompatible class, weapon and sequence inputs', () => {
    const invalid = setup('class=bad&skill=Frenzy&weapon=bad&ias=NaN&level=999&slow=-30');
    expect(invalid.character).toBe('ama'); expect(invalid.skill).toBe('attack');
    expect(invalid.weapon).toBe(''); expect(invalid.ias).toBe(0);
    expect(invalid.level).toBe(100); expect(invalid.slow).toBe(0);
    const state = setup('class=bar&skill=Frenzy&weapon=ssd');
    expect(calculateIas(data, state).error).toContain('second weapon');
  });
  it('returns no numbers for missing animation data', () => {
    const result = calculateIas({ ...data, Animations: [] }, setup());
    expect(result.tables).toEqual([]); expect(result.error).toContain('unavailable');
  });
  it('uses form restrictions and simulates Fury as a complete sequence', () => {
    expect(setup('class=dru&skill=Fury').skill).toBe('attack');
    const state = setup('class=dru&form=wolf&skill=Fury&weapon=ssd&level=20');
    const result = calculateIas(data, state);
    expect(result.error).toBeUndefined();
    expect(result.tables[0].current.frames).toHaveLength(5);
  });
  it('round-trips a shared setup and preserves unrelated query state', () => {
    const state = setup('class=bar&skill=Frenzy&weapon=ssd&secondary=axe&ias=45&wias=20&swias=10&buff.Frenzy=20');
    const url = writeIasUrl(new URL('https://example.test/data/ias-calculator?campaign=test#results'), state, data);
    expect(readIasUrl(url, data)).toEqual(state);
    expect(url.searchParams.get('campaign')).toBe('test'); expect(url.hash).toBe('#results');
  });
});
