/**
 * Load image from assets folder with automatic extension detection
 * Supports: png, jpg, jpeg, svg, webp
 *
 * @param {string} imageName - Name of the image without extension (e.g., 'hero-bg', 'step-1')
 * @returns {string} - Image URL or empty string if not found
 *
 * Usage:
 * import { getImageUrl } from '../utils/imageLoader';
 * const heroImage = getImageUrl('hero-bg'); // Will find hero-bg.png, hero-bg.jpg, etc.
 */

// Import all images from assets folder
const images = import.meta.glob('../assets/*.(png|jpg|jpeg|svg|webp)', { eager: true, import: 'default' });

export const getImageUrl = (imageName) => {
  // Try each extension
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];

  for (const ext of extensions) {
    const key = `../assets/${imageName}.${ext}`;
    if (images[key]) {
      return images[key];
    }
  }

  console.warn(`Image "${imageName}" not found in assets folder`);
  return '';
};
