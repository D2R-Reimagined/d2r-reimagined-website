# Agent Guidelines — d2r-reimagined-website

Conventions for AI agents. Humans: see `CONTRIBUTING.md`.

## Comments
- Concise, code-related; explain *why* non-obvious code exists.
- No history/conversation/change-narration comments. No per-tweak comments.
- Match surrounding file's comment frequency/style. Remove dead commentary.

## Layout
- `src/pages/**` — Aurelia pages (uniques, sets, runewords, affixes, bases, cube-recipes, grail, home).
- `src/resources/elements/**` — Custom elements (`keyed-lines`, `multi-select`, `searchable-select`, `search-area`).
- `src/resources/value-converters/**` — Value converters (`keyed-line`, `split`).
- `src/utilities/**` — Helpers: `translation-store`, `format-template`, `strip-gender-tags`, `i-keyed-line`, `ui-strings`; `*.spec.ts` Vitest specs.
- `static/data/keyed/**` — Keyed item/recipe data (no inline English).
- `static/data/strings/{lang}.json` — Per-language string maps (loaded on demand; `enUS` preloaded fallback).
- `static/data/extras/**` — Diagnostic reports (non-shipping).

## Keys / translations
- Keyed lines: `{ "key": "...", "args": [...] }` in `static/data/keyed/*.json`.
- `translation-store.ts` API: `setLanguage`, `getActiveLanguage`, `onLanguageChanged`, `lookup`, `t`, `format`.
- `format-template.ts` substitutes `%d %s %+d %0..%9`; strips color codes.
- Templates: `${line | keyedLine}` (single), `items | keyedLines` (array).
- Full contract: `src/utilities/README-keyed.md`.

## Testing
- Vitest (`vitest.config.ts`). Run: `npx vitest run`.
- Specs colocated with code.
- New keyed string/language → `translation-coverage.spec.ts` must pass.
- Bug fix → add/update a spec that failed before the fix.

## Style
- Follow existing TS/Aurelia conventions in the edited file.
- ESLint (`eslint.config.js`): no new lint errors.
- Do not reintroduce deleted `src/pages/item-jsons/*.json`; data lives in `static/data/keyed/`.
