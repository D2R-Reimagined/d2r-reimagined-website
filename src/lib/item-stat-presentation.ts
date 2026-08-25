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

function valueOf(stat: SaveStat, bundle: ItemStatPresentationBundle): number {
  const shift = bundle.Stats[stat.name]?.ValueShift ?? 0;
  return rounded(stat.value / 2 ** shift);
}

function fallback(stat: SaveStat, bundle: ItemStatPresentationBundle): string {
  const layer = stat.layer ? ` (${words('layer')} ${stat.layer})` : '';
  const value = valueOf(stat, bundle);
  return `${words(stat.name)}${layer}: ${value > 0 ? '+' : ''}${value}`;
}

function keyedLine(stat: SaveStat, bundle: ItemStatPresentationBundle): DisplayStatLine | null {
  const metadata = bundle.Stats[stat.name];
  if (!metadata) return { fallback: fallback(stat, bundle) };

  const value = valueOf(stat, bundle);
  const key = value < 0 && metadata.NegativeKey ? metadata.NegativeKey : metadata.PositiveKey;
  if (!key) return null;

  let displayValue = value;
  if (metadata.Function === 5) displayValue = rounded(displayValue * 100 / 128);
  if (metadata.Function === 20) displayValue *= -1;
  return {
    keyed: { key, args: metadata.Function === 3 ? [] : [displayValue] },
    fallback: fallback(stat, bundle)
  };
}

function skillLine(stat: SaveStat, bundle: ItemStatPresentationBundle): DisplayStatLine | null {
  const skill = bundle.Skills[String(stat.layer)];
  if (!skill) return null;
  const args: Array<string | number> = [valueOf(stat, bundle), skill.NameKey];
  if (skill.ClassOnlyKey) args.push(skill.ClassOnlyKey);
  return {
    keyed: { key: skill.LineKey, args },
    fallback: `+${valueOf(stat, bundle)} to ${skill.FallbackName}${skill.ClassOnlyKey ? ' (Class Only)' : ''}`
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

function eventSkillLine(stat: SaveStat, bundle: ItemStatPresentationBundle): DisplayStatLine | null {
  const metadata = bundle.Stats[stat.name];
  const key = metadata?.PositiveKey;
  if (!key) return null;

  const skillId = stat.layer & 0x1ff;
  const level = stat.layer >> 9;
  const skill = bundle.Skills[String(skillId)];
  if (!skill) return keyedLine(stat, bundle);
  return {
    keyed: { key, args: [valueOf(stat, bundle), level, skill.NameKey] },
    fallback: `${valueOf(stat, bundle)}% chance to cast level ${level} ${skill.FallbackName}`
  };
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
  bundle: ItemStatPresentationBundle
): DisplayStatLine[] {
  const consumed = new Set<number>();
  const replacements = new Map<number, DisplayStatLine>();

  for (const [minimumName, maximumName, compositeName] of damagePairs) {
    const minimumIndex = stats.findIndex((stat, index) => !consumed.has(index) && stat.name === minimumName);
    const maximumIndex = stats.findIndex((stat, index) => !consumed.has(index) && stat.name === maximumName);
    const key = bundle.CompositeKeys[compositeName];
    if (minimumIndex < 0 || maximumIndex < 0 || !key) continue;
    consumed.add(minimumIndex);
    consumed.add(maximumIndex);
    const minimum = valueOf(stats[minimumIndex], bundle);
    const maximum = valueOf(stats[maximumIndex], bundle);
    replacements.set(Math.min(minimumIndex, maximumIndex), {
      keyed: { key, args: [minimum, maximum] },
      fallback: `Adds ${minimum}-${maximum} Damage`
    });
  }

  const poisonMinimumIndex = stats.findIndex((stat) => stat.name === 'poisonmindam');
  const poisonMaximumIndex = stats.findIndex((stat) => stat.name === 'poisonmaxdam');
  const poisonLengthIndex = stats.findIndex((stat) => stat.name === 'poisonlength');
  const poisonKey = bundle.CompositeKeys.PoisonDamage;
  if (poisonMinimumIndex >= 0 && poisonMaximumIndex >= 0 && poisonLengthIndex >= 0 && poisonKey) {
    consumed.add(poisonMinimumIndex);
    consumed.add(poisonMaximumIndex);
    consumed.add(poisonLengthIndex);
    const frames = valueOf(stats[poisonLengthIndex], bundle);
    const minimum = Math.ceil(valueOf(stats[poisonMinimumIndex], bundle) * frames / 256);
    const maximum = Math.ceil(valueOf(stats[poisonMaximumIndex], bundle) * frames / 256);
    const seconds = rounded(frames / 25);
    replacements.set(Math.min(poisonMinimumIndex, poisonMaximumIndex, poisonLengthIndex), {
      keyed: { key: poisonKey, args: [minimum, maximum, seconds] },
      fallback: `Adds ${minimum}-${maximum} Poison Damage over ${seconds} seconds`
    });
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
      ? skillLine(stat, bundle)
      : bundle.Stats[stat.name]?.Function === 15
        ? eventSkillLine(stat, bundle)
        : keyedLine(stat, bundle);
    if (line) lines.push(line);
  }
  return lines;
}
