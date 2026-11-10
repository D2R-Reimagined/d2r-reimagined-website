// Slash menu commands and reference search ranking for the visual editor.
import type { BlockKind } from '../builds';
import type { Atom } from './inline';
import type { LineType } from './lines';

export type SlashAction =
  | { kind: 'line'; type: LineType; level?: number }
  | { kind: 'reference'; target: 'item' | 'skill' }
  | { kind: 'section'; block: BlockKind };
export interface SlashItem { id: string; group: 'Text' | 'Insert' | 'Sections'; label: string; hint: string; icon: string; keywords: string[]; action: SlashAction }

const line = (type: LineType, level?: number): SlashAction => ({ kind: 'line', type, level });
export const slashItems: SlashItem[] = [
  { id: 'text', group: 'Text', label: 'Text', hint: 'Plain paragraph', icon: 'Aa', keywords: ['paragraph', 'plain'], action: line('paragraph') },
  { id: 'h1', group: 'Text', label: 'Heading 1', hint: 'Large heading', icon: 'H1', keywords: ['h1', 'title', '#'], action: line('heading', 1) },
  { id: 'h2', group: 'Text', label: 'Heading 2', hint: 'Medium heading', icon: 'H2', keywords: ['h2', 'subtitle', '##'], action: line('heading', 2) },
  { id: 'h3', group: 'Text', label: 'Heading 3', hint: 'Small heading', icon: 'H3', keywords: ['h3', '###'], action: line('heading', 3) },
  { id: 'bullet', group: 'Text', label: 'Bulleted list', hint: 'Simple list', icon: '•', keywords: ['ul', 'bullet', 'unordered', '-'], action: line('bullet') },
  { id: 'numbered', group: 'Text', label: 'Numbered list', hint: 'Ordered steps', icon: '1.', keywords: ['ol', 'ordered', 'steps', '1.'], action: line('numbered') },
  { id: 'quote', group: 'Text', label: 'Quote', hint: 'Quoted text', icon: '❝', keywords: ['blockquote', '>'], action: line('quote') },
  { id: 'code', group: 'Text', label: 'Code', hint: 'Monospace block', icon: '</>', keywords: ['pre', 'monospace', '```'], action: line('code') },
  { id: 'rule', group: 'Text', label: 'Divider', hint: 'Horizontal line', icon: '—', keywords: ['hr', 'rule', 'line', 'separator', '---'], action: line('rule') },
  { id: 'table', group: 'Text', label: 'Table', hint: 'Rows and columns', icon: '▦', keywords: ['grid', 'columns', 'stats'], action: line('table') },
  { id: 'item', group: 'Insert', label: 'Item tooltip…', hint: 'Unique, set, runeword or base', icon: '◆', keywords: ['item', 'unique', 'set', 'runeword', 'base', 'mention', '@'], action: { kind: 'reference', target: 'item' } },
  { id: 'skill', group: 'Insert', label: 'Skill tooltip…', hint: 'Skill with its level', icon: '✦', keywords: ['skill', 'spell', 'mention'], action: { kind: 'reference', target: 'skill' } },
  { id: 'callout', group: 'Sections', label: 'Callout', hint: 'Tip, warning, pros or cons', icon: '!', keywords: ['tip', 'warning', 'note', 'pros', 'cons'], action: { kind: 'section', block: 'callout' } },
  { id: 'items', group: 'Sections', label: 'Item list', hint: 'Row of item tooltips', icon: '◇', keywords: ['items', 'gear'], action: { kind: 'section', block: 'items' } },
  { id: 'skills', group: 'Sections', label: 'Skill tree', hint: 'Skill point planner', icon: '✧', keywords: ['skills', 'tree', 'points'], action: { kind: 'section', block: 'skills' } },
  { id: 'equipment', group: 'Sections', label: 'Equipment', hint: 'Character gear and inventory', icon: '⛨', keywords: ['gear', 'inventory', 'character'], action: { kind: 'section', block: 'equipment' } },
  { id: 'image', group: 'Sections', label: 'Image', hint: 'Picture with a caption', icon: '▣', keywords: ['picture', 'screenshot', 'photo'], action: { kind: 'section', block: 'image' } },
  { id: 'video', group: 'Sections', label: 'Video', hint: 'YouTube video', icon: '▶', keywords: ['youtube', 'clip'], action: { kind: 'section', block: 'video' } }
];

/** Prefix matches on the label rank first, then word prefixes, keywords and substrings. */
export function filterSlash(query: string, items: SlashItem[] = slashItems): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const score = (item: SlashItem) => {
    const label = item.label.toLowerCase();
    if (label.startsWith(q)) return 0;
    if (label.split(/\s+/).some(word => word.startsWith(q))) return 1;
    if (item.keywords.some(word => word.startsWith(q))) return 2;
    if (label.includes(q)) return 3;
    return -1;
  };
  return items.map((item, i) => ({ item, i, s: score(item) })).filter(x => x.s >= 0)
    .sort((a, b) => a.s - b.s || a.i - b.i).map(x => x.item);
}

export interface ReferenceEntry { id: string; title: string; detail: string; atom: Atom; skillClass?: string }

/** Ranks items and skills for a query; skills of the build's class come first on ties. */
export function rankReferences(entries: ReferenceEntry[], query: string, preferredClass = '', limit = 40): ReferenceEntry[] {
  const q = query.trim().toLowerCase();
  const group = (e: ReferenceEntry) => e.atom.kind === 'skill' ? (e.skillClass === preferredClass ? 0 : 2) : 1;
  if (!q) return entries.filter(e => e.atom.kind === 'skill' && e.skillClass === preferredClass).slice(0, limit);
  const tokens = q.split(/\s+/);
  const scored: { e: ReferenceEntry; s: number; g: number; i: number }[] = [];
  entries.forEach((e, i) => {
    const title = e.title.toLowerCase();
    let s = -1;
    if (title.startsWith(q)) s = 0;
    else if (title.split(/[\s'’-]+/).some(word => word.startsWith(q))) s = 1;
    else if (title.includes(q)) s = 2;
    else if (tokens.every(t => title.includes(t))) s = 3;
    if (s >= 0) scored.push({ e, s, g: group(e), i });
  });
  return scored.sort((a, b) => a.s - b.s || a.g - b.g || a.e.title.length - b.e.title.length || a.i - b.i)
    .slice(0, limit).map(x => x.e);
}
