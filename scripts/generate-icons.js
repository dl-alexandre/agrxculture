#!/usr/bin/env node

/**
 * Icon Generation Script for Agricultural Portfolio Website
 *
 * This script generates all required favicon and app icons from the base SVG favicon.
 * It creates PNG icons in various sizes for different platforms and use cases.
 *
 * Requirements: sharp (npm install sharp)
 * Usage: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes needed for comprehensive favicon package
const iconSizes = [
  // Standard favicon sizes
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },

  // Apple touch icons
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 57, name: 'apple-touch-icon-57x57.png' },

  // Android/Chrome icons (for manifest.json)
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },

  // Windows tile icons
  { size: 70, name: 'mstile-70x70.png' },
  { size: 144, name: 'mstile-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x310.png' },

  // Shortcut icons for PWA
  { size: 96, name: 'shortcut-projects.png' },
  { size: 96, name: 'shortcut-contact.png' },
  { size: 96, name: 'shortcut-services.png' },
];

// Agricultural-themed SVG icon
const agriculturalSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2E7D32;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1B5E20;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFC107;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8F00;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bgGradient)" stroke="#1B5E20" stroke-width="8"/>
  
  <!-- Agricultural plant/leaf design -->
  <g transform="translate(256,256)">
    <!-- Main stem -->
    <rect x="-4" y="-120" width="8" height="240" fill="#8D6E63" rx="4"/>
    
    <!-- Left leaves -->
    <ellipse cx="-40" cy="-80" rx="35" ry="20" fill="url(#leafGradient)" transform="rotate(-30 -40 -80)"/>
    <ellipse cx="-50" cy="-40" rx="40" ry="25" fill="url(#leafGradient)" transform="rotate(-45 -50 -40)"/>
    <ellipse cx="-45" cy="0" rx="38" ry="22" fill="url(#leafGradient)" transform="rotate(-35 -45 0)"/>
    <ellipse cx="-35" cy="40" rx="32" ry="18" fill="url(#leafGradient)" transform="rotate(-25 -35 40)"/>
    
    <!-- Right leaves -->
    <ellipse cx="40" cy="-80" rx="35" ry="20" fill="url(#leafGradient)" transform="rotate(30 40 -80)"/>
    <ellipse cx="50" cy="-40" rx="40" ry="25" fill="url(#leafGradient)" transform="rotate(45 50 -40)"/>
    <ellipse cx="45" cy="0" rx="38" ry="22" fill="url(#leafGradient)" transform="rotate(35 45 0)"/>
    <ellipse cx="35" cy="40" rx="32" ry="18" fill="url(#leafGradient)" transform="rotate(25 35 40)"/>
    
    <!-- Technology elements - IoT sensors -->
    <circle cx="-60" cy="-60" r="8" fill="url(#techGradient)" stroke="#FF6F00" stroke-width="2"/>
    <circle cx="60" cy="-60" r="8" fill="url(#techGradient)" stroke="#FF6F00" stroke-width="2"/>
    <circle cx="-70" cy="20" r="6" fill="url(#techGradient)" stroke="#FF6F00" stroke-width="2"/>
    <circle cx="70" cy="20" r="6" fill="url(#techGradient)" stroke="#FF6F00" stroke-width="2"/>
    
    <!-- Connection lines (IoT network) -->
    <line x1="-60" y1="-60" x2="0" y2="-100" stroke="#FFC107" stroke-width="2" opacity="0.7"/>
    <line x1="60" y1="-60" x2="0" y2="-100" stroke="#FFC107" stroke-width="2" opacity="0.7"/>
    <line x1="-70" y1="20" x2="0" y2="60" stroke="#FFC107" stroke-width="2" opacity="0.7"/>
    <line x1="70" y1="20" x2="0" y2="60" stroke="#FFC107" stroke-width="2" opacity="0.7"/>
    
    <!-- Central data hub -->
    <circle cx="0" cy="-100" r="12" fill="#FF8F00" stroke="#FF6F00" stroke-width="3"/>
    <circle cx="0" cy="60" r="10" fill="#FF8F00" stroke="#FF6F00" stroke-width="2"/>
    
    <!-- Small tech indicators -->
    <rect x="-2" y="-102" width="4" height="4" fill="#FFF" rx="1"/>
    <rect x="-2" y="58" width="4" height="4" fill="#FFF" rx="1"/>
  </g>
  
  <!-- Subtle agricultural pattern around the edge -->
  <g opacity="0.3">
    <circle cx="100" cy="100" r="3" fill="#4CAF50"/>
    <circle cx="412" cy="100" r="3" fill="#4CAF50"/>
    <circle cx="100" cy="412" r="3" fill="#4CAF50"/>
    <circle cx="412" cy="412" r="3" fill="#4CAF50"/>
    <circle cx="256" cy="50" r="2" fill="#4CAF50"/>
    <circle cx="256" cy="462" r="2" fill="#4CAF50"/>
    <circle cx="50" cy="256" r="2" fill="#4CAF50"/>
    <circle cx="462" cy="256" r="2" fill="#4CAF50"/>
  </g>
</svg>
`;

async function generateIcons() {
  try {
    console.log('🌱 Generating agricultural technology favicon package...');

    // Ensure icons directory exists
    const iconsDir = join(__dirname, '..', 'Public', 'icons');
    mkdirSync(iconsDir, { recursive: true });

    // Convert SVG to buffer for sharp processing
    const svgBuffer = Buffer.from(agriculturalSVG);

    // Generate all icon sizes
    for (const { size, name } of iconSizes) {
      console.log(`  📱 Generating ${name} (${size}x${size})`);

      await sharp(svgBuffer)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({
          quality: 95,
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toFile(join(iconsDir, name));
    }

    // Generate ICO file for legacy browser support
    console.log('  🖥️  Generating favicon.ico');
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(__dirname, '..', 'Public', 'favicon.png'));

    // Update the SVG favicon with the agricultural design
    console.log('  🎨 Updating SVG favicon');
    writeFileSync(
      join(__dirname, '..', 'Public', 'favicon.svg'),
      agriculturalSVG
    );

    console.log('✅ Icon generation complete!');
    console.log('📋 Generated icons:');
    console.log('   • Standard favicons (16x16, 32x32, 48x48)');
    console.log('   • Apple touch icons (57x57 to 180x180)');
    console.log('   • Android/Chrome icons (72x72 to 512x512)');
    console.log('   • Windows tile icons (70x70 to 310x310)');
    console.log('   • PWA shortcut icons (96x96)');
    console.log('   • Updated SVG favicon with agricultural theme');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIcons();
}

export { generateIcons };
