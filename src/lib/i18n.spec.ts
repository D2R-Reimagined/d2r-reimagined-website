import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { i18n, initializeI18n } from './i18n';

const strings = {
  strSkillRandomFromSkillClass: '+%d to %s %s',
  Blizzard: 'Blizzard',
  Teleport: 'Teleport',
  SorOnly: '(Sorceress Only)'
};

describe('item skill localization', () => {
  it('preserves scalar save skill names and class restrictions', () => {
    initializeI18n(strings);

    expect(get(i18n).line({
      key: 'strSkillRandomFromSkillClass',
      args: [3, 'Blizzard', 'SorOnly']
    })).toBe('+3 to Blizzard (Sorceress Only)');
  });

  it('supports scalar classless and ranged class-restricted skill lines', () => {
    initializeI18n(strings);
    const translate = get(i18n).line;

    expect(translate({
      key: 'strSkillRandomFromSkillClass',
      args: [3, 'Teleport']
    })).toBe('+3 to Teleport');
    expect(translate({
      key: 'strSkillRandomFromSkillClass',
      args: [1, 3, 'Blizzard', 'SorOnly']
    })).toBe('+1-3 to Blizzard (Sorceress Only)');
  });
});

describe('keyed line localization', () => {
  it('renders the numeric range carried by the label-only healperhit string', () => {
    initializeI18n({ healperhit: 'Life Per Hit' });

    expect(get(i18n).line({ key: 'healperhit', args: [2, 4] })).toBe('2-4 Life Per Hit');
  });
});
