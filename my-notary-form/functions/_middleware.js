/**
 * Cloudflare Pages Middleware
 * This middleware can be used for global request handling
 */

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Add security headers to all responses
  const response = await next();

  // Clone response to modify headers
  const newResponse = new Response(response.body, response);

  // Add CORS headers if needed
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add Cloudflare-specific headers
  newResponse.headers.set('CF-Ray', request.headers.get('CF-Ray') || '');
  
  return newResponse;
}

