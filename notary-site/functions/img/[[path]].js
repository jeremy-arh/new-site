/**
 * Proxy d'images Cloudflare avec cache de 1 an
 * 
 * URL: /img/{cloudflare-image-id}/options
 * Exemple: /img/763a76aa-aa08-47d4-436f-ca7bea56e900/quality=20,format=webp
 * 
 * Remplace: https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/{id}/{options}
 */

const CLOUDFLARE_ACCOUNT_HASH = 'l2xsuW0n52LVdJ7j0fQ5lA';
const CACHE_MAX_AGE = 31536000; // 1 an en secondes

export async function onRequest(context) {
  const { params } = context;
  
  // Reconstituer le chemin de l'image
  const pathParts = params.path;
  const imagePath = Array.isArray(pathParts) ? pathParts.join('/') : pathParts;
  
  if (!imagePath) {
    return new Response('Image path required', { status: 400 });
  }

  // Construire l'URL Cloudflare Images
  const imageUrl = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}/${imagePath}`;

  try {
    // Fetch l'image depuis Cloudflare Images
    const response = await fetch(imageUrl, {
      cf: {
        // Cache côté Cloudflare edge (en plus du cache navigateur)
        cacheTtl: CACHE_MAX_AGE,
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      return new Response('Image not found', { status: 404 });
    }

    // Créer une nouvelle réponse avec les headers de cache
    const headers = new Headers(response.headers);
    
    // Headers de cache agressifs - 1 AN
    headers.set('Cache-Control', `public, max-age=${CACHE_MAX_AGE}, immutable`);
    headers.set('CDN-Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
    headers.set('Cloudflare-CDN-Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
    
    // Permettre le cache par les CDN intermédiaires
    headers.set('Vary', 'Accept');
    
    // Supprimer les headers qui pourraient interférer
    headers.delete('Set-Cookie');
    headers.delete('Pragma');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}

