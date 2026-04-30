// Vitest config kept separate from `vite.config.ts` so the Aurelia HMR
// plugin and static-copy targets aren't loaded during unit tests. Tests
// only need TypeScript transformation and a Node environment.
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.spec.ts'],
        environment: 'node',
    },
    esbuild: {
        target: 'es2022',
    },
});
