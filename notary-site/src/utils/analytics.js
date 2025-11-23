/**
 * Analytics Tracking for Supabase
 * Tracks user interactions, page views, scroll depth, and CTA clicks
 */

import { supabase } from '../lib/supabase';
import { getSharedVisitorId, syncVisitorId } from './sharedVisitorId';

// Sync visitor ID on module load
if (typeof window !== 'undefined') {
  syncVisitorId();
}

// Generate or retrieve visitor ID (shared across domains)
const getVisitorId = () => {
  return getSharedVisitorId();
};

// Generate or retrieve session ID (stored in sessionStorage)
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get device information
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Detect device type
  let deviceType = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    deviceType = 'mobile';
  }

  // Parse browser info
  let browserName = 'unknown';
  let browserVersion = 'unknown';
  
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Edg')) {
    browserName = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    browserVersion = match ? match[1] : 'unknown';
  }

  // Parse OS info
  let osName = 'unknown';
  let osVersion = 'unknown';
  
  if (ua.includes('Windows')) {
    osName = 'Windows';
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    osVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('Mac OS X')) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    osVersion = match ? match[1].replace('_', '.') : 'unknown';
  } else if (ua.includes('Linux')) {
    osName = 'Linux';
  } else if (ua.includes('Android')) {
    osName = 'Android';
    const match = ua.match(/Android (\d+\.\d+)/);
    osVersion = match ? match[1] : 'unknown';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    osName = 'iOS';
    const match = ua.match(/OS (\d+[._]\d+)/);
    osVersion = match ? match[1].replace('_', '.') : 'unknown';
  }

  return {
    deviceType,
    browserName,
    browserVersion,
    osName,
    osVersion,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
};

// Get geo information from IP
const getGeoInfo = async () => {
  try {
    // Try ipapi.co first (more detailed, 1000 req/day free)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        countryCode: data.country_code || null,
        countryName: data.country_name || null,
        city: data.city || null,
        region: data.region || null,
        ip: data.ip || null
      };
    }
  } catch (error) {
    console.warn('Failed to fetch geo info from ipapi.co:', error);
  }
  
  // Fallback to ip-api.com if ipapi.co fails or is blocked
  try {
    const fallbackResponse = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,city,regionName,query');
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.status === 'success') {
        return {
          countryCode: fallbackData.countryCode || null,
          countryName: fallbackData.country || null,
          city: fallbackData.city || null,
          region: fallbackData.regionName || null,
          ip: fallbackData.query || null
        };
      }
    }
  } catch (fallbackError) {
    console.warn('Failed to fetch geo info from ip-api.com:', fallbackError);
  }
  
  // Return default values if all services fail
  return {
    countryCode: null,
    countryName: null,
    city: null,
    region: null,
    ip: null
  };
};

// Get browser language
const getBrowserLanguage = () => {
  return navigator.language || navigator.userLanguage || 'unknown';
};

// Get UTM parameters from URL
const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || null,
    utmMedium: params.get('utm_medium') || null,
    utmCampaign: params.get('utm_campaign') || null
  };
};

// Generic event tracking function
export const trackEvent = async (eventType, pagePath = null, metadata = {}) => {
  if (typeof window === 'undefined' || !supabase) {
    return;
  }

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();
    const geoInfo = await getGeoInfo();
    const language = getBrowserLanguage();
    const utmParams = getUTMParams();

    // Get current user if authenticated
    let userId = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch (error) {
      // User not authenticated, continue without userId
    }

    const eventData = {
      event_type: eventType,
      page_path: pagePath || window.location.pathname,
      visitor_id: visitorId,
      session_id: sessionId,
      user_id: userId,
      country_code: geoInfo.countryCode,
      country_name: geoInfo.countryName,
      city: geoInfo.city,
      region: geoInfo.region,
      ip_address: geoInfo.ip,
      language: language,
      device_type: deviceInfo.deviceType,
      browser_name: deviceInfo.browserName,
      browser_version: deviceInfo.browserVersion,
      os_name: deviceInfo.osName,
      os_version: deviceInfo.osVersion,
      screen_width: deviceInfo.screenWidth,
      screen_height: deviceInfo.screenHeight,
      referrer: document.referrer || null,
      utm_source: utmParams.utmSource,
      utm_medium: utmParams.utmMedium,
      utm_campaign: utmParams.utmCampaign,
      metadata: metadata
    };

    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  } catch (error) {
    console.error('Error in trackEvent:', error);
  }
};

// Track pageview
export const trackPageView = (pagePath = null) => {
  return trackEvent('pageview', pagePath || window.location.pathname, {
    timestamp: new Date().toISOString()
  });
};

// Track scroll depth
export const trackScrollDepth = (scrollPercentage) => {
  // Track milestones: 25%, 50%, 75%, 100%
  const milestones = [25, 50, 75, 100];
  const trackedMilestones = JSON.parse(sessionStorage.getItem('analytics_scroll_milestones') || '[]');
  
  milestones.forEach(milestone => {
    if (scrollPercentage >= milestone && !trackedMilestones.includes(milestone)) {
      trackedMilestones.push(milestone);
      trackEvent('scroll_depth', window.location.pathname, {
        scroll_percentage: milestone,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  sessionStorage.setItem('analytics_scroll_milestones', JSON.stringify(trackedMilestones));
};

// Track CTA click
export const trackCTAClick = (ctaLocation, serviceId = null, pagePath = null) => {
  return trackEvent('cta_click', pagePath || window.location.pathname, {
    cta_location: ctaLocation,
    service_id: serviceId,
    destination: 'form',
    timestamp: new Date().toISOString()
  });
};

// Track navigation click
export const trackNavigationClick = (linkText, destination, pagePath = null) => {
  return trackEvent('navigation_click', pagePath || window.location.pathname, {
    link_text: linkText,
    destination: destination,
    timestamp: new Date().toISOString()
  });
};

// Track service click
export const trackServiceClick = (serviceId, serviceName, location, pagePath = null) => {
  return trackEvent('service_click', pagePath || window.location.pathname, {
    service_id: serviceId,
    service_name: serviceName,
    click_location: location,
    timestamp: new Date().toISOString()
  });
};

// Track login click
export const trackLoginClick = (location, pagePath = null) => {
  return trackEvent('login_click', pagePath || window.location.pathname, {
    click_location: location,
    destination: 'login',
    timestamp: new Date().toISOString()
  });
};

// Track blog post view
export const trackBlogPostView = (postSlug, postTitle, pagePath = null) => {
  return trackEvent('blog_post_view', pagePath || window.location.pathname, {
    post_slug: postSlug,
    post_title: postTitle,
    timestamp: new Date().toISOString()
  });
};

// Track FAQ toggle
export const trackFAQToggle = (faqIndex, faqQuestion, pagePath = null) => {
  return trackEvent('faq_toggle', pagePath || window.location.pathname, {
    faq_index: faqIndex,
    faq_question: faqQuestion,
    timestamp: new Date().toISOString()
  });
};

