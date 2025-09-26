const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Regression test configuration
const REGRESSION_CONFIG = {
  // Critical user flows to test after deployments
  criticalFlows: [
    'navigation',
    'contact-form',
    'project-showcase',
    'responsive-design',
  ],

  // Performance benchmarks to maintain
  performanceBenchmarks: {
    lighthouse: {
      performance: 90,
      accessibility: 95,
      seo: 95,
    },
    loadTime: 3000, // 3 seconds max
    bundleSize: {
      css: 50 * 1024, // 50KB
      js: 100 * 1024, // 100KB
    },
  },

  // Visual regression testing (basic)
  visualTests: [
    { page: '/', name: 'homepage' },
    { page: '/services', name: 'services' },
    { page: '/showcase', name: 'showcase' },
    { page: '/contact', name: 'contact' },
  ],
};

class RegressionTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: 0,
      failed: 0,
      tests: [],
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix =
      {
        info: '📋',
        success: '✅',
        error: '❌',
        warning: '⚠️',
      }[type] || '📋';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFunction) {
    this.log(`Running ${testName}...`);

    try {
      const startTime = Date.now();
      await testFunction();
      const duration = Date.now() - startTime;

      this.results.passed++;
      this.results.tests.push({
        name: testName,
        status: 'passed',
        duration,
      });

      this.log(`${testName} passed (${duration}ms)`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({
        name: testName,
        status: 'failed',
        error: error.message,
      });

      this.log(`${testName} failed: ${error.message}`, 'error');
    }
  }

  async testBundleSize() {
    const distPath = path.join(process.cwd(), 'dist');

    if (!fs.existsSync(distPath)) {
      throw new Error('Build directory not found. Run npm run build first.');
    }

    // Check CSS bundle size
    const cssFiles = fs
      .readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.css'));

    let totalCssSize = 0;
    cssFiles.forEach(file => {
      const filePath = path.join(distPath, 'assets', file);
      totalCssSize += fs.statSync(filePath).size;
    });

    if (totalCssSize > REGRESSION_CONFIG.performanceBenchmarks.bundleSize.css) {
      throw new Error(
        `CSS bundle too large: ${totalCssSize} bytes (max: ${REGRESSION_CONFIG.performanceBenchmarks.bundleSize.css})`
      );
    }

    // Check JS bundle size
    const jsFiles = fs
      .readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.js'));

    let totalJsSize = 0;
    jsFiles.forEach(file => {
      const filePath = path.join(distPath, 'assets', file);
      totalJsSize += fs.statSync(filePath).size;
    });

    if (totalJsSize > REGRESSION_CONFIG.performanceBenchmarks.bundleSize.js) {
      throw new Error(
        `JS bundle too large: ${totalJsSize} bytes (max: ${REGRESSION_CONFIG.performanceBenchmarks.bundleSize.js})`
      );
    }

    this.log(`Bundle sizes OK - CSS: ${totalCssSize}B, JS: ${totalJsSize}B`);
  }

  async testCriticalFlows() {
    // Run Playwright tests for critical flows
    try {
      execSync(
        'npx playwright test --reporter=json > playwright-results.json',
        {
          stdio: 'pipe',
        }
      );

      const results = JSON.parse(
        fs.readFileSync('playwright-results.json', 'utf8')
      );

      if (results.stats.failed > 0) {
        throw new Error(`${results.stats.failed} critical flow tests failed`);
      }

      this.log(`All ${results.stats.passed} critical flow tests passed`);
    } catch (error) {
      if (error.stdout) {
        this.log(error.stdout.toString(), 'error');
      }
      throw new Error('Critical flow tests failed');
    }
  }

  async testPerformance() {
    // Run Lighthouse performance test
    try {
      execSync('node tests/performance/lighthouse-test.js', {
        stdio: 'pipe',
      });

      this.log('Performance benchmarks met');
    } catch (error) {
      throw new Error('Performance benchmarks not met');
    }
  }

  async testAccessibility() {
    // Run accessibility tests
    try {
      execSync('npm run test:accessibility', {
        stdio: 'pipe',
      });

      this.log('Accessibility tests passed');
    } catch (error) {
      throw new Error('Accessibility tests failed');
    }
  }

  async testVisualRegression() {
    // Basic visual regression - check if pages load without errors
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      for (const test of REGRESSION_CONFIG.visualTests) {
        const baseUrl = process.env.CI ? 'http://localhost:4321/agrxculture' : 'http://localhost:4321';
        await page.goto(`${baseUrl}${test.page}`);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check for JavaScript errors
        const errors = await page.evaluate(() => {
          return window.errors || [];
        });

        if (errors.length > 0) {
          throw new Error(
            `JavaScript errors on ${test.page}: ${errors.join(', ')}`
          );
        }

        // Take screenshot for manual review (optional)
        const screenshotPath = path.join(
          process.cwd(),
          'regression-screenshots',
          `${test.name}.png`
        );
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        await page.screenshot({ path: screenshotPath });
      }

      this.log('Visual regression tests completed');
    } finally {
      await browser.close();
    }
  }

  async runFullSuite() {
    this.log('🚀 Starting regression test suite for agricultural portfolio');
    this.log('Testing critical functionality after deployment\n');

    // Run all regression tests
    await this.runTest('Bundle Size Check', () => this.testBundleSize());
    await this.runTest('Critical User Flows', () => this.testCriticalFlows());
    await this.runTest('Performance Benchmarks', () => this.testPerformance());
    await this.runTest('Accessibility Standards', () =>
      this.testAccessibility()
    );
    await this.runTest('Visual Regression', () => this.testVisualRegression());

    // Generate report
    const reportPath = path.join(process.cwd(), 'regression-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Summary
    const total = this.results.passed + this.results.failed;
    this.log(`\n📊 Regression Test Summary:`);
    this.log(`   Passed: ${this.results.passed}/${total}`);
    this.log(`   Failed: ${this.results.failed}/${total}`);
    this.log(`   Report: ${reportPath}`);

    if (this.results.failed > 0) {
      this.log(
        '\n❌ Regression tests failed. Check the report for details.',
        'error'
      );
      process.exit(1);
    } else {
      this.log(
        '\n✅ All regression tests passed! Deployment is safe.',
        'success'
      );
    }
  }
}

// Run regression suite if called directly
if (require.main === module) {
  const tester = new RegressionTester();
  tester.runFullSuite().catch(error => {
    console.error('❌ Regression test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { RegressionTester, REGRESSION_CONFIG };
