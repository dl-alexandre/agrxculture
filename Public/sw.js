/**
 * Service Worker for Static Asset Caching
 * Task 9: Performance optimizations and accessibility features
 * 
 * Features:
 * - Basic static asset caching (no full PWA for MVP)
 * - Cache-first strategy for assets
 * - Network-first strategy for HTML
 * - Offline fallbacks for critical resources
 * - Cache versioning and cleanup
 */

const CACHE_NAME = 'agricultural-portfolio-v1.0.1';
const STATIC_CACHE = 'static-assets-v1.0.1';
const DYNAMIC_CACHE = 'dynamic-content-v1.0.1';

// Get base URL for proper path handling
const BASE_URL = self.location.pathname.includes('/agrxculture/')
  ? '/agrxculture'
  : '/';

// Assets to cache immediately
const STATIC_ASSETS = [
  `${BASE_URL}/`,
  `${BASE_URL}/styles/layout.css`,
  `${BASE_URL}/styles/tokens.css`,
  `${BASE_URL}/styles/images.css`,
  `${BASE_URL}/scripts/lazy-loading.js`,
  `${BASE_URL}/scripts/performance-monitor.js`,
  `${BASE_URL}/favicon.svg`,
  `${BASE_URL}/images/hero/agrxculture-logo.webp`,
  `${BASE_URL}/images/hero/agricultural-background-mobile.webp`
];

// Assets to cache on first request
const CACHE_ON_REQUEST = [
  '/images/',
  '/assets/',
  '/scripts/',
  '/styles/'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  '/contact',
  '/_astro/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v1.0.1 - Force cache clear');
  
  event.waitUntil(
    // Clear all existing caches first
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        return caches.open(STATIC_CACHE);
      })
      .then((cache) => {
        console.log('Service Worker: Caching static assets with new paths');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine caching strategy based on request
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isNetworkFirst(request.url)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isHTML(request)) {
    event.respondWith(networkFirstWithFallback(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Content not available offline', { status: 503 });
  }
}

// Network-first with offline fallback for HTML
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback page
    const fallbackResponse = await caches.match(`${BASE_URL}/`);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    return new Response('Page not available offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return CACHE_ON_REQUEST.some(pattern => url.includes(pattern)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.webp') ||
         url.includes('.jpg') ||
         url.includes('.png') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2');
}

function isNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isHTML(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Background sync for form submissions (basic implementation)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const submissions = await getPendingSubmissions();
    
    for (const submission of submissions) {
      try {
        const response = await fetch(`${BASE_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('Form submission synced successfully');
        }
      } catch (error) {
        console.error('Failed to sync form submission:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline form submissions
async function getPendingSubmissions() {
  // Simplified implementation - in production would use IndexedDB
  return [];
}

async function removePendingSubmission(id) {
  // Simplified implementation - in production would use IndexedDB
  console.log('Removing pending submission:', id);
}

// Cache size management
async function manageCacheSize() {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE];
  const maxEntries = 50;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      // Remove oldest entries
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(entriesToDelete.map(key => cache.delete(key)));
      console.log(`Cleaned up ${entriesToDelete.length} entries from ${cacheName}`);
    }
  }
}

// Periodic cache cleanup
setInterval(manageCacheSize, 24 * 60 * 60 * 1000); // Daily cleanup