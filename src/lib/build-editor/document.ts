// Document mutations shared by the classic and visual build editors.
//
// Both editors edit the same BuildContent; keeping the rules here (limits, copying
// equipment snapshots, class changes) stops the two surfaces drifting apart.
// Functions that copy take plain objects: pass `$state.snapshot(x)`, never a proxy.
import type { CharacterDetailsResponse } from '../characters';
import { duplicateVariant, newVariant, publicationErrors, type BuildBlock, type BuildContent,
  type BuildItemReference, type BuildVariant } from '../builds';

export const limits = { variants: 8, sections: 40, items: 40, tags: 8, tagText: 198 } as const;
type Equipment = Record<string, CharacterDetailsResponse>;

export const canAddVariant = (content: BuildContent) => content.document.variants.length < limits.variants;
export const canAddSection = (variant: BuildVariant) => variant.blocks.length < limits.sections;

/** A copy of `source` (a plain snapshot) that keeps pointing at the original's saved equipment. */
export function copyBlock(source: BuildBlock): BuildBlock {
  return { ...structuredClone(source), snapshotSourceId: source.snapshotSourceId ?? source.id, id: crypto.randomUUID() };
}

/** Inserts `block` at `index` (clamped). Returns false at the section limit. */
export function insertBlock(variant: BuildVariant, index: number, block: BuildBlock): boolean {
  if (!canAddSection(variant)) return false;
  variant.blocks.splice(Math.max(0, Math.min(index, variant.blocks.length)), 0, block);
  return true;
}

/** Inserts a copy of `source` (snapshot of variant.blocks[index]) after it, sharing its captured equipment. */
export function duplicateBlockAt(variant: BuildVariant, index: number, source: BuildBlock, equipment: Equipment): BuildBlock | null {
  const next = copyBlock(source);
  if (!insertBlock(variant, index + 1, next)) return null;
  if (equipment[source.id]) equipment[next.id] = equipment[source.id];
  return next;
}

/** Returns a new array with the item at `from` moved so it ends up at index `to`. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  if (from < 0 || from >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
  return next;
}

/** Appends a new (or copied, when `source` is a snapshot) variant. Returns it, or null at the limit. */
export function addVariant(content: BuildContent, equipment: Equipment, source?: BuildVariant): BuildVariant | null {
  if (!canAddVariant(content)) return null;
  const next = source ? duplicateVariant(source) : newVariant(`Setup ${content.document.variants.length + 1}`);
  content.document.variants.push(next);
  source?.blocks.forEach((block, index) => { if (equipment[block.id]) equipment[next.blocks[index].id] = equipment[block.id]; });
  return next;
}

/** Removes a variant (never the last one). Returns the id to show next, or null if nothing changed. */
export function removeVariant(content: BuildContent, id: string): string | null {
  const variants = content.document.variants;
  const index = variants.findIndex(v => v.id === id);
  if (variants.length <= 1 || index < 0) return null;
  content.document.variants = variants.filter(v => v.id !== id);
  return content.document.variants[Math.min(index, content.document.variants.length - 1)].id;
}

/** True when a class change would discard skill points or character selections. */
export function hasClassPlans(content: BuildContent): boolean {
  return content.document.variants.some(v => v.blocks.some(b => Object.values(b.ranks).some(n => n > 0) || b.characterId));
}

/** Sets the class and clears everything that belonged to the old one. Callers also clear equipment snapshots. */
export function applyClass(content: BuildContent, characterClass: string) {
  content.characterClass = characterClass;
  for (const v of content.document.variants) for (const b of v.blocks) { b.ranks = {}; b.characterId = null; }
}

/** Adds a catalog item once, up to the item limit. Returns false if nothing was added. */
export function addItemReference(items: BuildItemReference[], reference: BuildItemReference): boolean {
  if (items.length >= limits.items || items.some(i => i.catalog === reference.catalog && i.key === reference.key)) return false;
  items.push(reference);
  return true;
}

/** Adds comma-separated tags, trimmed and de-duplicated (case-insensitive), within the classic editor's limits. */
export function addTags(tags: readonly string[], input: string): string[] {
  const next = [...tags];
  for (const tag of input.split(',').map(s => s.trim()).filter(Boolean)) {
    if (next.length >= limits.tags) break;
    if (next.some(t => t.toLowerCase() === tag.toLowerCase())) continue;
    if ([...next, tag].join(', ').length > limits.tagText) break;
    next.push(tag);
  }
  return next;
}

/** Whether deleting this section would lose anything the author wrote or chose. */
export function blockHasContent(block: BuildBlock): boolean {
  return Boolean(block.body.trim() || block.items.length || Object.values(block.ranks).some(n => n > 0) || block.characterId
    || block.url.trim() || block.caption.trim() || block.manualGear?.length);
}

/** The publication problems that belong to one section, without the "variant / title:" prefix. */
export function blockIssues(block: BuildBlock): string[] {
  // Reuse publicationErrors on a one-section document so the rules live in one place.
  const probe: BuildContent = { title: 'x', summary: 'x', characterClass: '', patch: '', category: '', budget: '', tags: [],
    document: { version: 1, variants: [{ id: 'v', name: 'v', description: '', blocks: [block] }] } };
  const prefix = `v / ${block.title || 'Untitled section'}: `;
  return publicationErrors(probe).map(error => error.startsWith(prefix) ? error.slice(prefix.length) : error);
}
