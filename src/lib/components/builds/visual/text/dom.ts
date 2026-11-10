// DOM <-> rich text for the visual editor's contenteditable lines.
//
// Offsets are UTF-16 code units of the model: a text char is 1, an atom element is 1, a
// <br> is 1 except the final one (the sentinel that lets a trailing '\n' show a line).
// The walkers only use nodeType, nodeName, nodeValue, childNodes, parentNode and
// getAttribute, so they run against the tiny fake nodes in dom.spec.ts.
import { ATOM, type Atom, type Marks, type RichChar, type RichText } from '../../../../build-editor/inline';

const TEXT = 3;
const ELEMENT = 1;

export type RNode =
  | { type: 'el'; tag: 'strong' | 'em' | 's' | 'code' | 'a' | 'span'; attr?: string; children: RNode[] }
  | { type: 'text'; text: string }
  | { type: 'atom'; atom: Atom };

function runs(items: RichChar[], key: (c: RichChar) => string): RichChar[][] {
  const out: RichChar[][] = [];
  let last = '';
  for (const item of items) {
    const k = key(item);
    if (out.length && k === last) out.at(-1)!.push(item); else { out.push([item]); last = k; }
  }
  return out;
}
const text = (items: RichChar[]) => items.map(c => c.ch).join('');

/** Element tree for canonical rich text; nesting mirrors serializeInline (colour > strike > emphasis > leaf). */
export function renderTree(rich: RichText): RNode[] {
  const leaves = (items: RichChar[]): RNode[] => runs(items, c => c.atom ? 'atom' : c.marks.code ? 'code' : c.marks.link ? `a${c.marks.link}` : '')
    .flatMap((run): RNode[] => {
      const c = run[0];
      if (c.atom) return run.map(a => ({ type: 'atom', atom: a.atom! }));
      if (c.marks.code) return [{ type: 'el', tag: 'code', children: [{ type: 'text', text: text(run) }] }];
      if (c.marks.link) return [{ type: 'el', tag: 'a', attr: c.marks.link, children: [{ type: 'text', text: text(run) }] }];
      return [{ type: 'text', text: text(run) }];
    });
  const emphasis = (items: RichChar[]): RNode[] => runs(items, c => c.marks.bold ? 'b' : c.marks.italic ? 'i' : '')
    .flatMap((run): RNode[] => run[0].marks.bold ? [{ type: 'el', tag: 'strong', children: leaves(run) }]
      : run[0].marks.italic ? [{ type: 'el', tag: 'em', children: leaves(run) }] : leaves(run));
  const strike = (items: RichChar[]): RNode[] => runs(items, c => c.marks.strike ? 's' : '')
    .flatMap((run): RNode[] => run[0].marks.strike ? [{ type: 'el', tag: 's', children: emphasis(run) }] : emphasis(run));
  return runs(rich, c => c.marks.color ?? '')
    .flatMap((run): RNode[] => run[0].marks.color ? [{ type: 'el', tag: 'span', attr: run[0].marks.color, children: strike(run) }] : strike(run));
}

const quote = (value: string) => JSON.stringify(value);
export const atomAttr = (atom: Atom) => JSON.stringify(atom);

/** Comparable description of the tree, matching domSignature for an identical DOM. */
export function treeSignature(rich: RichText): string {
  const walk = (nodes: RNode[]): string => nodes.map(n => n.type === 'text' ? quote(n.text)
    : n.type === 'atom' ? `[${atomAttr(n.atom)}]` : `<${n.tag}${n.attr ? ` ${quote(n.attr)}` : ''}>${walk(n.children)}</${n.tag}>`).join('');
  return walk(renderTree(rich)) + (rich.at(-1)?.ch === '\n' ? '⏎' : '');
}

// ---------------------------------------------------------------------------

const isAtom = (node: Node) => node.nodeType === ELEMENT && (node as Element).getAttribute('data-atom') !== null;

/** The <br> that ends the line (ignored as content), if any. */
export function finalBreak(root: Node): Node | null {
  // undefined: subtree has no content; null: last content is not a <br>.
  const last = (node: Node): Node | null | undefined => {
    const kids = node.childNodes;
    for (let i = kids.length - 1; i >= 0; i--) {
      const c = kids[i];
      if (c.nodeType === TEXT) { if (c.nodeValue) return null; continue; }
      if (c.nodeType !== ELEMENT) continue;
      if (isAtom(c)) return null;
      if (c.nodeName === 'BR') return c;
      const inner = last(c);
      if (inner !== undefined) return inner;
    }
    return undefined;
  };
  return last(root) ?? null;
}

export function domSignature(root: Node): string {
  const br = finalBreak(root);
  let pending = '';
  const flush = () => { const out = pending ? quote(pending) : ''; pending = ''; return out; };
  const walk = (node: Node): string => {
    let out = '';
    for (const c of Array.from(node.childNodes)) {
      if (c.nodeType === TEXT) { pending += c.nodeValue ?? ''; continue; }
      if (c.nodeType !== ELEMENT) continue;
      const el = c as Element;
      if (isAtom(el)) { out += `${flush()}[${el.getAttribute('data-atom')}]`; continue; }
      if (el.nodeName === 'BR') { if (el !== br) out += `${flush()}<br>`; continue; }
      const tag = el.nodeName.toLowerCase();
      const attr = tag === 'a' ? el.getAttribute('href') : tag === 'span' ? el.getAttribute('data-color') : null;
      const head = `${flush()}<${tag}${attr ? ` ${quote(attr)}` : ''}>`;
      const inner = walk(el);
      out += `${head}${inner}${flush()}</${tag}>`;
    }
    return out;
  };
  const body = walk(root) + flush();
  return body + (br && readDom(root).at(-1)?.ch === '\n' ? '⏎' : '');
}

/** "rgb(199, 179, 119)" or "#C7B377" -> "#c7b377". */
export function cssColorToHex(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (hex) return `#${hex[1].toLowerCase()}`;
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(value.trim());
  return rgb ? `#${rgb.slice(1, 4).map(n => Math.min(255, Number(n)).toString(16).padStart(2, '0')).join('')}` : undefined;
}

function marksOf(el: Element, marks: Marks): Marks {
  const next: Marks = { ...marks };
  switch (el.nodeName) {
    case 'STRONG': case 'B': next.bold = true; break;
    case 'EM': case 'I': next.italic = true; break;
    case 'S': case 'STRIKE': case 'DEL': next.strike = true; break;
    case 'CODE': next.code = true; break;
    case 'A': { const href = el.getAttribute('href'); if (href) next.link = href; break; }
  }
  const color = el.getAttribute('data-color') ?? el.getAttribute('color');
  // Browsers re-create formatting with inline styles after some deletions.
  const style = (el as HTMLElement).style as CSSStyleDeclaration | undefined;
  const fromStyle = style?.color ? cssColorToHex(style.color) : undefined;
  if (color || fromStyle) next.color = cssColorToHex(color) ?? fromStyle;
  if (style) {
    if (/^(bold|[6-9]00)$/.test(style.fontWeight)) next.bold = true;
    if (style.fontStyle === 'italic') next.italic = true;
    if ((style.textDecorationLine || style.textDecoration || '').includes('line-through')) next.strike = true;
  }
  return next;
}

function atomOf(el: Element): Atom | null {
  try { return JSON.parse(el.getAttribute('data-atom') ?? '') as Atom; } catch { return null; }
}

/** Rich text as the DOM currently shows it (not yet canonical). */
export function readDom(root: Node): RichText {
  const out: RichText = [];
  const br = finalBreak(root);
  const walk = (node: Node, marks: Marks) => {
    for (const c of Array.from(node.childNodes)) {
      if (c.nodeType === TEXT) {
        for (const ch of (c.nodeValue ?? '').split('')) out.push({ ch, marks: ch === '\n' ? {} : { ...marks } });
        continue;
      }
      if (c.nodeType !== ELEMENT) continue;
      const el = c as Element;
      if (isAtom(el)) { const atom = atomOf(el); if (atom) out.push({ ch: ATOM, marks: { ...marks }, atom }); continue; }
      if (el.nodeName === 'BR') { if (el !== br) out.push({ ch: '\n', marks: {} }); continue; }
      walk(el, marksOf(el, marks));
    }
  };
  walk(root, {});
  return out;
}

/** Plain text of a raw-text (code) line. */
export function readPlain(root: Node): string {
  return readDom(root).map(c => c.ch === ATOM ? '' : c.ch).join('');
}

function closestAtom(node: Node, root: Node): Node | null {
  for (let n: Node | null = node; n && n !== root; n = n.parentNode) if (isAtom(n)) return n;
  return null;
}
const indexIn = (node: Node) => Array.prototype.indexOf.call(node.parentNode!.childNodes, node) as number;

/** Model offset of a DOM point (as in a Selection) inside root. */
export function offsetOf(root: Node, node: Node, offset: number): number {
  const atom = closestAtom(node, root);
  if (atom) { node = atom.parentNode!; offset = indexIn(atom); }
  const br = finalBreak(root);
  let count = 0;
  let found = -1;
  const visit = (n: Node): boolean => {
    if (n.nodeType === TEXT) {
      const length = n.nodeValue?.length ?? 0;
      if (n === node) { found = count + Math.min(Math.max(offset, 0), length); return true; }
      count += length;
      return false;
    }
    if (n.nodeType !== ELEMENT) return false;
    if (n !== root && isAtom(n)) { count += 1; return false; }
    if (n.nodeName === 'BR') {
      if (n === node) { found = count; return true; }
      if (n !== br) count += 1;
      return false;
    }
    const kids = n.childNodes;
    for (let i = 0; i < kids.length; i++) {
      if (n === node && i === offset) { found = count; return true; }
      if (visit(kids[i])) return true;
    }
    if (n === node) { found = count; return true; }
    return false;
  };
  visit(root);
  return found < 0 ? count : found;
}

interface Leaf { node: Node; text: boolean; start: number; end: number }
function leaves(root: Node): Leaf[] {
  const br = finalBreak(root);
  const out: Leaf[] = [];
  let count = 0;
  const visit = (n: Node) => {
    for (const c of Array.from(n.childNodes)) {
      if (c.nodeType === TEXT) { const length = c.nodeValue?.length ?? 0; out.push({ node: c, text: true, start: count, end: count += length }); continue; }
      if (c.nodeType !== ELEMENT) continue;
      if (isAtom(c) || (c.nodeName === 'BR' && c !== br)) { out.push({ node: c, text: false, start: count, end: count += 1 }); continue; }
      if (c.nodeName !== 'BR') visit(c);
    }
  };
  visit(root);
  return out;
}
export const textLength = (root: Node) => leaves(root).at(-1)?.end ?? 0;

/**
 * DOM point for a model offset. At a boundary the caret goes to the end of the text
 * before it, so typing inherits the marks of the char before (like insertPlain).
 */
export function pointAt(root: Node, offset: number): { node: Node; offset: number } {
  const all = leaves(root);
  const target = Math.min(Math.max(offset, 0), all.at(-1)?.end ?? 0);
  const inText = all.find(l => l.text && l.start < target && target <= l.end);
  if (inText) return { node: inText.node, offset: target - inText.start };
  const before = all.findLast(l => !l.text && l.end === target);
  if (before) return { node: before.node.parentNode!, offset: indexIn(before.node) + 1 };
  const first = all.find(l => l.end > l.start);
  if (target === 0 && first?.text && first.start === 0) return { node: first.node, offset: 0 };
  return { node: root, offset: target === 0 ? 0 : root.childNodes.length };
}

// ---------------------------------------------------------------------------
// Browser-only helpers.

export interface Offsets { start: number; end: number; backward: boolean }

export function selectionOffsets(root: HTMLElement): Offsets | null {
  const sel = root.ownerDocument.getSelection();
  if (!sel || !sel.rangeCount || !sel.anchorNode || !sel.focusNode) return null;
  if (!root.contains(sel.anchorNode) || !root.contains(sel.focusNode)) return null;
  const a = offsetOf(root, sel.anchorNode, sel.anchorOffset);
  const f = sel.isCollapsed ? a : offsetOf(root, sel.focusNode, sel.focusOffset);
  return { start: Math.min(a, f), end: Math.max(a, f), backward: f < a };
}

export function setSelectionOffsets(root: HTMLElement, start: number, end = start, backward = false) {
  const sel = root.ownerDocument.getSelection();
  if (!sel) return;
  const a = pointAt(root, backward ? end : start);
  const f = start === end ? a : pointAt(root, backward ? start : end);
  sel.setBaseAndExtent(a.node, a.offset, f.node, f.offset);
}

export interface CaretRect { left: number; top: number; bottom: number; height: number }

/** Viewport rect of the caret at `offset`, with fallbacks for spots that report no rect. */
export function rectAtOffset(root: HTMLElement, offset: number): CaretRect {
  const doc = root.ownerDocument;
  const total = textLength(root);
  const at = Math.min(Math.max(offset, 0), total);
  const range = doc.createRange();
  const set = (from: number, to: number) => {
    const a = pointAt(root, from), b = pointAt(root, to);
    range.setStart(a.node, a.offset); range.setEnd(b.node, b.offset);
    return Array.from(range.getClientRects()).filter(r => r.height > 0);
  };
  const toCaret = (r: DOMRect, x: number): CaretRect => ({ left: x, top: r.top, bottom: r.bottom, height: r.height });
  const collapsed = set(at, at);
  if (collapsed.length) return toCaret(collapsed[0], collapsed[0].left);
  if (at < total) { const next = set(at, at + 1); if (next.length) return toCaret(next[0], next[0].left); }
  if (at > 0) { const prev = set(at - 1, at); if (prev.length) { const r = prev.at(-1)!; return toCaret(r, r.right); } }
  const box = root.getBoundingClientRect();
  const style = getComputedStyle(root);
  const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.6 || 20;
  const top = box.top + (parseFloat(style.paddingTop) || 0);
  return { left: box.left + (parseFloat(style.paddingLeft) || 0), top, bottom: top + line, height: line };
}

/** Viewport rect of the model range [start, end). */
export function rangeRect(root: HTMLElement, start: number, end: number) {
  const a = pointAt(root, start), b = pointAt(root, end);
  const range = root.ownerDocument.createRange();
  range.setStart(a.node, a.offset);
  range.setEnd(b.node, b.offset);
  const r = range.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
}

/** Whether the caret (selection focus) is on the first and/or last visual line. */
export function caretLines(root: HTMLElement): { first: boolean; last: boolean } {
  const sel = selectionOffsets(root);
  if (!sel) return { first: true, last: true };
  const caret = rectAtOffset(root, sel.backward ? sel.start : sel.end);
  const start = rectAtOffset(root, 0);
  const end = rectAtOffset(root, textLength(root));
  const tolerance = Math.max(4, caret.height / 2);
  return { first: caret.top - start.top < tolerance, last: end.top - caret.top < tolerance };
}

const visible = (el: HTMLElement) => el.getClientRects().length > 0;
const editable = (el: HTMLElement) => el.isContentEditable;

/** The next/previous line stop anywhere on the page, in document order. */
export function adjacentLine(from: HTMLElement, dir: 1 | -1, x?: number): HTMLElement | null {
  const all = Array.from(from.ownerDocument.querySelectorAll<HTMLElement>('[data-visual-line]')).filter(visible);
  const index = all.indexOf(from);
  let target = index < 0 ? null : all[index + dir] ?? null;
  // Entering a table lands in the column under the caret.
  const row = target?.getAttribute('data-cell-row');
  const table = target?.closest('[data-table]');
  if (target && row !== null && table && x !== undefined) {
    const cells = Array.from(table.querySelectorAll<HTMLElement>(`[data-cell-row="${row}"]`));
    const distance = (cell: HTMLElement) => { const r = cell.getBoundingClientRect(); return x < r.left ? r.left - x : x > r.right ? x - r.right : 0; };
    target = cells.reduce((best, cell) => distance(cell) < distance(best) ? cell : best, cells[0] ?? target);
  }
  return target;
}

function pointFromCoordinates(doc: Document, x: number, y: number): { node: Node; offset: number } | null {
  const d = doc as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null; caretRangeFromPoint?: (x: number, y: number) => Range | null };
  if (d.caretPositionFromPoint) { const p = d.caretPositionFromPoint(x, y); return p ? { node: p.offsetNode, offset: p.offset } : null; }
  const r = d.caretRangeFromPoint?.(x, y);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}

/** Model offset under viewport coordinates, if they fall inside root. */
export function offsetFromPoint(root: HTMLElement, x: number, y: number): number | null {
  const p = pointFromCoordinates(root.ownerDocument, x, y);
  return p && root.contains(p.node) ? offsetOf(root, p.node, p.offset) : null;
}

/** Puts the caret in `target` (start/end, or under x on its first/last line when moving vertically). */
export function enterLine(target: HTMLElement, place: 'start' | 'end', x?: number) {
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'nearest' });
  if (!editable(target)) return;
  const length = textLength(target);
  let offset = place === 'start' ? 0 : length;
  if (x !== undefined) {
    const line = rectAtOffset(target, offset);
    const hit = offsetFromPoint(target, x, line.top + line.height / 2);
    if (hit !== null) offset = hit;
  }
  setSelectionOffsets(target, offset);
}

/**
 * Arrow keys that leave a line: Up/Down from the first/last visual line, Left/Right
 * from the very start/end. Returns true when it moved the caret.
 */
export function arrowAcross(event: KeyboardEvent, el: HTMLElement): boolean {
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
  const sel = selectionOffsets(el);
  if (!sel) return false;
  const dir = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (sel.start !== sel.end || (dir < 0 ? sel.start !== 0 : sel.end !== textLength(el))) return false;
    const target = adjacentLine(el, dir);
    if (!target) return false;
    enterLine(target, dir < 0 ? 'end' : 'start');
    return true;
  }
  const lines = caretLines(el);
  if (dir < 0 ? !lines.first : !lines.last) return false;
  const x = rectAtOffset(el, sel.backward ? sel.start : sel.end).left;
  const target = adjacentLine(el, dir, x);
  if (!target) return false;
  enterLine(target, dir < 0 ? 'end' : 'start', x);
  return true;
}

export interface Placement { left: number; top: number; above: boolean }

/** Fixed-position placement next to an anchor rect that stays inside the viewport. */
export function placePopover(
  anchor: { left: number; right?: number; top: number; bottom: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  { prefer = 'below', align = 'start', gap = 6, margin = 8, minTop = 8 }: { prefer?: 'above' | 'below'; align?: 'start' | 'center'; gap?: number; margin?: number; minTop?: number } = {}
): Placement {
  const desired = align === 'center' ? (anchor.left + (anchor.right ?? anchor.left)) / 2 - size.width / 2 : anchor.left;
  const left = Math.max(margin, Math.min(desired, viewport.width - size.width - margin));
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - gap - size.height;
  const fitsBelow = belowTop + size.height <= viewport.height - margin;
  const fitsAbove = aboveTop >= minTop;
  const above = prefer === 'above' ? fitsAbove || (!fitsBelow && anchor.top - minTop > viewport.height - anchor.bottom)
    : !fitsBelow && (fitsAbove || anchor.top - minTop > viewport.height - anchor.bottom);
  const top = above ? Math.max(minTop, aboveTop) : Math.max(minTop, Math.min(belowTop, viewport.height - size.height - margin));
  return { left, top, above };
}
