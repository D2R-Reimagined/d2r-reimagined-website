# Contributing to d2r-reimagined-website

Welcome! This document captures conventions for human contributors. AI agents
should read `AGENTS.MD` instead (it is a condensed version of the same rules).
Read this before making changes.

## Commenting policy (important)

Keep code comments **concise and strictly code-related**.

- Do **not** leave long stream-of-consciousness comments.
- Do **not** narrate the history of the change, the user's request, prior
  attempts, or the conversation that led to the edit.
- Do **not** add a comment for every tweak that was requested — comment only
  when the code itself is non-obvious.
- Prefer a short note explaining *why* non-obvious code exists, not *what* it
  does line-by-line.
- Match the existing comment frequency and style of the surrounding file.
- Remove dead/explanatory commentary before committing.

Good:
```ts
// Strip gender tags once per render pass to avoid O(n) re-parsing per line.
const cleaned = stripGenderTags(template);
```

Bad:
```ts
// The user asked us to fix the gender tag bug. Originally we tried doing this
// per-line but that was slow, then we moved it here, and now it works. See
// the chat for context...
```

## Project layout (high level)

- `src/pages/**` — Aurelia pages (uniques, sets, runewords, affixes, bases,
  cube-recipes, grail, home).
- `src/resources/elements/**` — Reusable Aurelia custom elements
  (`keyed-lines`, `multi-select`, `searchable-select`, `search-area`).
- `src/resources/value-converters/**` — Aurelia value converters, including
  `keyed-line` (translation rendering) and `split`.
- `src/utilities/**` — Framework-agnostic helpers: `translation-store`,
  `format-template`, `strip-gender-tags`, `i-keyed-line`, `ui-strings`, plus
  `*.spec.ts` Vitest specs.
- `static/data/keyed/**` — Item/recipe data keyed by string IDs (no inline
  English text). Consumed by the pages.
- `static/data/strings/{lang}.json` — Per-language string maps. Loaded on
  demand by `translation-store`.
- `static/data/extras/**` — Diagnostic reports (`missing-translations.txt`,
  `casc-fallback-report.txt`, `import-report.txt`). Not shipped logic.

## How keys and translations work

- Source data files in `static/data/keyed/*.json` reference strings by `key`
  with optional `args`, e.g. `{ "key": "ModStre10d", "args": [3, "FireBolt", 5, 12] }`.
- `translation-store.ts` fetches `static/data/strings/{lang}.json`, exposes
  `setLanguage`, `getActiveLanguage`, `onLanguageChanged`, `lookup`, `t`,
  and `format`. `enUS` is preloaded as fallback.
- `format-template.ts` performs the substitution (`%d %s %+d %0..%9`,
  color codes stripped).
- In templates use the value converters:
  - `${line | keyedLine}` for a single `IKeyedLine`.
  - `items | keyedLines` for arrays.
- See `src/utilities/README-keyed.md` for the full contract.

## Testing

- Test runner: **Vitest**. Config: `vitest.config.ts`.
- Run all tests:
  ```
  npx vitest run
  ```
- Specs live next to the code (e.g. `src/utilities/translation-store.spec.ts`,
  `src/utilities/translation-coverage.spec.ts`).
- When adding a new keyed string or language, ensure
  `translation-coverage.spec.ts` still passes — it guards against missing
  keys across language files.
- When fixing a bug, add or update a spec that fails before the fix.

## Style

- Follow existing TypeScript / Aurelia conventions in the file you're editing.
- ESLint config: `eslint.config.js`. Do not introduce new lint errors.
- Do not reintroduce the deleted `src/pages/item-jsons/*.json` files —
  data lives under `static/data/keyed/`.
