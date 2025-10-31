import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      // Longer delay to ensure DOM is ready and sections are loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Get element position relative to document
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          // Offset for fixed header (80px header height + 20px padding)
          const offsetPosition = elementPosition - 100;

          // Scroll to the calculated position
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // Otherwise, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
