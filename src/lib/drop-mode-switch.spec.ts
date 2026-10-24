import { describe, expect, it } from 'vitest';
import { resumeItemMode } from './drop-mode-switch';
import { readMonsterDropUrl, writeMonsterDropUrl } from './monster-drop-url';

const shako = { Id: 'unique:Harlequin Crest' };
const ber = { Id: 'rune:r30' };
const idle = { selected: null, calculatedItem: null, hasResults: false, busy: false, error: '' };

describe('returning to Find an item', () => {
  it('never calculates without a selected item', () => {
    expect(resumeItemMode(idle)).toBe('none');
    expect(resumeItemMode({ ...idle, calculatedItem: shako, hasResults: true })).toBe('none');
  });

  it('keeps results calculated for the selected item', () => {
    expect(resumeItemMode({ ...idle, selected: shako, calculatedItem: shako, hasResults: true })).toBe('keep');
  });

  it('calculates once for a selection without results', () => {
    expect(resumeItemMode({ ...idle, selected: shako })).toBe('calculate');
  });

  it('never keeps results that belong to another item', () => {
    expect(resumeItemMode({ ...idle, selected: ber, calculatedItem: shako, hasResults: true })).toBe('calculate');
  });

  it('lets a calculation in progress finish instead of starting a second worker', () => {
    expect(resumeItemMode({ ...idle, selected: shako, calculatedItem: shako, busy: true })).toBe('keep');
  });

  it('keeps a reported error rather than retrying on every switch', () => {
    expect(resumeItemMode({ ...idle, selected: shako, calculatedItem: shako, error: 'Unable to calculate drops. Please try again.' })).toBe('keep');
  });
});

describe('simulator URLs restored after a mode switch', () => {
  const base = new URL('https://example.com/data/drop-calculator?mode=simulate');

  it('round trips players, kills, seed, difficulty and monster', () => {
    const state = { ...readMonsterDropUrl(base), players: 3, party: 2, kills: 250, seed: 42, difficulty: 1, sourceId: 'fallen5:0:1:normal' };
    const url = writeMonsterDropUrl(base, state);
    expect(url.searchParams.get('mode')).toBe('simulate');
    expect(url.searchParams.get('sim_players')).toBe('3');
    expect(readMonsterDropUrl(url)).toEqual(state);
  });

  it('normalizes invalid and out-of-range values to safe settings', () => {
    const url = new URL(`${base}&sim_players=99&sim_party=12&sim_kills=0&sim_seed=-4&sim_difficulty=abc&sim_level=1e3&sim_sourceType=bogus`);
    expect(readMonsterDropUrl(url)).toMatchObject({ players: 8, party: 8, kills: 1, seed: 1, difficulty: 2, level: 85, sourceType: 'monster' });
  });

  it('writes nothing for defaults, so a plain simulator link stays unchanged', () => {
    expect(writeMonsterDropUrl(base, readMonsterDropUrl(base)).href).toBe(base.href);
  });
});
