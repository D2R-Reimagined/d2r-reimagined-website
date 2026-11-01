import { describe, expect, it } from 'vitest';
import {
  buildTradeLadders,
  preferredTradePath,
  resolveTradeRealm,
  tradeLadderPath,
  tradeLadderSlug,
  validStoredTradePath
} from './trade-ladders';

const ladders = buildTradeLadders([
  { id: 'one', name: 'Example Ladder Name' },
  { id: 'two', name: 'Reimagined 2' }
]);

describe('trade ladder routes', () => {
  it('builds readable name-based ladder paths', () => {
    expect(tradeLadderSlug('Example Ladder Name')).toBe('ExampleLadderName');
    expect(tradeLadderPath(ladders[0])).toBe('/trade/ExampleLadderName');
  });

  it('resolves all, standard, and ladder realms case-insensitively', () => {
    expect(resolveTradeRealm(ladders)?.kind).toBe('all');
    expect(resolveTradeRealm(ladders, 'standard')?.kind).toBe('standard');
    expect(resolveTradeRealm(ladders, 'exampleladdername')?.ladder?.id).toBe('one');
    expect(resolveTradeRealm(ladders, 'missing')).toBeNull();
  });

  it('rejects stale saved ladder routes', () => {
    expect(validStoredTradePath('/trade/Reimagined2', ladders)).toBe('/trade/Reimagined2');
    expect(validStoredTradePath('/trade/OldSeason', ladders)).toBeNull();
    expect(validStoredTradePath('/trade', ladders)).toBeNull();
  });

  it('lands a bare /trade visit on the saved realm, else the latest ladder', () => {
    const now = new Date('2026-11-01T00:00:00Z');
    const dated = buildTradeLadders([
      { id: 'old', name: 'Season One', startDateUtc: '2026-01-01T00:00:00Z', endDateUtc: '2026-06-01T00:00:00Z' },
      { id: 'cur', name: 'Season Two', startDateUtc: '2026-07-01T00:00:00Z', endDateUtc: '2027-01-01T00:00:00Z' },
      { id: 'next', name: 'Season Three', startDateUtc: '2027-01-01T00:00:00Z', endDateUtc: '2027-06-01T00:00:00Z' }
    ]);

    expect(preferredTradePath(null, dated, now)).toBe('/trade/SeasonTwo');
    expect(preferredTradePath('/trade/OldSeason', dated, now)).toBe('/trade/SeasonTwo');
    expect(preferredTradePath('/trade', dated, now)).toBe('/trade/SeasonTwo');
    expect(preferredTradePath('/trade/SeasonOne', dated, now)).toBe('/trade/SeasonOne');
    expect(preferredTradePath('/trade/standard', dated, now)).toBe('/trade/standard');
    expect(preferredTradePath(null, [], now)).toBeNull();
  });

  it('avoids collisions with reserved and duplicate routes', () => {
    const colliding = buildTradeLadders([
      { id: '11111111-aaaa', name: 'Standard' },
      { id: '22222222-bbbb', name: 'Same Ladder' },
      { id: '33333333-cccc', name: 'Same-Ladder' }
    ]);

    expect(colliding.map(tradeLadderPath)).toEqual([
      '/trade/Standard-11111111',
      '/trade/SameLadder-22222222',
      '/trade/SameLadder-33333333'
    ]);
  });
});
