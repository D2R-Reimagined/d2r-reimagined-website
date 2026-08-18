# Contributing

## Project layout

- `src/routes/**` — SvelteKit pages, server loaders, redirects, and SEO endpoints.
- `src/lib/components/**` — reusable navigation, catalog, Grail, and presentation components.
- `src/lib/i18n.ts` — SSR-safe translation and keyed-line rendering.
- `src/lib/types.ts` — shared catalog types and route definitions.
- `static/data/keyed/**` — keyed item and recipe data.
- `static/data/strings/**` — language bundles loaded on demand after English SSR.
- `static/images/**` and `static/fonts/**` — public presentation assets.

## Conventions

- Use Svelte 5 runes for project components.
- Keep data pages server-rendered. Initial HTML must contain meaningful catalog content.
- Reuse `CatalogFilters`, `CatalogCard`, `KeyedLines`, and related shared components before adding route-specific markup.
- Keep Holy Grail storage keys compatible with existing users.
- Put catalog pages under `/data/*`; keep `/grail` top-level.
- Keep comments concise and explain only non-obvious implementation choices.

## Validation

Run all three before opening a pull request:

```powershell
pnpm run check
pnpm test
pnpm run build
```
