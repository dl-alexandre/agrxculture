// Auto-generated image helpers
export const imageManifest = {
  "images": {
    "farm-management-ios": {
      "original": "images/showcase/farm-management-ios.jpg",
      "basename": "farm-management-ios",
      "extension": ".jpg",
      "sizes": {
        "400": "images/showcase/farm-management-ios-400w.jpg",
        "800": "images/showcase/farm-management-ios-800w.jpg",
        "1200": "images/showcase/farm-management-ios-1200w.jpg",
        "1600": "images/showcase/farm-management-ios-1600w.jpg"
      },
      "webp": {
        "400": "images/showcase/farm-management-ios-400w.webp",
        "800": "images/showcase/farm-management-ios-800w.webp",
        "1200": "images/showcase/farm-management-ios-1200w.webp",
        "1600": "images/showcase/farm-management-ios-1600w.webp",
        "original": "images/showcase/farm-management-ios.webp"
      },
      "aspectRatio": 1.6,
      "fileSize": 449,
      "optimized": true
    },
    "farm-sensor-network": {
      "original": "images/showcase/farm-sensor-network.jpg",
      "basename": "farm-sensor-network",
      "extension": ".jpg",
      "sizes": {
        "400": "images/showcase/farm-sensor-network-400w.jpg",
        "800": "images/showcase/farm-sensor-network-800w.jpg",
        "1200": "images/showcase/farm-sensor-network-1200w.jpg",
        "1600": "images/showcase/farm-sensor-network-1600w.jpg"
      },
      "webp": {
        "400": "images/showcase/farm-sensor-network-400w.webp",
        "800": "images/showcase/farm-sensor-network-800w.webp",
        "1200": "images/showcase/farm-sensor-network-1200w.webp",
        "1600": "images/showcase/farm-sensor-network-1600w.webp",
        "original": "images/showcase/farm-sensor-network.webp"
      },
      "aspectRatio": 1.6,
      "fileSize": 460,
      "optimized": true
    },
    "yield-analytics": {
      "original": "images/showcase/yield-analytics.jpg",
      "basename": "yield-analytics",
      "extension": ".jpg",
      "sizes": {
        "400": "images/showcase/yield-analytics-400w.jpg",
        "800": "images/showcase/yield-analytics-800w.jpg",
        "1200": "images/showcase/yield-analytics-1200w.jpg",
        "1600": "images/showcase/yield-analytics-1600w.jpg"
      },
      "webp": {
        "400": "images/showcase/yield-analytics-400w.webp",
        "800": "images/showcase/yield-analytics-800w.webp",
        "1200": "images/showcase/yield-analytics-1200w.webp",
        "1600": "images/showcase/yield-analytics-1600w.webp",
        "original": "images/showcase/yield-analytics.webp"
      },
      "aspectRatio": 1.6,
      "fileSize": 462,
      "optimized": true
    }
  },
  "generated": "2025-09-02T01:02:22.500Z",
  "totalImages": 3,
  "totalSizes": 15
};

export function getImageData(basename) {
  return imageManifest.images[basename];
}

export function getResponsiveImage(basename, alt = '', className = '', loading = 'lazy') {
  const imageData = getImageData(basename);
  if (!imageData) return '';
  const baseUrl = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '/';
  
  return `<picture class="responsive-image {{className}}">
  <source 
    srcset="${baseUrl}images/showcase/farm-management-ios-400w.webp 400w, ${baseUrl}images/showcase/farm-management-ios-800w.webp 800w, ${baseUrl}images/showcase/farm-management-ios-1200w.webp 1200w, ${baseUrl}images/showcase/farm-management-ios-1600w.webp 1600w" 
    sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    type="image/webp">
  <img 
    src="${baseUrl}images/showcase/farm-management-ios-800w.jpg" 
    srcset="${baseUrl}images/showcase/farm-management-ios-400w.jpg 400w, ${baseUrl}images/showcase/farm-management-ios-800w.jpg 800w, ${baseUrl}images/showcase/farm-management-ios-1200w.jpg 1200w, ${baseUrl}images/showcase/farm-management-ios-1600w.jpg 1600w"
    sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    alt="{{alt}}"
    loading="{{loading}}"
    style="aspect-ratio: 1.6"
    class="responsive-img">
</picture>`
    .replace('{{alt}}', alt)
    .replace('{{className}}', className)
    .replace('{{loading}}', loading);
}

export function getLazyImage(basename, alt = '', className = '', critical = false) {
  const imageData = getImageData(basename);
  if (!imageData) return '';
  const baseUrl = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '/';
  
  return `<picture class="responsive-image {{className}}">
  <source 
    data-lazy-srcset="${baseUrl}images/showcase/farm-management-ios-400w.webp 400w, ${baseUrl}images/showcase/farm-management-ios-800w.webp 800w, ${baseUrl}images/showcase/farm-management-ios-1200w.webp 1200w, ${baseUrl}images/showcase/farm-management-ios-1600w.webp 1600w" 
    data-lazy-sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    type="image/webp">
  <img 
    data-lazy-src="${baseUrl}images/showcase/farm-management-ios-800w.jpg" 
    data-lazy-srcset="${baseUrl}images/showcase/farm-management-ios-400w.jpg 400w, ${baseUrl}images/showcase/farm-management-ios-800w.jpg 800w, ${baseUrl}images/showcase/farm-management-ios-1200w.jpg 1200w, ${baseUrl}images/showcase/farm-management-ios-1600w.jpg 1600w"
    data-lazy-sizes="(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1024px) 1200px, 1600px"
    data-aspect-ratio="1.6"
    data-critical="true"
    alt="{{alt}}"
    class="responsive-img lazy">
</picture>`
    .replace('{{alt}}', alt)
    .replace('{{className}}', className)
    .replace('{{critical}}', critical);
}