# Agricultural Portfolio Website

## Deployment Status

[![Deploy to GitHub Pages](https://github.com/agrxculture/agricultural-portfolio-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/agrxculture/agricultural-portfolio-website/actions/workflows/deploy.yml)
[![Staging Environment](https://github.com/agrxculture/agricultural-portfolio-website/actions/workflows/staging.yml/badge.svg)](https://github.com/agrxculture/agricultural-portfolio-website/actions/workflows/staging.yml)
[![Lighthouse Performance](https://img.shields.io/badge/lighthouse-90%2B-brightgreen)](https://github.com/agrxculture/agricultural-portfolio-website/actions)
[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fagrxculture.github.io%2Fagricultural-portfolio-website)](https://agrxculture.github.io/agricultural-portfolio-website)



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

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run lint`            | Run ESLint to check code quality                 |
| `npm run lint:fix`        | Run ESLint and automatically fix issues          |
| `npm run format`          | Format code with Prettier                        |
| `npm run format:check`    | Check if code is properly formatted              |

## 🎯 Features

- **Static Site Generation**: Built with Astro for optimal performance
- **TypeScript**: Full TypeScript support with strict mode enabled
- **Responsive Design**: Mobile-first approach with agricultural theming
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Performance**: Optimized images, lazy loading, and minimal JavaScript
- **Design Tokens**: Consistent spacing, colors, and typography
- **Form Handling**: Contact form with validation and spam protection

## 🌱 Agricultural Focus

This portfolio specifically targets:

- Small to medium-sized farming operations
- Agricultural cooperatives
- Precision agriculture solutions
- IoT-driven farm efficiency
- Farm management technology

## 📝 Environment Setup

1. Copy `.env.example` to `.env`
2. Update environment variables for your deployment
3. Configure form endpoints and analytics as needed

## 🚀 Deployment

The site is configured for deployment to GitHub Pages:

- Build artifacts are generated in `./dist/`
- GitHub Actions workflow handles automated deployment
- Custom domain and SSL certificate supported

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build) or jump into the [Astro Discord server](https://astro.build/chat).
