import type { CatalogItem, KeyedLine } from './types';

/**
 * The orb recipe families, in the order the page presents them — roughly the order a player
 * applies them, from adding sockets through to corrupting a finished item.
 */
export const orbNoteKeys = [
  'strCubeNoteOrbOfSocketing',
  'strCubeNoteOrbOfShadows',
  'strCubeNoteOrbOfInfusion',
  'strCubeNoteOrbOfAssemblage',
  'strCubeNoteOrbOfConversion',
  'strCubeNoteOrbOfCorruption'
] as const;

const orbNotes = new Set<string>(orbNoteKeys);

/**
 * Equipment-slot order for an orb's accepted item types, so every orb lists them the same
 * way instead of in catalog order. Types not listed here sort after these, in catalog order.
 */
const targetOrder = [
  'weapitype', '1wepitype', 'slamitype', 'spplitype', 'aqv', 'cqv',
  'armoitype', 'helmitype', 'torsitype', 'shlditype', 'glovitype', 'bootitype', 'beltitype',
  'amu', 'rin'
];

/** Applied to every corrupted result, so the page states it once instead of per outcome. */
const CORRUPTED_MARKER_KEY = 'Corrupted';

/** The output name used when the player keeps the item they put in. */
const KEEP_NAME_KEY = 'strCubeOutputUseItemFromInput1';

/** One possible result of using an orb on one item type. */
export interface OrbOutcome {
  /** The backing recipe's catalog index — a stable key for the row. */
  index: string;
  /** Properties the result gains, without the implied `Corrupted` marker. */
  lines: KeyedLine[];
  /** Rarity qualifiers on the result, e.g. "Rare Item". */
  qualifiers: KeyedLine[];
  /** The item is replaced by a fresh roll rather than kept as-is. */
  rerolls: boolean;
  /** The item is changed but gains nothing — no properties and no reroll. */
  barren: boolean;
}

/** One item type an orb accepts, and what it can turn that item into. */
export interface OrbTarget {
  /** Translation key naming the item type, e.g. `helmitype`. */
  key: string;
  /** The input line as the recipe states it, so quantities survive. */
  input: KeyedLine;
  /**
   * Input-side conditions, each an alternative the item may satisfy. A family often lists
   * one recipe per accepted quality — "Low Quality", "Normal Quality", "Superior" — that all
   * lead to the same result, so those collapse into one target carrying every condition.
   */
  requires: KeyedLine[];
  /** Distinct results, deduplicated so a repeated effect is stated once. */
  outcomes: OrbOutcome[];
}

export interface Orb {
  /** The recipe note naming this family, e.g. `strCubeNoteOrbOfCorruption`. */
  noteKey: string;
  /** The consumed orb, e.g. `ka3` — Orb of Corruption. */
  reagent: KeyedLine;
  targets: OrbTarget[];
  /**
   * The single result every accepted item type shares. Present for the orbs that always do
   * one thing, so the page can state the effect once instead of repeating a row per type;
   * absent for the Orb of Corruption, whose outcome is one of many.
   */
  sharedOutcome?: OrbOutcome;
}

export function isOrbRecipe(item: CatalogItem): boolean {
  return (item.Notes ?? []).some((note) => orbNotes.has(note.key));
}

function orbNoteOf(item: CatalogItem): string | undefined {
  return (item.Notes ?? []).find((note) => orbNotes.has(note.key))?.key;
}

function inputsOf(item: CatalogItem): NonNullable<CatalogItem['Inputs']> {
  return (item.Inputs ?? []).filter((input) => Boolean(input.Name?.key));
}

/**
 * The reagent is the one input code every recipe in the family shares — the orb itself.
 * Reagent codes differ per orb (`ka3`, `ooi`, `oos`, …) and are not derivable from the note,
 * so they are found rather than listed. A family of one falls back to the last input, which
 * is where the exporter puts the reagent.
 */
function reagentKeyOf(family: CatalogItem[]): string | undefined {
  const counts = new Map<string, number>();
  for (const item of family) {
    for (const key of new Set(inputsOf(item).map((input) => input.Name!.key))) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const shared = [...counts].filter(([, count]) => count === family.length).map(([key]) => key);
  if (shared.length === 1) return shared[0];

  const last = inputsOf(family[0]).at(-1)?.Name?.key;
  return shared.includes(last ?? '') ? last : shared[0] ?? last;
}

function toOutcome(item: CatalogItem): OrbOutcome | undefined {
  const output = Object.values(item.Outputs ?? {})[0];
  if (!output) return undefined;

  const lines = (output.Lines ?? []).filter((line) => line.key !== CORRUPTED_MARKER_KEY);
  const rerolls = output.Name?.key !== KEEP_NAME_KEY;

  return {
    index: String(item.Index ?? ''),
    lines,
    qualifiers: output.Qualifiers ?? [],
    rerolls,
    barren: !rerolls && lines.length === 0
  };
}

/** Two results match when they grant the same qualifiers and the same properties. */
function signatureOf(outcome: OrbOutcome): string {
  return JSON.stringify([
    outcome.qualifiers.map((qualifier) => qualifier.key),
    outcome.lines.map((line) => [line.key, line.args ?? []])
  ]);
}

function sharedOutcomeOf(targets: OrbTarget[]): OrbOutcome | undefined {
  if (!targets.every((target) => target.outcomes.length === 1)) return undefined;
  const signatures = new Set(targets.map((target) => signatureOf(target.outcomes[0])));
  return signatures.size === 1 ? targets[0].outcomes[0] : undefined;
}

/**
 * Groups every orb recipe into one entry per orb, and within it one entry per item type the
 * orb accepts — collapsing families that enumerate the same effect across a dozen item types.
 *
 * Recipes carry an `Op`/`Param`/`Value` triple whose meaning is not settled here, so no
 * probability is derived from it; outcomes are presented as the possibilities they are.
 */
export function buildOrbs(items: CatalogItem[]): Orb[] {
  const families = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const note = orbNoteOf(item);
    if (!note) continue;
    families.set(note, [...(families.get(note) ?? []), item]);
  }

  const orbs: Orb[] = [];
  for (const noteKey of orbNoteKeys) {
    const family = families.get(noteKey);
    if (!family?.length) continue;

    const reagentKey = reagentKeyOf(family);
    const reagent = family
      .flatMap(inputsOf)
      .find((input) => input.Name!.key === reagentKey)?.Name;
    if (!reagent) continue;

    const targets = new Map<string, OrbTarget>();
    for (const item of family) {
      const input = inputsOf(item).find((candidate) => candidate.Name!.key !== reagentKey);
      const outcome = toOutcome(item);
      if (!input?.Name || !outcome) continue;

      let target = targets.get(input.Name.key);
      if (!target) {
        target = { key: input.Name.key, input: input.Name, requires: [], outcomes: [] };
        targets.set(input.Name.key, target);
      }
      for (const qualifier of input.Qualifiers ?? []) {
        if (!target.requires.some((existing) => existing.key === qualifier.key)) target.requires.push(qualifier);
      }
      if (!target.outcomes.some((existing) => signatureOf(existing) === signatureOf(outcome))) {
        target.outcomes.push(outcome);
      }
    }

    const rank = (key: string) => {
      const position = targetOrder.indexOf(key);
      return position >= 0 ? position : targetOrder.length;
    };
    const list = [...targets.values()].sort((a, b) => rank(a.key) - rank(b.key));
    if (!list.length) continue;
    orbs.push({ noteKey, reagent, targets: list, sharedOutcome: sharedOutcomeOf(list) });
  }

  return orbs;
}
