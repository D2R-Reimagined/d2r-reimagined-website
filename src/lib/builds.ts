import { apiRequest } from '$lib/auth';
import type { CharacterDetailsResponse } from '$lib/characters';

export const buildClasses = ['Amazon', 'Assassin', 'Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Sorceress', 'Warlock'];
export const buildCategories = ['Leveling', 'Endgame', 'Farming', 'Bossing', 'Support', 'PvP'];
export const buildBudgets = ['Starter', 'Budget', 'Midrange', 'High-end'];
export const blockKinds = ['text', 'callout', 'items', 'skills', 'equipment', 'image', 'video'] as const;
export type BlockKind = typeof blockKinds[number];
export interface BuildItemReference { catalog: 'uniques' | 'sets' | 'runewords' | 'bases'; key: string }
export interface BuildBlock {
  id: string; kind: BlockKind; title: string; body: string; tone: 'tip' | 'warning' | 'pros' | 'cons';
  url: string; caption: string; items: BuildItemReference[]; ranks: Record<number, number>;
  characterId: string | null; snapshotVersion: number; snapshotSourceId?: string | null;
}
export interface BuildVariant { id: string; name: string; description: string; blocks: BuildBlock[] }
export interface BuildContent {
  title: string; summary: string; characterClass: string; patch: string; category: string; budget: string;
  tags: string[]; document: { version: 1; variants: BuildVariant[] };
}
export interface BuildSummary {
  id: string; authorId: string; authorName: string; title: string; summary: string; characterClass: string;
  patch: string; category: string; budget: string; tags: string[]; updatedAtUtc: string; isPublished: boolean;
  rating: number; ratingCount: number; commentCount: number;
}
export interface BuildDetails {
  build: BuildSummary; content: BuildContent; equipment: Record<string, CharacterDetailsResponse>;
  revision: number; hasUnpublishedChanges: boolean; myRating: number | null;
}
export interface BuildComment { id: string; userId: string; authorName: string; body: string; parentId: string | null; createdAtUtc: string }
export interface BuildPage<T> { items: T[]; total: number; skip: number; count: number }

export const blockLabels: Record<BlockKind, string> = {
  text: 'Rich text', callout: 'Callout', items: 'Item tooltips', skills: 'Skill tree',
  equipment: 'Equipment & inventory', image: 'Image', video: 'Video'
};
export function newBlock(kind: BlockKind, title = blockLabels[kind]): BuildBlock {
  return { id: crypto.randomUUID(), kind, title, body: '', tone: 'tip', url: '', caption: '',
    items: [], ranks: {}, characterId: null, snapshotVersion: 0 };
}
export function newVariant(name = 'Main setup'): BuildVariant {
  return { id: crypto.randomUUID(), name, description: '', blocks: [newBlock('text', 'Overview')] };
}
export function newBuild(): BuildContent {
  return { title: '', summary: '', characterClass: 'Sorceress', patch: '', category: 'Endgame', budget: 'Starter',
    tags: [], document: { version: 1, variants: [newVariant()] } };
}
export function duplicateVariant(variant: BuildVariant): BuildVariant {
  // Callers pass $state.snapshot; never structuredClone a Svelte proxy.
  return { ...structuredClone(variant), id: crypto.randomUUID(), name: `${variant.name.slice(0, 53)} (copy)`,
    blocks: variant.blocks.map(block => ({ ...structuredClone(block), snapshotSourceId: block.snapshotSourceId ?? block.id, id: crypto.randomUUID() })) };
}
export function publicationErrors(content: BuildContent): string[] {
  const errors: string[] = [];
  if (!content.title.trim()) errors.push('Give your build a title.');
  if (!content.summary.trim()) errors.push('Add a short summary for players browsing builds.');
  for (const variant of content.document.variants) {
    if (!variant.name.trim()) errors.push('Name every variant.');
    if (!variant.blocks.length) errors.push(`${variant.name}: add at least one section.`);
    for (const block of variant.blocks) {
      const label = `${variant.name} / ${block.title || 'Untitled section'}`;
      if (!block.title.trim()) errors.push(`${label}: add a section title.`);
      if (['text', 'callout'].includes(block.kind) && !block.body.trim()) errors.push(`${label}: add text.`);
      if (block.kind === 'items' && !block.items.length) errors.push(`${label}: choose an item.`);
      if (block.kind === 'skills' && !Object.values(block.ranks).some(n => n > 0)) errors.push(`${label}: allocate skill points.`);
      if (block.kind === 'equipment' && !block.characterId) errors.push(`${label}: choose a character.`);
      if (block.kind === 'image' && !safeMediaUrl(block.url)) errors.push(`${label}: enter an HTTPS image URL.`);
      if (block.kind === 'video' && !youtubeEmbedUrl(block.url)) errors.push(`${label}: enter a valid YouTube video URL.`);
    }
  }
  return errors;
}
export function safeMediaUrl(value: string): string | null {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function youtubeEmbedUrl(value: string): string | null {
  const safe = safeMediaUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  let id: string | null = null;
  if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
  if (['youtube.com', 'www.youtube.com'].includes(url.hostname))
    id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:embed|shorts)\/([\w-]+)$/.exec(url.pathname)?.[1] ?? null;
  return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
export function buildDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
export const getBuild = (id: string, editing = false) => apiRequest<BuildDetails>(`/builds/${encodeURIComponent(id)}${editing ? '/edit' : ''}`, {}, editing ? true : 'optional');
export const saveBuild = (id: string | null, content: BuildContent, revision: number, publish = false) =>
  apiRequest<BuildDetails>(id ? `/builds/${encodeURIComponent(id)}` : '/builds', {
    method: id ? 'PUT' : 'POST', body: JSON.stringify({ content, revision, publish })
  }, true);
