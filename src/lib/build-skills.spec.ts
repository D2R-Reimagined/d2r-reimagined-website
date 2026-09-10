import { describe, expect, it } from 'vitest';
import { inlineTokens } from './build-markdown';
import { findBuildSkill, insertSkillReference, skillPreviewRank } from './build-skills';
import classes from '../../static/data/keyed/skills.json';
import type { SkillClass } from './types';

describe('Build skill tooltips', () => {
  it('parses optional levels and preserves surrounding text', () => {
    expect(inlineTokens('Use [[skill:221]] then [[skill:226:25]].')).toEqual([
      { kind: 'text', text: 'Use ' }, { kind: 'skill', text: '221', skillId: 221, rank: 1 },
      { kind: 'text', text: ' then ' }, { kind: 'skill', text: '226', skillId: 226, rank: 25 },
      { kind: 'text', text: '.' }
    ]);
  });
  it.each(['[[skill:abc]]', '[[skill:221:0]]', '[[skill:221:-1]]', '[[skill:221:100]]', '[[skill:221:2.5]]', '[[skill:221'])('leaves malformed markers literal: %s', text => {
    expect(inlineTokens(text)).toEqual([{ kind: 'text', text }]);
  });
  it('supports nested formatting while keeping code literal', () => {
    const token = inlineTokens('[color=#123456]**[[skill:221:25]]**[/color]')[0];
    expect(inlineTokens(inlineTokens(token.text)[0].text)[0]).toMatchObject({ kind: 'skill', skillId: 221, rank: 25 });
    expect(inlineTokens('`[[skill:221]]`')).toEqual([{ kind: 'code', text: '[[skill:221]]' }]);
  });
  it('replaces a selected skill name without duplicating it, or inserts at the cursor', () => {
    expect(insertSkillReference('Max Raven first.', 4, 9, 221, 25)).toBe('Max [[skill:221:25]] first.');
    expect(insertSkillReference('Use .', 4, 4, 221, 1)).toBe('Use [[skill:221:1]].');
  });
  it('resolves exported skills with their class prerequisites and clamps preview levels', () => {
    const druid = (classes as SkillClass[]).find(entry => entry.Class === 'Druid')!;
    const skill = druid.Tabs[0].Skills[0];
    const found = findBuildSkill(classes as SkillClass[], skill.Id)!;
    expect(found.skill.NameKey).toBe(skill.NameKey);
    expect(found.skills).toEqual(druid.Tabs.flatMap(tab => tab.Skills));
    expect(skillPreviewRank(skill, 9999)).toBe(skill.Descriptions?.MaxLevel ?? skill.MaxLevel);
    expect(skillPreviewRank(skill, NaN)).toBe(1);
    expect(findBuildSkill(classes as SkillClass[], 99999)).toBeUndefined();
  });
});
