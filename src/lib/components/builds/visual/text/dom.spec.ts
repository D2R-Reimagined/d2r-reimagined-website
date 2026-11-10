import { describe, expect, it } from 'vitest';
import { ATOM, canonicalInline, parseInline, serializeInline, type RichText } from '../../../../build-editor/inline';
import { cssColorToHex, domSignature, finalBreak, offsetOf, placePopover, pointAt, readDom, renderTree, textLength, treeSignature, type RNode } from './dom';

// Minimal stand-ins for DOM nodes: the walkers only read these properties.
interface Fake { nodeType: number; nodeName: string; nodeValue: string | null; childNodes: Fake[]; parentNode: Fake | null; attrs: Record<string, string>; getAttribute(name: string): string | null }
function el(name: string, attrs: Record<string, string>, ...children: (Fake | string)[]): Fake {
  const node: Fake = { nodeType: 1, nodeName: name.toUpperCase(), nodeValue: null, childNodes: [], parentNode: null, attrs, getAttribute: n => attrs[n] ?? null };
  for (const child of children) {
    const c = typeof child === 'string' ? txt(child) : child;
    c.parentNode = node; node.childNodes.push(c);
  }
  return node;
}
function txt(value: string): Fake {
  return { nodeType: 3, nodeName: '#text', nodeValue: value, childNodes: [], parentNode: null, attrs: {}, getAttribute: () => null };
}
const asNode = (f: Fake) => f as unknown as Node;

/** Builds the fake DOM the editor would render for rich text. */
function build(rich: RichText): Fake {
  const make = (n: RNode): Fake => n.type === 'text' ? txt(n.text)
    : n.type === 'atom' ? el('span', { 'data-atom': JSON.stringify(n.atom), contenteditable: 'false' }, el('button', {}, 'Name'))
    : el(n.tag, n.tag === 'a' ? { href: n.attr! } : n.tag === 'span' ? { 'data-color': n.attr! } : {}, ...n.children.map(make));
  const root = el('div', {}, ...renderTree(rich).map(make));
  if (rich.at(-1)?.ch === '\n') { const br = el('br', { 'data-sentinel': '' }); br.parentNode = root; root.childNodes.push(br); }
  return root;
}

const samples = [
  '', 'plain', '**bold** and *it* and ~~s~~', '[color=#c7b377]gold **bold** [[item:uniques:Shako]][/color] tail',
  '[link](https://example.com) `code`', 'line\nbreak', 'ends with break\n', '[[skill:54:3]][[skill:55:1]]', '~~**x** [y](/a)~~'
];

describe('render and read', () => {
  for (const md of samples) it(`round trips ${JSON.stringify(md)}`, () => {
    const rich = canonicalInline(parseInline(md));
    const root = build(rich);
    expect(serializeInline(readDom(asNode(root)))).toBe(serializeInline(rich));
    expect(domSignature(asNode(root))).toBe(treeSignature(rich));
    expect(textLength(asNode(root))).toBe(rich.length);
  });

  it('detects DOM the browser rearranged', () => {
    const rich = parseInline('**ab**');
    expect(domSignature(asNode(el('div', {}, el('b', {}, 'ab'))))).not.toBe(treeSignature(rich));
    expect(domSignature(asNode(el('div', {}, el('strong', {}, 'a', 'b'))))).toBe(treeSignature(rich));
    expect(domSignature(asNode(el('div', {}, el('strong', {}, 'ab'), el('em', {}))))).not.toBe(treeSignature(rich));
  });

  it('reads foreign formatting', () => {
    const root = el('div', {}, el('b', {}, 'a'), el('font', { color: '#FF0000' }, 'b'), el('del', {}, 'c'), el('br', {}), 'd', el('br', {}));
    expect(serializeInline(readDom(asNode(root)))).toBe('**a**[color=#ff0000]b[/color]~~c~~\nd');
  });

  it('needs the sentinel for a trailing break', () => {
    const rich = parseInline('a\n');
    expect(domSignature(asNode(el('div', {}, 'a\n')))).not.toBe(treeSignature(rich));
    expect(domSignature(asNode(el('div', {}, 'a\n', el('br', {}))))).toBe(treeSignature(rich));
    expect(domSignature(asNode(el('div', {}, 'a', el('br', {}))))).toBe(treeSignature(parseInline('a')));
  });

  it('converts css colours', () => {
    expect(cssColorToHex('rgb(199, 179, 119)')).toBe('#c7b377');
    expect(cssColorToHex('#ABCDEF')).toBe('#abcdef');
    expect(cssColorToHex('red')).toBeUndefined();
  });
});

describe('offsets', () => {
  // "ab" + bold "cd" + atom + "e\n" + sentinel
  const strong = el('strong', {}, 'cd');
  const atom = el('span', { 'data-atom': '{"kind":"skill","skillId":1,"rank":1}' }, el('button', {}, 'Skill name'));
  const tail = txt('e\n');
  const sentinel = el('br', {});
  const root = el('div', {}, 'ab', strong, atom, tail, sentinel);
  const r = asNode(root);

  it('maps DOM points to model offsets', () => {
    expect(offsetOf(r, asNode(root.childNodes[0]), 1)).toBe(1);
    expect(offsetOf(r, asNode(strong.childNodes[0]), 2)).toBe(4);
    expect(offsetOf(r, r, 2)).toBe(4);
    expect(offsetOf(r, r, 3)).toBe(5);
    expect(offsetOf(r, asNode(atom.childNodes[0].childNodes[0]), 3)).toBe(4);
    expect(offsetOf(r, asNode(tail), 2)).toBe(7);
    expect(offsetOf(r, r, 5)).toBe(7);
    expect(textLength(r)).toBe(7);
    expect(finalBreak(r)).toBe(asNode(sentinel));
  });

  it('maps model offsets back to DOM points, preferring the text before', () => {
    expect(pointAt(r, 0)).toEqual({ node: root.childNodes[0], offset: 0 });
    expect(pointAt(r, 2)).toEqual({ node: root.childNodes[0], offset: 2 });
    expect(pointAt(r, 3)).toEqual({ node: strong.childNodes[0], offset: 1 });
    expect(pointAt(r, 4)).toEqual({ node: strong.childNodes[0], offset: 2 });
    expect(pointAt(r, 5)).toEqual({ node: root, offset: 3 });
    expect(pointAt(r, 7)).toEqual({ node: tail, offset: 2 });
    expect(pointAt(r, 99)).toEqual({ node: tail, offset: 2 });
  });

  it('round trips every offset', () => {
    for (let i = 0; i <= 7; i++) { const p = pointAt(r, i); expect(offsetOf(r, asNode(p.node as unknown as Fake), p.offset)).toBe(i); }
  });

  it('handles empty lines and leading atoms', () => {
    const empty = el('div', {}, el('br', {}));
    expect(pointAt(asNode(empty), 0)).toEqual({ node: empty, offset: 0 });
    expect(readDom(asNode(empty))).toEqual([]);
    const lead = el('div', {}, el('span', { 'data-atom': '{"kind":"skill","skillId":1,"rank":1}' }));
    expect(pointAt(asNode(lead), 0)).toEqual({ node: lead, offset: 0 });
    expect(pointAt(asNode(lead), 1)).toEqual({ node: lead, offset: 1 });
    expect(readDom(asNode(lead))[0].ch).toBe(ATOM);
  });
});

describe('placePopover', () => {
  const viewport = { width: 390, height: 800 };
  const size = { width: 300, height: 200 };
  it('prefers below and clamps horizontally', () => {
    expect(placePopover({ left: 200, top: 100, bottom: 120 }, size, viewport)).toEqual({ left: 82, top: 126, above: false });
  });
  it('flips above near the bottom', () => {
    expect(placePopover({ left: 10, top: 700, bottom: 720 }, size, viewport)).toEqual({ left: 10, top: 494, above: true });
  });
  it('flips below when there is no room above the header', () => {
    const placed = placePopover({ left: 50, right: 150, top: 90, bottom: 110 }, { width: 200, height: 40 }, viewport, { prefer: 'above', align: 'center', minTop: 72 });
    expect(placed).toEqual({ left: 8, top: 116, above: false });
    const room = placePopover({ left: 50, right: 150, top: 300, bottom: 320 }, { width: 100, height: 40 }, viewport, { prefer: 'above', align: 'center', minTop: 72 });
    expect(room).toEqual({ left: 50, top: 254, above: true });
  });
});
