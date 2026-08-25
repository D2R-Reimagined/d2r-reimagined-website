import { describe, expect, it } from 'vitest';

import { sameCharacterName } from './character-save';

describe('character save helpers', () => {
  it('matches character names without case differences', () => {
    expect(sameCharacterName('Warcock', 'warcock')).toBe(true);
  });

  it('does not match different character names', () => {
    expect(sameCharacterName('Warcock', 'PhysJava')).toBe(false);
  });
});
