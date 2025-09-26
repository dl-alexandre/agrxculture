---
inclusion: always
---

# Technology Stack & Development Guidelines

## Core Architecture

- **Astro 5.x**: Static site generator - use `.astro` components for UI, TypeScript for utilities
- **TypeScript**: Strict mode enabled - always type function parameters and return values
- **ES Modules**: Use `import/export` syntax, avoid CommonJS except in config files

## Component Patterns

- **Astro Components**: Use PascalCase naming (`Hero.astro`, `ProjectCard.astro`)
- **Performance Components**: Always use `ResponsiveImage.astro` for images, `LazyImage.astro` for below-fold content
- **SEO Components**: Include `SEOHead.astro` in all page layouts with proper meta tags
- **Reusable Logic**: Extract shared functionality to `src/utils/` as TypeScript modules

## Content Management Rules

- **Content Collections**: Define in `src/content/config.ts` with Zod schemas for type safety
- **Frontmatter**: Required fields - title, description, image (for projects/services)
- **Data Processing**: Use `scripts/process-content.cjs` to generate processed JSON files
- **Image Assets**: Store in `Public/images/` with WebP/AVIF formats + fallbacks

## Performance Requirements

- **Critical CSS**: Inline above-the-fold styles in `src/styles/critical.css`
- **Lazy Loading**: Implement for all images below the fold
- **Service Worker**: Use for caching static assets and offline functionality
- **Lighthouse Targets**: 90+ scores across all metrics

## Testing Standards

- **Unit Tests**: Use Vitest with jsdom for component testing
- **E2E Tests**: Playwright for cross-browser testing with mobile device simulation
- **Accessibility**: Axe-core integration for WCAG 2.1 AA compliance
- **Performance**: Automated Lighthouse testing in CI/CD pipeline

## Development Workflow

```bash
# Development
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build with optimizations
npm run preview      # Test production build locally

# Code Quality (run before commits)
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run test:all     # Complete test suite

# Content Management
npm run process-content    # Generate processed JSON from collections
npm run optimize-performance # Run image/asset optimizations
```

## File Organization Rules

- **Components**: `src/components/` - PascalCase, single responsibility
- **Pages**: `src/pages/` - kebab-case, use dynamic routes `[id].astro`
- **Utilities**: `src/utils/` - camelCase functions, TypeScript modules
- **Styles**: `src/styles/` - modular CSS, critical.css for above-fold
- **Scripts**: `src/scripts/` - client-side JS, performance-focused
- **Data**: `src/data/` - processed JSON, image manifests

## Code Style Guidelines

- **TypeScript**: Use strict mode, explicit return types for functions
- **Astro Components**: Props interface at top, minimal client-side JS
- **CSS**: Mobile-first responsive, CSS custom properties for theming
- **Images**: Always use responsive components, include alt text
- **Performance**: Lazy load below-fold content, preload critical resources

## Path Aliases (tsconfig.json)

```typescript
"@/*" → "src/*"
"@/components/*" → "src/components/*"
"@/layouts/*" → "src/layouts/*"
"@/styles/*" → "src/styles/*"
"@/utils/*" → "src/utils/*"
```

## Build Optimization

- **Image Processing**: Sharp for WebP/AVIF conversion
- **CSS**: PostCSS with autoprefixer and cssnano
- **JS**: Vite with esbuild for fast compilation
- **Content**: Zod validation and type generation
