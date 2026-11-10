import { describe, expect, it } from 'vitest';
import { filterSlash, rankReferences, slashItems, type ReferenceEntry } from './menus';

describe('filterSlash', () => {
  const ids = (q: string) => filterSlash(q).map(i => i.id);
  it('shows everything for an empty query', () => { expect(filterSlash('')).toEqual(slashItems); });
  it('ranks label prefixes first', () => {
    expect(ids('h')[0]).toBe('h1');
    expect(ids('heading 2')).toEqual(['h2']);
    expect(ids('quo')).toEqual(['quote']);
  });
  it('matches words and keywords', () => {
    expect(ids('list')).toEqual(expect.arrayContaining(['bullet', 'numbered', 'items']));
    expect(ids('hr')).toEqual(['rule']);
    expect(ids('youtube')).toEqual(['video']);
  });
  it('returns nothing for unknown text', () => { expect(ids('zzz')).toEqual([]); });
});

describe('rankReferences', () => {
  const skill = (id: number, title: string, skillClass: string): ReferenceEntry => ({ id: `s${id}`, title, detail: skillClass, skillClass, atom: { kind: 'skill', skillId: id, rank: 1 } });
  const item = (key: string): ReferenceEntry => ({ id: key, title: key, detail: 'Unique', atom: { kind: 'item', catalog: 'uniques', key } });
  const entries = [item('Frostburn'), skill(1, 'Frost Nova', 'Sorceress'), skill(2, 'Frost Arrow', 'Amazon'), item('The Oculus'), skill(3, 'Frozen Orb', 'Sorceress')];
  it('lists the build class skills for an empty query', () => {
    expect(rankReferences(entries, '', 'Sorceress').map(e => e.id)).toEqual(['s1', 's3']);
  });
  it('orders by match quality, then class skills, items and other skills', () => {
    expect(rankReferences(entries, 'frost', 'Sorceress').map(e => e.id)).toEqual(['s1', 'Frostburn', 's2']);
    expect(rankReferences(entries, 'ocu', 'Sorceress').map(e => e.id)).toEqual(['The Oculus']);
    expect(rankReferences(entries, 'orb froz', 'Sorceress').map(e => e.id)).toEqual(['s3']);
  });
});
