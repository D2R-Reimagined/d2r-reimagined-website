import { describe, expect, it, vi } from 'vitest';
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn() }));
import type { CharacterDetailsResponse } from '../characters';
import { newBlock, newBuild } from '../builds';
import { addItemReference, addTags, addVariant, applyClass, blockHasContent, blockIssues, copyBlock,
  duplicateBlockAt, hasClassPlans, insertBlock, limits, moveItem, removeVariant } from './document';

const snapshot = {} as CharacterDetailsResponse;

describe('build document helpers', () => {
  it('copies a block with a new id that keeps pointing at the saved snapshot', () => {
    const block = newBlock('skills'); block.ranks = { 36: 5 };
    const copy = copyBlock(block);
    expect(copy.id).not.toBe(block.id);
    expect(copy.snapshotSourceId).toBe(block.id);
    copy.ranks[36] = 1;
    expect(block.ranks[36]).toBe(5);
    expect(copyBlock({ ...copy }).snapshotSourceId).toBe(block.id);
  });

  it('duplicates a section in place and shares its captured equipment', () => {
    const variant = newBuild().document.variants[0];
    const source = newBlock('equipment'); variant.blocks.push(source, newBlock('text'));
    const equipment: Record<string, CharacterDetailsResponse> = { [source.id]: snapshot };
    const copy = duplicateBlockAt(variant, 1, structuredClone(source), equipment)!;
    expect(variant.blocks.map(b => b.id)).toEqual([variant.blocks[0].id, source.id, copy.id, variant.blocks[3].id]);
    expect(equipment[copy.id]).toBe(snapshot);
  });

  it('respects the section and variant limits', () => {
    const content = newBuild();
    const variant = content.document.variants[0];
    while (insertBlock(variant, 99, newBlock('text')));
    expect(variant.blocks).toHaveLength(limits.sections);
    expect(duplicateBlockAt(variant, 0, structuredClone(variant.blocks[0]), {})).toBeNull();
    while (addVariant(content, {}));
    expect(content.document.variants).toHaveLength(limits.variants);
  });

  it('adds copied variants with their equipment and removes variants but never the last', () => {
    const content = newBuild();
    const first = content.document.variants[0];
    const equipment: Record<string, CharacterDetailsResponse> = { [first.blocks[0].id]: snapshot };
    const copy = addVariant(content, equipment, structuredClone(first))!;
    expect(copy.name).toBe('Main setup (copy)');
    expect(equipment[copy.blocks[0].id]).toBe(snapshot);
    expect(addVariant(content, equipment)!.name).toBe('Setup 3');
    expect(removeVariant(content, copy.id)).toBe(content.document.variants[1].id);
    expect(removeVariant(content, 'missing')).toBeNull();
    removeVariant(content, content.document.variants[1].id);
    expect(removeVariant(content, first.id)).toBeNull();
  });

  it('moves list items to a final index', () => {
    expect(moveItem([1, 2, 3, 4], 0, 2)).toEqual([2, 3, 1, 4]);
    expect(moveItem([1, 2, 3, 4], 3, 0)).toEqual([4, 1, 2, 3]);
    expect(moveItem([1, 2], 5, 0)).toEqual([1, 2]);
  });

  it('detects and clears class-specific plans', () => {
    const content = newBuild();
    expect(hasClassPlans(content)).toBe(false);
    const skills = newBlock('skills'); skills.ranks = { 1: 0 };
    content.document.variants[0].blocks.push(skills);
    expect(hasClassPlans(content)).toBe(false);
    skills.ranks = { 1: 3 };
    expect(hasClassPlans(content)).toBe(true);
    applyClass(content, 'Paladin');
    expect(content.characterClass).toBe('Paladin');
    expect(skills.ranks).toEqual({});
    expect(hasClassPlans(content)).toBe(false);
  });

  it('adds items once and tags trimmed, de-duplicated and capped', () => {
    const items = [{ catalog: 'uniques' as const, key: 'Shako' }];
    expect(addItemReference(items, { catalog: 'uniques', key: 'Shako' })).toBe(false);
    expect(addItemReference(items, { catalog: 'sets', key: 'Shako' })).toBe(true);
    expect(addTags(['Solo'], ' hardcore, solo ,,Fast')).toEqual(['Solo', 'hardcore', 'Fast']);
    expect(addTags([], 'a,b,c,d,e,f,g,h,i')).toHaveLength(limits.tags);
    expect(addTags(['x'.repeat(190)], 'longer tag')).toEqual(['x'.repeat(190)]);
  });

  it('knows when a section has content and which publication issues belong to it', () => {
    const block = newBlock('text');
    expect(blockHasContent(block)).toBe(false);
    expect(blockIssues(block)).toEqual(['add text.']);
    block.body = 'Hello';
    expect(blockHasContent(block)).toBe(true);
    expect(blockIssues(block)).toEqual([]);
    const untitled = newBlock('image', '');
    expect(blockIssues(untitled)).toEqual(['add a section title.', 'enter an HTTPS image URL.']);
  });
});
