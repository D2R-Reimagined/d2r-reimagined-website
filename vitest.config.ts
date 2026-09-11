// Unit tests only need TypeScript transformation and a Node environment.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // SvelteKit's own `$lib` alias is not here, and a module that imports a value
  // rather than only a type from `$lib` fails to resolve without it. Vite's
  // resolver is the only part of SvelteKit needed for that, so it is one entry
  // rather than a reason to load the plugin into unit tests.
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url))
    }
  },
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'node'
  }
});
