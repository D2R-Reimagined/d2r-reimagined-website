import { execFileSync } from 'node:child_process';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// SvelteKit names the client bootstrap global after a hash of `version.name`, which defaults
// to a timestamp taken by each process that loads this config. Any other process that loads it
// during a build (`svelte-kit sync` in `pnpm run check`, a second build) rewrites
// .svelte-kit/generated with its own timestamp, so the server and client bundles can disagree.
// A build ID or commit SHA is the same in every process for one deployment and changes between
// deployments. Without either (no Git metadata in the Docker context) SvelteKit's default applies
// and scripts/verify-build.mjs still rejects mismatched output.
function buildVersion(): string | undefined {
  const supplied = process.env.BUILD_ID?.trim() || process.env.GITHUB_SHA?.trim();
  if (supplied) return supplied;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
  } catch {
    return undefined;
  }
}

const version = buildVersion();

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      adapter: adapter(),
      ...(version ? { version: { name: version } } : {})
    }),
    tailwindcss()
  ],
  server: {
    port: 9500,
    strictPort: true,
    allowedHosts: true
  }
});
