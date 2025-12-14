/**
 * Proxy d'images Cloudflare avec cache 1 an
 * 
 * Usage: /img/CLOUDFLARE_IMAGE_ID/options
 * Exemple: /img/763a76aa-aa08-47d4-436f-ca7bea56e900/quality=80,format=webp
 */

export async function onRequest(context) {
  const { params } = context;
  const pathParts = params.path;
  
  // Reconstruire l'URL Cloudflare Images
  const imageId = pathParts[0];
  const options = pathParts.slice(1).join('/') || 'format=webp';
  
  const cloudflareImageUrl = `https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/${imageId}/${options}`;
  
  try {
    // Fetch l'image depuis Cloudflare Images
    const response = await fetch(cloudflareImageUrl, {
      cf: {
        // Cache sur le edge Cloudflare pendant 1 an
        cacheTtl: 31536000,
        cacheEverything: true,
      },
    });
    
    if (!response.ok) {
      return new Response('Image not found', { status: 404 });
    }
    
    // Créer une nouvelle réponse avec les headers de cache
    const newResponse = new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        // Cache navigateur 1 an
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Headers supplémentaires
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
    return newResponse;
  } catch (error) {
    return new Response('Error fetching image', { status: 500 });
  }
}

