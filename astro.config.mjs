import { defineConfig } from 'astro/config';

// https://astro.build/config
const isDev = process.env.NODE_ENV === 'development' || process.env.ASTRO_DEV === 'true';

export default defineConfig({
  site: isDev ? 'http://localhost:4321' : 'https://dl-alexandre.github.io/agrxculture/',
  base: isDev ? '/' : '/agrxculture/',
  output: 'static',
  trailingSlash: 'never', // Prevent redirects
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto', // Inline small CSS files
    minify: true, // Minify HTML, CSS, and JS
  },
  vite: {
    build: {
      // CSS optimization
      cssCodeSplit: true,
      cssMinify: 'esbuild',
      // JavaScript optimization
      minify: 'esbuild',
      target: 'es2020',
      // Asset optimization
      assetsInlineLimit: 8192, // Increased to 8KB for better inlining
      rollupOptions: {
        output: {
          // Optimize asset naming for caching
          assetFileNames: assetInfo => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            const name = info.slice(0, -1).join('.');
            return `assets/${name}-[hash].${ext}`;
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
    css: {
      postcss: './postcss.config.cjs',
    },
  },
});
