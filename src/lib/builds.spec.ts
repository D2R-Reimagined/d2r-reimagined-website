import { describe, expect, it, vi } from 'vitest';
vi.mock('$lib/auth', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '$lib/auth';
import { duplicateVariant, getBuild, newBlock, newBuild, publicationErrors, safeMediaUrl, saveBuild, youtubeEmbedUrl } from './builds';
import { inlineTokens, markdownBlocks, safeLink } from './build-markdown';

describe('Build documents', () => {
  it('starts with a private-ready, versioned document', () => {
    const build = newBuild(); expect(build.document.version).toBe(1); expect(build.document.variants).toHaveLength(1);
    expect(publicationErrors(build)).toHaveLength(3);
  });
  it('duplicates variants without shared identities or mutable allocations', () => {
    const variant = newBuild().document.variants[0]; variant.blocks[0].ranks = { 36: 10 };
    const copy = duplicateVariant(variant); expect(copy.id).not.toBe(variant.id);
    expect(copy.blocks[0].id).not.toBe(variant.blocks[0].id); copy.blocks[0].ranks[36] = 15;
    expect(variant.blocks[0].ranks[36]).toBe(10);
  });
  it('requires content for every published embed', () => {
    const build = newBuild(); build.title = 'Guide'; build.summary = 'Summary';
    build.document.variants[0].blocks = ['items','skills','equipment','image','video'].map(kind => newBlock(kind as 'items'));
    expect(publicationErrors(build)).toHaveLength(5);
  });
  it('accepts a complete text guide', () => {
    const build = newBuild(); build.title = 'Guide'; build.summary = 'Summary'; build.document.variants[0].blocks[0].body = 'Play well.';
    expect(publicationErrors(build)).toEqual([]);
  });
  it('sends only content and the expected revision, never supplied equipment snapshots', async () => {
    const content = newBuild(); await saveBuild('id', content, 7, true);
    expect(apiRequest).toHaveBeenLastCalledWith('/builds/id', { method:'PUT', body:JSON.stringify({content,revision:7,publish:true}) }, true);
    await getBuild('id',true); expect(apiRequest).toHaveBeenLastCalledWith('/builds/id/edit',{},true);
  });
});
describe('Safe guide rendering', () => {
  it.each(['javascript:alert(1)','data:text/html,test','//evil.test','https://user:password@example.com','/\\evil.test'])('rejects unsafe links %s', url => expect(safeLink(url)).toBeNull());
  it.each(['/data/uniques','#section-1','https://example.com'])('accepts safe links %s', url => expect(safeLink(url)).toBeTruthy());
  it('does not interpret author HTML', () => {
    expect(inlineTokens('<script>alert(1)</script>')).toEqual([{kind:'text',text:'<script>alert(1)</script>'}]);
  });
  it('tokenizes formatting and real item references', () => {
    const tokens = inlineTokens('**Bold** and *italic* [[item:uniques:The Oculus]] [safe](https://example.com)');
    expect(tokens.some(t => t.kind === 'bold')).toBe(true); expect(tokens.some(t => t.kind === 'italic')).toBe(true);
    expect(tokens.find(t => t.kind === 'item')).toMatchObject({catalog:'uniques',key:'The Oculus'});
  });
  it('parses tables, headings, lists, quotations, and code', () => {
    const blocks = markdownBlocks('# Intro\n\n- one\n- two\n\n| Stat | Target |\n| --- | --- |\n| FCR | 105 |\n\n> tip\n\n```\ncode\n```');
    expect(blocks.map(b => b.kind)).toEqual(['heading','list','table','quote','code']);
    expect(blocks[2].rows?.[1]).toEqual(['FCR','105']);
  });
  it('restricts media and normalizes YouTube to privacy-enhanced embeds', () => {
    expect(safeMediaUrl('http://example.com/a.jpg')).toBeNull();
    expect(youtubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(youtubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42')).toContain('youtube-nocookie.com');
    expect(youtubeEmbedUrl('https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(youtubeEmbedUrl('https://youtube.com/watch?v=bad')).toBeNull();
  });
});
