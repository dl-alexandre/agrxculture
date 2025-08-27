import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dl-alexandre.github.io',
  base: '/agrxculture',
  output: 'static',
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
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      rollupOptions: {
        output: {
          // Optimize asset naming for caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `styles/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'scripts/[name]-[hash].js',
          entryFileNames: 'scripts/[name]-[hash].js',
          // Optimize chunk splitting for better caching
          manualChunks: (id) => {
            if (id.includes('lazy-loading')) return 'lazy-loading';
            if (id.includes('showcase')) return 'showcase';
            if (id.includes('contact-form')) return 'contact';
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      }
    },
    // Performance optimizations
    optimizeDeps: {
      include: [] // Will be populated as needed
    }
  },
  // Compression and caching headers (for static hosting)
  compressHTML: true,
  
  // Integration for cache headers (GitHub Pages compatible)
  integrations: [],
  
  // Server configuration for development
  server: {
    headers: {
      // Cache headers for development testing
      'Cache-Control': 'public, max-age=3600'
    }
  }
});
