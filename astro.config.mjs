import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dl-alexandre.github.io/agrxculture/',
  base: '/agrxculture/',
  output: 'static',
  trailingSlash: 'always',
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
          assetFileNames: (assetInfo) => {
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
