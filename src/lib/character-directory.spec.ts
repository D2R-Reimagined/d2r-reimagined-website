import { describe, expect, it } from 'vitest';

import type { CharacterDirectoryEntry } from './characters';
import { characterSkillTreeAllocations } from './character-directory';
import type { SkillClass } from './types';

const sorceress = {
  Class: 'Sorceress',
  ClassCode: 'sor',
  NameKey: 'Sorceress',
  Tabs: [
    { Page: 1, NameKey: 'Fire', Skills: [{ Id: 36 }, { Id: 37 }] },
    { Page: 2, NameKey: 'Lightning', Skills: [{ Id: 38 }] },
    { Page: 3, NameKey: 'Cold', Skills: [{ Id: 39 }, { Id: 40 }] }
  ]
} as SkillClass;

const krista = {
  character: { class: 'Sorceress' },
  skills: [
    { skillId: 36, points: 3 },
    { skillId: 37, points: 1 },
    { skillId: 38, points: 1 },
    { skillId: 39, points: 50 },
    { skillId: 40, points: 25 }
  ]
} as CharacterDirectoryEntry;

describe('character skill tree allocations', () => {
  it('groups allocated points through the exported class tabs', () => {
    expect(characterSkillTreeAllocations(krista, [sorceress])).toEqual([
      { page: 1, nameKey: 'Fire', points: 4 },
      { page: 2, nameKey: 'Lightning', points: 1 },
      { page: 3, nameKey: 'Cold', points: 75 }
    ]);
  });

  it('returns no allocation when the character class is unknown', () => {
    expect(characterSkillTreeAllocations(
      { ...krista, character: { ...krista.character, class: 'Unknown' } },
      [sorceress]
    )).toEqual([]);
  });
});
