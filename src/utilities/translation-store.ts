// Active-language translation store.
//
// Loads `strings/{code}.json` (a flat key -> template map produced by the
// d2r-multi-export-tool LanguageBundleExporter), caches it, and exposes a
// `t(key, args?)` lookup plus a `format(line)` helper for `IKeyedLine` rows.
//
// Design choices:
//  - The store is intentionally a tiny module-level singleton — no DI plumbing.
//    Aurelia value converters and pages alike can `import { t, format } from
//    '../utilities/translation-store'` and stay simple.
//  - Missing keys fall back to enUS, then to the bare key (so a missing
//    translation is visibly broken instead of silently empty).
//  - Listeners can subscribe to language changes for templates that need
//    re-rendering when the user switches language.

import { formatTemplate, TemplateArg } from './format-template';
import {
    FALLBACK_LANGUAGE,
    IKeyedLine,
    LanguageCode,
    LANGUAGES,
    StringMap,
} from './i-keyed-line';
import { stripGenderTagsInPlace } from './strip-gender-tags';
import { UI_STRINGS } from './ui-strings.js';

type Listener = (code: LanguageCode) => void;

const STRINGS_BASE_URL = '/data/strings';

const cache = new Map<LanguageCode, StringMap>();
let activeCode: LanguageCode = FALLBACK_LANGUAGE;
let active: StringMap = {};
let fallback: StringMap = {};
const listeners = new Set<Listener>();

// Dev-only tracker for keys that fall through every fallback. Keyed by
// `${activeCode}:${key}` so a key that's missing in one language but added
// later in another still surfaces. Production builds tree-shake the warner
// via `import.meta.env.DEV`, so this set stays empty there.
const missingKeysWarned = new Set<string>();

function warnMissingKey(key: string): void {
    if (!import.meta.env.DEV) return;
    const tag = `${activeCode}:${key}`;
    if (missingKeysWarned.has(tag)) return;
    missingKeysWarned.add(tag);
    // eslint-disable-next-line no-console
    console.warn(
        `[translation-store] missing key "${key}" in ${activeCode}` +
            (activeCode !== FALLBACK_LANGUAGE ? ` (and in ${FALLBACK_LANGUAGE})` : ''),
    );
}

/** Returns the currently active language code. */
export function getActiveLanguage(): LanguageCode {
    return activeCode;
}

/** Subscribe to language changes. Returns an unsubscribe function. */
export function onLanguageChanged(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Load (or reuse cached) language file and make it active.
 * The fallback (enUS) is also preloaded on first call so missing keys can
 * resolve without an additional fetch.
 */
export async function setLanguage(code: LanguageCode): Promise<void> {
    if (!LANGUAGES.includes(code)) {
        throw new Error(`Unknown language code: ${code}`);
    }
    if (!cache.has(FALLBACK_LANGUAGE)) {
        cache.set(FALLBACK_LANGUAGE, await fetchStrings(FALLBACK_LANGUAGE));
    }
    fallback = cache.get(FALLBACK_LANGUAGE) ?? {};

    if (!cache.has(code)) {
        cache.set(code, await fetchStrings(code));
    }
    active = cache.get(code) ?? {};
    activeCode = code;

    // Persist choice to localStorage
    try {
        window.localStorage.setItem('language', code);
    } catch (err) {
        // Ignore storage errors (e.g. private mode)
    }

    listeners.forEach((l) => l(code));
}

/** Returns the saved language code from localStorage, or the fallback. */
export function getSavedLanguage(): LanguageCode {
    try {
        const saved = window.localStorage.getItem('language') as LanguageCode;
        if (saved && LANGUAGES.includes(saved)) {
            return saved;
        }
    } catch {
        /* ignore */
    }
    return FALLBACK_LANGUAGE;
}

/** Look up a translation key. Falls back to UI strings, then to enUS UI strings, then to enUS data, then to the raw key. */
export function lookup(key: string): string {
    if (!key) return '';
    // Bundles are pre-normalized in `fetchStrings` — gender/number tags are
    // stripped at load time, so callers always see a plain string.
    const hit =
        active[key] ??
        UI_STRINGS[activeCode]?.[key] ??
        UI_STRINGS[FALLBACK_LANGUAGE]?.[key] ??
        fallback[key];
    if (hit === undefined) {
        warnMissingKey(key);
        return key;
    }
    return hit;
}

/** Look up a key and apply args using the D2R template formatter. Strings in args are also looked up as keys. */
export function t(key: string, args: ReadonlyArray<TemplateArg> = []): string {
    const resolvedArgs = args.map((arg) => (typeof arg === 'string' ? lookup(arg) : arg));
    return formatTemplate(lookup(key), resolvedArgs);
}

/** Render a `IKeyedLine` (`{ key, args, perLevel?, qualifier?, itemsRequired?, fullSet? }`) directly. */
export function format(line: IKeyedLine | null | undefined): string {
    if (!line) return '';

    // Resolve string-typed args first (e.g. skill names)
    const resolvedArgs = (line.args || []).map((arg) => (typeof arg === 'string' ? t(arg) : arg));

    let result = t(line.key, resolvedArgs);

    if (line.perLevel) {
        result += t('strPerCharacterLevelSuffix');
    }

    if (line.qualifier) {
        const qualifierKey = {
            weapon: 'strRuneScopeWeapon',
            shield: 'strRuneScopeShield',
            armor: 'strRuneScopeArmor',
        }[line.qualifier];
        if (qualifierKey) {
            result += t(qualifierKey);
        }
    }

    if (line.classOnly) {
        result += ' ' + lookup(line.classOnly);
    }

    if (line.itemsRequired) {
        result = t('strPartialSetBonus', [result, line.itemsRequired]);
    } else if (line.fullSet) {
        result = t('strFullSetBonus', [result]);
    }

    return result;
}

async function fetchStrings(code: LanguageCode): Promise<StringMap> {
    const url = `${STRINGS_BASE_URL}/${code}.json`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.warn(`[translation-store] ${url} -> ${res.status}; using empty map`);
            return {};
        }
        const map = (await res.json()) as StringMap;
        // Collapse [ms]/[fs]/[pl]/... variants once per language so every
        // downstream `lookup` is a plain map read.
        stripGenderTagsInPlace(map);
        return map;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[translation-store] failed to load ${url}:`, err);
        return {};
    }
}
