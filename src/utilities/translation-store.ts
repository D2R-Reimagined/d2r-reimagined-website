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
//
// Warnings are *batched*: each render of e.g. the runewords/uniques pages
// can surface hundreds of missing keys, and one `console.warn` per key is
// expensive (DevTools stack capture is ~5–50 ms each). We accumulate the
// new misses for the current active language and flush them as a single
// `console.warn` on the next macrotask, which keeps the dev signal but
// removes the per-call cost from the render hot path.
const missingKeysWarned = new Set<string>();
let missingKeysPending: string[] | null = null;
let missingKeysPendingLang: LanguageCode | null = null;

function flushMissingKeyWarnings(): void {
    const keys = missingKeysPending;
    const lang = missingKeysPendingLang;
    missingKeysPending = null;
    missingKeysPendingLang = null;
    if (!keys || keys.length === 0 || lang === null) return;
    keys.sort();
    // eslint-disable-next-line no-console
    console.warn(
        `[translation-store] ${keys.length} missing key(s) in ${lang}` +
            (lang !== FALLBACK_LANGUAGE ? ` (and in ${FALLBACK_LANGUAGE})` : '') +
            `:\n  ${keys.join('\n  ')}`,
    );
}

function warnMissingKey(key: string): void {
    if (!import.meta.env.DEV) return;
    const tag = `${activeCode}:${key}`;
    if (missingKeysWarned.has(tag)) return;
    missingKeysWarned.add(tag);
    if (missingKeysPending === null || missingKeysPendingLang !== activeCode) {
        // First miss since last flush (or language switched mid-batch):
        // start a new batch and schedule one flush.
        if (missingKeysPending && missingKeysPendingLang !== null) {
            // Edge case: language changed before the previous batch flushed.
            // Emit the prior batch immediately so it is attributed to the
            // language it was collected under.
            flushMissingKeyWarnings();
        }
        missingKeysPending = [];
        missingKeysPendingLang = activeCode;
        setTimeout(flushMissingKeyWarnings, 0);
    }
    missingKeysPending.push(key);
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

    // The format() memo cache is keyed by IKeyedLine identity but produces
    // language-dependent output, so it must be discarded whenever the
    // active language changes.
    formatCache = new WeakMap<IKeyedLine, string>();

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

/**
 * Internal silent lookup used for arg-recursion paths where the input may
 * legitimately be already-rendered literal text (skill names, `classOnly`
 * strings such as `"(Necromancer Only)"`, the rendered base line that is
 * re-routed through the partial/full-set bonus wrappers, etc.). Returning
 * the input unchanged is the correct behavior in those cases — emitting a
 * "missing key" warning is not, because nothing is actually missing.
 */
function lookupSilent(key: string): string {
    if (!key) return '';
    return (
        active[key] ??
        UI_STRINGS[activeCode]?.[key] ??
        UI_STRINGS[FALLBACK_LANGUAGE]?.[key] ??
        fallback[key] ??
        key
    );
}

/**
 * Look up a translation key. Falls back to UI strings, then to enUS UI strings,
 * then to enUS data, then to the raw key. Emits a dev-only warning when the
 * key falls all the way through; use only for inputs that are *known* to be
 * translation keys (not for arg recursion, where the input may be literal text).
 */
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

/**
 * Look up a key and apply args using the D2R template formatter.
 *
 * Both the primary key and string args are resolved silently: callers across
 * the page layer pass dynamic values (item-type codes, equipment index codes,
 * dynamically-built chain entries, already-rendered skill names, etc.) where
 * a fall-through to the input is the *intended* behavior, not a bug. The
 * warning-emitting `lookup()` is reserved for inputs that are statically
 * known to be translation keys (e.g. `format()`'s hard-coded suffix keys).
 */
export function t(key: string, args: ReadonlyArray<TemplateArg> = []): string {
    const resolvedArgs = args.map((arg) => (typeof arg === 'string' ? lookupSilent(arg) : arg));
    return formatTemplate(lookupSilent(key), resolvedArgs);
}

// Memoize `format()` per IKeyedLine reference. Aurelia's `keyedLines`
// value converter re-invokes `format(line)` for every row whenever its
// input identity changes, and `format()` itself fans out into 1–6
// `lookup()` calls plus a `formatTemplate()` regex pass. On pages like
// runewords / uniques that's tens of thousands of redundant calls per
// render — the cache turns repeat invocations into a single map read.
//
// Safety: data files load IKeyedLine objects once via `JSON.parse`, so
// each row has a stable reference for the lifetime of the bundle. The
// cache is cleared inside `setLanguage` because the rendered text is
// language-dependent.
let formatCache = new WeakMap<IKeyedLine, string>();

/** Render a `IKeyedLine` (`{ key, args, perLevel?, qualifier?, itemsRequired?, fullSet? }`) directly. */
export function format(line: IKeyedLine | null | undefined): string {
    if (!line) return '';
    const cached = formatCache.get(line);
    if (cached !== undefined) return cached;

    // Resolve string-typed args first (e.g. skill names). Args may be either
    // keys (e.g. `Skill0` -> "Raise Skeleton") or already-rendered literals
    // shipped that way by the export pipeline; either is valid, so use the
    // silent lookup and let already-rendered text pass through unchanged.
    const resolvedArgs = (line.args || []).map(
        (arg) => (typeof arg === 'string' ? lookupSilent(arg) : arg),
    );

    let result = formatTemplate(lookup(line.key), resolvedArgs);

    if (line.perLevel) {
        result += lookup('strPerCharacterLevelSuffix');
    }

    if (line.qualifier) {
        const qualifierKey = {
            weapon: 'strRuneScopeWeapon',
            shield: 'strRuneScopeShield',
            armor: 'strRuneScopeArmor',
        }[line.qualifier];
        if (qualifierKey) {
            result += lookup(qualifierKey);
        }
    }

    if (line.classOnly) {
        // classOnly may be a key (`AssOnly` -> "(Assassin Only)") or already
        // be the rendered literal text. Use silent lookup so literals don't
        // generate false-positive missing-key warnings.
        result += ' ' + lookupSilent(line.classOnly);
    }

    // The partial/full-set wrappers re-feed an already-rendered string into
    // a template — bypass `t()`'s arg-recursion path so the rendered text is
    // not routed through `lookup()` (which would warn it as "missing").
    if (line.itemsRequired) {
        result = formatTemplate(lookup('strPartialSetBonus'), [result, line.itemsRequired]);
    } else if (line.fullSet) {
        result = formatTemplate(lookup('strFullSetBonus'), [result]);
    }

    formatCache.set(line, result);
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
