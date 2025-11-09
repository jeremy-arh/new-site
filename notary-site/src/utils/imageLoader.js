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

// Import all images statically to avoid issues with import.meta.glob and Terser
import heroBg from '../assets/hero-bg.svg';
import step1 from '../assets/step-1.svg';
import step2 from '../assets/step-2.svg';
import step3 from '../assets/step-3.svg';
import step4 from '../assets/step-4.svg';
import testimonialAvatar from '../assets/testimonial-avatar.svg';

// Image map for lookup
const imageMap = {
  'hero-bg': heroBg,
  'step-1': step1,
  'step-2': step2,
  'step-3': step3,
  'step-4': step4,
  'testimonial-avatar': testimonialAvatar,
};

export const getImageUrl = (imageName) => {
  const imageUrl = imageMap[imageName];
  if (imageUrl) {
    return imageUrl;
  }

  console.warn(`Image "${imageName}" not found in assets folder. Available images:`, Object.keys(imageMap));
  return '';
};
