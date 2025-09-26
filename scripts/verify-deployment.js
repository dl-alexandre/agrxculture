#!/usr/bin/env node

/**
 * Deployment verification script
 * Runs comprehensive checks on deployed site
 */

import { execSync } from 'child_process';
import fs from 'fs';

const SITE_URL =
  process.env.SITE_URL ||
  'https://agrxculture.github.io/agricultural-portfolio-website';
const TIMEOUT = 30000; // 30 seconds

// Test configuration
const tests = {
  lighthouse: {
    enabled: true,
    thresholds: {
      performance: 90,
      accessibility: 90,
      bestPractices: 90,
      seo: 90,
    },
  },
  brokenLinks: {
    enabled: true,
    excludeExternal: true,
  },
  seo: {
    enabled: true,
    requiredPages: ['/', '/about', '/services', '/showcase', '/contact'],
  },
  performance: {
    enabled: true,
    maxLoadTime: 3000, // 3 seconds
  },
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }[type];

  console.log(`${prefix} [${timestamp}] ${message}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      timeout: TIMEOUT,
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

// Test functions
async function testSiteAvailability() {
  log('Testing site availability...');

  const result = runCommand(
    `curl -I -s -o /dev/null -w "%{http_code}" ${SITE_URL}`
  );

  if (result.success && result.output.trim() === '200') {
    log('Site is available and responding', 'success');
    return true;
  } else {
    log(`Site availability check failed: HTTP ${result.output}`, 'error');
    return false;
  }
}

async function runLighthouseTests() {
  if (!tests.lighthouse.enabled) {
    log('Lighthouse tests disabled', 'warning');
    return true;
  }

  log('Running Lighthouse performance tests...');

  try {
    // Install lighthouse if not available
    runCommand('npm list -g @lhci/cli || npm install -g @lhci/cli@0.12.x');

    const result = runCommand(
      `lhci autorun --collect.url="${SITE_URL}" --upload.target=temporary-public-storage`
    );

    if (result.success) {
      log('Lighthouse tests completed successfully', 'success');
      return true;
    } else {
      log(`Lighthouse tests failed: ${result.error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Lighthouse test error: ${error.message}`, 'error');
    return false;
  }
}

async function checkBrokenLinks() {
  if (!tests.brokenLinks.enabled) {
    log('Broken link check disabled', 'warning');
    return true;
  }

  log('Checking for broken links...');

  const excludeFlag = tests.brokenLinks.excludeExternal
    ? '--exclude-external'
    : '';
  const result = runCommand(
    `npx broken-link-checker ${SITE_URL} --recursive --ordered ${excludeFlag}`
  );

  if (result.success) {
    log('No broken links found', 'success');
    return true;
  } else {
    log(`Broken links detected: ${result.error}`, 'warning');
    // Don't fail deployment for broken external links
    return !tests.brokenLinks.excludeExternal;
  }
}

async function validateSEO() {
  if (!tests.seo.enabled) {
    log('SEO validation disabled', 'warning');
    return true;
  }

  log('Validating SEO implementation...');

  let allPassed = true;

  for (const page of tests.seo.requiredPages) {
    const url = `${SITE_URL}${page}`;
    log(`Checking SEO for ${url}...`);

    // Check for required meta tags
    const result = runCommand(
      `curl -s "${url}" | grep -i "meta.*description\\|meta.*title\\|meta.*og:"`,
      {
        stdio: 'pipe',
      }
    );

    if (result.success && result.output.trim()) {
      log(`SEO tags found for ${page}`, 'success');
    } else {
      log(`Missing SEO tags for ${page}`, 'warning');
      allPassed = false;
    }
  }

  return allPassed;
}

async function testPerformance() {
  if (!tests.performance.enabled) {
    log('Performance tests disabled', 'warning');
    return true;
  }

  log('Testing site performance...');

  const startTime = Date.now();
  const result = runCommand(
    `curl -s -o /dev/null -w "%{time_total}" ${SITE_URL}`
  );
  const loadTime = parseFloat(result.output) * 1000; // Convert to milliseconds

  if (loadTime <= tests.performance.maxLoadTime) {
    log(
      `Site loads in ${loadTime.toFixed(0)}ms (under ${tests.performance.maxLoadTime}ms threshold)`,
      'success'
    );
    return true;
  } else {
    log(
      `Site loads in ${loadTime.toFixed(0)}ms (exceeds ${tests.performance.maxLoadTime}ms threshold)`,
      'warning'
    );
    return false;
  }
}

// Main verification function
async function verifyDeployment() {
  log('Starting deployment verification...');
  log(`Target URL: ${SITE_URL}`);

  const results = {
    availability: false,
    lighthouse: false,
    brokenLinks: false,
    seo: false,
    performance: false,
  };

  try {
    // Test site availability first
    results.availability = await testSiteAvailability();

    if (!results.availability) {
      log('Site is not available, skipping other tests', 'error');
      return false;
    }

    // Wait a moment for site to be fully ready
    log('Waiting for site to be fully ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Run all tests
    results.lighthouse = await runLighthouseTests();
    results.brokenLinks = await checkBrokenLinks();
    results.seo = await validateSEO();
    results.performance = await testPerformance();

    // Generate report
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    log(`\n📊 Verification Results: ${passed}/${total} tests passed`);

    Object.entries(results).forEach(([test, passed]) => {
      log(`${test}: ${passed ? 'PASS' : 'FAIL'}`, passed ? 'success' : 'error');
    });

    // Determine overall success
    const criticalTests = ['availability', 'performance'];
    const criticalPassed = criticalTests.every(test => results[test]);

    if (criticalPassed) {
      log('\n🎉 Deployment verification completed successfully!', 'success');
      return true;
    } else {
      log('\n💥 Deployment verification failed on critical tests', 'error');
      return false;
    }
  } catch (error) {
    log(`Verification error: ${error.message}`, 'error');
    return false;
  }
}

// Export for use in other scripts
export { verifyDeployment, testSiteAvailability, runLighthouseTests };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDeployment()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}
