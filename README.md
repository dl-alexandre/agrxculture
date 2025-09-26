# Agrxculture - Agricultural Technology Portfolio

## Deployment Status

[![Deploy to GitHub Pages](https://github.com/dl-alexandre/agrxculture/actions/workflows/deploy.yml/badge.svg)](https://github.com/dl-alexandre/agrxculture/actions/workflows/deploy.yml)
[![Staging Environment](https://github.com/dl-alexandre/agrxculture/actions/workflows/staging.yml/badge.svg)](https://github.com/dl-alexandre/agrxculture/actions/workflows/staging.yml)
[![Lighthouse Performance](https://img.shields.io/badge/lighthouse-90%2B-brightgreen)](https://github.com/dl-alexandre/agrxculture/actions)
[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fdl-alexandre.github.io%2Fagrxculture)](https://dl-alexandre.github.io/agrxculture)

A professional portfolio website showcasing precision agriculture IoT solutions and farm management technology expertise, built with Astro for optimal performance and SEO.

## 🚀 Project Structure

```
/
├── public/
│   ├── images/          # Static images and assets
│   ├── icons/           # Icons and favicons
│   └── favicon.svg      # Site favicon
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing pages
│   ├── styles/          # CSS files and design tokens
│   ├── data/            # Static data files (JSON)
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `npm install`              | Installs dependencies                            |
| `npm run dev`              | Starts local dev server at `localhost:4321`      |
| `npm run build`            | Build your production site to `./dist/`          |
| `npm run preview`          | Preview your build locally, before deploying     |
| `npm run astro ...`        | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`  | Get help using the Astro CLI                     |
| `npm run lint`             | Run ESLint to check code quality                 |
| `npm run lint:fix`         | Run ESLint and automatically fix issues          |
| `npm run format`           | Format code with Prettier                        |
| `npm run format:check`     | Check if code is properly formatted              |
| `npm run test`             | Run unit tests with Vitest                       |
| `npm run test:e2e`         | Run end-to-end tests with Playwright             |
| `npm run test:performance` | Run Lighthouse performance tests                 |

## 🎯 Features

- **Static Site Generation**: Built with Astro for optimal performance
- **TypeScript**: Full TypeScript support with strict mode enabled
- **Responsive Design**: Mobile-first approach with agricultural theming
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Performance**: Optimized images, lazy loading, and minimal JavaScript
- **Design Tokens**: Consistent spacing, colors, and typography
- **Contact Form**: Static Forms integration with validation and spam protection
- **Testing Suite**: Unit tests (Vitest), E2E tests (Playwright), and performance tests (Lighthouse)
- **CI/CD Pipeline**: Automated deployment with GitHub Actions

## 🌱 Agricultural Focus

This portfolio specifically targets:

- Small to medium-sized farming operations
- Agricultural cooperatives
- Precision agriculture solutions
- IoT-driven farm efficiency
- Farm management technology

## 📝 Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
```

### 3. Required Environment Variables

```env
# Static Forms API Key for Contact Form
STATIC_FORM_API_KEY=your_static_forms_api_key_here

# Base URL for the site
BASE_URL=https://dl-alexandre.github.io/agrxculture/
```

### 4. GitHub Repository Secrets (for deployment)

Set these in your GitHub repository settings (Settings → Secrets and variables → Actions):

- `STATIC_FORM_API_KEY` - Get your API key from [Static Forms](https://www.staticforms.xyz/)

## 🚀 Deployment

### GitHub Pages (Automatic)

The site is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**: Go to repository Settings → Pages → Source: "GitHub Actions"
2. **Push to main branch**: Automatic deployment via GitHub Actions workflow
3. **Live URL**: https://dl-alexandre.github.io/agrxculture

### Manual Deployment

```bash
# Build the site
npm run build

# Preview locally
npm run preview

# Deploy (if using other platforms)
npm run deploy:production
```

### Deployment Features

- ✅ **Static site generation** optimized for GitHub Pages
- ✅ **Automated builds** on push to main branch
- ✅ **Performance testing** with Lighthouse CI
- ✅ **Broken link detection**
- ✅ **Custom domain support**
- ✅ **SSL certificate** (automatic with GitHub Pages)
- ✅ **Contact form** via Static Forms (no server required)

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test:all

# Unit tests only
npm run test

# End-to-end tests
npm run test:e2e

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:accessibility
```

### Test Coverage

- **Unit Tests**: Component logic and utilities (Vitest)
- **E2E Tests**: Full user workflows (Playwright)
- **Performance Tests**: Lighthouse CI integration
- **Accessibility Tests**: WCAG compliance testing

## 🔧 Development

### Code Quality

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Husky**: Pre-commit hooks (if configured)

### Performance Monitoring

- **Lighthouse CI**: Automated performance testing
- **Bundle Analysis**: `npm run analyze-bundle`
- **Performance Reports**: Generated in `lighthouse-results/`

## 📧 Contact Form Setup

The contact form uses [Static Forms](https://www.staticforms.xyz/) for serverless form handling:

1. **Get API Key**: Sign up at [Static Forms](https://www.staticforms.xyz/) and get your API key
2. **Set Environment Variable**: Add `STATIC_FORM_API_KEY` to your environment
3. **Configure GitHub Secret**: Add the API key as a repository secret for CI/CD

The form includes:

- ✅ Client-side validation
- ✅ Spam protection (honeypot)
- ✅ Character limits and real-time feedback
- ✅ Mobile-optimized interface
- ✅ Accessibility features

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build) or jump into the [Astro Discord server](https://astro.build/chat).
