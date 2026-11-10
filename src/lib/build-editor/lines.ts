// Section body model for the visual editor: a flat list of lines, Notion style.
// Each text line stores its inline Markdown (see inline.ts); `serializeBody` and
// `parseBody` convert to and from the saved `BuildBlock.body` Markdown subset.
import { markdownBlocks } from '../build-markdown';
import { parseInline, serializeInline, type RichText } from './inline';

export type LineType = 'paragraph' | 'heading' | 'bullet' | 'numbered' | 'quote' | 'code' | 'rule' | 'table';
export interface EditorLine {
  id: string;
  type: LineType;
  /** Heading only: number of `#` (1–6). The reader shows `#` as h3, `##` as h4, and so on. */
  level?: number;
  /** Inline Markdown for text lines; raw text for `code`; unused for `rule` and `table`. */
  text: string;
  /** Table only: rows of inline Markdown cells; row 0 is the header. */
  rows?: string[][];
}

export const lineLabels: Record<LineType, string> = {
  paragraph: 'Text', heading: 'Heading', bullet: 'Bulleted list', numbered: 'Numbered list',
  quote: 'Quote', code: 'Code', rule: 'Divider', table: 'Table'
};
export const textLineTypes: LineType[] = ['paragraph', 'heading', 'bullet', 'numbered', 'quote', 'code'];

let counter = 0;
export function lineId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `line-${++counter}`;
}
export function newLine(type: LineType = 'paragraph', text = '', level?: number): EditorLine {
  const line: EditorLine = { id: lineId(), type, text };
  if (type === 'heading') line.level = level ?? 1;
  if (type === 'table') line.rows = [['Stat', 'Target'], ['', '']];
  return line;
}

export function parseBody(markdown: string): EditorLine[] {
  const lines: EditorLine[] = [];
  for (const block of markdownBlocks(markdown)) {
    switch (block.kind) {
      case 'heading': lines.push(newLine('heading', block.text!, Math.max(1, block.level! - 2))); break;
      case 'list': for (const text of block.lines!) lines.push(newLine(block.ordered ? 'numbered' : 'bullet', text)); break;
      case 'quote': lines.push(newLine('quote', block.text!)); break;
      case 'code': lines.push(newLine('code', block.text!)); break;
      case 'rule': lines.push(newLine('rule')); break;
      case 'table': lines.push({ ...newLine('table'), rows: block.rows!.map(row => [...row]) }); break;
      default: lines.push(newLine('paragraph', block.text!));
    }
  }
  return lines;
}

function isBlank(line: EditorLine): boolean {
  if (line.type === 'rule') return false;
  if (line.type === 'table') return !line.rows?.some(row => row.some(cell => cell.trim()));
  return !line.text.trim();
}

export function serializeBody(lines: EditorLine[]): string {
  const chunks: string[] = [];
  let list: { type: LineType; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    chunks.push(list.items.map((text, i) => `${list!.type === 'numbered' ? `${i + 1}.` : '-'} ${text}`).join('\n'));
    list = null;
  };
  for (const line of lines) {
    if (isBlank(line)) continue;
    if (line.type === 'bullet' || line.type === 'numbered') {
      if (list && list.type !== line.type) flush();
      list ??= { type: line.type, items: [] };
      list.items.push(oneLine(line.text));
      continue;
    }
    flush();
    switch (line.type) {
      case 'heading': chunks.push(`${'#'.repeat(Math.min(Math.max(line.level ?? 1, 1), 6))} ${oneLine(line.text).replace(/^\s+/, '')}`); break;
      case 'quote': chunks.push(line.text.split('\n').map(text => `> ${text}`).join('\n')); break;
      // A code line starting with ``` would close the fence early; a zero-width space keeps it literal.
      case 'code': chunks.push(`\`\`\`\n${line.text.replace(/^```/gm, '​```')}\n\`\`\``); break;
      case 'rule': chunks.push('---'); break;
      case 'table': chunks.push(serializeTable(line.rows ?? [])); break;
      default: chunks.push(line.text.split('\n').filter(text => text.trim()).map(escapeLineStart).join('\n'));
    }
  }
  flush();
  return chunks.join('\n\n');
}

/** Keeps paragraph text that looks like block syntax ("- x", "# x", "1. x", "---") a paragraph. */
export function escapeLineStart(text: string): string {
  return text
    .replace(/^(\s*)(#{1,6}\s|>|[-+] |\|?\s*:?-{3,})/, (_, space: string, token: string) => `${space}\\${token}`)
    .replace(/^(\s*\d+)\. /, '$1\\. ');
}
const oneLine = (text: string) => text.replace(/\n+/g, ' ');
const cell = (text: string) => oneLine(text).replace(/\|/g, '/').trim() || ' ';
function serializeTable(rows: string[][]): string {
  const width = Math.max(1, ...rows.map(row => row.length));
  const pad = (row: string[]) => Array.from({ length: width }, (_, i) => cell(row[i] ?? ''));
  const [head = [], ...body] = rows;
  return [pad(head), Array(width).fill('---'), ...body.map(pad)].map(row => `| ${row.join(' | ')} |`).join('\n');
}

/** Rendered structure of a body, used to prove a round trip changes nothing a reader sees. */
export function renderShape(markdown: string): unknown {
  const inline = (text: string) => parseInline(text).map(c => [c.ch, c.marks, c.atom ?? null]);
  return markdownBlocks(markdown).map(block => {
    if (block.kind === 'list') return { list: block.ordered, items: block.lines!.map(inline) };
    if (block.kind === 'table') return { table: block.rows!.map(row => row.map(inline)) };
    if (block.kind === 'code') return { code: block.text };
    if (block.kind === 'rule') return { rule: true };
    return { kind: block.kind, level: block.level, text: inline(block.text!) };
  });
}

/**
 * True when the visual editor can show and re-save this body without changing what
 * readers see. Bodies that fail open in the Markdown fallback instead.
 */
export function isLossless(markdown: string): boolean {
  return JSON.stringify(renderShape(markdown)) === JSON.stringify(renderShape(serializeBody(parseBody(markdown))));
}

/** Markdown shortcuts typed at the start of a paragraph, Notion style. */
export function detectShortcut(text: string): { type: LineType; level?: number; strip: number } | null {
  const heading = /^(#{1,3}) /.exec(text);
  if (heading) return { type: 'heading', level: heading[1].length, strip: heading[0].length };
  if (/^[-*+] /.test(text)) return { type: 'bullet', strip: 2 };
  if (/^1[.)] /.test(text)) return { type: 'numbered', strip: 3 };
  if (/^> /.test(text)) return { type: 'quote', strip: 2 };
  if (/^```$/.test(text)) return { type: 'code', strip: 3 };
  if (/^(---|\*\*\*)$/.test(text)) return { type: 'rule', strip: text.length };
  return null;
}

export const richOf = (line: EditorLine): RichText => parseInline(line.text);
export const textOf = (rich: RichText): string => serializeInline(rich);
