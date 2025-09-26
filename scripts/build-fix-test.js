#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class BuildFixTestRunner {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.testResults = {};
    this.startTime = Date.now();
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  logStep(step, message) {
    this.log(`\n${colors.bright}${colors.blue}=== ${step} ===${colors.reset}`);
    this.log(message);
  }

  logSuccess(message) {
    this.log(`${colors.green}✓ ${message}${colors.reset}`);
  }

  logError(message) {
    this.log(`${colors.red}✗ ${message}${colors.reset}`);
    this.errors.push(message);
  }

  logWarning(message) {
    this.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
    this.warnings.push(message);
  }

  logFix(message) {
    this.log(`${colors.magenta}🔧 ${message}${colors.reset}`);
    this.fixes.push(message);
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn('sh', ['-c', command], {
        stdio: 'pipe',
        ...options,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', data => {
        stdout += data.toString();
      });

      child.stderr.on('data', data => {
        stderr += data.toString();
      });

      child.on('close', code => {
        resolve({
          code,
          stdout,
          stderr,
          success: code === 0,
        });
      });

      child.on('error', error => {
        reject(error);
      });
    });
  }

  async checkDependencies() {
    this.logStep('DEPENDENCY CHECK', 'Verifying required dependencies...');

    const requiredDeps = [
      'astro',
      'typescript',
      'eslint',
      'prettier',
      'vitest',
      '@playwright/test',
    ];

    for (const dep of requiredDeps) {
      try {
        execSync(`npm list ${dep}`, { stdio: 'ignore' });
        this.logSuccess(`Found ${dep}`);
      } catch (error) {
        this.logError(`Missing dependency: ${dep}`);
        this.log(`Installing ${dep}...`);
        try {
          execSync(`npm install ${dep}`, { stdio: 'inherit' });
          this.logSuccess(`Installed ${dep}`);
        } catch (installError) {
          this.logError(`Failed to install ${dep}`);
        }
      }
    }
  }

  async buildSite() {
    this.logStep('BUILD', 'Building the site...');

    try {
      const result = await this.runCommand('npm run build');

      if (result.success) {
        this.logSuccess('Site built successfully');
        return true;
      } else {
        this.logError('Build failed');
        this.log('Build output:', colors.yellow);
        console.log(result.stdout);
        console.log(result.stderr);
        return false;
      }
    } catch (error) {
      this.logError(`Build error: ${error.message}`);
      return false;
    }
  }

  async fixLintingIssues() {
    this.logStep('LINT FIX', 'Fixing linting issues...');

    try {
      const result = await this.runCommand('npm run lint:fix');

      if (result.success) {
        this.logSuccess('Linting issues fixed');
        if (result.stdout.includes('fixed')) {
          this.logFix('Auto-fixed linting issues');
        }
        return true;
      } else {
        this.logWarning('Some linting issues could not be auto-fixed');
        console.log(result.stdout);
        return false;
      }
    } catch (error) {
      this.logError(`Lint fix error: ${error.message}`);
      return false;
    }
  }

  async fixFormattingIssues() {
    this.logStep('FORMAT FIX', 'Fixing formatting issues...');

    try {
      const result = await this.runCommand('npm run format');

      if (result.success) {
        this.logSuccess('Formatting issues fixed');
        this.logFix('Auto-formatted code');
        return true;
      } else {
        this.logError('Formatting failed');
        console.log(result.stderr);
        return false;
      }
    } catch (error) {
      this.logError(`Format fix error: ${error.message}`);
      return false;
    }
  }

  async runTypeCheck() {
    this.logStep('TYPE CHECK', 'Running TypeScript type checking...');

    try {
      const result = await this.runCommand('npx tsc --noEmit');

      if (result.success) {
        this.logSuccess('TypeScript type checking passed');
        return true;
      } else {
        this.logError('TypeScript type checking failed');
        console.log(result.stdout);
        console.log(result.stderr);
        return false;
      }
    } catch (error) {
      this.logError(`Type check error: ${error.message}`);
      return false;
    }
  }

  async runUnitTests() {
    this.logStep('UNIT TESTS', 'Running unit tests...');

    try {
      const result = await this.runCommand('npm run test');

      if (result.success) {
        this.logSuccess('Unit tests passed');
        this.testResults.unit = { passed: true, output: result.stdout };
        return true;
      } else {
        this.logError('Unit tests failed');
        console.log(result.stdout);
        console.log(result.stderr);
        this.testResults.unit = {
          passed: false,
          output: result.stdout + result.stderr,
        };
        return false;
      }
    } catch (error) {
      this.logError(`Unit test error: ${error.message}`);
      this.testResults.unit = { passed: false, error: error.message };
      return false;
    }
  }

  async runE2ETests() {
    this.logStep('E2E TESTS', 'Running end-to-end tests...');

    try {
      const result = await this.runCommand('npm run test:e2e');

      if (result.success) {
        this.logSuccess('E2E tests passed');
        this.testResults.e2e = { passed: true, output: result.stdout };
        return true;
      } else {
        this.logError('E2E tests failed');
        console.log(result.stdout);
        console.log(result.stderr);
        this.testResults.e2e = {
          passed: false,
          output: result.stdout + result.stderr,
        };
        return false;
      }
    } catch (error) {
      this.logError(`E2E test error: ${error.message}`);
      this.testResults.e2e = { passed: false, error: error.message };
      return false;
    }
  }

  async runAccessibilityTests() {
    this.logStep('ACCESSIBILITY TESTS', 'Running accessibility tests...');

    try {
      const result = await this.runCommand('npm run test:accessibility');

      if (result.success) {
        this.logSuccess('Accessibility tests passed');
        this.testResults.accessibility = {
          passed: true,
          output: result.stdout,
        };
        return true;
      } else {
        this.logError('Accessibility tests failed');
        console.log(result.stdout);
        console.log(result.stderr);
        this.testResults.accessibility = {
          passed: false,
          output: result.stdout + result.stderr,
        };
        return false;
      }
    } catch (error) {
      this.logError(`Accessibility test error: ${error.message}`);
      this.testResults.accessibility = { passed: false, error: error.message };
      return false;
    }
  }

  async runPerformanceTests() {
    this.logStep('PERFORMANCE TESTS', 'Running performance tests...');

    try {
      const result = await this.runCommand('npm run test:performance');

      if (result.success) {
        this.logSuccess('Performance tests passed');
        this.testResults.performance = { passed: true, output: result.stdout };
        return true;
      } else {
        this.logError('Performance tests failed');
        console.log(result.stdout);
        console.log(result.stderr);
        this.testResults.performance = {
          passed: false,
          output: result.stdout + result.stderr,
        };
        return false;
      }
    } catch (error) {
      this.logError(`Performance test error: ${error.message}`);
      this.testResults.performance = { passed: false, error: error.message };
      return false;
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);

    this.logStep('SUMMARY REPORT', 'Build, Fix, and Test Summary');

    this.log(`\n${colors.bright}Duration: ${duration}s${colors.reset}`);

    if (this.fixes.length > 0) {
      this.log(`\n${colors.magenta}Fixes Applied:${colors.reset}`);
      this.fixes.forEach(fix => this.log(`  • ${fix}`));
    }

    if (this.warnings.length > 0) {
      this.log(`\n${colors.yellow}Warnings:${colors.reset}`);
      this.warnings.forEach(warning => this.log(`  • ${warning}`));
    }

    if (this.errors.length > 0) {
      this.log(`\n${colors.red}Errors:${colors.reset}`);
      this.errors.forEach(error => this.log(`  • ${error}`));
    }

    this.log(`\n${colors.bright}Test Results:${colors.reset}`);
    Object.entries(this.testResults).forEach(([test, result]) => {
      const status = result.passed
        ? `${colors.green}✓ PASSED${colors.reset}`
        : `${colors.red}✗ FAILED${colors.reset}`;
      this.log(`  ${test}: ${status}`);
    });

    const allTestsPassed = Object.values(this.testResults).every(
      result => result.passed
    );
    const hasErrors = this.errors.length > 0;

    if (allTestsPassed && !hasErrors) {
      this.log(
        `\n${colors.bright}${colors.green}🎉 ALL CHECKS PASSED!${colors.reset}`
      );
      this.log(`${colors.green}Site is ready for deployment.${colors.reset}`);
    } else {
      this.log(`\n${colors.bright}${colors.red}❌ ISSUES FOUND${colors.reset}`);
      this.log(
        `${colors.yellow}Please review and fix the issues above.${colors.reset}`
      );
    }

    return {
      success: allTestsPassed && !hasErrors,
      duration,
      fixes: this.fixes,
      warnings: this.warnings,
      errors: this.errors,
      testResults: this.testResults,
    };
  }

  async run() {
    this.log(
      `${colors.bright}${colors.cyan}🚀 Build, Fix, and Test Runner${colors.reset}`
    );
    this.log(
      `${colors.cyan}=====================================${colors.reset}`
    );

    try {
      await this.checkDependencies();

      let buildSuccess = await this.buildSite();
      if (!buildSuccess) {
        this.log('\nAttempting to fix issues and rebuild...');

        await this.fixLintingIssues();
        await this.fixFormattingIssues();

        buildSuccess = await this.buildSite();
        if (!buildSuccess) {
          this.logError(
            'Build failed even after fixes. Please check manually.'
          );
        }
      }

      if (buildSuccess) {
        await this.runTypeCheck();

        const testResults = await Promise.allSettled([
          this.runUnitTests(),
          this.runE2ETests(),
          this.runAccessibilityTests(),
          this.runPerformanceTests(),
        ]);

        const failedTests = testResults.filter(
          result =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && !result.value)
        );

        if (failedTests.length > 0) {
          this.logWarning(`${failedTests.length} test suite(s) failed`);
        }
      }

      const report = this.generateReport();

      if (!report.success) {
        process.exit(1);
      }
    } catch (error) {
      this.logError(`Fatal error: ${error.message}`);
      process.exit(1);
    }
  }
}

const runner = new BuildFixTestRunner();
runner.run();
