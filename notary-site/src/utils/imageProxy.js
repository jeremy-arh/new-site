/**
 * Utilitaire pour les URLs d'images avec cache optimisé
 * 
 * Convertit les URLs imagedelivery.net en URLs proxy locales
 * pour bénéficier du cache de 1 an configuré dans notre proxy.
 */

const CLOUDFLARE_ACCOUNT_HASH = 'l2xsuW0n52LVdJ7j0fQ5lA';
const IMAGEDELIVERY_BASE = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/`;

/**
 * Convertit une URL Cloudflare Images en URL proxy locale
 * 
 * @param {string} imageId - ID de l'image Cloudflare
 * @param {string} options - Options de transformation (ex: "quality=20,format=webp")
 * @returns {string} URL proxy locale
 * 
 * @example
 * getProxyImageUrl('763a76aa-aa08-47d4-436f-ca7bea56e900', 'quality=20,format=webp')
 * // Retourne: '/img/763a76aa-aa08-47d4-436f-ca7bea56e900/quality=20,format=webp'
 */
export function getProxyImageUrl(imageId, options = 'public') {
  return `/img/${imageId}/${options}`;
}

/**
 * Convertit une URL complète imagedelivery.net en URL proxy
 * 
 * @param {string} url - URL imagedelivery.net complète
 * @returns {string} URL proxy locale
 * 
 * @example
 * convertToProxyUrl('https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/abc123/quality=80')
 * // Retourne: '/img/abc123/quality=80'
 */
export function convertToProxyUrl(url) {
  if (!url || !url.includes('imagedelivery.net')) {
    return url;
  }
  
  // Extraire le chemin après le hash du compte
  const path = url.replace(IMAGEDELIVERY_BASE, '');
  return `/img/${path}`;
}

// URLs des images pré-définies pour import facile
export const IMAGES = {
  // Hero backgrounds
  HERO_HOME: '/img/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/quality=20,format=webp',
  HERO_SERVICE: '/img/763a76aa-aa08-47d4-436f-ca7bea56e900/quality=20,format=webp',
  
  // Logos
  LOGO_WHITE: '/img/b9d9d28f-0618-4a93-9210-8d9d18c3d200/quality=20,format=webp',
  LOGO_BLACK: '/img/e4a88604-ba5d-44a5-5fe8-a0a26c632d00/quality=20,format=webp',
  
  // Section images
  PRICING_IMAGE: '/img/ab3815ee-dd67-4351-09f2-f661ee7d1000/quality=20,format=webp',
  CTA_BG: '/img/d84aca7a-998a-4ff6-1862-7676557ab400/quality=20,format=webp',
  CHAT_AVATAR: '/img/36b5466f-9dee-4b88-ac69-83859843f900/quality=20,format=webp',
};

