import type { SaveStat } from '$lib/characters';
import type { KeyedLine } from '$lib/types';

export interface ItemStatPresentation {
  Priority?: number;
  Function?: number;
  ValueMode?: number;
  PositiveKey?: string;
  NegativeKey?: string;
  SecondaryKey?: string;
  ValueShift: number;
}

export interface ItemStatSkillPresentation {
  NameKey: string;
  FallbackName: string;
  LineKey: string;
  ClassOnlyKey?: string;
}

export interface ItemStatPresentationBundle {
  Stats: Record<string, ItemStatPresentation>;
  Skills: Record<string, ItemStatSkillPresentation>;
  CompositeKeys: Record<string, string>;
}

export interface DisplayStatLine {
  keyed?: KeyedLine;
  fallback: string;
  priority?: number;
  tone?: 'magic' | 'enchantment' | 'corrupted' | 'flavor';
}

export interface ItemStatDisplayContext {
  characterLevel?: number;
}

const hiddenSkillIds = new Set([449]);
const hiddenSkillNameKeys = new Set(['charmweight1']);
const hiddenStatNames = new Set(['charm_weight']);

let presentationPromise: Promise<ItemStatPresentationBundle> | undefined;

export function loadItemStatPresentation(): Promise<ItemStatPresentationBundle> {
  presentationPromise ??= fetch('/data/keyed/item-stat-presentation.json').then(async (response) => {
    if (!response.ok) throw new Error(`Unable to load item stat presentation data (${response.status})`);
    return await response.json() as ItemStatPresentationBundle;
  });
  return presentationPromise;
}

function words(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function rounded(value: number): number {
  return Math.round(value * 100) / 100;
}

function isPerLevel(stat: SaveStat): boolean {
  return stat.name.toLowerCase().endsWith('_perlevel');
}

function valueOf(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): number {
  const shift = bundle.Stats[stat.name]?.ValueShift ?? 0;
  let value = stat.value / 2 ** shift;
  if (isPerLevel(stat)) {
    value /= 4;
    if (context.characterLevel) value *= context.characterLevel;
  }
  return rounded(value);
}

function fallback(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): string {
  const layer = stat.layer ? ` (${words('layer')} ${stat.layer})` : '';
  const value = valueOf(stat, bundle, context);
  const suffix = isPerLevel(stat) ? ' (Based on Character Level)' : '';
  return `${words(stat.name)}${layer}: ${value > 0 ? '+' : ''}${value}${suffix}`;
}

function keyedLine(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): DisplayStatLine | null {
  const metadata = bundle.Stats[stat.name];
  if (!metadata) return { fallback: fallback(stat, bundle, context) };

  const value = valueOf(stat, bundle, context);
  const key = value < 0 && metadata.NegativeKey ? metadata.NegativeKey : metadata.PositiveKey;
  if (!key) return null;

  let displayValue = value;
  if (metadata.Function === 5) displayValue = rounded(displayValue * 100 / 128);
  if (metadata.Function === 20) displayValue *= -1;
  const perLevel = isPerLevel(stat);
  return {
    keyed: {
      key,
      args: metadata.Function === 3 ? [] : [displayValue],
      ...(perLevel ? { perLevel: true } : {})
    },
    fallback: fallback(stat, bundle, context)
  };
}

function skillLine(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): DisplayStatLine | null {
  const skill = bundle.Skills[String(stat.layer)];
  if (!skill) return null;
  const args: Array<string | number> = [valueOf(stat, bundle, context), skill.NameKey];
  if (skill.ClassOnlyKey) args.push(skill.ClassOnlyKey);
  return {
    keyed: { key: skill.LineKey, args },
    fallback: `+${valueOf(stat, bundle, context)} to ${skill.FallbackName}${skill.ClassOnlyKey ? ' (Class Only)' : ''}`
  };
}

function displayedSkillLine(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): DisplayStatLine | null {
  const metadata = bundle.Stats[stat.name];
  const key = metadata?.PositiveKey;
  const skill = bundle.Skills[String(stat.layer)];
  if (!key || !skill) return keyedLine(stat, bundle, context);

  const value = valueOf(stat, bundle, context);
  const aura = metadata.Function === 16;
  return {
    keyed: { key, args: [value, skill.NameKey] },
    fallback: aura
      ? `Level ${value} ${skill.FallbackName} Aura When Equipped`
      : `+${value} to ${skill.FallbackName} (oskill)`
  };
}

export function isHiddenItemStat(
  stat: SaveStat,
  bundle?: ItemStatPresentationBundle
): boolean {
  if (hiddenStatNames.has(stat.name)) return true;
  if (stat.name !== 'item_nonclassskill' && stat.name !== 'item_singleskill') return false;
  const skill = bundle?.Skills[String(stat.layer)];
  return hiddenSkillIds.has(stat.layer) || hiddenSkillNameKeys.has(skill?.NameKey.toLowerCase() ?? '');
}

function eventSkillLine(
  stat: SaveStat,
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext
): DisplayStatLine | null {
  const metadata = bundle.Stats[stat.name];
  const key = metadata?.PositiveKey;
  if (!key) return null;

  const skillId = stat.layer & 0x1ff;
  const level = stat.layer >> 9;
  const skill = bundle.Skills[String(skillId)];
  if (!skill) return keyedLine(stat, bundle, context);
  return {
    keyed: { key, args: [valueOf(stat, bundle, context), level, skill.NameKey] },
    fallback: `${valueOf(stat, bundle, context)}% chance to cast level ${level} ${skill.FallbackName}`
  };
}

function decorate(
  line: DisplayStatLine,
  stat: SaveStat,
  bundle: ItemStatPresentationBundle
): DisplayStatLine {
  const metadata = bundle.Stats[stat.name];
  const key = metadata?.PositiveKey ?? metadata?.NegativeKey;
  const tone = stat.name.startsWith('upgrade_')
    ? 'enchantment'
    : stat.name === 'item_corrupted'
      ? 'corrupted'
      : key === 'uber_mod'
        ? 'flavor'
        : 'magic';
  return { ...line, priority: metadata?.Priority ?? 0, tone };
}

const damagePairs = [
  ['mindamage', 'maxdamage', 'PhysicalDamage'],
  ['firemindam', 'firemaxdam', 'FireDamage'],
  ['coldmindam', 'coldmaxdam', 'ColdDamage'],
  ['lightmindam', 'lightmaxdam', 'LightningDamage'],
  ['magicmindam', 'magicmaxdam', 'MagicDamage']
] as const;

export function displayStatLines(
  stats: SaveStat[],
  bundle: ItemStatPresentationBundle,
  context: ItemStatDisplayContext = {}
): DisplayStatLine[] {
  const consumed = new Set<number>();
  const replacements = new Map<number, DisplayStatLine>();

  // Reimagined pairs the real item_nonclassskill record with a descfunc 28 display-only
  // record. Render the latter with its skill layer and suppress only the matching hidden
  // backing stat, otherwise the tooltip shows the same oskill twice (once as class-only).
  stats.forEach((stat, index) => {
    if (stat.name !== 'item_nonclassskill_display') return;
    const backingIndex = stats.findIndex((candidate, candidateIndex) =>
      candidateIndex !== index
      && candidate.name === 'item_nonclassskill'
      && candidate.layer === stat.layer
      && candidate.value === stat.value);
    if (backingIndex >= 0) consumed.add(backingIndex);
  });

  for (const [minimumName, maximumName, compositeName] of damagePairs) {
    const minimumIndex = stats.findIndex((stat, index) => !consumed.has(index) && stat.name === minimumName);
    const maximumIndex = stats.findIndex((stat, index) => !consumed.has(index) && stat.name === maximumName);
    const key = bundle.CompositeKeys[compositeName];
    if (minimumIndex < 0 || maximumIndex < 0 || !key) continue;
    consumed.add(minimumIndex);
    consumed.add(maximumIndex);
    const minimum = valueOf(stats[minimumIndex], bundle, context);
    const maximum = valueOf(stats[maximumIndex], bundle, context);
    const sourceIndex = (bundle.Stats[stats[minimumIndex].name]?.Priority ?? 0)
      >= (bundle.Stats[stats[maximumIndex].name]?.Priority ?? 0)
      ? minimumIndex
      : maximumIndex;
    replacements.set(Math.min(minimumIndex, maximumIndex), decorate({
      keyed: { key, args: [minimum, maximum] },
      fallback: `Adds ${minimum}-${maximum} Damage`
    }, stats[sourceIndex], bundle));
  }

  const poisonMinimumIndex = stats.findIndex((stat) => stat.name === 'poisonmindam');
  const poisonMaximumIndex = stats.findIndex((stat) => stat.name === 'poisonmaxdam');
  const poisonLengthIndex = stats.findIndex((stat) => stat.name === 'poisonlength');
  const poisonKey = bundle.CompositeKeys.PoisonDamage;
  if (poisonMinimumIndex >= 0 && poisonMaximumIndex >= 0 && poisonLengthIndex >= 0 && poisonKey) {
    consumed.add(poisonMinimumIndex);
    consumed.add(poisonMaximumIndex);
    consumed.add(poisonLengthIndex);
    const frames = valueOf(stats[poisonLengthIndex], bundle, context);
    const minimum = Math.ceil(valueOf(stats[poisonMinimumIndex], bundle, context) * frames / 256);
    const maximum = Math.ceil(valueOf(stats[poisonMaximumIndex], bundle, context) * frames / 256);
    const seconds = rounded(frames / 25);
    replacements.set(Math.min(poisonMinimumIndex, poisonMaximumIndex, poisonLengthIndex), decorate({
      keyed: { key: poisonKey, args: [minimum, maximum, seconds] },
      fallback: `Adds ${minimum}-${maximum} Poison Damage over ${seconds} seconds`
    }, stats[poisonMinimumIndex], bundle));
  }

  const lines: DisplayStatLine[] = [];
  for (let index = 0; index < stats.length; index += 1) {
    const replacement = replacements.get(index);
    if (replacement) lines.push(replacement);
    if (consumed.has(index)) continue;

    const stat = stats[index];
    if (isHiddenItemStat(stat, bundle)) continue;
    if (stat.name === 'poison_count') continue;
    const line = stat.name === 'item_nonclassskill' || stat.name === 'item_singleskill'
      ? skillLine(stat, bundle, context)
      : bundle.Stats[stat.name]?.Function === 16 || bundle.Stats[stat.name]?.Function === 28
        ? displayedSkillLine(stat, bundle, context)
      : bundle.Stats[stat.name]?.Function === 15
        ? eventSkillLine(stat, bundle, context)
        : keyedLine(stat, bundle, context);
    if (line) lines.push(decorate(line, stat, bundle));
  }
  return lines.sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));
}
