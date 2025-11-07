import { useEffect } from 'react';
import faviconSvg from '../assets/favicon.svg?url';

/**
 * Favicon component
 * Automatically sets the favicon from assets/favicon.svg
 * To replace the favicon, update the favicon.svg file in the assets directory
 */
const Favicon = () => {
  useEffect(() => {
    // Find existing favicon link or create a new one
    let link = document.querySelector("link[rel~='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    link.href = faviconSvg;
    link.type = 'image/svg+xml';
    
    // Also set apple-touch-icon for better mobile support
    let appleTouchIcon = document.querySelector("link[rel~='apple-touch-icon']");
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      document.getElementsByTagName('head')[0].appendChild(appleTouchIcon);
    }
    appleTouchIcon.href = faviconSvg;
  }, []);

  return null; // This component doesn't render anything
};

export default Favicon;

