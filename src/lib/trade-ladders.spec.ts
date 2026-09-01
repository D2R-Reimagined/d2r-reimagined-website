import { describe, expect, it } from 'vitest';
import {
  buildTradeLadders,
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
