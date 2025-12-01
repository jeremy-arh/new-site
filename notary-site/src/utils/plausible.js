/**
 * Plausible Analytics - GTM Integration
 * Sends Plausible events via Google Tag Manager dataLayer
 * This allows Plausible to be managed through GTM and avoids ad blocker issues
 */

import { pushGTMEvent } from './gtm';

/**
 * Track a Plausible pageview via GTM
 * @param {string} pageName - Page name (optional)
 * @param {string} pagePath - Page path (optional, defaults to current path)
 */
export const trackPageView = (pageName = null, pagePath = null) => {
  const path = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  pushGTMEvent('plausible_pageview', {
    plausible_event: 'pageview',
    plausible_domain: 'mynotary.io',
    page_name: pageName,
    page_path: path,
    page_url: typeof window !== 'undefined' ? window.location.href : path
  });
};

/**
 * Track a custom Plausible event via GTM
 * @param {string} eventName - Event name
 * @param {object} props - Event properties (optional)
 */
export const trackEvent = (eventName, props = {}) => {
  pushGTMEvent('plausible_event', {
    plausible_event: eventName,
    plausible_domain: 'mynotary.io',
    plausible_props: props,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    page_url: typeof window !== 'undefined' ? window.location.href : '/'
  });
};

/**
 * Track CTA click (Book an appointment)
 * @param {string} location - Where the CTA was clicked (hero, navbar, mobile, etc.)
 */
export const trackCTAClick = (location) => {
  trackEvent('cta_click', {
    cta_type: 'book_appointment',
    cta_location: location
  });
};

/**
 * Track service click
 * @param {string} serviceId - Service ID
 * @param {string} serviceName - Service name
 * @param {string} location - Where the service was clicked (homepage, services page, etc.)
 */
export const trackServiceClick = (serviceId, serviceName, location) => {
  trackEvent('service_click', {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location
  });
};

/**
 * Track login click
 * @param {string} location - Where the login link was clicked
 */
export const trackLoginClick = (location) => {
  trackEvent('login_click', {
    click_location: location
  });
};

/**
 * Track navigation click
 * @param {string} linkText - Text of the navigation link
 * @param {string} destination - Destination URL or anchor
 */
export const trackNavigationClick = (linkText, destination) => {
  trackEvent('navigation_click', {
    link_text: linkText,
    destination: destination
  });
};

/**
 * Track blog post view
 * @param {string} postSlug - Blog post slug
 * @param {string} postTitle - Blog post title
 */
export const trackBlogPostView = (postSlug, postTitle) => {
  trackEvent('blog_post_view', {
    post_slug: postSlug,
    post_title: postTitle
  });
};

/**
 * Initialize Plausible tracking
 * This will send the initial pageview
 */
export const initPlausible = () => {
  if (typeof window !== 'undefined') {
    // Send initial pageview
    trackPageView();
  }
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  // Wait for GTM to be ready before sending pageview
  // GTM will handle the initial pageview via its own triggers
  // So we don't need to call initPlausible() here
}
