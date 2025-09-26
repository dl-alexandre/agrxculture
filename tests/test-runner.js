#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      unit: { passed: false, output: '' },
      accessibility: { passed: false, output: '' },
      e2e: { passed: false, output: '' },
      performance: { passed: false, output: '' },
      regression: { passed: false, output: '' },
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      error: '\x1b[31m', // Red
      warning: '\x1b[33m', // Yellow
      reset: '\x1b[0m', // Reset
    };

    const color = colors[type] || colors.info;
    console.log(`${color}${message}${colors.reset}`);
  }

  async runCommand(command, description) {
    this.log(`\n🔄 ${description}...`);

    try {
      const output = execSync(command, {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 300000, // 5 minutes timeout
      });

      this.log(`✅ ${description} completed successfully`, 'success');
      return { passed: true, output };
    } catch (error) {
      this.log(`❌ ${description} failed`, 'error');
      this.log(error.message, 'error');
      return { passed: false, output: error.message };
    }
  }

  async checkPrerequisites() {
    this.log('🔍 Checking prerequisites...');

    // Check if build exists
    if (!fs.existsSync('dist')) {
      this.log('Building project first...', 'warning');
      await this.runCommand('npm run build', 'Building project');
    }

    // Check if dev server is running (for E2E tests)
    try {
      const baseUrl = process.env.CI ? 'http://localhost:4321/agrxculture/' : 'http://localhost:4321/';
      const response = await fetch(baseUrl);
      this.log('✅ Dev server is running', 'success');
    } catch (error) {
      this.log(
        '⚠️  Dev server not running. E2E tests will start their own server.',
        'warning'
      );
    }
  }

  async runUnitTests() {
    this.results.unit = await this.runCommand(
      'npm run test',
      'Running unit tests (form validation, interactive components)'
    );
  }

  async runAccessibilityTests() {
    this.results.accessibility = await this.runCommand(
      'npm run test:accessibility',
      'Running accessibility tests with axe-core'
    );
  }

  async runE2ETests() {
    this.results.e2e = await this.runCommand(
      'npm run test:e2e',
      'Running end-to-end tests (navigation, form submission, cross-browser)'
    );
  }

  async runPerformanceTests() {
    // Start dev server if not running
    let devServer;
    try {
      const baseUrl = process.env.CI ? 'http://localhost:4321/agrxculture/' : 'http://localhost:4321/';
      await fetch(baseUrl);
    } catch (error) {
      this.log('Starting dev server for performance tests...', 'warning');
      devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: true,
      });

      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    try {
      this.results.performance = await this.runCommand(
        'npm run test:performance',
        'Running Lighthouse performance tests'
      );
    } finally {
      if (devServer) {
        process.kill(-devServer.pid);
      }
    }
  }

  async runRegressionTests() {
    this.results.regression = await this.runCommand(
      'node tests/regression/regression-suite.js',
      'Running regression test suite'
    );
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: Object.keys(this.results).length,
        passed: Object.values(this.results).filter(r => r.passed).length,
        failed: Object.values(this.results).filter(r => !r.passed).length,
      },
      results: this.results,
      requirements: {
        4.2: 'Form validation testing',
        4.3: 'Contact form functionality and spam protection',
        5.1: 'Performance optimization and loading times',
        5.4: 'Accessibility compliance and keyboard navigation',
      },
    };

    const reportPath = path.join(process.cwd(), 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return { report, reportPath };
  }

  async runAllTests() {
    this.log('🚀 Agricultural Portfolio Website - Comprehensive Test Suite');
    this.log('Testing Requirements: 4.2, 4.3, 5.1, 5.4\n');

    await this.checkPrerequisites();

    // Run all test suites
    await this.runUnitTests();
    await this.runAccessibilityTests();
    await this.runE2ETests();
    await this.runPerformanceTests();
    await this.runRegressionTests();

    // Generate and display report
    const { report, reportPath } = this.generateReport();

    this.log('\n📊 Test Suite Summary:');
    this.log(`   Total Suites: ${report.summary.total}`);
    this.log(
      `   Passed: ${report.summary.passed}`,
      report.summary.passed > 0 ? 'success' : 'info'
    );
    this.log(
      `   Failed: ${report.summary.failed}`,
      report.summary.failed > 0 ? 'error' : 'info'
    );
    this.log(`   Report: ${reportPath}`);

    // Detailed results
    this.log('\n📋 Detailed Results:');
    Object.entries(this.results).forEach(([suite, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const color = result.passed ? 'success' : 'error';
      this.log(`   ${suite.padEnd(15)} ${status}`, color);
    });

    // Requirements coverage
    this.log('\n📝 Requirements Coverage:');
    Object.entries(report.requirements).forEach(([req, desc]) => {
      this.log(`   ${req}: ${desc}`);
    });

    if (report.summary.failed > 0) {
      this.log(
        '\n❌ Some tests failed. Review the detailed report above.',
        'error'
      );
      process.exit(1);
    } else {
      this.log(
        '\n🎉 All tests passed! The agricultural portfolio website is ready for production.',
        'success'
      );
    }
  }
}

// CLI interface
const args = process.argv.slice(2);
const runner = new TestRunner();

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Agricultural Portfolio Website Test Suite

Usage: node tests/test-runner.js [options]

Options:
  --unit          Run only unit tests
  --accessibility Run only accessibility tests  
  --e2e           Run only end-to-end tests
  --performance   Run only performance tests
  --regression    Run only regression tests
  --help, -h      Show this help message

Examples:
  node tests/test-runner.js                    # Run all tests
  node tests/test-runner.js --unit             # Run only unit tests
  node tests/test-runner.js --performance      # Run only performance tests
  `);
  process.exit(0);
}

// Run specific test suites based on arguments
if (args.length > 0) {
  (async () => {
    await runner.checkPrerequisites();

    if (args.includes('--unit')) await runner.runUnitTests();
    if (args.includes('--accessibility')) await runner.runAccessibilityTests();
    if (args.includes('--e2e')) await runner.runE2ETests();
    if (args.includes('--performance')) await runner.runPerformanceTests();
    if (args.includes('--regression')) await runner.runRegressionTests();

    const { report } = runner.generateReport();

    if (report.summary.failed > 0) {
      process.exit(1);
    }
  })();
} else {
  // Run all tests
  runner.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
