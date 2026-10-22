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

`static/data` holds the generated D2R Multi-Export bundle. The exporter validates and installs it directly when run with `--website <this checkout>` (or the desktop client's Website Repository setting); the website serves the files as they are. See [docs/DATA-INSTALL.md](docs/DATA-INSTALL.md).

## Production

`pnpm run build` creates a Node SSR application in `build/`. Run it with:

```powershell
$env:ORIGIN='https://www.d2r-reimagined.com'
$env:PORT='3000'
node build
```

The SvelteKit version that ties server-rendered HTML to its client bundle is `BUILD_ID` when set, otherwise `GITHUB_SHA` or the current Git commit, and SvelteKit's timestamp default only when none of these is available. Run `pnpm run check` and `pnpm run build` one after the other, not concurrently. `pnpm run build` finishes with `scripts/verify-build.mjs`, which fails the build if the server and client bundles disagree on that version.

The included `Dockerfile` and `compose.yml` provide the same Node SSR runtime in a container. This app cannot be deployed as a static GitHub Pages site without losing server rendering.

## Routes

- `/` — project home
- `/grail` — local Holy Grail tracker
- `/profile` — registration, sign-in, profile details, and Steam account linking
- `/launcher/authorize` — authenticated PKCE approval flow for the desktop launcher
- `/admin/ladders` — Admin-only ladder scheduling and extension requirements
- `/admin/users` — Admin-only staff-role management
- `/data/*` — uniques, sets, runewords, bases, affixes, and cube recipes
- `/robots.txt` and `/sitemap.xml` — SEO discovery endpoints

Legacy catalog routes redirect permanently to their `/data/*` equivalents.

The Admin link appears after the signed-in profile response includes the `Admin` role. `/admin` redirects to the ladder page, and the nested Admin layout provides left-hand navigation between Ladders and Users. The API refreshes authorization roles from Identity on each authenticated request, so role changes take effect immediately.
