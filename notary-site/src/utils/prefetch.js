import { supabase } from '../lib/supabase';
import { cache } from './cache';
import { getServiceFields } from './services';
import { getFormUrl } from './formUrl';

/**
 * Prefetch a blog post by slug
 */
export const prefetchBlogPost = async (slug) => {
  // Check cache first
  if (cache.has('blog_post', slug)) {
    return cache.get('blog_post', slug);
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      // Cache for 5 minutes
      cache.set('blog_post', slug, data, 5 * 60 * 1000);
      return data;
    }
  } catch (error) {
    console.error('Error prefetching blog post:', error);
  }

  return null;
};

/**
 * Prefetch a service by service_id
 */
export const prefetchService = async (serviceId) => {
  // Check cache first
  if (cache.has('service', serviceId)) {
    return cache.get('service', serviceId);
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select(getServiceFields())
      .eq('service_id', serviceId)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      // Cache for 10 minutes (services change less frequently)
      cache.set('service', serviceId, data, 10 * 60 * 1000);
      return data;
    }
  } catch (error) {
    console.error('Error prefetching service:', error);
  }

  return null;
};

/**
 * Prefetch multiple blog posts (for blog listing)
 */
export const prefetchBlogPosts = async (limit = 10) => {
  const cacheKey = `blog_posts_list_${limit}`;
  
  if (cache.has('blog_posts_list', cacheKey)) {
    return cache.get('blog_posts_list', cacheKey);
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (!error && data) {
      // Cache for 3 minutes
      cache.set('blog_posts_list', cacheKey, data, 3 * 60 * 1000);
      return data;
    }
  } catch (error) {
    console.error('Error prefetching blog posts:', error);
  }

  return null;
};

/**
 * Prefetch all active services
 */
export const prefetchServices = async () => {
  if (cache.has('services', 'all')) {
    return cache.get('services', 'all');
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select(getServiceFields())
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (!error && data) {
      // Cache for 10 minutes
      cache.set('services', 'all', data, 10 * 60 * 1000);
      return data;
    }
  } catch (error) {
    console.error('Error prefetching services:', error);
  }

  return null;
};

/**
 * Prefetch the form page (external URL)
 * Uses link prefetch for better browser support
 */
export const prefetchForm = (currency = 'EUR', serviceId = null) => {
  if (typeof window === 'undefined') return;

  const formUrl = getFormUrl(currency, serviceId);

  // Check if already prefetched
  if (document.querySelector(`link[rel="prefetch"][href="${formUrl}"]`)) {
    return;
  }

  try {
    // Use link prefetch for external URLs (best practice for cross-origin prefetching)
    // The browser will handle the prefetch in the background
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = formUrl;
    link.as = 'document';
    // Note: crossOrigin is not needed for prefetch, browser handles it automatically
    document.head.appendChild(link);
  } catch (error) {
    // Silently fail - prefetch is best effort
    if (process.env.NODE_ENV === 'development') {
      console.warn('Form prefetch error:', error);
    }
  }
};

/**
 * Setup prefetch on link hover
 */
export const setupLinkPrefetch = () => {
  if (typeof window === 'undefined') return;

  // Track prefetched items to avoid duplicate requests
  const prefetched = new Set();
  let hoverTimeout = null;

  const prefetchFromLink = (link) => {
    const href = link.getAttribute('href') || link.href;
    if (!href) return;

    // Form URL (external)
    if (href.includes('app.mynotary.io/form')) {
      const url = new URL(href);
      const currency = url.searchParams.get('currency') || 'EUR';
      const serviceId = url.searchParams.get('service') || null;
      const cacheKey = `form:${currency}:${serviceId || 'none'}`;
      if (!prefetched.has(cacheKey)) {
        prefetched.add(cacheKey);
        prefetchForm(currency, serviceId);
      }
    }
    // Blog post
    else if (href.includes('/blog/')) {
      const match = href.match(/\/blog\/([^/#?]+)/);
      if (match && match[1]) {
        const slug = decodeURIComponent(match[1]);
        const cacheKey = `blog:${slug}`;
        if (!prefetched.has(cacheKey)) {
          prefetched.add(cacheKey);
          prefetchBlogPost(slug);
        }
      }
    }
    // Service
    else if (href.includes('/services/')) {
      const match = href.match(/\/services\/([^/#?]+)/);
      if (match && match[1]) {
        const serviceId = decodeURIComponent(match[1]);
        const cacheKey = `service:${serviceId}`;
        if (!prefetched.has(cacheKey)) {
          prefetched.add(cacheKey);
          prefetchService(serviceId);
        }
      }
    }
  };

  // Handle hover with debounce
  const handleHover = (e) => {
    // Check if closest is available (for older browsers or edge cases)
    if (!e.target || typeof e.target.closest !== 'function') return;
    
    const link = e.target.closest('a[href*="/blog/"], a[href*="/services/"], a[href*="app.mynotary.io/form"]');
    if (!link) return;

    // Clear existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Prefetch after a small delay
    hoverTimeout = setTimeout(() => {
      prefetchFromLink(link);
    }, 150);
  };

  // Use event delegation for better performance
  document.addEventListener('mouseenter', handleHover, true);
  document.addEventListener('touchstart', handleHover, true);
};

/**
 * Prefetch visible links on page load
 */
export const prefetchVisibleLinks = () => {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = entry.target;
        const href = link.getAttribute('href') || link.href;
        
        // Form URL (external)
        if (href && href.includes('app.mynotary.io/form')) {
          try {
            const url = new URL(href);
            const currency = url.searchParams.get('currency') || 'EUR';
            const serviceId = url.searchParams.get('service') || null;
            prefetchForm(currency, serviceId);
          } catch (e) {
            // Invalid URL, skip
          }
        }
        // Blog post
        else if (href && href.includes('/blog/')) {
          const match = href.match(/\/blog\/([^/#?]+)/);
          if (match && match[1]) {
            const slug = decodeURIComponent(match[1]);
            prefetchBlogPost(slug);
          }
        }
        // Service
        else if (href && href.includes('/services/')) {
          const match = href.match(/\/services\/([^/#?]+)/);
          if (match && match[1]) {
            const serviceId = decodeURIComponent(match[1]);
            prefetchService(serviceId);
          }
        }
        
        // Unobserve after prefetching
        observer.unobserve(link);
      }
    });
  }, {
    rootMargin: '200px' // Prefetch when link is 200px away from viewport
  });

  // Function to observe links
  const observeLinks = () => {
    const links = document.querySelectorAll('a[href*="/blog/"], a[href*="/services/"], a[href*="app.mynotary.io/form"]');
    links.forEach((link) => {
      // Only observe if not already observed
      if (!link.dataset.prefetchObserved) {
        link.dataset.prefetchObserved = 'true';
        observer.observe(link);
      }
    });
  };

  // Observe existing links
  observeLinks();

  // Use MutationObserver to watch for new links added to DOM
  const mutationObserver = new MutationObserver(() => {
    observeLinks();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Cleanup function (returned but not used in this context)
  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
};

