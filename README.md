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

The API must include the website origin in `Cors__AllowedOrigins` so credentialed Steam handoff requests are accepted.

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
- `/profile` — registration, sign-in, profile details, and Steam account linking
- `/launcher/authorize` — authenticated PKCE approval flow for the desktop launcher
- `/admin/ladders` — Admin-only ladder scheduling and extension requirements
- `/admin/users` — Admin-only staff-role management
- `/data/*` — uniques, sets, runewords, bases, affixes, and cube recipes
- `/robots.txt` and `/sitemap.xml` — SEO discovery endpoints

Legacy catalog routes redirect permanently to their `/data/*` equivalents.

The Admin link appears after the signed-in profile response includes the `Admin` role. `/admin` redirects to the ladder page, and the nested Admin layout provides left-hand navigation between Ladders and Users. The API refreshes authorization roles from Identity on each authenticated request, so role changes take effect immediately.
