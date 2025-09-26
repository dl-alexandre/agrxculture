#!/usr/bin/env node

/**
 * Update deployment status in README and generate status badges
 */

import fs from 'fs';

function generateStatusBadges() {
  const repository = 'agrxculture/agricultural-portfolio-website';

  const badges = {
    deployment: `[![Deploy to GitHub Pages](https://github.com/${repository}/actions/workflows/deploy.yml/badge.svg)](https://github.com/${repository}/actions/workflows/deploy.yml)`,
    staging: `[![Staging Environment](https://github.com/${repository}/actions/workflows/staging.yml/badge.svg)](https://github.com/${repository}/actions/workflows/staging.yml)`,
    lighthouse: `[![Lighthouse Performance](https://img.shields.io/badge/lighthouse-90%2B-brightgreen)](https://github.com/${repository}/actions)`,
    uptime: `[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fagrxculture.github.io%2Fagricultural-portfolio-website)](https://agrxculture.github.io/agricultural-portfolio-website)`,
  };

  return badges;
}

function updateReadme() {
  const readmePath = 'README.md';

  if (!fs.existsSync(readmePath)) {
    console.log('⚠️  README.md not found, creating new one...');
    createNewReadme();
    return;
  }

  let content = fs.readFileSync(readmePath, 'utf8');
  const badges = generateStatusBadges();

  // Create badges section
  const badgeSection = `
## Deployment Status

${badges.deployment}
${badges.staging}
${badges.lighthouse}
${badges.uptime}

`;

  // Check if badges section already exists
  if (content.includes('## Deployment Status')) {
    // Replace existing section
    content = content.replace(
      /## Deployment Status[\s\S]*?(?=##|$)/,
      badgeSection
    );
  } else {
    // Add badges section after title
    const lines = content.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('# '));

    if (titleIndex !== -1) {
      lines.splice(titleIndex + 1, 0, badgeSection);
      content = lines.join('\n');
    } else {
      content = badgeSection + content;
    }
  }

  fs.writeFileSync(readmePath, content);
  console.log('✅ Updated README.md with deployment status badges');
}

function createNewReadme() {
  const badges = generateStatusBadges();

  const content = `# Agricultural Portfolio Website

${badges.deployment}
${badges.staging}
${badges.lighthouse}
${badges.uptime}

A professional portfolio website showcasing agricultural technology expertise, built with Astro and deployed to GitHub Pages.

## Features

- 🌱 Agricultural technology focus
- 📱 Responsive design optimized for rural connectivity
- ⚡ High performance (90+ Lighthouse scores)
- 🔍 SEO optimized with structured data
- 🚀 Automated CI/CD deployment
- 🛡️ Security best practices

## Technology Stack

- **Framework**: Astro (Static Site Generator)
- **Styling**: CSS Grid, Flexbox, PostCSS
- **Performance**: WebP images, lazy loading, service worker
- **Deployment**: GitHub Pages with GitHub Actions
- **Testing**: Lighthouse CI, broken link checker, accessibility tests

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment Commands

\`\`\`bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Verify deployment
npm run verify-deployment
\`\`\`

## Performance Optimization

- Asset fingerprinting for long-term caching
- WebP image format with fallbacks
- Lazy loading for images and components
- Service worker for offline support
- CSS and JavaScript minification

## SEO Features

- Automated meta tag generation
- Open Graph and Twitter Card support
- Schema.org structured data
- XML sitemap generation
- Canonical URLs

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast ratios
- Focus management

## License

MIT License - see LICENSE file for details.
`;

  fs.writeFileSync('README.md', content);
  console.log('✅ Created new README.md with deployment information');
}

// Main execution
function main() {
  try {
    updateReadme();

    const badges = generateStatusBadges();
    console.log('\n📊 Generated status badges:');
    Object.entries(badges).forEach(([name, badge]) => {
      console.log(`${name}: ${badge}`);
    });
  } catch (error) {
    console.error('❌ Error updating deployment status:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateStatusBadges, updateReadme };
