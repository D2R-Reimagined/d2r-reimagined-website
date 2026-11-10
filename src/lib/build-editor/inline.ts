// Rich text model for the visual build editor.
//
// The saved format is the Markdown subset in `build-markdown.ts`; this module never
// invents syntax. A line of text is an array of code units ("chars"), each carrying a
// flat set of marks, so every editing operation is a simple array edit and
// `serializeInline` is the only place that knows the syntax rules.
//
// Invariant (fuzz tested): parseInline(serializeInline(t)) keeps every character of t
// and every mark the dialect can express (see canonicalChar), and
// serializeInline(parseInline(md)) renders exactly like md.
import { inlineTokens, safeLink } from '../build-markdown';
import type { BuildItemReference } from '../builds';

export type Atom =
  | { kind: 'item'; catalog: BuildItemReference['catalog']; key: string }
  | { kind: 'skill'; skillId: number; rank: number };
export interface Marks { bold?: true; italic?: true; strike?: true; code?: true; color?: string; link?: string }
export type MarkName = keyof Marks;
/** One UTF-16 code unit, a soft line break ('\n'), or an atom (ch = ATOM). */
export interface RichChar { ch: string; marks: Marks; atom?: Atom }
export type RichText = RichChar[];

export const ATOM = '￼';
const itemCatalogs = new Set(['uniques', 'sets', 'runewords', 'bases', 'cube-recipes']);
const colorPattern = /^#[0-9a-fA-F]{6}$/;

function chars(text: string, marks: Marks): RichChar[] {
  return [...text.split('')].map(ch => ({ ch, marks: ch === '\n' ? {} : { ...marks } }));
}

export function parseInline(markdown: string, inherited: Marks = {}): RichText {
  const out: RichText = [];
  for (const token of inlineTokens(markdown)) {
    switch (token.kind) {
      case 'bold': out.push(...parseInline(token.text, { ...inherited, bold: true })); break;
      case 'italic': out.push(...parseInline(token.text, { ...inherited, italic: true })); break;
      case 'strike': out.push(...parseInline(token.text, { ...inherited, strike: true })); break;
      case 'color': out.push(...parseInline(token.text, { ...inherited, color: token.color!.toLowerCase() })); break;
      case 'code': out.push(...chars(token.text, { ...inherited, code: true })); break;
      case 'link': out.push(...chars(token.text, { ...inherited, link: token.href })); break;
      case 'item': out.push({ ch: ATOM, marks: { ...inherited }, atom: { kind: 'item', catalog: token.catalog as BuildItemReference['catalog'], key: token.key! } }); break;
      case 'skill': out.push({ ch: ATOM, marks: { ...inherited }, atom: { kind: 'skill', skillId: token.skillId!, rank: token.rank! } }); break;
      default: out.push(...chars(token.text, inherited));
    }
  }
  return out;
}

export function atomMarkdown(atom: Atom): string {
  return atom.kind === 'item' ? `[[item:${atom.catalog}:${atom.key}]]` : `[[skill:${atom.skillId}:${atom.rank}]]`;
}

/** Drops marks the syntax cannot express for a given char, so serialization is exact. */
export function canonicalChar(char: RichChar): RichChar {
  const marks: Marks = { ...char.marks };
  if (char.ch === '\n') return { ch: '\n', marks: {} };
  const atom = char.atom && validAtom(char.atom) ? char.atom : undefined;
  if (char.ch === ATOM && !atom) return { ch: '', marks: {} };
  if (atom) { delete marks.code; delete marks.link; }
  if (marks.code && marks.link) delete marks.link;
  // Code spans have no escapes, so a backtick cannot be inside one.
  if (marks.code && char.ch === '`') delete marks.code;
  if (marks.link && (!safeLink(marks.link) || /[\s)]/.test(marks.link))) delete marks.link;
  if (marks.color && !colorPattern.test(marks.color)) delete marks.color;
  if (marks.color) marks.color = marks.color.toLowerCase();
  // Bold and italic cannot nest in this dialect; bold wins.
  if (marks.bold && marks.italic) delete marks.italic;
  // Plain and link text is escaped; only unescapable parts can break a wrapper.
  const raw = atom ? atomMarkdown(atom) : marks.code ? char.ch : marks.link ?? '';
  if ((marks.bold || marks.italic) && raw.includes('*')) { delete marks.bold; delete marks.italic; }
  if (marks.strike && raw.includes('~')) delete marks.strike;
  if (marks.color && /\[\/color\]/i.test(raw)) delete marks.color;
  for (const key of Object.keys(marks) as MarkName[]) if (marks[key] === undefined) delete marks[key];
  return atom ? { ch: ATOM, marks, atom } : { ch: char.ch, marks };
}

function validAtom(atom: Atom): boolean {
  if (atom.kind === 'item') return itemCatalogs.has(atom.catalog) && /^[^\]\n]{1,160}$/.test(atom.key);
  return Number.isInteger(atom.skillId) && atom.skillId >= 0 && atom.skillId <= 99999
    && Number.isInteger(atom.rank) && atom.rank >= 1 && atom.rank <= 99;
}

export function canonicalInline(text: RichText): RichText {
  return parseInline(serializeInline(text));
}

type Run = { key: string; items: RichChar[] };
function groupBy(items: RichChar[], key: (char: RichChar) => string): Run[] {
  const runs: Run[] = [];
  for (const item of items) {
    const k = key(item);
    const last = runs.at(-1);
    if (last && last.key === k) last.items.push(item); else runs.push({ key: k, items: [item] });
  }
  return runs;
}

/** Escapes every character that could start or end inline syntax. */
export function escapeInline(text: string): string {
  return text.replace(/[\\*~`[\]]/g, '\\$&');
}

function serializeLeaves(items: RichChar[]): string {
  return groupBy(items, c => c.atom ? `atom` : c.marks.code ? 'code' : c.marks.link ? `link:${c.marks.link}` : 'text').map(run => {
    if (run.key === 'atom') return run.items.map(c => atomMarkdown(c.atom!)).join('');
    const text = run.items.map(c => c.ch).join('');
    if (run.key === 'code') return `\`${text}\``;
    if (run.key.startsWith('link:')) return `[${escapeInline(text)}](${run.items[0].marks.link})`;
    return escapeInline(text);
  }).join('');
}

function serializeEmphasis(items: RichChar[]): string {
  return groupBy(items, c => c.marks.bold ? 'b' : c.marks.italic ? 'i' : '').map(run => {
    const inner = serializeLeaves(run.items);
    return run.key === 'b' ? `**${inner}**` : run.key === 'i' ? `*${inner}*` : inner;
  }).join('');
}

function serializeStrike(items: RichChar[]): string {
  return groupBy(items, c => c.marks.strike ? 's' : '').map(run =>
    run.key ? `~~${serializeEmphasis(run.items)}~~` : serializeEmphasis(run.items)).join('');
}

function serializeSegment(items: RichChar[]): string {
  return groupBy(items, c => c.marks.color ?? '').map(run =>
    run.key ? `[color=${run.key}]${serializeStrike(run.items)}[/color]` : serializeStrike(run.items)).join('');
}

export function serializeInline(text: RichText): string {
  const canonical = text.map(canonicalChar).filter(c => c.ch !== '');
  const lines: RichChar[][] = [[]];
  for (const char of canonical) {
    if (char.ch === '\n') lines.push([]); else lines.at(-1)!.push(char);
  }
  return lines.map(serializeSegment).join('\n');
}

// ---------------------------------------------------------------------------
// Editing operations. Offsets are code-unit offsets, matching DOM selections.

export function plainText(text: RichText): string {
  return text.map(c => c.ch).join('');
}
export function sliceRich(text: RichText, start: number, end = text.length): RichText {
  return text.slice(start, end).map(c => ({ ...c, marks: { ...c.marks } }));
}
export function insertRich(text: RichText, at: number, insert: RichText): RichText {
  return [...text.slice(0, at), ...insert, ...text.slice(at)];
}
export function deleteRange(text: RichText, start: number, end: number): RichText {
  return [...text.slice(0, start), ...text.slice(end)];
}
/** Plain text typed at `at` inherits the marks of the char before it (Notion-style), except links. */
export function insertPlain(text: RichText, at: number, value: string): RichText {
  const before = text[at - 1];
  const marks: Marks = before && before.ch !== '\n' && !before.atom ? { ...before.marks } : {};
  delete marks.link; delete marks.code;
  return insertRich(text, at, chars(value, marks));
}
export function insertAtom(text: RichText, at: number, atom: Atom): RichText {
  return insertRich(text, at, [{ ch: ATOM, marks: {}, atom }]);
}

/** True when every char in [start, end) has the mark (and value, when given). */
export function hasMark(text: RichText, start: number, end: number, mark: MarkName, value?: string): boolean {
  const range = text.slice(start, end).filter(c => c.ch !== '\n');
  return range.length > 0 && range.every(c => value === undefined ? c.marks[mark] !== undefined : c.marks[mark] === value);
}

/** Sets (value given) or clears (value null) a mark over [start, end). */
export function applyMark(text: RichText, start: number, end: number, mark: MarkName, value: true | string | null): RichText {
  return text.map((c, i) => {
    if (i < start || i >= end || c.ch === '\n') return c;
    const marks: Marks = { ...c.marks };
    if (value === null) delete marks[mark];
    else {
      (marks as Record<string, unknown>)[mark] = value;
      if (mark === 'bold') delete marks.italic;
      if (mark === 'italic') delete marks.bold;
      if (mark === 'code') delete marks.link;
      if (mark === 'link') delete marks.code;
    }
    return { ...c, marks };
  });
}
export function toggleMark(text: RichText, start: number, end: number, mark: 'bold' | 'italic' | 'strike' | 'code'): RichText {
  return applyMark(text, start, end, mark, hasMark(text, start, end, mark) ? null : true);
}
export function clearMarks(text: RichText, start: number, end: number): RichText {
  return text.map((c, i) => i < start || i >= end ? c : { ...c, marks: {} });
}
/** Marks shared by every char in the range (for toolbar active state). */
export function marksIn(text: RichText, start: number, end: number): Marks {
  const range = text.slice(start, end).filter(c => c.ch !== '\n');
  if (!range.length) return {};
  const first = range[0].marks;
  const shared: Marks = {};
  for (const key of Object.keys(first) as MarkName[])
    if (range.every(c => c.marks[key] === first[key])) (shared as Record<string, unknown>)[key] = first[key];
  return shared;
}

export function sameRich(a: RichText, b: RichText): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].ch !== b[i].ch || JSON.stringify(a[i].marks, Object.keys(a[i].marks).sort()) !== JSON.stringify(b[i].marks, Object.keys(b[i].marks).sort())) return false;
    if (JSON.stringify(a[i].atom ?? null) !== JSON.stringify(b[i].atom ?? null)) return false;
  }
  return true;
}
