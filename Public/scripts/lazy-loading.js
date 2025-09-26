/**
 * Lazy Loading Implementation with IntersectionObserver
 * Task 9: Performance optimizations and accessibility features
 *
 * Features:
 * - Reduced JavaScript overhead using IntersectionObserver
 * - Skeleton screens for better perceived performance
 * - Accessibility support with proper ARIA attributes
 * - WebP image support with fallbacks
 * - CLS prevention with proper aspect ratios
 */

class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.skeletonObserver = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    this.setupImageObserver();
    this.setupSkeletonObserver();
    this.observeImages();
    this.observeSkeletons();
  }

  setupImageObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01,
    };

    this.imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  setupSkeletonObserver() {
    const options = {
      root: null,
      rootMargin: '100px 0px', // Show skeleton 100px before entering viewport
      threshold: 0.01,
    };

    this.skeletonObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.showSkeleton(entry.target);
          this.skeletonObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('[data-lazy-src]');
    lazyImages.forEach(img => {
      // Set up skeleton placeholder
      this.setupImageSkeleton(img);
      this.imageObserver.observe(img);
    });
  }

  observeSkeletons() {
    const skeletonElements = document.querySelectorAll('.lazy-skeleton');
    skeletonElements.forEach(skeleton => {
      this.skeletonObserver.observe(skeleton);
    });
  }

  setupImageSkeleton(img) {
    // Add skeleton class for CSS animation
    img.classList.add('lazy-skeleton');

    // Set ARIA attributes for accessibility
    img.setAttribute('aria-label', 'Loading image...');
    img.setAttribute('role', 'img');

    // Prevent layout shift by setting dimensions
    if (!img.style.aspectRatio && img.dataset.aspectRatio) {
      img.style.aspectRatio = img.dataset.aspectRatio;
    }
  }

  showSkeleton(element) {
    element.classList.add('skeleton-visible');
  }

  loadImage(img) {
    const src = img.dataset.lazySrc;
    const srcset = img.dataset.lazySrcset;
    const sizes = img.dataset.lazySizes;

    if (this.loadedImages.has(src)) {
      return;
    }

    // Create new image to preload
    const imageLoader = new Image();

    imageLoader.onload = () => {
      this.onImageLoad(img, src, srcset, sizes);
    };

    imageLoader.onerror = () => {
      this.onImageError(img);
    };

    // Start loading
    if (srcset) {
      imageLoader.srcset = srcset;
    }
    if (sizes) {
      imageLoader.sizes = sizes;
    }
    imageLoader.src = src;
  }

  onImageLoad(img, src, srcset, sizes) {
    // Update image attributes
    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;

    // Remove skeleton and add loaded class
    img.classList.remove('lazy-skeleton', 'skeleton-visible');
    img.classList.add('lazy-loaded');

    // Update ARIA attributes
    img.setAttribute('aria-label', img.alt || 'Image loaded');
    img.removeAttribute('role');

    // Mark as loaded
    this.loadedImages.add(src);

    // Dispatch custom event for analytics/tracking
    img.dispatchEvent(
      new CustomEvent('lazyImageLoaded', {
        detail: { src, loadTime: performance.now() },
      })
    );
  }

  onImageError(img) {
    img.classList.remove('lazy-skeleton', 'skeleton-visible');
    img.classList.add('lazy-error');

    // Set fallback image or show error state
    const fallback = img.dataset.fallbackSrc;
    if (fallback) {
      img.src = fallback;
    } else {
      img.alt = 'Image failed to load';
      img.setAttribute('aria-label', 'Image failed to load');
    }

    // Dispatch error event
    img.dispatchEvent(
      new CustomEvent('lazyImageError', {
        detail: { src: img.dataset.lazySrc },
      })
    );
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('[data-lazy-src]');
    lazyImages.forEach(img => {
      const src = img.dataset.lazySrc;
      const srcset = img.dataset.lazySrcset;
      const sizes = img.dataset.lazySizes;

      img.src = src;
      if (srcset) img.srcset = srcset;
      if (sizes) img.sizes = sizes;

      img.classList.add('lazy-loaded');
    });
  }

  // Public method to manually load specific images
  loadImageById(id) {
    const img = document.getElementById(id);
    if (img && img.dataset.lazySrc) {
      this.loadImage(img);
    }
  }

  // Public method to preload critical images
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll(
      '[data-lazy-src][data-critical="true"]'
    );
    criticalImages.forEach(img => {
      this.loadImage(img);
    });
  }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyImageLoader();
  });
} else {
  window.lazyLoader = new LazyImageLoader();
}

// Export for module usage
export default LazyImageLoader;
