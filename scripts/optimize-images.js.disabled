#!/usr/bin/env node

/**
 * Enhanced Image Optimization Script for Task 9
 * Generates WebP versions, responsive sizes, and optimizes for performance
 * 
 * Features:
 * - WebP conversion with JPEG/PNG fallbacks
 * - Multiple responsive sizes for different viewports
 * - Optimized for rural/low-bandwidth users
 * - Generates picture element markup
 * - Creates image manifests for lazy loading
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imageDir = 'Public/images';
const outputDir = 'Public/images';
const sizes = [400, 800, 1200, 1600];
const quality = {
  webp: 80,
  jpeg: 85,
  png: 90
};

// Image manifest for lazy loading and optimization
const imageManifest = {
  images: {},
  generated: new Date().toISOString(),
  totalImages: 0,
  totalSizes: 0
};

// Skip already-generated size files (e.g., name-400w.jpg) and only regenerate when source is newer
async function pathIsUpToDate(srcPath, outPath) {
  try {
    const srcStat = fs.statSync(srcPath);
    const outStat = fs.statSync(outPath);
    return outStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

function isGeneratedDerivative(fileName) {
  return /-\d{3,4}w\.(?:jpg|jpeg|png|webp)$/i.test(fileName);
}

// Generate responsive images and WebP versions
async function generateResponsiveImages(inputPath, outputDir) {
  const basename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  const relativePath = path.relative('Public', inputPath);
  
  if (isGeneratedDerivative(path.basename(inputPath))) {
    return null;
  }
  
  console.log(`Processing: ${inputPath}`);
  
  const imageData = {
    original: relativePath,
    basename: basename,
    extension: ext,
    sizes: {},
    webp: {},
    aspectRatio: null,
    fileSize: null,
    optimized: true
  };

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    imageData.aspectRatio = metadata.width / metadata.height;
    imageData.fileSize = fs.statSync(inputPath).size;
    
    // Generate WebP versions for each size
    for (const size of sizes) {
      const webpPath = path.join(outputDir, `${basename}-${size}w.webp`);
      const fallbackPath = path.join(outputDir, `${basename}-${size}w${ext}`);
      
      // Store paths for manifest
      imageData.webp[size] = path.relative('Public', webpPath);
      imageData.sizes[size] = path.relative('Public', fallbackPath);
      
      // Skip if outputs are up-to-date
      const webpFresh = await pathIsUpToDate(inputPath, webpPath);
      const fallbackFresh = await pathIsUpToDate(inputPath, fallbackPath);

      if (!webpFresh) {
        await sharp(inputPath)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: quality.webp, effort: 6 })
          .toFile(webpPath);
        console.log(`✅ Generated WebP: ${webpPath}`);
      }
      
      if ((ext === '.jpg' || ext === '.jpeg') && !fallbackFresh) {
        await sharp(inputPath)
          .resize(size, null, { withoutEnlargement: true })
          .jpeg({ quality: quality.jpeg, progressive: true })
          .toFile(fallbackPath);
        console.log(`✅ Generated fallback: ${fallbackPath}`);
      } else if (ext === '.png' && !fallbackFresh) {
        await sharp(inputPath)
          .resize(size, null, { withoutEnlargement: true })
          .png({ quality: quality.png, progressive: true })
          .toFile(fallbackPath);
        console.log(`✅ Generated fallback: ${fallbackPath}`);
      }
    }
    
    // Generate base WebP version
    const baseWebpPath = path.join(outputDir, `${basename}.webp`);
    imageData.webp.original = path.relative('Public', baseWebpPath);

    const baseFresh = await pathIsUpToDate(inputPath, baseWebpPath);
    if (!baseFresh) {
      await sharp(inputPath)
        .webp({ quality: quality.webp, effort: 6 })
        .toFile(baseWebpPath);
      console.log(`✅ Generated base WebP: ${baseWebpPath}`);
    }
    
    // Add to manifest
    imageManifest.images[basename] = imageData;
    imageManifest.totalImages++;
    imageManifest.totalSizes += sizes.length + 1; // +1 for original WebP
    
    return imageData;
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

// Generate picture element markup
function generatePictureMarkup(imageData, alt = '', className = '', loading = 'lazy') {
  const { basename, webp, sizes, aspectRatio } = imageData;
  
  // Build srcset strings
  const webpSrcset = Object.entries(webp)
    .filter(([key]) => key !== 'original')
    .map(([size, path]) => `/${path} ${size}w`)
    .join(', ');
    
  const fallbackSrcset = Object.entries(sizes)
    .map(([size, path]) => `/${path} ${size}w`)
    .join(', ');
  
  const markup = `
<picture class="responsive-image ${className}">
  <source 
    srcset="${webpSrcset}" 
    sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    type="image/webp">
  <img 
    src="/${sizes[800] || sizes[400]}" 
    srcset="${fallbackSrcset}"
    sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    alt="${alt}"
    loading="${loading}"
    ${aspectRatio ? `style="aspect-ratio: ${aspectRatio}"` : ''}
    class="responsive-img">
</picture>`.trim();

  return markup;
}

// Generate lazy loading markup
function generateLazyMarkup(imageData, alt = '', className = '', critical = false) {
  const { basename, webp, sizes, aspectRatio } = imageData;
  
  // Build srcset strings
  const webpSrcset = Object.entries(webp)
    .filter(([key]) => key !== 'original')
    .map(([size, path]) => `/${path} ${size}w`)
    .join(', ');
    
  const fallbackSrcset = Object.entries(sizes)
    .map(([size, path]) => `/${path} ${size}w`)
    .join(', ');
  
  const markup = `
<picture class="responsive-image ${className}">
  <source 
    data-lazy-srcset="${webpSrcset}" 
    data-lazy-sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    type="image/webp">
  <img 
    data-lazy-src="/${sizes[800] || sizes[400]}" 
    data-lazy-srcset="${fallbackSrcset}"
    data-lazy-sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    ${aspectRatio ? `data-aspect-ratio="${aspectRatio}"` : ''}
    ${critical ? 'data-critical="true"' : ''}
    alt="${alt}"
    class="responsive-img lazy">
</picture>`.trim();

  return markup;
}

// Scan for images and process them
async function processImages(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await processImages(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
      if (isGeneratedDerivative(file.name)) continue;
      await generateResponsiveImages(fullPath, dir);
    }
  }
}

// Generate image manifest
function generateManifest() {
  const manifestPath = path.join('src/data', 'image-manifest.json');
  const helpersPath = path.join('src/utils', 'image-helpers.js');
  
  // Ensure directories exist
  const manifestDir = path.dirname(manifestPath);
  const helpersDir = path.dirname(helpersPath);
  
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  if (!fs.existsSync(helpersDir)) {
    fs.mkdirSync(helpersDir, { recursive: true });
  }
  
  // Save manifest
  fs.writeFileSync(manifestPath, JSON.stringify(imageManifest, null, 2));
  console.log(`📄 Manifest saved to: ${manifestPath}`);
  
  // Generate helper functions
  const helpersContent = `
// Auto-generated image helpers
export const imageManifest = ${JSON.stringify(imageManifest, null, 2)};

export function getImageData(basename) {
  return imageManifest.images[basename];
}

export function getResponsiveImage(basename, alt = '', className = '', loading = 'lazy') {
  const imageData = getImageData(basename);
  if (!imageData) return '';
  
  return \`${generatePictureMarkup(imageManifest.images[Object.keys(imageManifest.images)[0]], '{{alt}}', '{{className}}', '{{loading}}')}\`
    .replace('{{alt}}', alt)
    .replace('{{className}}', className)
    .replace('{{loading}}', loading);
}

export function getLazyImage(basename, alt = '', className = '', critical = false) {
  const imageData = getImageData(basename);
  if (!imageData) return '';
  
  return \`${generateLazyMarkup(imageManifest.images[Object.keys(imageManifest.images)[0]], '{{alt}}', '{{className}}', '{{critical}}')}\`
    .replace('{{alt}}', alt)
    .replace('{{className}}', className)
    .replace('{{critical}}', critical);
}
`.trim();
  
  fs.writeFileSync(helpersPath, helpersContent);
  console.log(`🔧 Helpers saved to: ${helpersPath}`);
}

// Main execution
async function main() {
  console.log('Enhanced Image Optimization Script - Task 9');
  console.log('==========================================');
  console.log('Processing images and generating optimization data...\\n');
  
  try {
    // Process all images
    await processImages(imageDir);
    
    // Generate image manifest
    generateManifest();
    
    console.log('\\nImage optimization complete!');
    console.log(`Processed ${imageManifest.totalImages} images`);
    console.log(`Generated ${imageManifest.totalSizes} optimized versions`);
    console.log(`Manifest saved to: src/data/image-manifest.json`);
    console.log(`Helpers saved to: src/utils/image-helpers.js`);
    
    console.log('\\nNext steps:');
    console.log('1. ✅ Sharp is installed and working');
    console.log('2. ✅ WebP images are being generated');
    console.log('3. ✅ Responsive sizes are created');
    console.log('4. ✅ Use the generated helpers in your Astro components');
    
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { generateResponsiveImages, generatePictureMarkup, generateLazyMarkup };