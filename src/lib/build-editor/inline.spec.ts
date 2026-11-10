import { describe, expect, it } from 'vitest';
import { ATOM, applyMark, canonicalChar, canonicalInline, hasMark, insertPlain, marksIn, parseInline, plainText, serializeInline,
  toggleMark, type Marks, type RichChar, type RichText } from './inline';

const md = (text: RichText) => serializeInline(text);
const roundTrip = (source: string) => md(parseInline(source));

describe('inline round trip', () => {
  const samples = [
    'plain text', '**bold** and *italic* and ~~gone~~ and `code`',
    '[a link](https://example.com/x) then [[item:uniques:Harlequin Crest]]',
    'Use [[skill:54:20]] with [[skill:54]] at rank one',
    '[color=#E9AB74]coloured **bold** text[/color] after',
    '~~**struck bold**~~ and **~~bold struck~~**',
    '**bold [link](https://example.com) inside**',
    'line one\nline two with *italic*',
    '2 * 3 * 4', '***weird***', '[not a link](javascript:alert(1))', '[[item:bogus:x]]',
    'unicode 🔥 ✓ — fine', '`a*b` code with star', 'escaped \\*not italic\\* and \\[x\\](y)', 'backslash \\ alone'
  ];
  for (const sample of samples) it(`is stable: ${sample}`, () => {
    const once = roundTrip(sample);
    expect(roundTrip(once)).toBe(once);
    expect(parseInline(once)).toEqual(parseInline(sample));
  });

  it('escapes literal syntax characters', () => {
    expect(md([...'2 * 3 [a](b)'].map(ch => ({ ch, marks: {} })))).toBe('2 \\* 3 \\[a\\](b)');
    expect(plainText(parseInline('2 \\* 3 \\[a\\](b)'))).toBe('2 * 3 [a](b)');
  });
  it('keeps atoms intact', () => {
    const text = parseInline('a [[item:sets:Tal Rasha]] b');
    expect(text.filter(c => c.atom)).toEqual([{ ch: ATOM, marks: {}, atom: { kind: 'item', catalog: 'sets', key: 'Tal Rasha' } }]);
    expect(md(text)).toBe('a [[item:sets:Tal Rasha]] b');
  });
});

describe('serialization of arbitrary marks', () => {
  // Deterministic PRNG so failures reproduce.
  let seed = 1234567;
  const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const pick = <T>(values: T[]) => values[Math.floor(random() * values.length)];
  const alphabet = ['a', 'b', ' ', '*', '~', '`', '[', ']', '(', ')', '|', '\n', '#', '-', 'é', 'x'];
  function randomText(): RichText {
    const out: RichChar[] = [];
    const length = Math.floor(random() * 24);
    for (let i = 0; i < length; i++) {
      const marks: Marks = {};
      if (random() < .3) marks.bold = true;
      if (random() < .3) marks.italic = true;
      if (random() < .2) marks.strike = true;
      if (random() < .15) marks.code = true;
      if (random() < .15) marks.color = pick(['#ff0000', '#00ff00']);
      if (random() < .15) marks.link = pick(['https://example.com/a', '/data/uniques']);
      if (random() < .08) out.push({ ch: ATOM, marks, atom: random() < .5 ? { kind: 'skill', skillId: 54, rank: 3 } : { kind: 'item', catalog: 'uniques', key: 'Shako' } });
      else out.push({ ch: pick(alphabet), marks });
    }
    return out;
  }
  it('round-trips 5000 random texts exactly (every char, every expressible mark)', () => {
    for (let i = 0; i < 5000; i++) {
      const text = randomText();
      const canonical = text.map(canonicalChar).filter(c => c.ch !== '');
      const back = parseInline(md(text));
      expect(back, `${JSON.stringify(text)} => ${md(text)}`).toEqual(canonical);
    }
  });
  it('keeps every mark except the documented conflicts', () => {
    for (let i = 0; i < 2000; i++) {
      const text = randomText();
      const expected = canonicalInline(text);
      expect(plainText(expected)).toBe(plainText(text));
      // Bold beats italic and code beats link; otherwise every mark survives.
      text.forEach((c, index) => {
        if (c.ch === '\n') return;
        const got = expected[index].marks;
        const codeChar = c.marks.code && !c.atom ? c.ch : '';
        if (c.marks.bold && !codeChar.includes('*') && !c.atom) expect(got.bold).toBe(true);
        if (c.marks.strike && !codeChar.includes('~') && !c.atom) expect(got.strike).toBe(true);
        if (c.marks.color) expect(got.color).toBe(c.marks.color);
        if (!c.atom && c.marks.code && c.ch !== '`' && c.ch !== '\n') expect(got.code).toBe(true);
      });
    }
  });
});

describe('editing operations', () => {
  it('toggles bold over a range', () => {
    const text = parseInline('hello world');
    const bold = toggleMark(text, 0, 5, 'bold');
    expect(md(bold)).toBe('**hello** world');
    expect(hasMark(bold, 0, 5, 'bold')).toBe(true);
    expect(md(toggleMark(bold, 0, 5, 'bold'))).toBe('hello world');
  });
  it('makes bold and italic exclusive', () => {
    const text = toggleMark(parseInline('abc'), 0, 3, 'italic');
    expect(md(toggleMark(text, 0, 3, 'bold'))).toBe('**abc**');
  });
  it('applies colour and link', () => {
    let text = applyMark(parseInline('see guide'), 4, 9, 'link', 'https://example.com');
    text = applyMark(text, 0, 3, 'color', '#AABBCC');
    expect(md(text)).toBe('[color=#aabbcc]see[/color] [guide](https://example.com)');
  });
  it('continues marks when typing, but not links', () => {
    const text = parseInline('**bo** [x](https://e.com)');
    expect(md(insertPlain(text, 2, 'ld'))).toBe('**bold** [x](https://e.com/)');
    expect(md(insertPlain(text, text.length, 'y'))).toBe('**bo** [x](https://e.com/)y');
  });
  it('reports shared marks', () => {
    const text = parseInline('**ab**c');
    expect(marksIn(text, 0, 2)).toEqual({ bold: true });
    expect(marksIn(text, 0, 3)).toEqual({});
  });
});
