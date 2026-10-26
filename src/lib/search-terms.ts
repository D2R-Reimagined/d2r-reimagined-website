// Matching for searchable selects. The default is the shared selector's original behavior;
// the multi-term matcher is opted into by individual pickers.

export type LabelMatcher = (label: string, query: string) => boolean;

/** Case-insensitive substring match of the whole query, as every selector has always done. */
export const matchesSubstring: LabelMatcher = (label, query) => label.toLocaleLowerCase().includes(query.toLocaleLowerCase());

/** Splits a query on whitespace, ignoring surrounding and repeated whitespace. */
export function searchTerms(query: string): string[] {
  return query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
}

const digitsOnly = /^\d+$/;
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The whole numbers that directly follow `word` in `text`, such as 1 and 5 in `act 1 h2h b · level 5` for `act` and `level`. */
function numbersAfter(text: string, word: string): Set<string> {
  return new Set(Array.from(text.matchAll(new RegExp(`${escapeRegExp(word)}\\s+(\\d+)`, 'g')), match => match[1]));
}

/**
 * Every term must appear in the label, in any order. A single term is a plain substring match;
 * with several terms, a number term only matches a whole number, so `act 5` does not match `Level 85`.
 * A number typed right after a word that the label itself numbers (`Act 1`, `Level 5`) must be that
 * word's number, so `act 5` does not match `Act 1 … · Level 5`, while `level 5` still finds it.
 */
export const matchesAllTerms: LabelMatcher = (label, query) => {
  const terms = searchTerms(query);
  if (terms.length <= 1) return matchesSubstring(label, terms[0] ?? '');
  const text = label.toLocaleLowerCase();
  const numbers = new Set(text.match(/\d+/g) ?? []);
  return terms.every((term, index) => {
    if (!digitsOnly.test(term)) return text.includes(term);
    if (!numbers.has(term)) return false;
    const word = terms[index - 1];
    if (!word || digitsOnly.test(word)) return true;
    const bound = numbersAfter(text, word);
    return !bound.size || bound.has(term);
  });
};
