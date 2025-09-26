---
inclusion: always
---

# Project Structure & Organization

## Root Directory Structure

```
/
├── .astro/              # Astro build artifacts and type definitions
├── .kiro/               # Kiro AI assistant configuration and steering
├── Public/              # Static assets (images, icons, documents)
├── src/                 # Source code and components
├── docs/                # Project documentation and guides
├── scripts/             # Build and deployment automation scripts
├── tests/               # Test suites (unit, e2e, accessibility, performance)
├── lighthouse-results/  # Performance testing results
└── temp-files/          # Temporary build and test artifacts
```

## Source Code Organization (`src/`)

### Components (`src/components/`)

**Key Performance Components** (always use these):

- `ResponsiveImage.astro` - For all images with multiple breakpoints
- `LazyImage.astro` - For below-the-fold content
- `SEOHead.astro` - Required in all layouts with proper meta tags
- `Hero.astro`, `Services.astro` - Main layout sections
- `ProjectCard.astro`, `ProjectModal.astro` - Project showcase components

### Layouts (`src/layouts/`)

- `BaseLayout.astro` - Main layout template with navigation, SEO, performance optimizations
- Always include mobile-first responsive design and accessibility features

### Pages (`src/pages/`)

**File-based routing patterns**:

- Dynamic routes: `[id].astro` for projects and services
- Core pages: `index.astro`, `services.astro`, `showcase.astro`, `contact.astro`
- SEO: `sitemap.xml.ts` for search engine optimization

### Content (`src/content/`)

**Type-safe collections with Zod validation**:

- `projects/` - Markdown files with required frontmatter (title, description, image, technologies)
- `services/` - Service descriptions with structured data
- `config.ts` - Defines collection schemas and validation rules

### Data (`src/data/`)

**Processed JSON files** (auto-generated, do not edit manually):

- `projects-processed.json`, `services-processed.json` - Generated from content collections
- `testimonials.json` - Client testimonials data
- `image-manifest.json` - Optimized image metadata

### Styles (`src/styles/`)

**Modular CSS architecture**:

- `critical.css` - Above-the-fold styles (inline in BaseLayout)
- `layout.css` - Grid and responsive utilities
- `performance.css` - Performance optimizations
- `images.css` - Image optimization styles
- `tokens.css` - Design system variables

### Scripts (`src/scripts/`)

**Client-side functionality**:

- `performance-monitor.js` - Core Web Vitals tracking
- `lazy-loading.js` - Image and content lazy loading
- `contact-form.js` - Form validation and submission
- `showcase.js` - Project filtering and modal interactions

### Utils (`src/utils/`)

**TypeScript utilities**:

- `seo.ts` - Meta tag generation and structured data
- `content-loader.ts` - Type-safe content fetching
- `project-seo.ts` - Project-specific SEO helpers
- `image-paths.ts` - Image path utilities

## Testing Structure (`tests/`)

**Run tests before commits**: `npm run test:all`

### Unit Tests (`tests/unit/`)

- `contact-form.test.ts` - Form validation and submission
- `content-management.test.ts` - Content loading and validation
- `interactive-components.test.ts` - Component functionality

### E2E Tests (`tests/e2e/`)

- `navigation.spec.ts` - Site navigation and routing
- `contact-form.spec.ts` - Form submission workflows
- `services-functionality.spec.ts` - Services page interactions
- `cross-browser.spec.ts` - Multi-browser compatibility

### Accessibility Tests (`tests/accessibility/`)

- `axe-tests.test.ts` - WCAG 2.1 AA compliance validation

### Performance Tests (`tests/performance/`)

- `lighthouse-test.js` - Automated Lighthouse scoring (target: 90+)

## Asset Organization (`Public/`)

### Images (`Public/images/`)

**Always use optimized formats with fallbacks**:

- `hero/` - Landing page images (WebP, SVG, with fallbacks)
- `showcase/` - Project images (farm-management-ios.jpg, farm-sensor-network.jpg, yield-analytics.jpg)
- `testimonials/` - Client photos

### Icons (`Public/icons/`)

- Favicon variations (16x16, 32x32, etc.)
- PWA icons (192x192, 512x512)
- Shortcut icons for quick actions

### Documents (`Public/documents/`)

- Case studies and company overviews (PDF format)

## Key Configuration Files

### Build & Development

- `astro.config.mjs` - Astro build settings with performance optimizations
- `tsconfig.json` - TypeScript config with path aliases (`@/*` → `src/*`)
- `package.json` - Scripts: `dev`, `build`, `preview`, `test:all`

### Code Quality

- `.eslintrc.json` - ESLint rules for consistency
- `.prettierrc` - Code formatting with Astro support
- `playwright.config.ts` - E2E testing with mobile device simulation
- `vitest.config.ts` - Unit testing with coverage

## Naming Conventions

### Files & Components

- **PascalCase**: Astro components (`Hero.astro`, `ProjectCard.astro`)
- **kebab-case**: Pages, utilities, scripts (`contact-form.js`, `project-seo.ts`)
- **camelCase**: TypeScript functions and variables

### Content Collections

- **Collection names**: `projects`, `services` (singular)
- **Content IDs**: `farm-management-ios`, `iot-integration` (kebab-case)
- **Required frontmatter**: title, description, image (validated by Zod schemas)

## Performance Requirements

### Critical Optimizations

- **Always inline critical CSS** in BaseLayout for above-the-fold content
- **Use lazy loading** for below-the-fold images (`LazyImage.astro`)
- **Implement service worker** caching for static assets
- **Target Lighthouse scores**: 90+ across all metrics

### Mobile-First Rules

- **Responsive images** with multiple breakpoints (use `ResponsiveImage.astro`)
- **Touch targets**: Minimum 48px for mobile usability
- **Progressive enhancement**: Core functionality without JavaScript
- **Offline support**: Essential content accessible without network

## Development Workflow

```bash
# Development
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run preview      # Test production build

# Code Quality (run before commits)
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run test:all     # Complete test suite

# Content Management
npm run process-content    # Generate processed JSON from collections
```

## Path Aliases (tsconfig.json)

```typescript
"@/*" → "src/*"
"@/components/*" → "src/components/*"
"@/layouts/*" → "src/layouts/*"
"@/utils/*" → "src/utils/*"
```
