#!/usr/bin/env node

/**
 * Generate cache headers configuration for GitHub Pages
 * This creates a _headers file for Netlify and instructions for GitHub Pages
 */

import fs from 'fs';
import path from 'path';

// Cache configuration
const cacheConfig = {
  // Static assets - 1 year cache
  staticAssets: {
    patterns: [
      '*.js',
      '*.css',
      '*.png',
      '*.jpg',
      '*.jpeg',
      '*.gif',
      '*.svg',
      '*.webp',
      '*.woff',
      '*.woff2',
      '*.ttf',
      '*.eot',
      '*.ico',
    ],
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      Expires: new Date(Date.now() + 31536000 * 1000).toUTCString(),
    },
  },

  // HTML files - 1 hour cache
  htmlFiles: {
    patterns: ['*.html'],
    headers: {
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      Expires: new Date(Date.now() + 3600 * 1000).toUTCString(),
    },
  },

  // API and dynamic content - no cache
  dynamicContent: {
    patterns: ['*.json', '*.xml'],
    headers: {
      'Cache-Control': 'public, max-age=300, must-revalidate',
    },
  },
};

// Generate Netlify _headers file
function generateNetlifyHeaders() {
  let content = '# Cache headers for optimal performance\n\n';

  // Static assets
  cacheConfig.staticAssets.patterns.forEach(pattern => {
    content += `/${pattern}\n`;
    Object.entries(cacheConfig.staticAssets.headers).forEach(([key, value]) => {
      content += `  ${key}: ${value}\n`;
    });
    content += '\n';
  });

  // HTML files
  cacheConfig.htmlFiles.patterns.forEach(pattern => {
    content += `/${pattern}\n`;
    Object.entries(cacheConfig.htmlFiles.headers).forEach(([key, value]) => {
      content += `  ${key}: ${value}\n`;
    });
    content += '\n';
  });

  // Dynamic content
  cacheConfig.dynamicContent.patterns.forEach(pattern => {
    content += `/${pattern}\n`;
    Object.entries(cacheConfig.dynamicContent.headers).forEach(
      ([key, value]) => {
        content += `  ${key}: ${value}\n`;
      }
    );
    content += '\n';
  });

  return content;
}

// Generate GitHub Pages instructions
function generateGitHubPagesInstructions() {
  return `# GitHub Pages Cache Headers Configuration

GitHub Pages doesn't support custom headers directly, but we can implement cache optimization through:

## 1. Asset Fingerprinting
- All assets are built with content hashes in filenames
- This enables long-term caching (browsers cache until filename changes)
- Configured in astro.config.mjs build.rollupOptions.output

## 2. Service Worker Caching
- Implemented in public/sw.js
- Provides cache control for repeat visitors
- Handles cache invalidation and updates

## 3. Meta Tags for HTML Caching
- Added cache-control meta tags to HTML head
- Provides hints to browsers and CDNs

## 4. CDN Configuration (if using custom domain)
If using a custom domain with Cloudflare or similar CDN:

### Static Assets (1 year cache):
- *.js, *.css, *.png, *.jpg, *.svg, *.webp, *.woff, *.woff2
- Cache-Control: public, max-age=31536000, immutable

### HTML Files (1 hour cache):
- *.html
- Cache-Control: public, max-age=3600, must-revalidate

### Dynamic Content (5 minutes cache):
- *.json, *.xml
- Cache-Control: public, max-age=300, must-revalidate

## Implementation Status
✅ Asset fingerprinting configured
✅ Service worker caching implemented
✅ Meta tags added to HTML templates
⚠️  CDN headers require custom domain setup
`;
}

// Main execution
function main() {
  try {
    // Create public directory if it doesn't exist
    const publicDir = 'public';
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate Netlify headers file
    const netlifyHeaders = generateNetlifyHeaders();
    fs.writeFileSync(path.join(publicDir, '_headers'), netlifyHeaders);
    console.log('✅ Generated public/_headers for Netlify');

    // Generate GitHub Pages instructions
    const githubInstructions = generateGitHubPagesInstructions();
    fs.writeFileSync('CACHE-HEADERS-SETUP.md', githubInstructions);
    console.log(
      '✅ Generated CACHE-HEADERS-SETUP.md with GitHub Pages instructions'
    );

    // Generate cache configuration for service worker
    const swCacheConfig = {
      staticAssets: cacheConfig.staticAssets.patterns,
      htmlFiles: cacheConfig.htmlFiles.patterns,
      dynamicContent: cacheConfig.dynamicContent.patterns,
      cacheNames: {
        static: 'agricultural-portfolio-static-v1',
        dynamic: 'agricultural-portfolio-dynamic-v1',
      },
    };

    fs.writeFileSync(
      path.join(publicDir, 'cache-config.json'),
      JSON.stringify(swCacheConfig, null, 2)
    );
    console.log('✅ Generated public/cache-config.json for service worker');
  } catch (error) {
    console.error('❌ Error generating cache headers:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateNetlifyHeaders, generateGitHubPagesInstructions };
