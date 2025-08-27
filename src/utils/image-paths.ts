/**
 * Image path utilities for handling base URLs in Astro
 */

/**
 * Get the proper image URL with base path
 * @param imagePath - The image path (can start with / or be relative)
 * @returns The full image URL with base path
 */
export function getImageUrl(imagePath: string): string {
  const baseUrl = import.meta.env.BASE_URL;
  
  // If path already starts with base URL, return as is
  if (imagePath.startsWith(baseUrl)) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Combine base URL with clean path
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get multiple image URLs with base path
 * @param imagePaths - Array of image paths
 * @returns Array of full image URLs with base path
 */
export function getImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(getImageUrl);
}

/**
 * Get showcase image URL specifically
 * @param filename - Just the filename (e.g., 'farm-sensor-network.jpg')
 * @returns Full showcase image URL with base path
 */
export function getShowcaseImageUrl(filename: string): string {
  return getImageUrl(`images/showcase/${filename}`);
}