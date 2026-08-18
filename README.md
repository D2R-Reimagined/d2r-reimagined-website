# D2R Reimagined Website

Server-rendered SvelteKit website and searchable game-data reference for D2R Reimagined.

## Stack

- SvelteKit and Svelte 5
- Node SSR adapter
- Tailwind CSS 4
- Flowbite Svelte
- pnpm 10

## Local development

Requires Node.js 22 and pnpm 10.

```powershell
pnpm install
pnpm dev
```

The development server runs at `http://localhost:9500`.

## Validation

```powershell
pnpm run check
pnpm test
pnpm run build
```

## Production

`pnpm run build` creates a Node SSR application in `build/`. Run it with:

```powershell
$env:ORIGIN='https://www.d2r-reimagined.com'
$env:PORT='3000'
node build
```

The included `Dockerfile` and `compose.yml` provide the same Node SSR runtime in a container. This app cannot be deployed as a static GitHub Pages site without losing server rendering.

## Routes

- `/` — project home
- `/grail` — local Holy Grail tracker
- `/data/*` — uniques, sets, runewords, bases, affixes, and cube recipes
- `/robots.txt` and `/sitemap.xml` — SEO discovery endpoints

Legacy catalog routes redirect permanently to their `/data/*` equivalents.
