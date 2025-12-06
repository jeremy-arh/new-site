import { useState, useEffect, useCallback, memo } from 'react';
import { Icon } from '@iconify/react';
import { trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';

const MobileCTA = memo(({ ctaText = null, price, serviceId = null }) => {
  const { t } = useTranslation();
  const defaultCtaText = ctaText || t('nav.notarizeNow');
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
          <div className="flex flex-col items-center gap-2">
            <a
              href={getFormUrl(currency, serviceId)}
              className="w-full text-center px-6 py-4 glassy-cta text-white font-bold rounded-lg transition-all duration-300"
              onClick={() => {
                trackPlausibleCTAClick('mobile_cta');
                trackCTAClick('mobile_cta', serviceId, window.location.pathname);
              }}
            >
              <span className="btn-text inline-block inline-flex items-center justify-center gap-2">
                <Icon icon="f7:doc-checkmark" className="w-5 h-5 text-white" />
                {defaultCtaText}
              </span>
            </a>
            {formattedPrice && (
              <div className="text-gray-900 flex items-center gap-1">
                <span className="text-base font-semibold">{formattedPrice}</span>
                <span className="text-xs font-normal text-gray-500">{t('services.perDocument')} - no hidden fee</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MobileCTA.displayName = 'MobileCTA';

export default MobileCTA;
