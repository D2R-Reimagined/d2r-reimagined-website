import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { i18n, initializeI18n } from './i18n';
import type { KeyedLine } from './types';
import enUS from '../../static/data/strings/enUS.json';
import deDE from '../../static/data/strings/deDE.json';
import ruRU from '../../static/data/strings/ruRU.json';
import uniques from '../../static/data/keyed/uniques.json';
import sets from '../../static/data/keyed/sets.json';
import runewords from '../../static/data/keyed/runewords.json';
import magicsuffix from '../../static/data/keyed/magicsuffix.json';

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

describe('fractional exported properties', () => {
  // Finds the first exported line with this key and these exact args, so the fixtures stay real.
  function exportedLine(data: unknown, key: string, args: number[]): KeyedLine {
    let found: KeyedLine | undefined;
    const walk = (node: unknown) => {
      if (found || !node || typeof node !== 'object') return;
      const line = node as KeyedLine;
      if (line.key === key && JSON.stringify(line.args) === JSON.stringify(args)) found = line;
      else Object.values(node).forEach(walk);
    };
    walk(data);
    expect(found, `${key} ${JSON.stringify(args)}`).toBeDefined();
    return found!;
  }
  const deadlyStrike = exportedLine(uniques, 'ModStr5q', [0.375]);
  const coldResist = exportedLine(magicsuffix, 'ModStr1k', [0.625]);
  const coldLength = exportedLine(uniques, 'StrSkill13', [0.12]);
  const setColdLength = exportedLine(sets, 'StrSkill13', [3]);
  const rangedColdLength = exportedLine(runewords, 'StrSkill13', [3, 10.24]);

  it('keeps exported precision on per-level and fractional lines in English', () => {
    initializeI18n(enUS);
    const { line } = get(i18n);

    expect(deadlyStrike.perLevel).toBe(true);
    expect(line(deadlyStrike)).toBe('+0.375% Deadly Strike (Based on Character Level)');
    expect(line(coldResist)).toBe('+0.625% Cold Resistance (Based on Character Level)');
    expect(line(coldLength)).toBe('Cold Length: 0.12 seconds');
    expect(line(rangedColdLength)).toBe('Cold Length: 3-10.24 seconds');
    expect(line({ ...setColdLength, itemsRequired: undefined })).toBe('Cold Length: 3 seconds');
  });

  it('keeps exported precision in localized templates with a different argument order', () => {
    initializeI18n(deDE);
    expect(get(i18n).line(coldResist)).toBe('Kältewiderstand +0.625% (basierend auf Charakterstufe)');
    expect(get(i18n).line(rangedColdLength)).toBe('Dauer der Kälte: 3-10.24 Sek.');

    initializeI18n(ruRU);
    expect(get(i18n).line(deadlyStrike)).toBe('+0.375% к вероятности нанести смертельный удар (зависит от уровня персонажа)');
    expect(get(i18n).line(coldLength)).toBe('Длительность замедления от льда: 0.12 сек.');
  });
});
