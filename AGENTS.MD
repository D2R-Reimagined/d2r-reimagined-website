# Agent Guidelines — d2r-reimagined-website

Humans should read `CONTRIBUTING.md`.

## Architecture

- SvelteKit 2 / Svelte 5 using the Node SSR adapter.
- Tailwind CSS 4 with Flowbite Svelte.
- `src/routes/**` owns pages and server loaders.
- `src/lib/components/**` owns reusable UI.
- `static/data/keyed/**` is the authoritative catalog data.
- `static/data/strings/**` is the authoritative localization data.

## Requirements

- Catalog content must remain present in server-rendered HTML for SEO.
- All catalog routes belong under `/data/*`; Holy Grail remains `/grail`.
- Preserve legacy route redirects and existing Grail localStorage keys.
- Prefer shared catalog, filter, line-rendering, and layout components.
- Preserve keyed data and translation formatting rather than adding inline English item data.

## Validation

- `pnpm run check`
- `pnpm test`
- `pnpm run build`
- Verify representative routes against the built Node server, including robots and sitemap.
