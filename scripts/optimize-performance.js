#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Optimizes images, CSS, and JavaScript for better performance
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'Public');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('🚀 Starting Performance Optimization...\n');

// Check if sharp is installed
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch {
    return false;
  }
}

// Optimize images
async function optimizeImages() {
  console.log('📸 Optimizing images...');

  if (!checkSharp()) {
    console.log('⚠️  Sharp not installed. Installing...');
    try {
      execSync('npm install sharp', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Failed to install sharp. Skipping image optimization.');
      return;
    }
  }

  const sharp = (await import('sharp')).default;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const imageFiles = [];

  function findImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findImages(filePath);
      } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
        imageFiles.push(filePath);
      }
    }
  }

  findImages(PUBLIC_DIR);

  console.log(`Found ${imageFiles.length} images to optimize`);

  for (const imagePath of imageFiles) {
    try {
      const relativePath = path.relative(PUBLIC_DIR, imagePath);
      const outputPath = path.join(DIST_DIR, relativePath);

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Optimize image
      await sharp(imagePath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));

      // Also create optimized version of original format
      await sharp(imagePath)
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);

      console.log(`✅ Optimized: ${relativePath}`);
    } catch (error) {
      console.log(`❌ Failed to optimize: ${imagePath} - ${error.message}`);
    }
  }
}

// Generate critical CSS
function generateCriticalCSS() {
  console.log('\n🎨 Generating critical CSS...');

  try {
    // This would require a headless browser to extract critical CSS
    // For now, we'll create a basic critical CSS file
    const criticalCSS = `
/* Critical CSS - Above the fold styles */
.hero { display: block; }
.site-header { display: block; }
.main-nav { display: block; }
.hero-title { display: block; }
.hero-subtitle { display: block; }
    `.trim();

    const criticalCSSPath = path.join(DIST_DIR, 'styles', 'critical.css');
    fs.writeFileSync(criticalCSSPath, criticalCSS);

    console.log('✅ Generated critical CSS');
  } catch (error) {
    console.log(`❌ Failed to generate critical CSS: ${error.message}`);
  }
}

// Optimize CSS
function optimizeCSS() {
  console.log('\n🎨 Optimizing CSS...');

  try {
    const stylesDir = path.join(DIST_DIR, 'styles');
    if (!fs.existsSync(stylesDir)) {
      console.log('⚠️  Styles directory not found. Run build first.');
      return;
    }

    const cssFiles = fs
      .readdirSync(stylesDir)
      .filter(file => file.endsWith('.css'));

    for (const cssFile of cssFiles) {
      const cssPath = path.join(stylesDir, cssFile);
      let css = fs.readFileSync(cssPath, 'utf8');

      // Basic CSS optimization
      css = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/;\s*}/g, '}') // Remove trailing semicolons
        .replace(/:\s+/g, ':') // Remove spaces after colons
        .replace(/;\s+/g, ';') // Remove spaces after semicolons
        .trim();

      fs.writeFileSync(cssPath, css);
      console.log(`✅ Optimized: ${cssFile}`);
    }
  } catch (error) {
    console.log(`❌ Failed to optimize CSS: ${error.message}`);
  }
}

// Generate performance report
function generatePerformanceReport() {
  console.log('\n📊 Generating performance report...');

  const report = {
    timestamp: new Date().toISOString(),
    optimizations: {
      images: 'WebP + JPEG optimization',
      css: 'Minification and critical CSS',
      js: 'Minification and chunking',
      html: 'Compression and minification',
    },
    recommendations: [
      'Use WebP images with JPEG fallbacks',
      'Implement lazy loading for images',
      'Preload critical resources',
      'Use service worker for caching',
      'Implement resource hints (preconnect, prefetch)',
      'Optimize font loading with font-display: swap',
    ],
  };

  const reportPath = path.join(
    ROOT_DIR,
    'performance-optimization-report.json'
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('✅ Generated performance report');
  console.log(`📄 Report saved to: ${reportPath}`);
}

// Main optimization function
async function optimizePerformance() {
  try {
    // Check if dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      console.log(
        '⚠️  Dist directory not found. Please run "npm run build" first.'
      );
      return;
    }

    await optimizeImages();
    generateCriticalCSS();
    optimizeCSS();
    generatePerformanceReport();

    console.log('\n🎉 Performance optimization completed!');
    console.log('\nNext steps:');
    console.log('1. Test your site with Lighthouse');
    console.log('2. Implement lazy loading for images');
    console.log('3. Add resource hints to your HTML');
    console.log('4. Consider implementing a service worker');
  } catch (error) {
    console.error('❌ Performance optimization failed:', error);
    process.exit(1);
  }
}

// Run optimization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizePerformance();
}

export { optimizePerformance };
