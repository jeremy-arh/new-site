/**
 * Cloudflare Pages Function to generate dynamic sitemap.xml
 * This function fetches data from Supabase and generates a sitemap
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Get Supabase credentials from environment variables
    // Cloudflare Pages exposes env vars without VITE_ prefix in Functions
    // But we check both for compatibility
    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const supabaseKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return basic sitemap if Supabase is not configured
      return generateBasicSitemap(baseUrl);
    }

    // Fetch dynamic URLs from Supabase
    const urls = await fetchUrlsFromSupabase(supabaseUrl, supabaseKey, baseUrl);

    // Generate sitemap XML
    const sitemap = generateSitemapXML(baseUrl, urls);

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap on error
    return new Response(generateBasicSitemap(baseUrl), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    });
  }
}

/**
 * Fetch URLs from Supabase
 */
async function fetchUrlsFromSupabase(supabaseUrl, supabaseKey, baseUrl) {
  const urls = [];

  try {
    // Fetch services if services table exists
    try {
      const servicesResponse = await fetch(
        `${supabaseUrl}/rest/v1/services?is_active=eq.true&select=service_id,updated_at,created_at`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (servicesResponse.ok) {
        const services = await servicesResponse.json();
        services.forEach((service) => {
          urls.push({
            loc: `${baseUrl}/services/${service.service_id}`,
            lastmod: service.updated_at || service.created_at,
            changefreq: 'monthly',
            priority: '0.7',
          });
        });
      }
    } catch (error) {
      console.warn('Could not fetch services:', error.message);
    }

    // Fetch blog posts if blog_posts table exists (optional)
    try {
      const blogResponse = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?status=eq.published&select=slug,updated_at,published_at`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (blogResponse.ok) {
        const blogPosts = await blogResponse.json();
        blogPosts.forEach((post) => {
          urls.push({
            loc: `${baseUrl}/blog/${post.slug}`,
            lastmod: post.updated_at || post.published_at,
            changefreq: 'weekly',
            priority: '0.8',
          });
        });

        // Add blog listing page if posts exist
        if (blogPosts.length > 0) {
          urls.push({
            loc: `${baseUrl}/blog`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: '0.9',
          });
        }
      }
    } catch (error) {
      console.warn('Could not fetch blog posts:', error.message);
    }
  } catch (error) {
    console.error('Error fetching URLs from Supabase:', error);
  }

  return urls;
}

/**
 * Generate sitemap XML
 */
function generateSitemapXML(baseUrl, dynamicUrls = []) {
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
    },
  ];

  // Add services page if services exist in dynamic URLs
  if (dynamicUrls.some(url => url.loc.includes('/services/'))) {
    staticPages.push({
      loc: `${baseUrl}/services`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
    });
  }

  // Combine static and dynamic URLs
  const allUrls = [...staticPages, ...dynamicUrls];

  // Generate XML
  const urlElements = allUrls.map((url) => {
    const lastmod = url.lastmod ? new Date(url.lastmod).toISOString().split('T')[0] : currentDate;
    return `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.5'}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Generate basic sitemap without Supabase
 */
function generateBasicSitemap(baseUrl) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXML(baseUrl)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}

/**
 * Escape XML special characters
 */
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

