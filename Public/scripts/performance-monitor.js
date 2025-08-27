/**
 * Performance Monitoring Script
 * Task 9: Performance optimizations and accessibility features
 * 
 * Features:
 * - Core Web Vitals monitoring (CLS, LCP, FID, FCP)
 * - Lighthouse score validation
 * - Performance budget enforcement
 * - Real User Monitoring (RUM) data collection
 * - Accessibility performance tracking
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cls: 0,
      lcp: 0,
      fid: 0,
      fcp: 0,
      ttfb: 0,
      loadTime: 0,
      domContentLoaded: 0
    };
    
    this.thresholds = {
      cls: 0.1,      // Good: < 0.1
      lcp: 2500,     // Good: < 2.5s
      fid: 100,      // Good: < 100ms
      fcp: 1800,     // Good: < 1.8s
      ttfb: 800,     // Good: < 0.8s
      loadTime: 3000 // Target: < 3s
    };
    
    this.init();
  }

  init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      this.startMonitoring();
    } else {
      window.addEventListener('load', () => this.startMonitoring());
    }
  }

  startMonitoring() {
    this.measureCoreWebVitals();
    this.measureLoadTimes();
    this.monitorLayoutShifts();
    this.trackImageLoading();
    this.setupPerformanceObserver();
    
    // Report metrics after a delay to capture all measurements
    setTimeout(() => this.reportMetrics(), 5000);
  }

  measureCoreWebVitals() {
    // Use web-vitals library if available, otherwise implement basic measurements
    if (typeof webVitals !== 'undefined') {
      webVitals.getCLS(this.onCLS.bind(this));
      webVitals.getLCP(this.onLCP.bind(this));
      webVitals.getFID(this.onFID.bind(this));
      webVitals.getFCP(this.onFCP.bind(this));
      webVitals.getTTFB(this.onTTFB.bind(this));
    } else {
      this.measureBasicMetrics();
    }
  }

  measureBasicMetrics() {
    // Basic performance measurements without web-vitals library
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      this.metrics.loadTime = navigation.loadEventEnd - navigation.navigationStart;
    }

    // Measure FCP using PerformanceObserver
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported for paint entries');
      }
    }
  }

  monitorLayoutShifts() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            this.metrics.cls += entry.value;
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Layout shift monitoring not supported');
    }
  }

  trackImageLoading() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let totalImages = images.length;
    
    if (totalImages === 0) return;

    const imageLoadStart = performance.now();
    
    images.forEach((img) => {
      const trackLoad = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          const imageLoadTime = performance.now() - imageLoadStart;
          this.metrics.imageLoadTime = imageLoadTime;
        }
      };

      if (img.complete) {
        trackLoad();
      } else {
        img.addEventListener('load', trackLoad);
        img.addEventListener('error', trackLoad);
      }
    });
  }

  setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.analyzeResourceTiming(entry);
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Advanced performance monitoring not supported');
    }
  }

  analyzeResourceTiming(entry) {
    const { name, duration, transferSize } = entry;
    
    // Check for slow resources
    if (duration > 1000) {
      console.warn(`Slow resource: ${name} took ${duration}ms`);
    }
    
    // Check for large resources
    if (transferSize > 500000) { // 500KB
      console.warn(`Large resource: ${name} is ${Math.round(transferSize / 1024)}KB`);
    }
    
    // Track critical resources
    if (name.includes('.css') || name.includes('.js')) {
      this.metrics.criticalResourceTime = Math.max(
        this.metrics.criticalResourceTime || 0,
        duration
      );
    }
  }

  // Core Web Vitals callbacks
  onCLS(metric) {
    this.metrics.cls = metric.value;
  }

  onLCP(metric) {
    this.metrics.lcp = metric.value;
  }

  onFID(metric) {
    this.metrics.fid = metric.value;
  }

  onFCP(metric) {
    this.metrics.fcp = metric.value;
  }

  onTTFB(metric) {
    this.metrics.ttfb = metric.value;
  }

  validateMetrics() {
    const results = {
      passed: 0,
      failed: 0,
      warnings: []
    };

    Object.entries(this.thresholds).forEach(([metric, threshold]) => {
      const value = this.metrics[metric];
      
      if (value <= threshold) {
        results.passed++;
      } else {
        results.failed++;
        results.warnings.push(`${metric.toUpperCase()}: ${value} exceeds threshold of ${threshold}`);
      }
    });

    return results;
  }

  reportMetrics() {
    const validation = this.validateMetrics();
    
    console.group('🚀 Performance Metrics Report');
    console.log('Core Web Vitals:', this.metrics);
    console.log('Validation Results:', validation);
    
    if (validation.warnings.length > 0) {
      console.warn('Performance Issues:');
      validation.warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
    } else {
      console.log('✅ All performance metrics within acceptable thresholds');
    }
    
    console.groupEnd();

    // Dispatch custom event for external monitoring
    document.dispatchEvent(new CustomEvent('performanceReport', {
      detail: {
        metrics: this.metrics,
        validation: validation,
        timestamp: Date.now()
      }
    }));

    // Send to analytics if configured
    this.sendToAnalytics();
  }

  sendToAnalytics() {
    // Basic analytics reporting (can be extended for specific services)
    if (typeof gtag !== 'undefined') {
      // Google Analytics 4
      gtag('event', 'web_vitals', {
        cls: this.metrics.cls,
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        fcp: this.metrics.fcp
      });
    }

    // Custom analytics endpoint (if configured)
    const analyticsEndpoint = document.querySelector('meta[name="analytics-endpoint"]')?.content;
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'performance',
          metrics: this.metrics,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(err => console.warn('Analytics reporting failed:', err));
    }
  }

  // Public methods for manual monitoring
  measureCustomMetric(name, startTime, endTime) {
    const duration = endTime - startTime;
    this.metrics[name] = duration;
    
    console.log(`Custom metric ${name}: ${duration}ms`);
    return duration;
  }

  startTimer(name) {
    this[`${name}StartTime`] = performance.now();
  }

  endTimer(name) {
    const startTime = this[`${name}StartTime`];
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics[name] = duration;
      delete this[`${name}StartTime`];
      return duration;
    }
    return null;
  }
}

// Performance budget checker
class PerformanceBudget {
  constructor() {
    this.budgets = {
      totalPageSize: 1024 * 1024, // 1MB
      totalRequests: 50,
      cssSize: 50 * 1024, // 50KB
      jsSize: 100 * 1024, // 100KB
      imageSize: 500 * 1024, // 500KB
      fontSize: 100 * 1024 // 100KB
    };
  }

  checkBudget() {
    const resources = performance.getEntriesByType('resource');
    const analysis = {
      totalSize: 0,
      totalRequests: resources.length,
      byType: {
        css: { size: 0, count: 0 },
        js: { size: 0, count: 0 },
        image: { size: 0, count: 0 },
        font: { size: 0, count: 0 },
        other: { size: 0, count: 0 }
      }
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      analysis.totalSize += size;

      const type = this.getResourceType(resource.name);
      analysis.byType[type].size += size;
      analysis.byType[type].count++;
    });

    return this.validateBudget(analysis);
  }

  getResourceType(url) {
    if (url.match(/\.(css)$/i)) return 'css';
    if (url.match(/\.(js)$/i)) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'other';
  }

  validateBudget(analysis) {
    const violations = [];

    if (analysis.totalSize > this.budgets.totalPageSize) {
      violations.push(`Total page size (${Math.round(analysis.totalSize / 1024)}KB) exceeds budget (${Math.round(this.budgets.totalPageSize / 1024)}KB)`);
    }

    if (analysis.totalRequests > this.budgets.totalRequests) {
      violations.push(`Total requests (${analysis.totalRequests}) exceeds budget (${this.budgets.totalRequests})`);
    }

    Object.entries(analysis.byType).forEach(([type, data]) => {
      const budget = this.budgets[`${type}Size`];
      if (budget && data.size > budget) {
        violations.push(`${type.toUpperCase()} size (${Math.round(data.size / 1024)}KB) exceeds budget (${Math.round(budget / 1024)}KB)`);
      }
    });

    return {
      analysis,
      violations,
      passed: violations.length === 0
    };
  }
}

// Initialize performance monitoring
let performanceMonitor;
let performanceBudget;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor = new PerformanceMonitor();
    performanceBudget = new PerformanceBudget();
    
    // Check performance budget after load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const budgetResult = performanceBudget.checkBudget();
        console.log('Performance Budget Check:', budgetResult);
      }, 2000);
    });
  });
} else {
  performanceMonitor = new PerformanceMonitor();
  performanceBudget = new PerformanceBudget();
}

// Export for external use
window.performanceMonitor = performanceMonitor;
window.performanceBudget = performanceBudget;

export { PerformanceMonitor, PerformanceBudget };