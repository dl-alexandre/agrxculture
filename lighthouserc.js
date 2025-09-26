module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npx serve dist -l 3000',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 10000,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/services',
        'http://localhost:3000/showcase',
        'http://localhost:3000/contact',
      ],
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
