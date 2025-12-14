/**
 * Load image from assets folder with automatic extension detection
 * Supports: png, jpg, jpeg, svg, webp
 *
 * @param {string} imageName - Name of the image without extension (e.g., 'hero-bg')
 * @returns {string} - Image URL or empty string if not found
 *
 * Usage:
 * import { getImageUrl } from '../utils/imageLoader';
 * const heroImage = getImageUrl('hero-bg'); // Will find hero-bg.png, hero-bg.jpg, etc.
 */

// Image map for lookup - step images now served from Supabase
const imageMap = {};

export const getImageUrl = (imageName) => {
  const imageUrl = imageMap[imageName];
  if (imageUrl) {
    return imageUrl;
  }

  // Return empty string - step images are now served from Supabase
  return '';
};
