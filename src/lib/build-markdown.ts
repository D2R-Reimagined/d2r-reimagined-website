// A deliberately HTML-free Markdown subset. All text is rendered by Svelte,
// never {@html}; item references remain real interactive components.
export type InlineToken = { kind: 'text' | 'bold' | 'italic' | 'code' | 'strike' | 'link' | 'item'; text: string; href?: string; catalog?: string; key?: string };
export type MarkdownBlock = { kind: 'paragraph' | 'heading' | 'quote' | 'code' | 'list' | 'table' | 'rule'; text?: string; level?: number; ordered?: boolean; lines?: string[]; rows?: string[][] };

export function safeLink(value: string): string | null {
  if (/^\/(?!\/)[^\s\\]*$/.test(value)) return value;
  if (/^#[\w-]+$/.test(value)) return value;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function inlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const expression = /\[\[item:(uniques|sets|runewords|bases):([^\]\n]{1,160})\]\]|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`|~~([^~\n]+)~~|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(expression)) {
    if (match.index! > last) tokens.push({ kind: 'text', text: text.slice(last, match.index) });
    if (match[1]) tokens.push({ kind: 'item', text: match[2], catalog: match[1], key: match[2] });
    else if (match[3]) tokens.push({ kind: 'bold', text: match[3] });
    else if (match[4]) tokens.push({ kind: 'italic', text: match[4] });
    else if (match[5]) tokens.push({ kind: 'code', text: match[5] });
    else if (match[6]) tokens.push({ kind: 'strike', text: match[6] });
    else {
      const href = safeLink(match[8]);
      tokens.push(href ? { kind: 'link', text: match[7], href } : { kind: 'text', text: match[0] });
    }
    last = match.index! + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', text: text.slice(last) });
  return tokens;
}
export function markdownBlocks(text: string): MarkdownBlock[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  const cells = (line: string) => line.replace(/^\s*\||\|\s*$/g, '').split('|').map(s => s.trim());
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (/^```/.test(line)) {
      const code = []; while (++i < lines.length && !/^```/.test(lines[i])) code.push(lines[i]);
      blocks.push({ kind: 'code', text: code.join('\n') }); continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { blocks.push({ kind: 'heading', level: Math.min(heading[1].length + 2, 6), text: heading[2] }); continue; }
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) { blocks.push({ kind: 'rule' }); continue; }
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const rows = [cells(line)]; i++;
      while (i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].trim()) rows.push(cells(lines[++i]));
      blocks.push({ kind: 'table', rows }); continue;
    }
    if (/^\s*(?:[-*+] |\d+\. )/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const list = [line.replace(/^\s*(?:[-*+] |\d+\. )/, '')];
      const pattern = ordered ? /^\s*\d+\. / : /^\s*[-*+] /;
      while (i + 1 < lines.length && pattern.test(lines[i + 1])) list.push(lines[++i].replace(pattern, ''));
      blocks.push({ kind: 'list', ordered, lines: list }); continue;
    }
    if (/^>\s?/.test(line)) {
      const quote = [line.replace(/^>\s?/, '')];
      while (i + 1 < lines.length && /^>/.test(lines[i + 1])) quote.push(lines[++i].replace(/^>\s?/, ''));
      blocks.push({ kind: 'quote', text: quote.join('\n') }); continue;
    }
    const paragraph = [line];
    while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#{1,6}\s|>|```|\s*[-*+] |\s*\d+\. |---)/.test(lines[i + 1])) {
      if (lines[i + 1].includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 2] ?? '')) break;
      paragraph.push(lines[++i]);
    }
    blocks.push({ kind: 'paragraph', text: paragraph.join('\n') });
  }
  return blocks;
}
