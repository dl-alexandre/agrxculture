# GitHub Pages Cache Headers Configuration

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
