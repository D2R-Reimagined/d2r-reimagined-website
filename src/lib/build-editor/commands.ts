// Pure editing commands for the visual section editor. Every structural edit (split,
// merge, convert, paste, move) goes through here so the components only move carets.
import { safeLink } from '../build-markdown';
import {
  applyMark, atomMarkdown, clearMarks, deleteRange, insertAtom, insertPlain, insertRich, parseInline,
  plainText, serializeInline, sliceRich, ATOM, type Atom, type MarkName, type Marks, type RichText
} from './inline';
import { detectShortcut, newLine, parseBody, type EditorLine, type LineType } from './lines';

/** Where the caret goes after an edit. `start` past the end clamps to the end. */
export interface Focus { id: string; start: number; end?: number; cell?: [number, number] }
export interface Edit { lines: EditorLine[]; focus?: Focus }
export const END = Number.MAX_SAFE_INTEGER;

export const isTextLine = (line: EditorLine) => line.type !== 'rule' && line.type !== 'table';
/** Headings and list items save as one Markdown line, so soft breaks split them instead. */
export const isSingleLine = (type: LineType) => type === 'heading' || type === 'bullet' || type === 'numbered';
const continues = (type: LineType) => type === 'bullet' || type === 'numbered' || type === 'quote';

export function plainRich(text: string): RichText {
  return text.split('').map(ch => ({ ch, marks: {} }));
}
/** Code lines hold raw text; atoms become their Markdown so nothing is lost. */
export function toPlain(rich: RichText): string {
  return rich.map(c => c.atom ? atomMarkdown(c.atom) : c.ch).join('');
}
export function lineRich(line: EditorLine): RichText {
  if (line.type === 'code') return plainRich(line.text);
  return isTextLine(line) ? parseInline(line.text) : [];
}
export function withRich(line: EditorLine, rich: RichText): EditorLine {
  if (line.type === 'code') return { ...line, text: toPlain(rich) };
  const content = isSingleLine(line.type) ? rich.map(c => c.ch === '\n' ? { ch: ' ', marks: {} } : c) : rich;
  return { ...line, text: serializeInline(content) };
}
/** Table cells are single-line and cannot hold the column separator. */
export function cellRich(rich: RichText): RichText {
  return rich.map(c => c.ch === '\n' ? { ch: ' ', marks: {} } : c.ch === '|' ? { ...c, ch: '/' } : c);
}

export function convertLine(line: EditorLine, type: LineType, level?: number): EditorLine {
  const next: EditorLine = { id: line.id, type, text: '' };
  if (type === 'heading') next.level = Math.min(Math.max(level ?? 1, 1), 6);
  if (type === 'table') return { ...next, rows: line.rows ?? newLine('table').rows };
  if (type === 'rule') return next;
  return withRich(next, lineRich(line));
}

const replaceAt = (lines: EditorLine[], index: number, ...items: EditorLine[]) =>
  [...lines.slice(0, index), ...items, ...lines.slice(index + 1)];

/** Enter (soft = Shift+Enter) with the selection [start, end) in line `index`. */
export function splitLine(lines: EditorLine[], index: number, start: number, end: number, soft = false): Edit {
  const line = lines[index];
  if (line.type === 'code') return codeEnter(lines, index, start, end, soft);
  const rich = deleteRange(lineRich(line), start, end);
  if (soft && !isSingleLine(line.type)) {
    return { lines: replaceAt(lines, index, withRich(line, insertPlain(rich, start, '\n'))), focus: { id: line.id, start: start + 1 } };
  }
  if (continues(line.type) && rich.length === 0) {
    return { lines: replaceAt(lines, index, convertLine(line, 'paragraph')), focus: { id: line.id, start: 0 } };
  }
  const type: LineType = continues(line.type) ? line.type : 'paragraph';
  if (start === 0 && rich.length > 0) {
    // At the very start, open an empty line above and keep the caret (and the heading) here.
    return { lines: replaceAt(lines, index, newLine(type), withRich(line, rich)), focus: { id: line.id, start: 0 } };
  }
  const created = withRich(newLine(type), sliceRich(rich, start));
  return { lines: replaceAt(lines, index, withRich(line, sliceRich(rich, 0, start)), created), focus: { id: created.id, start: 0 } };
}

function codeEnter(lines: EditorLine[], index: number, start: number, end: number, soft: boolean): Edit {
  const line = lines[index];
  const text = line.text;
  const exit = (kept: string): Edit => {
    const para = newLine();
    return { lines: replaceAt(lines, index, { ...line, text: kept }, para), focus: { id: para.id, start: 0 } };
  };
  if (soft) return exit(text);
  if (start === end && end === text.length && text.endsWith('\n\n')) return exit(text.slice(0, -2));
  return { lines: replaceAt(lines, index, { ...line, text: `${text.slice(0, start)}\n${text.slice(end)}` }), focus: { id: line.id, start: start + 1 } };
}

/** Backspace at offset 0 with a collapsed selection. Null when nothing should happen. */
export function backspaceAtStart(lines: EditorLine[], index: number): Edit | null {
  const line = lines[index];
  if (line.type !== 'paragraph') {
    return { lines: replaceAt(lines, index, convertLine(line, 'paragraph')), focus: { id: line.id, start: 0 } };
  }
  const prev = lines[index - 1];
  if (!prev) return null;
  if (prev.type === 'rule') return { lines: [...lines.slice(0, index - 1), ...lines.slice(index)], focus: { id: line.id, start: 0 } };
  const rich = lineRich(line);
  if (prev.type === 'table') {
    const rows = prev.rows ?? [[]];
    const cell: [number, number] = [rows.length - 1, Math.max(0, (rows.at(-1)?.length ?? 1) - 1)];
    return { lines: rich.length ? lines : replaceAt(lines, index), focus: { id: prev.id, start: END, cell } };
  }
  const prevRich = lineRich(prev);
  return {
    lines: [...lines.slice(0, index - 1), withRich(prev, [...prevRich, ...rich]), ...lines.slice(index + 1)],
    focus: { id: prev.id, start: prevRich.length }
  };
}

/** Delete at the end of line `index` with a collapsed selection. */
export function deleteAtEnd(lines: EditorLine[], index: number): Edit | null {
  const line = lines[index];
  const next = lines[index + 1];
  if (!next || next.type === 'table') return null;
  const rich = lineRich(line);
  if (next.type === 'rule') return { lines: replaceAt(lines, index + 1), focus: { id: line.id, start: rich.length } };
  return {
    lines: [...lines.slice(0, index), withRich(line, [...rich, ...lineRich(next)]), ...lines.slice(index + 2)],
    focus: { id: line.id, start: rich.length }
  };
}

/** Markdown shortcut typed at the start of a paragraph, applied when the caret sits right after it. */
export function applyShortcut(lines: EditorLine[], index: number, caret: number): Edit | null {
  const line = lines[index];
  if (line.type !== 'paragraph') return null;
  const rich = lineRich(line);
  const shortcut = detectShortcut(plainText(rich));
  if (!shortcut || caret !== shortcut.strip) return null;
  if (shortcut.type === 'rule') {
    const para = newLine();
    return { lines: replaceAt(lines, index, { id: line.id, type: 'rule', text: '' }, para), focus: { id: para.id, start: 0 } };
  }
  const converted = convertLine(withRich(line, deleteRange(rich, 0, shortcut.strip)), shortcut.type, shortcut.level);
  return { lines: replaceAt(lines, index, converted), focus: { id: line.id, start: 0 } };
}

/** Turns line `index` into a rule or table; a line with text keeps it and gets the block below. */
export function insertBlock(lines: EditorLine[], index: number, type: 'rule' | 'table'): Edit {
  const line = lines[index];
  const block = newLine(type);
  const empty = isTextLine(line) && lineRich(line).length === 0;
  const placed = empty ? { ...block, id: line.id } : block;
  const after = lines[index + 1];
  const para = after && isTextLine(after) && after.type === 'paragraph' && !after.text ? null : newLine();
  const items = [...(empty ? [] : [line]), placed, ...(para ? [para] : [])];
  const focus: Focus = type === 'table' ? { id: placed.id, start: 0, cell: [1, 0] } : { id: (para ?? after).id, start: 0 };
  return { lines: replaceAt(lines, index, ...items), focus };
}

export function removeLine(lines: EditorLine[], index: number): Edit {
  const rest = replaceAt(lines, index);
  if (!rest.length) {
    const para = newLine();
    return { lines: [para], focus: { id: para.id, start: 0 } };
  }
  const prev = rest[index - 1];
  const target = prev ?? rest[0];
  return { lines: rest, focus: { id: target.id, start: prev ? END : 0 } };
}

export function duplicateLine(lines: EditorLine[], index: number): Edit {
  const copy: EditorLine = { ...lines[index], id: newLine().id, rows: lines[index].rows?.map(row => [...row]) };
  if (!copy.rows) delete copy.rows;
  return { lines: replaceAt(lines, index, lines[index], copy), focus: { id: copy.id, start: END } };
}

/** Moves line `from` so it lands before the line currently at `to` (0..length). */
export function moveLine(lines: EditorLine[], from: number, to: number): EditorLine[] {
  if (from < 0 || from >= lines.length) return lines;
  const target = Math.min(Math.max(to, 0), lines.length);
  if (target === from || target === from + 1) return lines;
  const rest = [...lines.slice(0, from), ...lines.slice(from + 1)];
  rest.splice(target > from ? target - 1 : target, 0, lines[from]);
  return rest;
}

/** Paste at [start, end) of line `index`. One line keeps its inline Markdown; several become lines. */
export function pasteText(lines: EditorLine[], index: number, start: number, end: number, text: string): Edit {
  const line = lines[index];
  const clean = text.replace(/\r\n?/g, '\n');
  if (line.type === 'code') {
    return { lines: replaceAt(lines, index, { ...line, text: line.text.slice(0, start) + clean + line.text.slice(end) }), focus: { id: line.id, start: start + clean.length } };
  }
  const value = clean.replace(/ /g, ' ').replace(/\n+$/, '');
  const rich = deleteRange(lineRich(line), start, end);
  if (!value.includes('\n')) {
    const inserted = parseInline(value);
    return { lines: replaceAt(lines, index, withRich(line, insertRich(rich, start, inserted))), focus: { id: line.id, start: start + inserted.length } };
  }
  const blocks = parseBody(value);
  if (!blocks.length) return { lines: replaceAt(lines, index, withRich(line, rich)), focus: { id: line.id, start } };
  const before = sliceRich(rich, 0, start);
  const after = sliceRich(rich, start);
  const out: EditorLine[] = [];
  let rest = blocks;
  if (blocks[0].type === 'paragraph') {
    out.push(withRich(line, [...before, ...lineRich(blocks[0])]));
    rest = blocks.slice(1);
  } else if (before.length || line.type !== 'paragraph') out.push(withRich(line, before));
  out.push(...rest);
  let last = out.at(-1)!;
  let focus: Focus = { id: last.id, start: isTextLine(last) ? lineRich(last).length : 0 };
  if (after.length) {
    if (isTextLine(last) && last.type !== 'code') {
      const lastRich = lineRich(last);
      out[out.length - 1] = withRich(last, [...lastRich, ...after]);
      focus = { id: last.id, start: lastRich.length };
    } else {
      last = withRich(newLine(line.type === 'heading' ? 'paragraph' : line.type), after);
      out.push(last);
      focus = { id: last.id, start: 0 };
    }
  }
  return { lines: replaceAt(lines, index, ...out), focus };
}

/** Keeps ids of unchanged lines (then same-position lines) so mounted editors survive outside edits. */
export function reuseIds(prev: EditorLine[], next: EditorLine[]): EditorLine[] {
  const used = new Set<number>();
  const ids: (string | undefined)[] = next.map(() => undefined);
  let from = 0;
  next.forEach((line, i) => {
    for (let j = from; j < prev.length; j++) {
      if (!used.has(j) && prev[j].type === line.type && prev[j].text === line.text && prev[j].level === line.level) {
        used.add(j); ids[i] = prev[j].id; from = j + 1; return;
      }
    }
  });
  next.forEach((_, i) => { if (!ids[i] && prev[i] && !used.has(i)) { used.add(i); ids[i] = prev[i].id; } });
  return next.map((line, i) => ids[i] ? { ...line, id: ids[i]! } : line);
}

// ---------------------------------------------------------------------------
// Tables: rows of inline Markdown cells, row 0 is the header.

export const tableWidth = (rows: string[][]) => Math.max(1, ...rows.map(row => row.length));
export const padRows = (rows: string[][]) => {
  const width = tableWidth(rows);
  return (rows.length ? rows : [[]]).map(row => Array.from({ length: width }, (_, i) => row[i] ?? ''));
};
export const tableAddRow = (rows: string[][], at: number) => {
  const padded = padRows(rows);
  return [...padded.slice(0, at), Array(tableWidth(padded)).fill(''), ...padded.slice(at)];
};
export const tableAddColumn = (rows: string[][], at: number) =>
  padRows(rows).map(row => [...row.slice(0, at), '', ...row.slice(at)]);
/** The header row stays; a table keeps at least one column. */
export const tableDeleteRow = (rows: string[][], at: number) => at <= 0 ? padRows(rows) : padRows(rows).filter((_, i) => i !== at);
export const tableDeleteColumn = (rows: string[][], at: number) =>
  tableWidth(rows) <= 1 ? padRows(rows) : padRows(rows).map(row => row.filter((_, i) => i !== at));
export const tableSetCell = (rows: string[][], r: number, c: number, value: string) =>
  padRows(rows).map((row, i) => i === r ? row.map((cell, j) => j === c ? value : cell) : row);

// ---------------------------------------------------------------------------
// Inline formatting.

export type FormatMark = 'bold' | 'italic' | 'strike' | 'code';
/** Chars a mark can apply to; the others would be dropped by serialization anyway. */
function eligible(rich: RichText, start: number, end: number, mark: MarkName): number[] {
  const out: number[] = [];
  for (let i = Math.max(0, start); i < Math.min(end, rich.length); i++) {
    const c = rich[i];
    if (c.ch === '\n') continue;
    if (c.atom && (mark === 'code' || mark === 'link')) continue;
    if (mark === 'code' && c.ch === '`') continue;
    if (mark === 'italic' && c.marks.bold) continue;
    out.push(i);
  }
  return out;
}
/** Bold wins over italic in this dialect, so italic cannot apply to all-bold text. */
export function italicBlocked(rich: RichText, start: number, end: number): boolean {
  return start < end && eligible(rich, start, end, 'italic').length === 0 && eligible(rich, start, end, 'bold').length > 0;
}
export function toggleFormat(rich: RichText, start: number, end: number, mark: FormatMark): RichText {
  const targets = eligible(rich, start, end, mark);
  if (!targets.length) return rich;
  const on = !targets.every(i => rich[i].marks[mark]);
  const set = new Set(targets);
  return rich.map((c, i) => {
    if (!set.has(i)) return c;
    const marks: Marks = { ...c.marks };
    if (!on) delete marks[mark];
    else {
      marks[mark] = true;
      if (mark === 'bold') delete marks.italic;
      if (mark === 'code') delete marks.link;
    }
    return { ...c, marks };
  });
}
export interface FormatState { bold: boolean; italic: boolean; strike: boolean; code: boolean; link?: string; color?: string; italicBlocked: boolean }
export function formatState(rich: RichText, start: number, end: number): FormatState {
  const all = (mark: MarkName) => { const t = eligible(rich, start, end, mark); return t.length > 0 && t.every(i => rich[i].marks[mark]); };
  const shared = (mark: 'link' | 'color') => {
    const values = eligible(rich, start, end, mark).map(i => rich[i].marks[mark]);
    return values.length && values.every(v => v === values[0]) ? values[0] : undefined;
  };
  return { bold: all('bold'), italic: all('italic'), strike: all('strike'), code: all('code'), link: shared('link'), color: shared('color'), italicBlocked: italicBlocked(rich, start, end) };
}
export const setLink = (rich: RichText, start: number, end: number, href: string | null) => applyMark(rich, start, end, 'link', href);
export const setColor = (rich: RichText, start: number, end: number, color: string | null) => applyMark(rich, start, end, 'color', color);
export const clearFormatting = clearMarks;

/** A link the dialect can save, or null. Bare domains get https://. */
export function normalizeLink(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const check = (v: string) => { const href = safeLink(v)?.replace(/\)/g, '%29'); return href && !/\s/.test(href) ? href : null; };
  return check(value) ?? (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(value) ? check(`https://${value}`) : null);
}

/** Inserts an atom over [start, end) followed by a space; returns the caret after it. */
export function insertReference(rich: RichText, start: number, end: number, atom: Atom): { rich: RichText; caret: number } {
  let next = insertAtom(deleteRange(rich, start, end), start, atom);
  const after = next[start + 1];
  if (!after || !/\s/.test(after.ch)) next = insertRich(next, start + 1, [{ ch: ' ', marks: {} }]);
  return { rich: next, caret: start + 2 };
}

// ---------------------------------------------------------------------------
// "/" and "@" triggers.

export function opensTrigger(plain: string, caret: number, char: '/' | '@'): boolean {
  return caret > 0 && plain[caret - 1] === char && (caret === 1 || /\s/.test(plain[caret - 2]));
}
/**
 * The text typed after a trigger at `at`, or null once the trigger no longer applies.
 * With `char` '' (menu opened from the + button) the query starts at `at` itself.
 */
export function triggerQuery(plain: string, at: number, caret: number, char: '/' | '@' | ''): string | null {
  const start = at + char.length;
  if ((char && plain[at] !== char) || caret < start) return null;
  const query = plain.slice(start, caret);
  if (query.length > 40 || query.includes('\n') || query.includes(ATOM) || /^\s|\s\s/.test(query)) return null;
  return query;
}
