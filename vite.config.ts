import { defineConfig } from 'vite';
import aurelia from '@aurelia/vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        port: 9500,
        strictPort: true,
    },
    publicDir: 'src/assets/icons',
    build: {
        minify: false,
        target: 'es2022',
        emptyOutDir: false,
        rollupOptions: {
            plugins: [],
        },
        outDir: 'docs',
    },
    esbuild: {
        target: 'es2022',
    },
    plugins: [
        tailwindcss(),
        aurelia({ enableConventions: true, hmr: true }),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/assets',
                    dest: ''
                },
                {
                    src: 'talonrage',
                    dest: ''
                }
            ]
        })
    ],
});
