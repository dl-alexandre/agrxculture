#!/usr/bin/env node

/**
 * SEO Validation Script
 *
 * This script validates the SEO implementation for the agricultural portfolio website.
 * It checks for proper meta tags, structured data, and SEO best practices.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SEO validation checks
const seoChecks = {
  files: {
    'robots.txt': 'Public/robots.txt',
    'sitemap.xml': 'src/pages/sitemap.xml.ts',
    'browserconfig.xml': 'Public/browserconfig.xml',
    'manifest.json': 'Public/manifest.json',
    'favicon.svg': 'Public/favicon.svg',
  },

  icons: [
    'Public/icons/apple-touch-icon.png',
    'Public/icons/favicon-16x16.png',
    'Public/icons/favicon-32x32.png',
    'Public/icons/icon-192x192.png',
    'Public/icons/icon-512x512.png',
  ],

  components: [
    'src/components/SEOHead.astro',
    'src/utils/seo.ts',
    'src/utils/project-seo.ts',
  ],
};

function validateFileExists(filePath, description) {
  const fullPath = join(__dirname, '..', filePath);
  const exists = existsSync(fullPath);

  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);

  if (exists && filePath.endsWith('.txt')) {
    try {
      const content = readFileSync(fullPath, 'utf-8');
      if (content.length < 50) {
        console.log(
          `   ⚠️  File seems too short (${content.length} characters)`
        );
      }
    } catch (error) {
      console.log(`   ❌ Error reading file: ${error.message}`);
    }
  }

  return exists;
}

function validateRobotsTxt() {
  console.log('\n📋 Validating robots.txt...');

  const robotsPath = join(__dirname, '..', 'Public/robots.txt');
  if (!existsSync(robotsPath)) {
    console.log('❌ robots.txt not found');
    return false;
  }

  const content = readFileSync(robotsPath, 'utf-8');
  const checks = [
    { test: content.includes('User-agent: *'), desc: 'User-agent directive' },
    { test: content.includes('Allow: /'), desc: 'Allow directive' },
    { test: content.includes('Sitemap:'), desc: 'Sitemap reference' },
    { test: content.includes('agricultural'), desc: 'Agricultural keywords' },
    { test: content.includes('Disallow:'), desc: 'Disallow directives' },
  ];

  checks.forEach(check => {
    console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
  });

  return checks.every(check => check.test);
}

function validateManifest() {
  console.log('\n📱 Validating manifest.json...');

  const manifestPath = join(__dirname, '..', 'Public/manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('❌ manifest.json not found');
    return false;
  }

  try {
    const content = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    const checks = [
      { test: manifest.name, desc: 'App name' },
      { test: manifest.short_name, desc: 'Short name' },
      { test: manifest.description, desc: 'Description' },
      { test: manifest.start_url, desc: 'Start URL' },
      { test: manifest.display, desc: 'Display mode' },
      { test: manifest.theme_color, desc: 'Theme color' },
      { test: manifest.background_color, desc: 'Background color' },
      {
        test: manifest.icons && manifest.icons.length > 0,
        desc: 'Icons array',
      },
      {
        test: manifest.description.includes('agricultural'),
        desc: 'Agricultural focus',
      },
    ];

    checks.forEach(check => {
      console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
    });

    if (manifest.icons) {
      console.log(`   📊 ${manifest.icons.length} icons configured`);
    }

    return checks.every(check => check.test);
  } catch (error) {
    console.log(`❌ Error parsing manifest.json: ${error.message}`);
    return false;
  }
}

function validateSEOComponents() {
  console.log('\n🧩 Validating SEO components...');

  const seoHeadPath = join(__dirname, '..', 'src/components/SEOHead.astro');
  if (!existsSync(seoHeadPath)) {
    console.log('❌ SEOHead component not found');
    return false;
  }

  const content = readFileSync(seoHeadPath, 'utf-8');
  const checks = [
    {
      test: content.includes('generatePageSEO'),
      desc: 'Uses SEO utility functions',
    },
    { test: content.includes('og:'), desc: 'Open Graph tags' },
    { test: content.includes('twitter:'), desc: 'Twitter Card tags' },
    { test: content.includes('application/ld+json'), desc: 'Structured data' },
    { test: content.includes('agricultural'), desc: 'Agricultural keywords' },
    { test: content.includes('canonical'), desc: 'Canonical URL' },
    { test: content.includes('Schema.org'), desc: 'Schema.org markup' },
  ];

  checks.forEach(check => {
    console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
  });

  return checks.every(check => check.test);
}

function validateSEOUtils() {
  console.log('\n🛠️  Validating SEO utilities...');

  const seoUtilsPath = join(__dirname, '..', 'src/utils/seo.ts');
  if (!existsSync(seoUtilsPath)) {
    console.log('❌ SEO utilities not found');
    return false;
  }

  const content = readFileSync(seoUtilsPath, 'utf-8');
  const checks = [
    { test: content.includes('generateMetaTags'), desc: 'Meta tag generation' },
    { test: content.includes('generatePersonSchema'), desc: 'Person schema' },
    { test: content.includes('generateProjectSchema'), desc: 'Project schema' },
    { test: content.includes('generateServiceSchema'), desc: 'Service schema' },
    { test: content.includes('generateWebsiteSchema'), desc: 'Website schema' },
    {
      test: content.includes('agricultural technology'),
      desc: 'Agricultural focus',
    },
    {
      test: content.includes('precision agriculture'),
      desc: 'Precision agriculture keywords',
    },
  ];

  checks.forEach(check => {
    console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
  });

  return checks.every(check => check.test);
}

function validateProjectSEO() {
  console.log('\n📊 Validating project SEO utilities...');

  const projectSEOPath = join(__dirname, '..', 'src/utils/project-seo.ts');
  if (!existsSync(projectSEOPath)) {
    console.log('❌ Project SEO utilities not found');
    return false;
  }

  const content = readFileSync(projectSEOPath, 'utf-8');
  const checks = [
    { test: content.includes('projectSEOData'), desc: 'Project SEO data' },
    {
      test: content.includes('farm-sensor-network'),
      desc: 'Farm sensor project',
    },
    { test: content.includes('farmtrack-ios'), desc: 'FarmTrack iOS project' },
    {
      test: content.includes('irrigation-automation'),
      desc: 'Irrigation project',
    },
    { test: content.includes('livestock-tracker'), desc: 'Livestock project' },
    {
      test: content.includes('yield-analytics'),
      desc: 'Yield analytics project',
    },
    { test: content.includes('HowTo'), desc: 'HowTo schema' },
    { test: content.includes('FAQPage'), desc: 'FAQ schema' },
  ];

  checks.forEach(check => {
    console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
  });

  return checks.every(check => check.test);
}

function generateSEOReport() {
  console.log('🌱 Agricultural Portfolio Website - SEO Validation Report');
  console.log('='.repeat(60));

  let allPassed = true;

  // Check core SEO files
  console.log('\n📁 Core SEO Files:');
  Object.entries(seoChecks.files).forEach(([name, path]) => {
    const exists = validateFileExists(path, name);
    if (!exists) allPassed = false;
  });

  // Check icon files
  console.log('\n🎨 Icon Files:');
  seoChecks.icons.forEach(iconPath => {
    const exists = validateFileExists(iconPath, 'Icon file');
    if (!exists) allPassed = false;
  });

  // Check SEO components
  console.log('\n🧩 SEO Components:');
  seoChecks.components.forEach(componentPath => {
    const exists = validateFileExists(componentPath, 'SEO component');
    if (!exists) allPassed = false;
  });

  // Detailed validations
  const robotsValid = validateRobotsTxt();
  const manifestValid = validateManifest();
  const seoComponentsValid = validateSEOComponents();
  const seoUtilsValid = validateSEOUtils();
  const projectSEOValid = validateProjectSEO();

  allPassed =
    allPassed &&
    robotsValid &&
    manifestValid &&
    seoComponentsValid &&
    seoUtilsValid &&
    projectSEOValid;

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(
    `📊 SEO Implementation Status: ${allPassed ? '✅ PASSED' : '❌ NEEDS ATTENTION'}`
  );

  if (allPassed) {
    console.log(
      '\n🎉 Excellent! Your SEO implementation is comprehensive and follows best practices.'
    );
    console.log('\n📋 Next Steps:');
    console.log('   1. Replace icon placeholders with actual PNG files');
    console.log('   2. Add Google Search Console verification meta tag');
    console.log('   3. Test with Google Rich Results Test');
    console.log('   4. Validate structured data with Schema.org validator');
    console.log('   5. Check page speed with Google PageSpeed Insights');
  } else {
    console.log(
      '\n⚠️  Some SEO components need attention. Review the failed checks above.'
    );
  }

  console.log('\n🔗 Useful SEO Testing Tools:');
  console.log(
    '   • Google Rich Results Test: https://search.google.com/test/rich-results'
  );
  console.log('   • Schema.org Validator: https://validator.schema.org/');
  console.log('   • Google PageSpeed Insights: https://pagespeed.web.dev/');
  console.log(
    '   • Open Graph Debugger: https://developers.facebook.com/tools/debug/'
  );
  console.log(
    '   • Twitter Card Validator: https://cards-dev.twitter.com/validator'
  );

  return allPassed;
}

// Run validation
const success = generateSEOReport();
process.exit(success ? 0 : 1);
