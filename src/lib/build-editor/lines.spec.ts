import { describe, expect, it } from 'vitest';
import { detectShortcut, isLossless, newLine, parseBody, renderShape, serializeBody } from './lines';

const strip = (lines: ReturnType<typeof parseBody>) => lines.map(({ id: _id, ...rest }) => rest);

describe('section body round trip', () => {
  const bodies = [
    '',
    'Just a paragraph.',
    '## Gear\n\nWear **Shako** and [[item:uniques:Harlequin Crest]].\nSecond line.',
    '- one\n- two\n\n1. first\n2. second',
    '> quoted *text*\n> more',
    '```\ncode here\n  indented\n```',
    'Above\n\n---\n\nBelow',
    '| Stat | Target |\n| --- | --- |\n| FCR | 105% |\n| Res | 75 |',
    '# One\n## Two\n### Three\n#### Four',
    '[color=#e9ab74]Coloured[/color] text with [[skill:54:20]]'
  ];
  for (const body of bodies) it(`renders identically: ${JSON.stringify(body).slice(0, 50)}`, () => {
    expect(isLossless(body)).toBe(true);
    const once = serializeBody(parseBody(body));
    expect(serializeBody(parseBody(once))).toBe(once);
  });

  it('parses each structure into lines', () => {
    expect(strip(parseBody('## Gear\n\n- a\n- b\n\n---'))).toEqual([
      { type: 'heading', level: 2, text: 'Gear' },
      { type: 'bullet', text: 'a' }, { type: 'bullet', text: 'b' },
      { type: 'rule', text: '' }
    ]);
  });

  it('drops empty lines and merges consecutive list items', () => {
    const lines = [newLine('paragraph', 'Intro'), newLine('paragraph', ''), newLine('bullet', 'a'), newLine('bullet', 'b'), newLine('numbered', 'c')];
    expect(serializeBody(lines)).toBe('Intro\n\n- a\n- b\n\n1. c');
  });

  it('serializes tables with a header separator', () => {
    const table = { ...newLine('table'), rows: [['Stat', 'Target'], ['FCR', '105|%']] };
    const body = serializeBody([table]);
    expect(body).toBe('| Stat | Target |\n| --- | --- |\n| FCR | 105/% |');
    expect(renderShape(body)).toEqual([{ table: [['Stat', 'Target'], ['FCR', '105/%']].map(r => r.map(c => [...c].map(ch => [ch, {}, null]))) }]);
  });
});

describe('paragraphs that look like block syntax', () => {
  it.each(['- not a list', '+ nor this', '# not a heading', '> not a quote', '1. not numbered', '---', '| --- |', '  - indented'])('%s stays a paragraph', text => {
    const body = serializeBody([newLine('paragraph', `Intro\n${text}`)]);
    const back = parseBody(body);
    expect(back.map(l => l.type)).toEqual(['paragraph']);
    expect(back[0].text.split('\n')[1].replace(/\\/g, '')).toBe(text.replace(/\\/g, ''));
    expect(serializeBody(back)).toBe(body);
  });
});

describe('code lines', () => {
  it('keep a fence-like line inside the block', () => {
    const body = serializeBody([newLine('code', 'before\n```\nafter'), newLine('paragraph', 'next')]);
    const back = parseBody(body);
    expect(back.map(l => l.type)).toEqual(['code', 'paragraph']);
    expect(back[0].text.replace(/​/g, '')).toBe('before\n```\nafter');
  });
});

describe('markdown shortcuts', () => {
  it.each([
    ['# ', 'heading', 1], ['### ', 'heading', 3], ['- ', 'bullet', undefined], ['1. ', 'numbered', undefined],
    ['> ', 'quote', undefined], ['```', 'code', undefined], ['---', 'rule', undefined]
  ])('%s becomes %s', (text, type, level) => {
    expect(detectShortcut(text)).toMatchObject({ type, ...(level ? { level } : {}) });
  });
  it('ignores ordinary text', () => { expect(detectShortcut('hello')).toBeNull(); });
});
