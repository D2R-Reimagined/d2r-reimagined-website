import { describe, expect, it } from 'vitest';
import {
  applyShortcut, backspaceAtStart, cellRich, convertLine, deleteAtEnd, duplicateLine, END, formatState, insertBlock,
  insertReference, italicBlocked, lineRich, moveLine, normalizeLink, opensTrigger, pasteText, removeLine, reuseIds,
  splitLine, tableAddColumn, tableAddRow, tableDeleteColumn, tableDeleteRow, tableSetCell, toggleFormat, triggerQuery, withRich
} from './commands';
import { ATOM, parseInline, plainText, serializeInline } from './inline';
import { newLine, serializeBody, type EditorLine } from './lines';

const shape = (lines: EditorLine[]) => lines.map(l => [l.type, l.text, ...(l.level ? [l.level] : [])]);
const p = (text: string) => newLine('paragraph', text);

describe('splitLine', () => {
  it('splits a paragraph at the caret and keeps marks on both halves', () => {
    const lines = [p('**bold text**')];
    const edit = splitLine(lines, 0, 5, 5);
    expect(shape(edit.lines)).toEqual([['paragraph', '**bold **'], ['paragraph', '**text**']]);
    expect(edit.focus).toEqual({ id: edit.lines[1].id, start: 0 });
  });
  it('replaces the selection before splitting', () => {
    const edit = splitLine([p('abcdef')], 0, 2, 4);
    expect(shape(edit.lines)).toEqual([['paragraph', 'ab'], ['paragraph', 'ef']]);
  });
  it('continues lists and quotes', () => {
    expect(shape(splitLine([newLine('bullet', 'ab')], 0, 1, 1).lines)).toEqual([['bullet', 'a'], ['bullet', 'b']]);
    expect(shape(splitLine([newLine('numbered', 'ab')], 0, 2, 2).lines)).toEqual([['numbered', 'ab'], ['numbered', '']]);
    expect(shape(splitLine([newLine('quote', 'ab')], 0, 2, 2).lines)).toEqual([['quote', 'ab'], ['quote', '']]);
  });
  it('turns an empty list item or quote into a paragraph', () => {
    for (const type of ['bullet', 'numbered', 'quote'] as const) {
      const line = newLine(type, '');
      const edit = splitLine([line], 0, 0, 0);
      expect(shape(edit.lines)).toEqual([['paragraph', '']]);
      expect(edit.focus).toEqual({ id: line.id, start: 0 });
    }
  });
  it('follows a heading with a paragraph', () => {
    expect(shape(splitLine([newLine('heading', 'Title', 2)], 0, 5, 5).lines)).toEqual([['heading', 'Title', 2], ['paragraph', '']]);
  });
  it('opens a line above when the caret is at the start', () => {
    const heading = newLine('heading', 'Title', 1);
    const edit = splitLine([heading], 0, 0, 0);
    expect(shape(edit.lines)).toEqual([['paragraph', ''], ['heading', 'Title', 1]]);
    expect(edit.focus).toEqual({ id: heading.id, start: 0 });
  });
  it('inserts a soft break with Shift+Enter in paragraphs and quotes only', () => {
    expect(shape(splitLine([p('ab')], 0, 1, 1, true).lines)).toEqual([['paragraph', 'a\nb']]);
    expect(splitLine([p('ab')], 0, 1, 1, true).focus?.start).toBe(2);
    expect(shape(splitLine([newLine('quote', 'ab')], 0, 1, 1, true).lines)).toEqual([['quote', 'a\nb']]);
    expect(shape(splitLine([newLine('bullet', 'ab')], 0, 1, 1, true).lines)).toEqual([['bullet', 'a'], ['bullet', 'b']]);
    expect(shape(splitLine([newLine('heading', 'ab', 1)], 0, 1, 1, true).lines)).toEqual([['heading', 'a', 1], ['paragraph', 'b']]);
  });
  it('adds newlines in code and exits after two blank lines or Shift+Enter', () => {
    const code = newLine('code', 'x = 1');
    const once = splitLine([code], 0, 5, 5);
    expect(shape(once.lines)).toEqual([['code', 'x = 1\n']]);
    const twice = splitLine(once.lines, 0, 6, 6);
    expect(shape(twice.lines)).toEqual([['code', 'x = 1\n\n']]);
    const exit = splitLine(twice.lines, 0, 7, 7);
    expect(shape(exit.lines)).toEqual([['code', 'x = 1'], ['paragraph', '']]);
    expect(exit.focus?.id).toBe(exit.lines[1].id);
    expect(shape(splitLine([code], 0, 2, 2, true).lines)).toEqual([['code', 'x = 1'], ['paragraph', '']]);
  });
});

describe('backspaceAtStart and deleteAtEnd', () => {
  it('turns a non-paragraph into a paragraph first', () => {
    for (const line of [newLine('heading', '**H**', 2), newLine('bullet', 'a'), newLine('quote', 'q'), newLine('code', 'a*b')]) {
      const edit = backspaceAtStart([p('x'), line], 1)!;
      expect(edit.lines[1].type).toBe('paragraph');
      expect(plainText(lineRich(edit.lines[1]))).toBe(plainText(lineRich(line)));
    }
  });
  it('merges into the previous line with the caret at the join', () => {
    const a = p('ab'), b = p('*cd*');
    const edit = backspaceAtStart([a, b], 1)!;
    expect(shape(edit.lines)).toEqual([['paragraph', 'ab*cd*']]);
    expect(edit.focus).toEqual({ id: a.id, start: 2 });
  });
  it('merges into a heading without soft breaks', () => {
    const edit = backspaceAtStart([newLine('heading', 'T', 1), p('a\nb')], 1)!;
    expect(shape(edit.lines)).toEqual([['heading', 'Ta b', 1]]);
  });
  it('merges into code as raw text', () => {
    const edit = backspaceAtStart([newLine('code', 'x'), p('**y** [[skill:54:2]]')], 1)!;
    expect(shape(edit.lines)).toEqual([['code', 'xy [[skill:54:2]]']]);
  });
  it('deletes a previous rule instead of merging', () => {
    const rule = newLine('rule'), b = p('b');
    const edit = backspaceAtStart([p('a'), rule, b], 2)!;
    expect(shape(edit.lines)).toEqual([['paragraph', 'a'], ['paragraph', 'b']]);
    expect(edit.focus).toEqual({ id: b.id, start: 0 });
  });
  it('moves into a previous table and drops an empty line', () => {
    const table = newLine('table');
    const edit = backspaceAtStart([table, p('')], 1)!;
    expect(edit.lines).toEqual([table]);
    expect(edit.focus).toEqual({ id: table.id, start: END, cell: [1, 1] });
    expect(backspaceAtStart([table, p('keep')], 1)!.lines).toHaveLength(2);
  });
  it('does nothing on the first paragraph', () => {
    expect(backspaceAtStart([p('a')], 0)).toBeNull();
  });
  it('merges the next line on Delete', () => {
    const a = newLine('bullet', 'a');
    const edit = deleteAtEnd([a, p('**b**'), p('c')], 0)!;
    expect(shape(edit.lines)).toEqual([['bullet', 'a**b**'], ['paragraph', 'c']]);
    expect(edit.focus).toEqual({ id: a.id, start: 1 });
    expect(shape(deleteAtEnd([p('a'), newLine('rule'), p('c')], 0)!.lines)).toEqual([['paragraph', 'a'], ['paragraph', 'c']]);
    expect(deleteAtEnd([p('a')], 0)).toBeNull();
    expect(deleteAtEnd([p('a'), newLine('table')], 0)).toBeNull();
  });
});

describe('shortcuts and conversions', () => {
  it.each([
    ['# Title', 2, 'heading', 'Title'], ['### x', 4, 'heading', 'x'], ['- item', 2, 'bullet', 'item'],
    ['1. one', 3, 'numbered', 'one'], ['> q', 2, 'quote', 'q'], ['```', 3, 'code', '']
  ])('%s converts the paragraph', (text, caret, type, rest) => {
    const edit = applyShortcut([p(text)], 0, caret)!;
    expect(edit.lines[0].type).toBe(type);
    expect(edit.lines[0].text).toBe(rest);
    expect(edit.focus?.start).toBe(0);
  });
  it('keeps the heading level', () => {
    expect(applyShortcut([p('## ')], 0, 3)!.lines[0].level).toBe(2);
  });
  it('turns --- into a divider followed by a paragraph', () => {
    const edit = applyShortcut([p('---')], 0, 3)!;
    expect(shape(edit.lines)).toEqual([['rule', ''], ['paragraph', '']]);
    expect(edit.focus?.id).toBe(edit.lines[1].id);
  });
  it('ignores markers away from the caret or outside paragraphs', () => {
    expect(applyShortcut([p('# Title')], 0, 7)).toBeNull();
    expect(applyShortcut([newLine('bullet', '- x')], 0, 2)).toBeNull();
    expect(applyShortcut([p('hello')], 0, 1)).toBeNull();
  });
  it('converts between text and code without losing content', () => {
    const line = p('**a** `b` [[item:uniques:Shako]]');
    const code = convertLine(line, 'code');
    expect(code.text).toBe('a b [[item:uniques:Shako]]');
    const back = convertLine(newLine('code', 'a*b'), 'paragraph');
    expect(plainText(lineRich(back))).toBe('a*b');
    expect(convertLine(p('a\nb'), 'bullet').text).toBe('a b');
    expect(convertLine(p('x'), 'heading', 3)).toMatchObject({ type: 'heading', level: 3, text: 'x' });
  });
  it('places a divider or table on an empty line, or below a line with text', () => {
    const empty = p('');
    const rule = insertBlock([empty], 0, 'rule');
    expect(shape(rule.lines)).toEqual([['rule', ''], ['paragraph', '']]);
    expect(rule.lines[0].id).toBe(empty.id);
    const table = insertBlock([p('keep'), p('')], 0, 'table');
    expect(table.lines.map(l => l.type)).toEqual(['paragraph', 'table', 'paragraph']);
    expect(table.focus).toMatchObject({ id: table.lines[1].id, cell: [1, 0] });
  });
});

describe('line list operations', () => {
  const [a, b, c] = [p('a'), p('b'), p('c')];
  it('moves lines to an insertion index', () => {
    expect(moveLine([a, b, c], 0, 3).map(l => l.text)).toEqual(['b', 'c', 'a']);
    expect(moveLine([a, b, c], 2, 0).map(l => l.text)).toEqual(['c', 'a', 'b']);
    expect(moveLine([a, b, c], 0, 2).map(l => l.text)).toEqual(['b', 'a', 'c']);
    expect(moveLine([a, b, c], 1, 1)).toEqual([a, b, c]);
    expect(moveLine([a, b, c], 1, 2)).toEqual([a, b, c]);
  });
  it('duplicates with a fresh id and deep-copied rows', () => {
    const table = newLine('table');
    const edit = duplicateLine([table], 0);
    expect(edit.lines[1].id).not.toBe(table.id);
    expect(edit.lines[1].rows).toEqual(table.rows);
    expect(edit.lines[1].rows).not.toBe(table.rows);
    expect('rows' in duplicateLine([a], 0).lines[1]).toBe(false);
  });
  it('removes a line and always keeps one', () => {
    expect(removeLine([a, b], 1)).toEqual({ lines: [a], focus: { id: a.id, start: END } });
    expect(removeLine([a, b], 0)).toEqual({ lines: [b], focus: { id: b.id, start: 0 } });
    const last = removeLine([a], 0);
    expect(shape(last.lines)).toEqual([['paragraph', '']]);
  });
  it('reuses ids for unchanged lines after an outside edit', () => {
    const next = [p('a'), p('x'), p('c')];
    const merged = reuseIds([a, b, c], next);
    expect(merged.map(l => l.id)).toEqual([a.id, b.id, c.id]);
    const removed = reuseIds([a, b, c], [p('a'), p('c')]);
    expect(removed.map(l => l.id)).toEqual([a.id, c.id]);
    const added = reuseIds([a, c], [p('a'), p('b'), p('c')]);
    expect(added[0].id).toBe(a.id);
    expect(added[2].id).toBe(c.id);
    expect(new Set(added.map(l => l.id)).size).toBe(3);
  });
});

describe('pasteText', () => {
  it('inserts single-line Markdown with its formatting', () => {
    const line = p('ab');
    const edit = pasteText([line], 0, 1, 1, '**x** [[skill:54:3]]');
    expect(edit.lines[0].text).toBe('a**x** [[skill:54:3]]b');
    expect(edit.focus).toEqual({ id: line.id, start: 4 });
  });
  it('splices several blocks into the line', () => {
    const line = p('startend');
    const edit = pasteText([line, p('after')], 0, 5, 5, 'one\n\n## Two\n\n- three\n- four\n');
    expect(shape(edit.lines)).toEqual([
      ['paragraph', 'startone'], ['heading', 'Two', 2], ['bullet', 'three'], ['bullet', 'fourend'], ['paragraph', 'after']
    ]);
    expect(edit.focus).toEqual({ id: edit.lines[3].id, start: 4 });
  });
  it('replaces an empty paragraph with a pasted block', () => {
    const edit = pasteText([p('')], 0, 0, 0, '# A\n\nb');
    expect(shape(edit.lines)).toEqual([['heading', 'A', 1], ['paragraph', 'b']]);
  });
  it('keeps text after the caret on its own line after a code block', () => {
    const edit = pasteText([p('xy')], 0, 1, 1, '```\ncode\n```');
    expect(shape(edit.lines)).toEqual([['paragraph', 'x'], ['code', 'code'], ['paragraph', 'y']]);
  });
  it('pastes raw text into code lines', () => {
    const edit = pasteText([newLine('code', 'ab')], 0, 1, 1, '**x**\r\ny');
    expect(edit.lines[0].text).toBe('a**x**\nyb');
    expect(edit.focus?.start).toBe(8);
  });
  it('produces lines that serialize', () => {
    const edit = pasteText([p('')], 0, 0, 0, '| A | B |\n| --- | --- |\n| 1 | 2 |');
    expect(serializeBody(edit.lines)).toBe('| A | B |\n| --- | --- |\n| 1 | 2 |');
  });
});

describe('formatting', () => {
  const rich = parseInline('**bold** plain');
  it('lets bold win over italic', () => {
    expect(italicBlocked(rich, 0, 4)).toBe(true);
    expect(italicBlocked(rich, 0, 6)).toBe(false);
    expect(serializeInline(toggleFormat(rich, 0, 4, 'italic'))).toBe('**bold** plain');
    expect(serializeInline(toggleFormat(rich, 0, 10, 'italic'))).toBe('**bold*** plain*');
    expect(serializeInline(toggleFormat(parseInline('*it*'), 0, 2, 'bold'))).toBe('**it**');
  });
  it('toggles marks off when every eligible char has them', () => {
    const coded = parseInline('`ab`[[skill:1:1]]');
    expect(formatState(coded, 0, 3).code).toBe(true);
    expect(serializeInline(toggleFormat(coded, 0, 3, 'code'))).toBe('ab[[skill:1:1]]');
    expect(serializeInline(toggleFormat(parseInline('~~x~~'), 0, 1, 'strike'))).toBe('x');
  });
  it('reports shared link and colour', () => {
    const state = formatState(parseInline('[color=#c7b377][a](https://x.io/)[/color]'), 0, 1);
    expect(state).toMatchObject({ link: 'https://x.io/', color: '#c7b377', bold: false });
  });
  it('validates links', () => {
    expect(normalizeLink('https://example.com/a b')).toBe('https://example.com/a%20b');
    expect(normalizeLink('example.com/x')).toBe('https://example.com/x');
    expect(normalizeLink('/data/uniques')).toBe('/data/uniques');
    expect(normalizeLink('javascript:alert(1)')).toBeNull();
    expect(normalizeLink('hello')).toBeNull();
    expect(normalizeLink('https://x.io/a)b')).toBe('https://x.io/a%29b');
  });
  it('inserts references with a trailing space', () => {
    const atom = { kind: 'skill' as const, skillId: 54, rank: 1 };
    const { rich: out, caret } = insertReference(parseInline('a @tele b'), 2, 7, atom);
    expect(serializeInline(out)).toBe('a [[skill:54:1]] b');
    expect(caret).toBe(4);
    expect(serializeInline(insertReference([], 0, 0, atom).rich)).toBe('[[skill:54:1]] ');
  });
  it('keeps table cells on one line without separators', () => {
    expect(plainText(cellRich(parseInline('a|b\nc')))).toBe('a/b c');
  });
  it('withRich keeps single-line types on one line', () => {
    expect(withRich(newLine('bullet'), parseInline('a\nb')).text).toBe('a b');
  });
});

describe('triggers', () => {
  it('opens at the start of a line or after whitespace', () => {
    expect(opensTrigger('/', 1, '/')).toBe(true);
    expect(opensTrigger('a /', 3, '/')).toBe(true);
    expect(opensTrigger('a\n@', 3, '@')).toBe(true);
    expect(opensTrigger('a/', 2, '/')).toBe(false);
    expect(opensTrigger('x@y', 2, '@')).toBe(false);
  });
  it('tracks the query until it stops applying', () => {
    expect(triggerQuery('/head', 0, 5, '/')).toBe('head');
    expect(triggerQuery('a @harle cr', 2, 11, '@')).toBe('harle cr');
    expect(triggerQuery('/x', 0, 0, '/')).toBeNull();
    expect(triggerQuery('x', 0, 1, '/')).toBeNull();
    expect(triggerQuery('/  x', 0, 4, '/')).toBeNull();
    expect(triggerQuery(`/a${ATOM}`, 0, 3, '/')).toBeNull();
  });
});

describe('virtual triggers and tables', () => {
  it('reads a query from the + menu without a trigger char', () => {
    expect(triggerQuery('', 0, 0, '')).toBe('');
    expect(triggerQuery('head', 0, 4, '')).toBe('head');
    expect(triggerQuery('ab', 1, 0, '')).toBeNull();
  });
  it('edits table rows and columns', () => {
    const rows = [['A', 'B'], ['1']];
    expect(tableAddRow(rows, 1)).toEqual([['A', 'B'], ['', ''], ['1', '']]);
    expect(tableAddColumn(rows, 1)).toEqual([['A', '', 'B'], ['1', '', '']]);
    expect(tableDeleteRow(rows, 1)).toEqual([['A', 'B']]);
    expect(tableDeleteRow(rows, 0)).toEqual([['A', 'B'], ['1', '']]);
    expect(tableDeleteColumn(rows, 0)).toEqual([['B'], ['']]);
    expect(tableDeleteColumn([['A'], ['1']], 0)).toEqual([['A'], ['1']]);
    expect(tableSetCell(rows, 1, 1, '**x**')).toEqual([['A', 'B'], ['1', '**x**']]);
  });
});
