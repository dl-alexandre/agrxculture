// Performance-optimized Service Worker for Agrxculture
const CACHE_NAME = 'agrxculture-v1';
const STATIC_CACHE = 'agrxculture-static-v1';
const DYNAMIC_CACHE = 'agrxculture-dynamic-v1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/agrxculture/',
  '/agrxculture/styles/critical.css',
  '/agrxculture/styles/layout.css',
  '/agrxculture/scripts/vendor.js',
  '/agrxculture/favicon.svg'
];

// Static resources to cache
const STATIC_RESOURCES = [
  '/agrxculture/styles/',
  '/agrxculture/scripts/',
  '/agrxculture/icons/',
  '/agrxculture/manifest.json'
];

// Image optimization cache
const IMAGE_CACHE = 'agrxculture-images-v1';

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle different resource types
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(handleStaticRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle image requests with optimization
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the image for future use
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Image fetch failed:', error);
    
    // Return a placeholder image if available
    const placeholderResponse = await cache.match('/agrxculture/icons/placeholder.svg');
    if (placeholderResponse) {
      return placeholderResponse;
    }
    
    throw error;
  }
}

// Handle static resource requests
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Static resource fetch failed:', error);
    throw error;
  }
}

// Handle document requests
async function handleDocumentRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache HTML pages for offline access
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Document fetch failed:', error);
    
    // Return cached version if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    const offlineResponse = await cache.match('/agrxculture/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    throw error;
  }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Dynamic request failed:', error);
    
    // Return cached version if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform background sync tasks
    console.log('Performing background sync');
    
    // Example: sync form submissions
    const formData = await getOfflineFormData();
    if (formData.length > 0) {
      await syncFormData(formData);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline form data
async function getOfflineFormData() {
  // Implementation depends on your storage strategy
  return [];
}

// Sync form data
async function syncFormData(formData) {
  // Implementation depends on your API
  console.log('Syncing form data:', formData);
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/agrxculture/icons/icon-192x192.png',
      badge: '/agrxculture/icons/icon-72x72.png',
      data: data.data,
      actions: data.actions || [],
      requireInteraction: true
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle specific action
    console.log('Notification action clicked:', event.action);
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/agrxculture/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Clean up old caches periodically
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== STATIC_CACHE && 
      name !== DYNAMIC_CACHE && 
      name !== IMAGE_CACHE
    );
    
    for (const cacheName of oldCaches) {
      await caches.delete(cacheName);
      console.log('Cleaned up old cache:', cacheName);
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}, 24 * 60 * 60 * 1000); // Run every 24 hours
