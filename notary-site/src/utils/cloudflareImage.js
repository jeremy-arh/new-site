/**
 * Convertit une URL Cloudflare Images en URL proxy avec cache 1 an
 * 
 * Avant: https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/IMAGE_ID/options
 * Après: /img/IMAGE_ID/options
 * 
 * @param {string} imageId - L'ID de l'image Cloudflare
 * @param {string} options - Options d'image (ex: "quality=80,format=webp")
 * @returns {string} URL proxy avec cache
 */
export function cfImage(imageId, options = 'format=webp') {
  return `/img/${imageId}/${options}`;
}

/**
 * URLs d'images pré-définies pour éviter les erreurs de typo
 */
export const CF_IMAGES = {
  // Hero images
  HERO_HOME: cfImage('d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00', 'quality=20,format=webp'),
  HERO_SERVICE: cfImage('763a76aa-aa08-47d4-436f-ca7bea56e900', 'quality=20,format=webp'),
  
  // Logos
  LOGO_WHITE: cfImage('b9d9d28f-0618-4a93-9210-8d9d18c3d200', 'quality=20,format=webp'),
  LOGO_BLACK: cfImage('e4a88604-ba5d-44a5-5fe8-a0a26c632d00', 'quality=20,format=webp'),
  
  // Pricing/Service images
  PRICING_IMAGE: cfImage('ab3815ee-dd67-4351-09f2-f661ee7d1000', 'quality=20,format=webp'),
  
  // Background patterns
  PATTERN_BG: cfImage('d84aca7a-998a-4ff6-1862-7676557ab400', 'quality=20,format=webp'),
  
  // Chat/Support
  CHAT_AVATAR: cfImage('36b5466f-9dee-4b88-ac69-83859843f900', 'quality=20,format=webp'),
};

