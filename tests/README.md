# Agricultural Portfolio Website - Test Suite

This comprehensive test suite ensures the agricultural portfolio website meets all requirements for form validation, accessibility, performance, and cross-browser compatibility.

## 📋 Requirements Coverage

This test suite covers the following requirements from the specification:

- **4.2**: Form validation and interactive components
- **4.3**: Contact form functionality and spam protection  
- **5.1**: Performance optimization and loading times
- **5.4**: Accessibility compliance and keyboard navigation

## 🧪 Test Categories

### 1. Unit Tests (`tests/unit/`)
- **Contact Form Validation**: Email format, required fields, character limits
- **Interactive Components**: Project filtering, navigation functionality
- **Form Error Handling**: Error display, validation messages

### 2. Accessibility Tests (`tests/accessibility/`)
- **axe-core Integration**: Automated accessibility scanning
- **WCAG 2.1 AA Compliance**: Color contrast, keyboard navigation
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Form Accessibility**: Proper labels, error announcements

### 3. End-to-End Tests (`tests/e2e/`)
- **Navigation Flow**: Multi-page navigation, mobile menu
- **Contact Form Submission**: Complete form workflow
- **Cross-Browser Compatibility**: Chrome, Firefox, Safari, mobile browsers
- **Responsive Design**: Multiple viewport sizes

### 4. Performance Tests (`tests/performance/`)
- **Lighthouse Automation**: Performance, accessibility, SEO scores
- **Core Web Vitals**: FCP, LCP, CLS measurements
- **3G Network Simulation**: Rural connectivity testing
- **Bundle Size Monitoring**: CSS/JS size limits

### 5. Regression Tests (`tests/regression/`)
- **Critical Flow Validation**: Post-deployment verification
- **Performance Benchmarks**: Maintaining speed standards
- **Visual Regression**: Screenshot comparison
- **Bundle Size Regression**: Preventing bloat

## 🚀 Running Tests

### Quick Start
```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test suites
npm run test              # Unit tests only
npm run test:e2e          # End-to-end tests
npm run test:accessibility # Accessibility tests
npm run test:performance  # Performance tests
```

### Individual Test Suites
```bash
# Unit tests with coverage
npm run test:coverage

# E2E tests with UI
npm run test:e2e:ui

# Performance tests (requires dev server)
npm run dev &
npm run test:performance

# Regression suite (post-deployment)
node tests/regression/regression-suite.js
```

### Custom Test Runner
```bash
# Run comprehensive test suite
node tests/test-runner.js

# Run specific categories
node tests/test-runner.js --unit --accessibility
node tests/test-runner.js --performance
node tests/test-runner.js --help
```

## 📊 Performance Thresholds

The test suite enforces these performance standards:

- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95  
- **Lighthouse SEO**: ≥95
- **First Contentful Paint**: ≤1.8s
- **Largest Contentful Paint**: ≤2.5s
- **Cumulative Layout Shift**: ≤0.1
- **CSS Bundle Size**: ≤50KB
- **JavaScript Bundle Size**: ≤100KB

## 🌐 Cross-Browser Testing

Tests run on multiple browsers and devices:

- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: iOS Safari, Chrome Mobile
- **Low-end Android**: Galaxy S5 simulation
- **Network Conditions**: 3G simulation for rural areas
- **Accessibility**: Reduced motion, keyboard-only navigation

## 🔧 Configuration Files

- `vitest.config.ts` - Unit test configuration
- `playwright.config.ts` - E2E test configuration  
- `tests/setup.ts` - Test environment setup
- `.github/workflows/test-suite.yml` - CI/CD automation

## 📈 Continuous Integration

GitHub Actions automatically runs:

- **On Push**: Unit, accessibility, E2E, performance tests
- **On PR**: Full test suite validation
- **Daily**: Regression tests for production monitoring
- **Cross-Platform**: Windows, macOS, Linux testing

## 🐛 Debugging Tests

### Local Development
```bash
# Run tests in watch mode
npm run test:watch

# Debug E2E tests with UI
npm run test:e2e:ui

# Generate test coverage report
npm run test:coverage
```

### CI/CD Debugging
- Check GitHub Actions logs for detailed error messages
- Download test artifacts (screenshots, reports) from failed runs
- Review Lighthouse reports for performance issues

## 📝 Test Reports

Tests generate detailed reports:

- `test-report.json` - Comprehensive test results
- `lighthouse-results.json` - Performance metrics
- `playwright-report/` - E2E test results with screenshots
- `regression-report.json` - Post-deployment validation
- `coverage/` - Code coverage reports

## 🎯 Agricultural Focus

Tests are specifically designed for agricultural portfolio requirements:

- **Rural Connectivity**: 3G network simulation
- **Low-end Devices**: Android device testing
- **Accessibility**: Farm equipment operator considerations
- **Performance**: Slow network tolerance
- **Form Validation**: Agricultural project type handling

## 🔄 Maintenance

### Adding New Tests
1. Create test files in appropriate category folder
2. Follow existing naming conventions (`*.test.ts`, `*.spec.ts`)
3. Update test runner configuration if needed
4. Add to CI/CD workflow if required

### Updating Thresholds
1. Modify `PERFORMANCE_THRESHOLDS` in `lighthouse-test.js`
2. Update `REGRESSION_CONFIG` in `regression-suite.js`
3. Adjust Playwright configuration for new browsers/devices

### Monitoring
- Review daily regression test results
- Monitor performance trends over time
- Update tests when requirements change
- Maintain browser compatibility matrix

## 🆘 Troubleshooting

### Common Issues
- **Port conflicts**: Ensure dev server runs on port 4321
- **Browser installation**: Run `npx playwright install`
- **Memory issues**: Increase Node.js memory limit for large test suites
- **Network timeouts**: Check internet connection for Lighthouse tests

### Getting Help
- Check test logs for specific error messages
- Review GitHub Actions workflow runs
- Validate local environment setup
- Ensure all dependencies are installed