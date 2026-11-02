import {
  classSkillLines,
  isHiddenItemSkill,
  skillTabClassOnlyKeys,
  skillTabStringIds,
  type ItemStatPresentationBundle
} from '#lib/item-stat-presentation.js';
import type {
  TradePropertyFilterGroup,
  TradePropertyGroupType
} from '#lib/trades.js';

export interface TradePropertyFilterDraft {
  id: number;
  query: string;
  stat: string;
  layer?: number;
  stats?: string[];
  minimumValue: string;
  maximumValue: string;
  valueShift: number;
  valueFunction?: number;
}

export interface TradePropertyGroupDraft {
  id: number;
  type: TradePropertyGroupType;
  minimumCount: string;
  maximumCount: string;
  filters: TradePropertyFilterDraft[];
}

export interface TradePropertyDefinition {
  stat: string;
  layer?: number;
  /** Real stats behind a mod the game stores separately, such as all resistances. */
  stats?: string[];
  labelKey: string;
  labelArgs?: string[];
  classOnly?: string;
  /** Tells apart options whose translated labels collide. Defaults to the stat name. */
  hint?: string;
  valueShift: number;
  valueFunction?: number;
}

export interface TradePropertyOption extends TradePropertyDefinition {
  id: string;
  label: string;
  aliases: string[];
  labelWords: string[];
  statWords: string[];
  searchText: string;
  variant: boolean;
}

// Common trade shorthand. Variants sharing a label key (per level, over time) inherit these.
const statAliases: Record<string, string[]> = {
  item_fastercastrate: ['fcr'],
  item_fastergethitrate: ['fhr'],
  item_fastermovevelocity: ['frw'],
  item_fasterblockrate: ['fbr'],
  item_fasterattackrate: ['ias'],
  item_magicbonus: ['mf', 'magic find'],
  item_goldbonus: ['gf', 'gold find'],
  item_armor_percent: ['ed'],
  damagepercent: ['ed'],
  item_maxdamage_percent: ['ed'],
  tohit: ['ar'],
  item_tohit_percent: ['ar'],
  maxhp: ['hp'],
  item_maxhp_percent: ['hp'],
  lifedrainmindam: ['ll', 'life leech'],
  manadrainmindam: ['ml', 'mana leech'],
  item_crushingblow: ['cb'],
  item_deadlystrike: ['ds'],
  item_openwounds: ['ow'],
  item_cannotbefrozen: ['cbf'],
  damageresist: ['dr', 'pdr'],
  item_ignoretargetac: ['itd']
};

const variantSuffixes: ReadonlyArray<readonly [RegExp, string]> = [
  [/_perlevel$/i, 'Per Level'],
  [/_bytime$/i, 'Over Time']
];

// Omitted from the flat stat pass: layered stats are expanded per class, tab, skill or aura,
// item_nonclassskill_display mirrors item_nonclassskill, and charm_weight is not a trade filter.
const excludedStats = new Set([
  'charm_weight',
  'item_addclassskills',
  'item_addskill_tab',
  'item_aura',
  'item_nonclassskill_display',
  'item_singleskill'
]);

// The skill export does not mark auras, so these are the Paladin aura skill ids item lines use.
const itemAuraSkillIds = [
  98, 99, 100, 102, 103, 104, 105, 108, 109, 113, 114, 115, 118, 119, 120, 122, 123, 124, 125
];

const compoundProperties = [
  {
    stat: 'all_resistances',
    labelKey: 'strModAllResistances',
    stats: ['fireresist', 'lightresist', 'coldresist', 'poisonresist']
  },
  {
    stat: 'all_maximum_resistances',
    labelKey: 'ModStrAllMaxRes',
    stats: ['maxfireresist', 'maxlightresist', 'maxcoldresist', 'maxpoisonresist']
  },
  {
    stat: 'all_attributes',
    labelKey: 'Moditem2allattrib',
    stats: ['strength', 'energy', 'dexterity', 'vitality']
  }
];

let nextDraftId = 0;

export function createTradePropertyFilter(): TradePropertyFilterDraft {
  return {
    id: ++nextDraftId,
    query: '',
    stat: '',
    minimumValue: '',
    maximumValue: '',
    valueShift: 0
  };
}

export function createTradePropertyGroup(
  type: TradePropertyGroupType = 'And'
): TradePropertyGroupDraft {
  return {
    id: ++nextDraftId,
    type,
    minimumCount: '1',
    maximumCount: '',
    filters: [createTradePropertyFilter()]
  };
}

export function activeTradePropertyCount(groups: TradePropertyGroupDraft[]): number {
  return groups.reduce(
    (count, group) => count + group.filters.filter((filter) => filter.stat).length,
    0
  );
}

export function compoundTradePropertyOutsideAnd(groups: TradePropertyGroupDraft[]): boolean {
  return groups.some((group) => group.type !== 'And'
    && group.filters.some((filter) => filter.stats?.length));
}

export function invalidTradePropertyQuery(groups: TradePropertyGroupDraft[]): boolean {
  return groups.some((group) => group.filters.some(
    (filter) => filter.query.trim().length > 0 && !filter.stat
  ));
}

export function toTradePropertyFilterGroups(
  groups: TradePropertyGroupDraft[]
): TradePropertyFilterGroup[] {
  return groups.flatMap((group) => {
    const filters = group.filters
      .filter((filter) => filter.stat)
      .flatMap((filter) => (filter.stats ?? [filter.stat]).map((stat) => ({
        stat,
        layer: filter.layer,
        minimumValue: optionalNumber(filter.minimumValue),
        maximumValue: optionalNumber(filter.maximumValue),
        valueShift: filter.valueShift,
        valueFunction: filter.valueFunction
      })));
    if (!filters.length) return [];

    return [{
      type: group.type,
      minimumCount: group.type === 'Count' ? optionalNumber(group.minimumCount) : undefined,
      maximumCount: group.type === 'Count' ? optionalNumber(group.maximumCount) : undefined,
      filters
    }];
  });
}

export function tradePropertyStatName(stat: string): string {
  return stat
    .replace(/^item_/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function tradePropertyDefinitions(
  bundle: ItemStatPresentationBundle
): TradePropertyDefinition[] {
  const metadata = (stat: string) => ({
    valueShift: bundle.Stats[stat]?.ValueShift ?? 0,
    valueFunction: bundle.Stats[stat]?.Function
  });
  const auraIds = new Set(itemAuraSkillIds);
  const oskillKey = bundle.Stats.item_nonclassskill_display?.PositiveKey;
  const auraKey = bundle.Stats.item_aura?.PositiveKey;

  return [
    ...Object.entries(bundle.Stats)
      .filter(([stat, entry]) => Boolean(entry.PositiveKey) && !excludedStats.has(stat))
      .map(([stat, entry]) => ({
        stat,
        labelKey: entry.PositiveKey!,
        valueShift: entry.ValueShift ?? 0,
        valueFunction: entry.Function
      })),
    ...compoundProperties.map((property) => ({ ...property, valueShift: 0, valueFunction: 19 })),
    ...classSkillLines.map((line, layer) => ({
      stat: 'item_addclassskills',
      layer,
      labelKey: line.key,
      ...metadata('item_addclassskills')
    })),
    ...skillTabStringIds.flatMap((pages, classIndex) => pages.map((stringId, page) => ({
      stat: 'item_addskill_tab',
      layer: classIndex * 8 + page,
      labelKey: `StrSklTabItem${stringId}`,
      classOnly: skillTabClassOnlyKeys[classIndex],
      ...metadata('item_addskill_tab')
    }))),
    ...uniquePlayerSkills(bundle).flatMap(({ id, skill }) => {
      const nameKey = skill.NameKey!;
      return [
        ...(skill.ClassOnlyKey ? [{
          stat: 'item_singleskill',
          layer: id,
          labelKey: skill.LineKey,
          labelArgs: ['#', nameKey, skill.ClassOnlyKey],
          hint: skill.FallbackName,
          ...metadata('item_singleskill')
        }] : []),
        ...(oskillKey ? [{
          stat: 'item_nonclassskill',
          layer: id,
          labelKey: oskillKey,
          labelArgs: ['#', nameKey],
          hint: skill.FallbackName,
          ...metadata('item_nonclassskill')
        }] : []),
        ...(auraKey && auraIds.has(id) ? [{
          stat: 'item_aura',
          layer: id,
          labelKey: auraKey,
          labelArgs: ['#', nameKey],
          hint: skill.FallbackName,
          ...metadata('item_aura')
        }] : [])
      ];
    })
  ];
}

// Monster copies repeat player skill names under other ids. A filter holds one layer, so
// each name resolves to its class skill when it has one, otherwise to its lowest id.
function uniquePlayerSkills(bundle: ItemStatPresentationBundle) {
  const skills = Object.entries(bundle.Skills)
    .map(([id, skill]) => ({ id: Number(id), skill }))
    .filter(({ id, skill }) => Boolean(skill.NameKey) && !isHiddenItemSkill(id, bundle))
    .sort((left, right) =>
      Number(Boolean(right.skill.ClassOnlyKey)) - Number(Boolean(left.skill.ClassOnlyKey))
      || left.id - right.id);
  const seen = new Set<string>();
  return skills.filter(({ skill }) => {
    if (seen.has(skill.FallbackName)) return false;
    seen.add(skill.FallbackName);
    return true;
  });
}

export function buildTradePropertyOptions(
  definitions: TradePropertyDefinition[],
  translate: (definition: TradePropertyDefinition) => string
): TradePropertyOption[] {
  const aliasesByKey = new Map<string, Set<string>>();
  for (const definition of definitions) {
    const aliases = statAliases[definition.stat];
    if (!aliases) continue;
    const known = aliasesByKey.get(definition.labelKey) ?? new Set<string>();
    for (const alias of aliases) known.add(alias);
    aliasesByKey.set(definition.labelKey, known);
  }

  const qualified = definitions.map((definition) => {
    const suffix = variantSuffixes.find(([pattern]) => pattern.test(definition.stat))?.[1];
    const translated = translate(definition);
    return {
      definition,
      variant: Boolean(suffix),
      label: suffix ? `${translated} · ${suffix}` : translated
    };
  });
  const counts = new Map<string, number>();
  for (const { label } of qualified) {
    const key = label.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return qualified
    .map(({ definition, variant, label }) => {
      const statName = tradePropertyStatName(definition.stat);
      const uniqueLabel = counts.get(label.toLowerCase()) === 1
        ? label
        : `${label} · ${definition.hint ?? statName}`;
      const aliases = [...(aliasesByKey.get(definition.labelKey) ?? [])].map(normalizeSearchText);
      const labelWords = searchWords(uniqueLabel);
      const statWords = searchWords(statName);
      return {
        ...definition,
        id: `${definition.stat}:${definition.layer ?? ''}`,
        label: uniqueLabel,
        aliases,
        labelWords,
        statWords,
        searchText: [...labelWords, ...statWords, ...aliases].join(' '),
        variant
      };
    })
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function searchTradePropertyOptions(
  options: TradePropertyOption[],
  query: string,
  limit = Infinity
): TradePropertyOption[] {
  const tokens = searchTokens(query);
  if (!tokens.length) return options.slice(0, limit);

  const phrase = tokens.join(' ');
  return options
    .flatMap((option) => {
      const score = matchScore(option, tokens, phrase);
      return score === undefined ? [] : [{ option, score }];
    })
    .sort((left, right) =>
      left.score - right.score
      || Number(left.option.variant) - Number(right.option.variant)
      || left.option.label.length - right.option.label.length
      || left.option.label.localeCompare(right.option.label))
    .slice(0, limit)
    .map(({ option }) => option);
}

/** The option a typed value unambiguously names: its label, its shorthand, or its only match. */
export function resolveTradePropertyOption(
  options: TradePropertyOption[],
  query: string
): TradePropertyOption | undefined {
  const label = query.trim().toLowerCase();
  const exact = options.find((option) => option.label.toLowerCase() === label);
  const tokens = searchTokens(query);
  if (exact || !tokens.length) return exact;

  const phrase = tokens.join(' ');
  const shorthand = options.filter((option) => !option.variant && option.aliases.includes(phrase));
  if (shorthand.length) return shorthand.length === 1 ? shorthand[0] : undefined;

  const matches = searchTradePropertyOptions(options, query, 2);
  return matches.length === 1 ? matches[0] : undefined;
}

function matchScore(
  option: TradePropertyOption,
  tokens: string[],
  phrase: string
): number | undefined {
  if (option.aliases.includes(phrase)) return 0;
  let total = 1;
  for (const token of tokens) {
    const score = tokenScore(option, token);
    if (score === undefined) return undefined;
    total += score;
  }
  return total;
}

function tokenScore(option: TradePropertyOption, token: string): number | undefined {
  if (option.labelWords.includes(token)) return 0;
  if (option.labelWords.some((word) => word.startsWith(token))) return 1;
  if (option.statWords.some((word) => word.startsWith(token))) return 2;
  return option.searchText.includes(token) ? 3 : undefined;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function searchWords(value: string): string[] {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

// Numbers are dropped so a pasted item line such as "+20% Faster Cast Rate" still matches.
function searchTokens(query: string): string[] {
  return searchWords(query).filter((token) => !/^\d+$/.test(token));
}

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
