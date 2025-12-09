import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackCTAClick } from '../utils/analytics';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, getServiceFields } from '../utils/services';

const CTAPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [service, setService] = useState(null);
  const [ctaPrice, setCtaPrice] = useState('');
  const location = useLocation();
  const { currency, formatPrice } = useCurrency();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Detect serviceId from URL if on a service page
  const serviceMatch = location.pathname.match(/^\/services\/([^/]+)/);
  const serviceId = serviceMatch ? serviceMatch[1] : null;
  const isServicePage = !!serviceId;

  // Fetch service data if on a service page
  useEffect(() => {
    if (serviceId) {
      const fetchService = async () => {
        try {
          const { data, error } = await supabase
            .from('services')
            .select(getServiceFields())
            .eq('service_id', serviceId)
            .eq('is_active', true)
            .single();

          if (!error && data) {
            // Formater le service selon la langue actuelle
            const formattedService = formatServiceForLanguage(data, language);
            setService(formattedService);
          }
        } catch (error) {
          console.error('Error fetching service for popup:', error);
        }
      };

      fetchService();
    }
  }, [serviceId, language]);

  // Update price when service or currency changes
  useEffect(() => {
    if (service?.base_price) {
      formatPrice(service.base_price).then(setCtaPrice);
    } else {
      setCtaPrice('');
    }
  }, [service?.base_price, formatPrice, currency]);


  // Prevent body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleContactClick = () => {
    handleClose();
    // Open Crisp chat
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    } else {
      // If Crisp is not loaded yet, wait a bit
      setTimeout(() => {
        if (window.$crisp) {
          window.$crisp.push(['do', 'chat:open']);
        }
      }, 500);
    }
  };

  const handleCTAClick = () => {
    trackPlausibleCTAClick('popup_cta', location.pathname);
    trackCTAClick('popup_cta', serviceId, location.pathname);
    const formUrl = getFormUrl(currency, serviceId);
    window.location.href = formUrl;
  };

  const handleOverlayClick = (e) => {
    // Close only if clicking on overlay, not on popup content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Popup content */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t('ctaPopup.title')}
          </h2>
          <p className="text-gray-600 mb-8 text-base">
            {t('ctaPopup.description')}
          </p>

          {/* CTA buttons - Side by side */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Contact button */}
            <button
              onClick={handleContactClick}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              {t('ctaPopup.contact')}
            </button>
            
            {/* Primary CTA button - Always black background */}
            <div className="flex-1 flex flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-center sm:gap-1">
              <button
                onClick={handleCTAClick}
                className="flex-1 min-w-0 px-6 py-3 bg-black text-white font-medium rounded-lg cursor-pointer hover:bg-gray-900 transition-all whitespace-nowrap inline-flex items-center justify-center gap-2 flex-shrink-0"
              >
                <Icon icon="lsicon:open-new-filled" className="w-5 h-5 text-white" />
                <span className="inline-block">
                  {isServicePage && service?.cta ? service.cta : t('nav.notarizeNow')}
                </span>
              </button>
              {isServicePage && ctaPrice && (
                <div className="text-gray-900 flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-gray-500">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAPopup;

