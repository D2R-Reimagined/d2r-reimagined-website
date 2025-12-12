# D2R Reimagined Website

## Prerequisites

- Node.js 20.19+ or 22.12+ (Vite requires one of these versions)
- pnpm 10.x (this repo uses pnpm; see `package.json#packageManager`)

Verify versions:

```
node -v
pnpm -v
```

## Start dev web server

```
pnpm start
```

This starts Vite on http://localhost:9500.

## Build the app in production mode

```
pnpm run build
```

The build outputs to the `docs` folder. A `404.html` is generated for SPA routing (copied from `index.html`).

To deploy to a static host, copy everything under `docs/` to your server root. For example:

```
docs/index.html
docs/404.html
docs/foo.12345.js
```

Copy to production root folder:

```
root_folder/index.html
root_folder/404.html
root_folder/foo.12345.js
```
