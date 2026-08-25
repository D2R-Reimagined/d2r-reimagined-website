import { derived, get, writable } from 'svelte/store';

import { countNumericSlots, formatTemplate, type TemplateArg } from '../utilities/format-template';
import { stripGenderTagsInPlace } from '../utilities/strip-gender-tags';
import { UI_STRINGS } from '../utilities/ui-strings';
import type { KeyedLine, SkillDescriptionLine } from './types';

export const languages = [
  { code: 'enUS', name: 'English' },
  { code: 'zhTW', name: '繁體中文' },
  { code: 'deDE', name: 'Deutsch' },
  { code: 'esES', name: 'Español' },
  { code: 'frFR', name: 'Français' },
  { code: 'itIT', name: 'Italiano' },
  { code: 'koKR', name: '한국어' },
  { code: 'plPL', name: 'Polski' },
  { code: 'esMX', name: 'Español (AL)' },
  { code: 'jaJP', name: '日本語' },
  { code: 'ptBR', name: 'Português' },
  { code: 'ruRU', name: 'Русский' },
  { code: 'zhCN', name: '简体中文' }
] as const;

export type LanguageCode = (typeof languages)[number]['code'];
type StringMap = Record<string, string>;

interface I18nState {
  code: LanguageCode;
  active: StringMap;
  fallback: StringMap;
}

const state = writable<I18nState>({ code: 'enUS', active: {}, fallback: {} });
const cache = new Map<LanguageCode, StringMap>();

function normalize(input: StringMap): StringMap {
  const copy = { ...input };
  stripGenderTagsInPlace(copy);
  return copy;
}

export function initializeI18n(fallback: StringMap): void {
  const normalized = normalize(fallback);
  cache.set('enUS', normalized);
  state.set({ code: 'enUS', active: normalized, fallback: normalized });
}

function lookup(s: I18nState, key: string): string {
  if (!key) return '';
  return s.active[key]
    ?? UI_STRINGS[s.code]?.[key]
    ?? UI_STRINGS.enUS?.[key]
    ?? s.fallback[key]
    ?? key;
}

function prepareSpecial(key: string, template: string, args: ReadonlyArray<TemplateArg>) {
  // healperhit is a label-only synthetic string in every exported language,
  // while its keyed catalog line still carries the numeric min/max pair.
  // Give the shared formatter one numeric slot so it can render that range
  // without replacing or hard-coding the localized label.
  if (key === 'healperhit' && args.length > 0) {
    return { template: `%d ${template}`, args };
  }

  if (key !== 'strSkillRandomFromSkillClass' || args.length < 2) return { template, args };
  const [min, max, ...rest] = args;
  const numeric = typeof min === 'number' && typeof max === 'number'
    ? Math.trunc(min) === Math.trunc(max) ? String(Math.trunc(min)) : `${Math.trunc(min)}-${Math.trunc(max)}`
    : min;
  return {
    template: rest.length < 2 ? template.replace(/\s*%s\s*$/, '') : template,
    args: [numeric, ...rest]
  };
}

function makeTools(s: I18nState) {
  const t = (key: string | number | undefined | null, args: ReadonlyArray<TemplateArg> = []): string => {
    const stringKey = String(key ?? '');
    const resolvedArgs = args.map((arg) => typeof arg === 'string' ? lookup(s, arg) : arg);
    const prepared = prepareSpecial(stringKey, lookup(s, stringKey), resolvedArgs);
    return formatTemplate(prepared.template, prepared.args);
  };

  const line = (value: KeyedLine | undefined | null): string => {
    if (!value) return '';
    const resolvedArgs = (value.args ?? []).map((arg) => typeof arg === 'string' ? lookup(s, arg) : arg);
    const prepared = prepareSpecial(value.key, lookup(s, value.key), resolvedArgs);
    let result = formatTemplate(prepared.template, prepared.args);
    if (value.perLevel) result += lookup(s, 'strPerCharacterLevelSuffix');
    if (value.qualifier) {
      const suffix = {
        weapon: 'strRuneScopeWeapon',
        shield: 'strRuneScopeShield',
        armor: 'strRuneScopeArmor'
      }[value.qualifier];
      result += lookup(s, suffix);
    }
    if (value.classOnly) result += ` ${lookup(s, value.classOnly)}`;
    if (value.itemsRequired) result = formatTemplate(lookup(s, 'strPartialSetBonus'), [result, value.itemsRequired]);
    else if (value.fullSet) result = formatTemplate(lookup(s, 'strFullSetBonus'), [result]);
    return result;
  };

  // A skill line is a template plus one value table per numeric argument. The exporter
  // trims each table's constant tail, so reading past the end means "it stopped scaling".
  const skillLine = (value: SkillDescriptionLine | undefined | null, level: number): string => {
    if (!value) return '';
    const numbers = (value.values ?? []).map(
      (table) => table[Math.min(Math.max(level, 1) - 1, table.length - 1)]
    );
    const key = value.pluralKey && numbers[0] !== 1 ? value.pluralKey : value.key;
    const template = lookup(s, key);
    const strings = (value.args ?? []).map((arg) => lookup(s, arg));
    // A few templates carry fewer slots than the game's data supplies — usually because
    // the mod's second line was lost upstream ("Defense: %d" for a def-and-AR pair). Pass
    // only what the template can place; otherwise formatTemplate reads the surplus as a
    // min-max range and prints "Defense: 25-35" for two unrelated numbers.
    const slots = countNumericSlots(template, strings.length);
    return formatTemplate(template, [...strings, ...numbers.slice(0, slots)]);
  };

  return { code: s.code, t, line, skillLine };
}

export const i18n = derived(state, makeTools);

export async function setLanguage(code: LanguageCode): Promise<void> {
  let strings = cache.get(code);
  if (!strings) {
    const response = await fetch(`/data/strings/${code}.json`);
    if (!response.ok) throw new Error(`Unable to load ${code}`);
    strings = normalize(await response.json() as StringMap);
    cache.set(code, strings);
  }
  const fallback = cache.get('enUS') ?? get(state).fallback;
  state.set({ code, active: strings, fallback });
  try { localStorage.setItem('language', code); } catch { /* storage is optional */ }
}

export async function restoreSavedLanguage(): Promise<void> {
  try {
    const saved = localStorage.getItem('language') as LanguageCode | null;
    if (saved && languages.some((language) => language.code === saved) && saved !== 'enUS') {
      await setLanguage(saved);
    }
  } catch { /* storage is optional */ }
}
