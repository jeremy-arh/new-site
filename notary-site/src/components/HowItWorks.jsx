import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getImageUrl } from '../utils/imageLoader';
import { trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import ctaBg from '../assets/cta-bg.webp';

const HowItWorks = memo(() => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [servicePrice, setServicePrice] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState('');
  const location = useLocation();
  const { formatPrice, currency } = useCurrency();
  const { t } = useTranslation();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Fetch service price and serviceId if on a service detail page
  const [currentServiceId, setCurrentServiceId] = useState(null);
  
  useEffect(() => {
    const fetchServicePrice = async () => {
      const path = location.pathname || '';
      const serviceMatch = path.match(/^\/services\/([^/]+)/);
      
      if (serviceMatch && serviceMatch[1]) {
        const serviceId = decodeURIComponent(serviceMatch[1]);
        setCurrentServiceId(serviceId);
        try {
          const { data, error } = await supabase
            .from('services')
            .select('base_price')
            .eq('service_id', serviceId)
            .single();

          if (!error && data?.base_price) {
            setServicePrice(data.base_price);
          } else {
            setServicePrice(null);
          }
        } catch (error) {
          console.error('Error fetching service price:', error);
          setServicePrice(null);
        }
      } else {
        setServicePrice(null);
        setCurrentServiceId(null);
      }
    };

    fetchServicePrice();
  }, [location.pathname]);

  useEffect(() => {
    if (servicePrice) {
      formatPrice(servicePrice).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [servicePrice, formatPrice]);

  const steps = useMemo(() => [
    {
      icon: 'f7:doc',
      title: t('howItWorks.step1.title'),
      subtitle: t('howItWorks.step1.subtitle'),
      description: t('howItWorks.step1.description'),
      image: getImageUrl('step-1')
    },
    {
      icon: 'solar:calendar-broken',
      title: t('howItWorks.step2.title'),
      subtitle: t('howItWorks.step2.subtitle'),
      description: t('howItWorks.step2.description'),
      image: getImageUrl('step-2')
    },
    {
      icon: 'icon-park-outline:camera-two',
      title: t('howItWorks.step3.title'),
      subtitle: t('howItWorks.step3.subtitle'),
      description: t('howItWorks.step3.description'),
      image: getImageUrl('step-3')
    },
    {
      icon: 'f7:doc-checkmark',
      title: t('howItWorks.step4.title'),
      subtitle: t('howItWorks.step4.subtitle'),
      description: t('howItWorks.step4.description'),
      image: getImageUrl('step-4')
    }
  ], [t]);

  return (
    <section id="how-it-works" className="py-16 md:py-32 px-0 md:px-[30px] bg-gray-50 relative">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20 px-[30px] md:px-0">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            {t('howItWorks.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 scroll-slide-up">
            {t('howItWorks.heading').split(' ').slice(0, -1).join(' ')} <span>{t('howItWorks.heading').split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto scroll-slide-up">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Stacking Cards */}
        <div className="space-y-5 md:space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="sticky transition-all duration-500"
              style={{
                top: isMobile ? '0px' : `${100 + index * 30}px`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="bg-white md:rounded-3xl p-6 md:p-12 shadow-none md:shadow-2xl border-0 md:border border-gray-200 md:hover:shadow-3xl transition-shadow duration-300 animate-slide-up min-h-screen md:min-h-[500px] flex flex-col pb-24 md:pb-0">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center flex-1">
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} space-y-4 md:space-y-6 flex flex-col justify-center`}>
                    <div>
                      <div className="flex items-start gap-4 mb-4 md:mb-6">
                        <Icon icon={step.icon} className="w-8 h-8 md:w-10 md:h-10 text-black flex-shrink-0" />
                        <div>
                          <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                            {step.title}
                          </h3>
                          {step.subtitle && (
                            <p className="text-gray-600 text-sm md:text-base mt-1">{step.subtitle}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2 md:pt-4">
                      <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-500 text-sm font-medium">
                        {t('howItWorks.stepLabel')} {index + 1} {t('howItWorks.of')} {steps.length}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex items-center justify-center`}>
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      loading="lazy"
                      width="450"
                      height="450"
                      className="w-full max-w-[300px] md:max-w-[450px] h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA (blog-detail style) */}
        <div className="px-[30px] md:px-0 mt-16 md:mt-32 animate-fade-in animation-delay-1000">
          <div 
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center shadow-2xl"
            style={{
              backgroundImage: `url(${ctaBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {t('howItWorks.ctaTitle')}
              </h3>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {t('howItWorks.ctaDescription')}
              </p>
              <div className="flex flex-row flex-wrap items-center justify-center gap-3 md:flex-col md:items-center md:gap-2">
                <a
                  href={getFormUrl(currency, currentServiceId)}
                  className="primary-cta text-sm md:text-lg inline-flex items-center gap-3 bg-white text-black hover:bg-gray-100 whitespace-nowrap flex-shrink-0 justify-center"
                  onClick={() => {
                    trackPlausibleCTAClick('how_it_works');
                    trackCTAClick('how_it_works', currentServiceId, location.pathname);
                  }}
                >
                  <Icon icon="f7:doc-checkmark" className="w-5 h-5" />
                  <span className="btn-text inline-block">
                    {t('nav.notarizeNow')}
                  </span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                {formattedPrice && (
                  <div className="text-white flex items-center gap-1 justify-center">
                    <span className="text-base font-semibold">{formattedPrice}</span>
                    <span className="text-xs font-normal text-white/70">{t('services.perDocument')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;
