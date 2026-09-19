import { describe, expect, it } from 'vitest';
import { leaderboardClass, leaderboardFilterUrl, leaderboardQuery } from './leaderboard-entries';

describe('shareable leaderboard filters', () => {
  it('accepts class names case-insensitively and ignores unknown classes', () => {
    expect(leaderboardClass('barbarian')).toBe('Barbarian');
    expect(leaderboardClass('Warlock')).toBe('Warlock');
    expect(leaderboardClass('unknown')).toBe('');
    expect(leaderboardClass(null)).toBe('');
  });

  it('preserves other parameters and the fragment when sharing a class and ladder', () => {
    const url = leaderboardFilterUrl(new URL('https://example.com/leaderboard?other=1#board'), 'season-one', 'Barbarian');
    expect(url.searchParams.get('ladderId')).toBe('season-one');
    expect(url.searchParams.get('class')).toBe('Barbarian');
    expect(url.searchParams.get('other')).toBe('1');
    expect(url.hash).toBe('#board');
    expect(leaderboardQuery({ characterClass: leaderboardClass(url.searchParams.get('class')) }).get('class')).toBe('Barbarian');
  });

  it('removes the class for All classes and keeps Standard explicit', () => {
    const url = leaderboardFilterUrl(new URL('https://example.com/leaderboard?ladderId=season-one&class=Barbarian'), null, '');
    expect(url.searchParams.has('class')).toBe(false);
    expect(url.searchParams.get('ladderId')).toBe('');
  });
});
