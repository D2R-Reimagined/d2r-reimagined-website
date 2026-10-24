import type { DropQuality, DropSource } from './drop-calculator';

/** Legacy "no maximum" value kept in state and URLs; any level at or above the exported range behaves the same. */
export const UNRESTRICTED_MAX_LEVEL = 999;
export const DEFAULT_MIN_LEVEL = 1;
export const MAGIC_FIND_LIMIT = 10000;
export const KILL_LIMIT = 100000;

export interface LevelRange { min: number; max: number }

/** Supported monster levels come from the exported sources rather than a hardcoded cap. */
export function monsterLevelRange(sources: Pick<DropSource, 'Level'>[]): LevelRange {
  let min = Infinity, max = -Infinity;
  for (const { Level } of sources) {
    if (!Number.isInteger(Level)) continue;
    if (Level < min) min = Level;
    if (Level > max) max = Level;
  }
  return Number.isFinite(min) ? { min, max } : { min: DEFAULT_MIN_LEVEL, max: UNRESTRICTED_MAX_LEVEL };
}

export type NumberCheck = { value: number; error?: undefined } | { value?: undefined; error: string };

/** Strict whole-number parsing for typed values: no clamping, no partial parses, no exponent notation. */
export function checkWholeNumber(text: string, label: string, min: number, max: number): NumberCheck {
  const trimmed = text.trim();
  const range = `from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}`;
  if (!trimmed) return { error: `Enter ${label} ${range}.` };
  if (/^[+-]?\d*\.\d+$|^[+-]?\d+\.\d*$/.test(trimmed)) return { error: `Use a whole number ${range}.` };
  if (!/^[+-]?\d+$/.test(trimmed)) return { error: `Enter a number ${range}.` };
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value) || value < min || value > max) return { error: `Use a whole number ${range}.` };
  return { value };
}

export interface DropFormText { magicFind: string; minLevel: string; maxLevel: string; kills: string }
export interface DropFormValues { magicFind: number; minLevel: number; maxLevel: number; kills: number }
export type DropFormField = keyof DropFormText;
export interface DropFormCheck {
  /** Values to calculate and share; present only for fields that are individually valid. */
  values: Partial<DropFormValues>;
  errors: Partial<Record<DropFormField, string>>;
  /** Cross-field level error, shown beside the maximum and referenced by the minimum. */
  levelRangeError?: string;
  valid: boolean;
  levelsValid: boolean;
}

/** Validates typed form text. An empty maximum means any level; inapplicable Magic Find is not validated. */
export function checkDropForm(text: DropFormText, levels: LevelRange, magicFindApplies = true): DropFormCheck {
  const values: Partial<DropFormValues> = {};
  const errors: Partial<Record<DropFormField, string>> = {};
  const record = (field: DropFormField, check: NumberCheck) => {
    if (check.error !== undefined) errors[field] = check.error; else values[field] = check.value;
  };
  if (magicFindApplies) record('magicFind', checkWholeNumber(text.magicFind, 'a Magic Find value', 0, MAGIC_FIND_LIMIT));
  record('kills', checkWholeNumber(text.kills, 'kills per monster', 1, KILL_LIMIT));
  record('minLevel', checkWholeNumber(text.minLevel, 'a minimum level', levels.min, levels.max));
  if (!text.maxLevel.trim()) values.maxLevel = UNRESTRICTED_MAX_LEVEL;
  else {
    const check = checkWholeNumber(text.maxLevel, 'a maximum level', levels.min, levels.max);
    if (check.error !== undefined) errors.maxLevel = check.error.replace(/\.$/, ', or leave it empty for any level.');
    else values.maxLevel = check.value;
  }
  let levelRangeError: string | undefined;
  if (values.minLevel !== undefined && values.maxLevel !== undefined && values.minLevel > values.maxLevel)
    levelRangeError = `Maximum level must be at least the minimum level (${values.minLevel}).`;
  const levelsValid = !errors.minLevel && !errors.maxLevel && !levelRangeError;
  return { values, errors, levelRangeError, levelsValid, valid: levelsValid && Object.keys(errors).length === 0 };
}

/** Form text for a stored maximum; the unrestricted sentinel is shown as an empty "Any level" field. */
export function maxLevelText(maxLevel: number, levels: LevelRange): string {
  return maxLevel >= UNRESTRICTED_MAX_LEVEL || maxLevel > levels.max ? '' : String(maxLevel);
}

export function describeLevelRange(minLevel: number, maxLevel: number): string {
  if (maxLevel >= UNRESTRICTED_MAX_LEVEL) return minLevel <= DEFAULT_MIN_LEVEL ? 'all monster levels' : `level ${minLevel} and above`;
  return minLevel === maxLevel ? `level ${minLevel}` : `levels ${minLevel}–${maxLevel}`;
}

/** Reducing players keeps nearby party within the new player count. */
export function partyForPlayers(party: number, players: number): number {
  return Math.max(1, Math.min(party, players));
}

/** Mirrors the calculator: Magic Find only changes unique and set quality rolls. `null` means any category. */
export function magicFindApplies(quality: DropQuality | null): boolean {
  return quality !== 'rune' && quality !== 'misc';
}

export function magicFindNote(quality: DropQuality | null): string {
  if (quality === 'rune') return 'Magic Find does not affect rune drops. Your previous value is preserved.';
  if (quality === 'misc') return 'Magic Find does not affect miscellaneous item drops. Your previous value is preserved.';
  return '';
}
