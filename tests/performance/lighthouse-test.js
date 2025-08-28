import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

// Performance thresholds based on requirements
const PERFORMANCE_THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  'best-practices': 90,
  seo: 95,
  'first-contentful-paint': 1800, // 1.8 seconds
  'largest-contentful-paint': 2500, // 2.5 seconds
  'cumulative-layout-shift': 0.1,
  'speed-index': 3000,
};

// Test URLs (adjust based on your deployment)
const TEST_URLS = [
  'http://localhost:4321/',
  'http://localhost:4321/services',
  'http://localhost:4321/showcase',
  'http://localhost:4321/contact',
];

async function runLighthouseTest(url) {
  const chrome = await launch({
    chromeFlags: [
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-frame-sequence-analysis',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });
  
  const options = {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    }
  };

  try {
    const runnerResult = await lighthouse(url, options);
    await chrome.kill();
    
    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('Lighthouse returned no results');
    }
    
    return runnerResult.lhr;
  } catch (error) {
    await chrome.kill();
    console.error(`❌ Lighthouse test failed for ${url}:`, error.message);
    return null;
  }
}

function analyzeResults(lhr, url) {
  if (!lhr || !lhr.categories || !lhr.audits) {
    console.error(`❌ Invalid Lighthouse result for ${url}`);
    return {
      url,
      passed: false,
      error: 'Invalid Lighthouse result'
    };
  }

  const scores = lhr.categories;
  const audits = lhr.audits;
  
  const report = {
    url,
    timestamp: new Date().toISOString(),
    scores: {
      performance: Math.round(scores.performance.score * 100),
      accessibility: Math.round(scores.accessibility.score * 100),
      bestPractices: Math.round(scores['best-practices'].score * 100),
      seo: Math.round(scores.seo.score * 100),
    },
    metrics: {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
    },
    passed: true,
    failures: [],
  };

  // Check thresholds
  Object.entries(PERFORMANCE_THRESHOLDS).forEach(([metric, threshold]) => {
    let actualValue;
    
    if (metric in report.scores) {
      actualValue = report.scores[metric];
    } else if (metric in report.metrics) {
      actualValue = report.metrics[metric];
    } else {
      return;
    }

    const passed = metric.includes('shift') || metric.includes('paint') || metric.includes('index')
      ? actualValue <= threshold  // Lower is better for timing metrics
      : actualValue >= threshold; // Higher is better for scores

    if (!passed) {
      report.passed = false;
      report.failures.push({
        metric,
        expected: threshold,
        actual: actualValue,
        message: `${metric} failed: expected ${threshold}, got ${actualValue}`,
      });
    }
  });

  return report;
}

async function runAllTests() {
  console.log('🚀 Starting Lighthouse performance tests...');
  console.log('📊 Testing against agricultural portfolio requirements\n');
  
  const allResults = [];
  
  for (const url of TEST_URLS) {
    console.log(`Testing: ${url}`);
    
    try {
      const results = await runLighthouseTest(url);
      const analysis = analyzeResults(results, url);
      allResults.push(analysis);
      
      console.log(`✅ Performance: ${analysis.scores.performance}%`);
      console.log(`♿ Accessibility: ${analysis.scores.accessibility}%`);
      console.log(`🏆 Best Practices: ${analysis.scores.bestPractices}%`);
      console.log(`🔍 SEO: ${analysis.scores.seo}%`);
      console.log(`⚡ FCP: ${Math.round(analysis.metrics.firstContentfulPaint)}ms`);
      console.log(`🎯 LCP: ${Math.round(analysis.metrics.largestContentfulPaint)}ms`);
      
      if (!analysis.passed) {
        console.log('❌ Failures:');
        analysis.failures.forEach(failure => {
          console.log(`   - ${failure.message}`);
        });
      }
      
      console.log('');
    } catch (error) {
      console.error(`❌ Failed to test ${url}:`, error.message);
      allResults.push({
        url,
        error: error.message,
        passed: false,
      });
    }
  }

  // Save detailed results
  const reportPath = path.join(process.cwd(), 'lighthouse-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  
  // Summary
  const passedTests = allResults.filter(r => r.passed).length;
  const totalTests = allResults.length;
  
  console.log(`📋 Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(`📄 Detailed results saved to: ${reportPath}`);
  
  if (passedTests < totalTests) {
    console.log('❌ Some performance tests failed. Check the results above.');
    process.exit(1);
  } else {
    console.log('✅ All performance tests passed!');
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('❌ Performance test suite failed:', error);
    process.exit(1);
  });
}

export { runLighthouseTest, analyzeResults, PERFORMANCE_THRESHOLDS };
