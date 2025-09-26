/**
 * Service Worker Registration
 * Task 9: Performance optimizations and accessibility features
 *
 * Features:
 * - Progressive enhancement (works without SW)
 * - Graceful fallback for unsupported browsers
 * - Update notifications for new versions
 * - Performance monitoring integration
 */

class ServiceWorkerManager {
  constructor() {
    this.swRegistration = null;
    this.updateAvailable = false;
    this.init();
  }

  async init() {
    // Check for service worker support
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      await this.registerServiceWorker();
      this.setupUpdateHandling();
      this.setupPerformanceIntegration();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully');

      // Handle different registration states
      if (this.swRegistration.installing) {
        console.log('Service Worker installing...');
        this.trackInstallProgress(this.swRegistration.installing);
      } else if (this.swRegistration.waiting) {
        console.log('Service Worker waiting...');
        this.showUpdateAvailable();
      } else if (this.swRegistration.active) {
        console.log('Service Worker active');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  setupUpdateHandling() {
    if (!this.swRegistration) return;

    // Listen for updates
    this.swRegistration.addEventListener('updatefound', () => {
      const newWorker = this.swRegistration.installing;

      if (newWorker) {
        this.trackInstallProgress(newWorker);

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            this.showUpdateAvailable();
          }
        });
      }
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      // Optionally reload the page
      if (this.updateAvailable) {
        window.location.reload();
      }
    });
  }

  trackInstallProgress(worker) {
    worker.addEventListener('statechange', () => {
      console.log('Service Worker state changed:', worker.state);

      switch (worker.state) {
        case 'installed':
          console.log('Service Worker installed');
          break;
        case 'activated':
          console.log('Service Worker activated');
          this.onServiceWorkerReady();
          break;
        case 'redundant':
          console.log('Service Worker redundant');
          break;
      }
    });
  }

  showUpdateAvailable() {
    this.updateAvailable = true;
    console.log('App update available');

    // Dispatch custom event for UI to handle
    document.dispatchEvent(
      new CustomEvent('swUpdateAvailable', {
        detail: {
          registration: this.swRegistration,
        },
      })
    );

    // Show subtle notification (non-intrusive)
    this.showUpdateNotification();
  }

  showUpdateNotification() {
    // Create a subtle update notification
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="sw-update-content">
        <span>A new version is available</span>
        <button class="sw-update-button" onclick="window.swManager.applyUpdate()">
          Update
        </button>
        <button class="sw-update-dismiss" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .sw-update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary, #2E7D32);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      }
      
      .sw-update-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .sw-update-button {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .sw-update-button:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .sw-update-dismiss {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 480px) {
        .sw-update-notification {
          bottom: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  async applyUpdate() {
    if (!this.swRegistration || !this.swRegistration.waiting) {
      return;
    }

    // Tell the waiting service worker to skip waiting
    this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Remove notification
    const notification = document.querySelector('.sw-update-notification');
    if (notification) {
      notification.remove();
    }
  }

  setupPerformanceIntegration() {
    // Integrate with performance monitoring
    document.addEventListener('performanceReport', event => {
      const { metrics } = event.detail;

      // Send performance data to service worker for caching decisions
      if (this.swRegistration && this.swRegistration.active) {
        this.swRegistration.active.postMessage({
          type: 'PERFORMANCE_DATA',
          metrics: metrics,
        });
      }
    });
  }

  onServiceWorkerReady() {
    console.log('Service Worker ready');

    // Dispatch ready event
    document.dispatchEvent(
      new CustomEvent('swReady', {
        detail: {
          registration: this.swRegistration,
        },
      })
    );

    // Preload critical resources
    this.preloadCriticalResources();
  }

  async preloadCriticalResources() {
    if (!this.swRegistration || !this.swRegistration.active) return;

    const criticalResources = [
      '/images/hero/agrxculture-logo.webp',
      '/images/hero/agricultural-background-mobile.webp',
      '/styles/layout.css',
    ];

    // Request service worker to cache critical resources
    this.swRegistration.active.postMessage({
      type: 'PRELOAD_RESOURCES',
      resources: criticalResources,
    });
  }

  // Public methods
  async checkForUpdates() {
    if (this.swRegistration) {
      await this.swRegistration.update();
    }
  }

  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    }
  }

  getRegistration() {
    return this.swRegistration;
  }

  isUpdateAvailable() {
    return this.updateAvailable;
  }
}

// Initialize service worker manager
let swManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    swManager = new ServiceWorkerManager();
    window.swManager = swManager;
  });
} else {
  swManager = new ServiceWorkerManager();
  window.swManager = swManager;
}

// Handle messages from service worker
navigator.serviceWorker?.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'CACHE_UPDATED':
      console.log('Cache updated:', data);
      break;
    case 'OFFLINE_READY':
      console.log('App ready for offline use');
      break;
    default:
      console.log('Service Worker message:', event.data);
  }
});

export default ServiceWorkerManager;
