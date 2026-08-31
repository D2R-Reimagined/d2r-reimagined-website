import { describe, expect, it } from 'vitest';

import { entryStanding, leaderboardQuery, type LeaderboardEntry } from './leaderboard-entries';

function entry(overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry {
  return {
    rank: 1,
    characterId: 'character',
    characterName: 'Borgir',
    class: 'Barbarian',
    level: 90,
    experience: 1_500_000,
    isHardcore: false,
    ladderId: null,
    ladderName: null,
    isLadder: false,
    ladderSeason: null,
    isDead: false,
    userId: 'user',
    ownerDisplayName: 'Player',
    ownerSteamId: null,
    lastTrackedAtUtc: '2026-06-01T00:00:00Z',
    source: 'LadderSave',
    lastPlayedAtUtc: '2026-06-01T00:00:00Z',
    saveRemovedAtUtc: null,
    ...overrides
  };
}

describe('leaderboardQuery', () => {
  it('always sends paging so a caller cannot depend on a server default', () => {
    expect(leaderboardQuery().toString()).toBe('skip=0&count=25');
  });

  it('omits filters that were not set rather than sending empty values', () => {
    const query = leaderboardQuery({ skip: 50, count: 10 });

    expect(query.has('ladderId')).toBe(false);
    expect(query.has('class')).toBe(false);
    expect(query.has('isHardcore')).toBe(false);
    expect(query.has('search')).toBe(false);
    expect(query.get('skip')).toBe('50');
  });

  // Softcore-only is a real filter, and `false` is falsy - sending it has to
  // survive the same check that drops an unset value.
  it('sends isHardcore=false when softcore is explicitly chosen', () => {
    expect(leaderboardQuery({ isHardcore: false }).get('isHardcore')).toBe('false');
  });

  it('carries the ladder, class, source, and search filters', () => {
    const query = leaderboardQuery({
      ladderId: 'ladder-1',
      characterClass: 'Sorceress',
      source: 'Manual',
      search: 'borgir'
    });

    expect(query.get('ladderId')).toBe('ladder-1');
    expect(query.get('class')).toBe('Sorceress');
    expect(query.get('source')).toBe('Manual');
    expect(query.get('search')).toBe('borgir');
  });
});

describe('entryStanding', () => {
  it('reads a living character as alive', () => {
    expect(entryStanding(entry())).toBe('alive');
  });

  it('reads a dead character as dead', () => {
    expect(entryStanding(entry({ isDead: true }))).toBe('dead');
  });

  // A softcore save leaving the bucket means the player deleted a character they
  // were done with. Calling that a death would put a result on the board that
  // never happened.
  it('separates a removed save from a death', () => {
    expect(entryStanding(entry({ saveRemovedAtUtc: '2026-06-02T00:00:00Z' }))).toBe('removed');
  });

  it('still reports a death when the save is gone too', () => {
    const fallen = entry({ isDead: true, saveRemovedAtUtc: '2026-06-02T00:00:00Z' });

    expect(entryStanding(fallen)).toBe('dead');
  });
});
