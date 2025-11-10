import { useState, useEffect, useCallback, memo } from 'react';
import { trackCTAClick } from '../utils/gtm';

const MobileCTA = memo(({ ctaText = 'Book an appointement' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    // Show CTA after scrolling 200px
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const checkMenuState = useCallback(() => {
    setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Check initial state
    checkMenuState();

    // Observe changes to body classes
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [checkMenuState]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible && !isMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-4 py-3">
          <a
            href="https://app.mynotary.io/form"
            className="block w-full text-center px-6 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg"
            onClick={() => trackCTAClick('mobile_cta')}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
});

MobileCTA.displayName = 'MobileCTA';

export default MobileCTA;
