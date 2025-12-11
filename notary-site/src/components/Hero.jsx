import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';

const Hero = memo(() => {
  const heroBg = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/d0f6bfc4-a8db-41e1-87e2-7c7e0b7a1c00/public';
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1150);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <section className={isMobile ? '' : 'px-5 pt-[90px]'} data-hero>
      {/* Hero Block with Background Image - LCP Element */}
      <div
        className={`relative ${isMobile ? '' : 'rounded-3xl'} overflow-hidden ${isMobile ? 'min-h-screen' : 'min-h-0 h-[calc(100vh-110px)]'} flex items-center`}
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'auto'
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-white ${isMobile ? 'mb-4' : 'mb-6'} leading-tight animate-fade-in`}>
              {t('hero.title')}
            </h1>

            <p className={`text-base sm:text-lg text-white/90 ${isMobile ? 'mb-6' : 'mb-8'} leading-relaxed max-w-2xl animate-fade-in animation-delay-200`}>
              {t('hero.subtitle')}
            </p>

            <a 
              href={getFormUrl(currency)} 
              className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-flex items-center gap-2 ${isMobile ? 'mb-8' : 'mb-12'} text-white animate-fade-in animation-delay-400`}
              style={{
                backgroundColor: '#2F6AEC',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2F6AEC';
              }}
              onClick={() => {
                trackPlausibleCTAClick('hero', null, window.location.pathname, {
                  ctaText: t('nav.notarizeNow'),
                  destination: getFormUrl(currency),
                  elementId: 'hero_primary'
                });
                trackCTAClick('hero', null, window.location.pathname);
              }}
            >
              <Icon icon="lsicon:open-new-filled" className="w-5 h-5" />
              <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
            </a>

            {/* Features */}
            <div className={`flex ${isMobile ? 'flex-col items-start gap-3' : 'flex-row items-center gap-8'} ${isMobile ? 'mt-6' : 'mt-8'} animate-fade-in animation-delay-600`}>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Icon icon="lets-icons:world-2-light" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white flex-shrink-0`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature1')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <Icon icon="fluent:flash-32-regular" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white flex-shrink-0`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature2')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <Icon icon="si:lock-line" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white flex-shrink-0`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
