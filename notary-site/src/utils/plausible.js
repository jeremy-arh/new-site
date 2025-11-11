/**
 * Plausible Analytics - NPM Package Integration
 * Documentation: https://plausible.io/docs/plausible-tracker
 */

import { Plausible } from 'plausible-tracker';

// Initialiser Plausible avec votre domaine
const plausible = Plausible({
  domain: 'mynotary.io',
  apiHost: 'https://plausible.io'
});

/**
 * Track page view
 * @param {string} pageName - Page name
 * @param {string} pagePath - Page path
 */
export const trackPageView = (pageName, pagePath) => {
  plausible.pageview({ 
    url: pagePath,
    props: {
      page_name: pageName
    }
  });
};

/**
 * Track custom event
 * @param {string} eventName - Event name
 * @param {object} props - Event properties (optional)
 */
export const trackEvent = (eventName, props = {}) => {
  plausible.event(eventName, { props });
};

/**
 * Track CTA click (Book an appointment)
 * @param {string} location - Where the CTA was clicked (hero, navbar, mobile, etc.)
 */
export const trackCTAClick = (location) => {
  trackEvent('cta_click', {
    cta_type: 'book_appointment',
    cta_location: location,
    destination: 'https://app.mynotary.io/form'
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
    click_location: location,
    destination: 'https://app.mynotary.io/login'
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
 * Track FAQ toggle
 * @param {number} faqIndex - FAQ item index
 * @param {string} faqQuestion - FAQ question
 */
export const trackFAQToggle = (faqIndex, faqQuestion) => {
  trackEvent('faq_toggle', {
    faq_index: faqIndex,
    faq_question: faqQuestion
  });
};

/**
 * Track external link click
 * @param {string} url - External URL
 * @param {string} linkText - Link text
 */
export const trackExternalLinkClick = (url, linkText) => {
  trackEvent('external_link_click', {
    url: url,
    link_text: linkText
  });
};

export default plausible;

