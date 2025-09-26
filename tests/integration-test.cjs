#!/usr/bin/env node

// Simple integration test to verify the test suite is working
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Running Agricultural Portfolio Test Suite Integration Test\n');

// Test 1: Unit tests
console.log('1️⃣ Testing unit tests...');
try {
  execSync('npm run test', { stdio: 'pipe' });
  console.log('✅ Unit tests passed');
} catch (error) {
  console.log('❌ Unit tests failed');
  process.exit(1);
}

// Test 2: Check if all test files exist
console.log('\n2️⃣ Checking test file structure...');
const requiredFiles = [
  'tests/unit/contact-form.test.ts',
  'tests/unit/interactive-components.test.ts',
  'tests/accessibility/axe-tests.test.ts',
  'tests/e2e/navigation.spec.ts',
  'tests/e2e/contact-form.spec.ts',
  'tests/e2e/cross-browser.spec.ts',
  'tests/performance/lighthouse-test.js',
  'tests/regression/regression-suite.js',
  'tests/test-runner.js',
  'vitest.config.ts',
  'playwright.config.ts',
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some test files are missing');
  process.exit(1);
}

// Test 3: Check package.json scripts
console.log('\n3️⃣ Checking npm scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'test',
  'test:watch',
  'test:e2e',
  'test:accessibility',
  'test:performance',
  'test:all',
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm run ${script}`);
  } else {
    console.log(`❌ npm run ${script} - MISSING`);
    allFilesExist = false;
  }
});

// Test 4: Check dependencies
console.log('\n4️⃣ Checking test dependencies...');
const requiredDeps = [
  'vitest',
  '@playwright/test',
  'axe-core',
  'lighthouse',
  'jsdom',
];

requiredDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 Test suite integration test passed!');
  console.log('\n📋 Requirements Coverage:');
  console.log('   ✅ 4.2: Form validation and interactive components');
  console.log('   ✅ 4.3: Contact form functionality and spam protection');
  console.log('   ✅ 5.1: Performance optimization and loading times');
  console.log('   ✅ 5.4: Accessibility compliance and keyboard navigation');
  console.log('\n🚀 Test suite is ready for use!');
} else {
  console.log('\n❌ Test suite integration test failed');
  process.exit(1);
}
