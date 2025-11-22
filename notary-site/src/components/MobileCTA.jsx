import { useState, useEffect, useCallback, memo } from 'react';
import { trackCTAClick } from '../utils/plausible';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';

const MobileCTA = memo(({ ctaText = 'Notarize now', price, serviceId = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { formatPrice, currency } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState('');

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

  useEffect(() => {
    if (price) {
      formatPrice(price).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [price, formatPrice]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible && !isMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-4 py-3">
          <a
            href={getFormUrl(currency, serviceId)}
            className="block w-full text-center px-6 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg relative cta-animated-border"
            onClick={() => trackCTAClick('mobile_cta')}
          >
            <svg className="cta-border-svg" viewBox="0 0 200 50" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cta-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#491AE9" />
                  <stop offset="25%" stopColor="#D414E5" />
                  <stop offset="50%" stopColor="#FC03A1" />
                  <stop offset="75%" stopColor="#FF7715" />
                  <stop offset="100%" stopColor="#491AE9" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="rotate"
                    values="0 0.5 0.5;360 0.5 0.5"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
                <filter id="glow-mobile" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="6" result="haloBlur"/>
                  <feOffset in="SourceGraphic" dx="0" dy="5" result="shadow"/>
                  <feGaussianBlur in="shadow" stdDeviation="15" result="shadowBlur"/>
                  <feMerge>
                    <feMergeNode in="haloBlur" opacity="0.5"/>
                    <feMergeNode in="shadowBlur" opacity="0.9"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Main border with halo */}
              <path
                d="M 8,0 Q 0,0 0,8 L 0,42 Q 0,50 8,50 L 192,50 Q 200,50 200,42 L 200,8 Q 200,0 192,0 Z"
                stroke="url(#cta-gradient-mobile)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#glow-mobile)"
              />
            </svg>
            <span className="btn-text inline-block relative z-10">
              {ctaText}{formattedPrice ? ` - ${formattedPrice}` : ''}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
});

MobileCTA.displayName = 'MobileCTA';

export default MobileCTA;
