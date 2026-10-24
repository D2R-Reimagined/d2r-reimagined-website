# Contributing

## Project layout

- `src/routes/**` — SvelteKit pages, server loaders, redirects, and SEO endpoints.
- `src/lib/components/**` — reusable navigation, catalog, Grail, and presentation components.
- `src/lib/i18n.ts` — SSR-safe translation and keyed-line rendering.
- `src/lib/types.ts` — shared catalog types and route definitions.
- `static/data/keyed/**` — keyed item and recipe data.
- `static/data/strings/**` — language bundles loaded on demand after English SSR.
- `static/images/**` and `static/fonts/**` — public presentation assets.

Everything under `static/data` (including `sprites/`, `extras/` and `manifest.json`) is generated
export output; never edit it by hand. Refresh it by selecting `static/data` as D2R Multi-Export's
Output Files Directory and running the normal Import and Export action, as described in
[docs/UPDATING-GAME-DATA.md](docs/UPDATING-GAME-DATA.md), and commit data changes separately.

Feature documentation lives in `docs/`: [skill planner](docs/SKILL-PLANNER.md),
[drop calculator](docs/DROP-CALCULATOR.md), [community builds](docs/builds.md) and
[loot filter builder](docs/LOOT-FILTER.md).

## Conventions

- Use Svelte 5 runes for project components.
- Keep data pages server-rendered. Initial HTML must contain meaningful catalog content.
- Reuse `CatalogFilters`, `CatalogCard`, `KeyedLines`, and related shared components before adding route-specific markup.
- Keep Holy Grail storage keys and saved progress compatible with existing users. Items with a
  unique name keep their original progress key; same-name variants, such as runewords with two
  recipes, are tracked separately, and older progress for that name marks every variant found
  (`src/lib/grail-progress.ts`).
- Put catalog pages under `/data/*`; keep `/grail` top-level.
- Keep comments concise and explain only non-obvious implementation choices.

## Validation

Run all three before opening a pull request:

```powershell
pnpm run check
pnpm test
pnpm run build
```
