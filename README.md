# D2R Reimagined Website

Server-rendered SvelteKit website and searchable game-data reference for D2R Reimagined.

## Stack

- SvelteKit and Svelte 5
- Node SSR adapter
- Tailwind CSS 4
- Flowbite Svelte
- pnpm 11

## Local development

Requires Node.js 24 (`.nvmrc`) and pnpm 11. `package.json` pins the exact pnpm version in `packageManager`; `corepack enable` provides it.

```powershell
pnpm install
pnpm dev
```

The development server runs at `http://localhost:9500`.

The development environment points authentication requests at `http://localhost:5000`. For production, set:

```powershell
$env:PUBLIC_API_BASE_URL='https://api.d2r-reimagined.com'
```

The Trade navigation link is hidden by default. Set the feature flag to the exact value `true` to show it:

```powershell
$env:TRADE_ENABLED='true'
```

The API must include the website origin in `Cors__AllowedOrigins` so credentialed Steam handoff requests are accepted.

## Validation

```powershell
pnpm run check
pnpm test
pnpm run build
```

## Game data

`static/data` holds the generated D2R Multi-Export output, and the website uses the files as they are. To refresh it, select `static/data` as the exporter's Output Files Directory, run the normal Import and Export action, review the changes, then commit and push them. Normal exports overwrite matching files and keep other existing files; the optional Destructive export (off by default) replaces the directory's contents after a run without errors. See [docs/UPDATING-GAME-DATA.md](docs/UPDATING-GAME-DATA.md).

## Production

`pnpm run build` creates a Node SSR application in `build/`. Run it with:

```powershell
$env:ORIGIN='https://www.d2r-reimagined.com'
$env:PORT='3000'
node build
```

`pnpm run build` runs `vite build` and then `scripts/verify-build.mjs`, which fails the build if the server and client bundles disagree on the SvelteKit version. That version is `BUILD_ID` when set, otherwise `GITHUB_SHA` or the current Git commit, and SvelteKit's timestamp default only when none of these is available. The Docker build excludes `.git` and passes no `BUILD_ID`, so it uses the timestamp default. Run `pnpm run check` and `pnpm run build` one after the other, not concurrently: `svelte-kit sync` or a second build can rewrite generated files mid-build, which the verification step then rejects.

The included `Dockerfile` and `compose.yml` provide the same Node SSR runtime in a container. This app cannot be deployed as a static GitHub Pages site without losing server rendering.

## Routes

- `/` — project home
- `/grail` — local Holy Grail tracker
- `/profile` — registration, sign-in, profile details, and Steam account linking
- `/launcher/authorize` — authenticated PKCE approval flow for the desktop launcher
- `/admin/ladders` — Admin-only ladder scheduling and extension requirements
- `/admin/users` — Admin-only staff-role management
- `/data/*` — game data: uniques, sets, runewords, bases, affixes, cube recipes, and orbs
- `/data/skills` — skill trees and planner; see [docs/SKILL-PLANNER.md](docs/SKILL-PLANNER.md)
- `/data/drop-calculator` — item drop sources and monster loot simulation; see [docs/DROP-CALCULATOR.md](docs/DROP-CALCULATOR.md)
- `/data/ias-calculator` — attack speed breakpoints
- `/data/health-calculator` — monster health explorer; unlisted (no navigation or sitemap entry) and `noindex`
- `/builds` — community build guides; see [docs/builds.md](docs/builds.md)
- `/loot-filter` — unlisted UnHoarder loot filter builder; see [docs/LOOT-FILTER.md](docs/LOOT-FILTER.md)
- `/robots.txt` and `/sitemap.xml` — SEO discovery endpoints

Legacy catalog routes redirect permanently to their `/data/*` equivalents.

The Admin link appears after the signed-in profile response includes the `Admin` role. `/admin` redirects to the ladder page, and the nested Admin layout provides left-hand navigation between Ladders and Users. The API refreshes authorization roles from Identity on each authenticated request, so role changes take effect immediately.
