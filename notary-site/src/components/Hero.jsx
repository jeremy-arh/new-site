import { memo, useState, useEffect } from 'react';
import { trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';

// SVG inline pour éviter @iconify (performance)
const IconWorld = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
));
const IconFlash = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
));
const IconLock = memo(() => (
  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
));
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));

import { IMAGES } from '../utils/imageProxy';

// Image Hero - via proxy avec cache 1 an
const HERO_IMG = IMAGES.HERO_HOME;

// Hook optimisé avec matchMedia
const useIsMobile = (breakpoint = 1150) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, [breakpoint]);

  return isMobile;
};

const Hero = memo(() => {
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const isMobile = useIsMobile(1150);

  return (
    <section className={isMobile ? '' : 'px-5 pt-[90px]'} data-hero>
      {/* Hero Block with Background Image - LCP Element */}
      <div
        className={`relative ${isMobile ? '' : 'rounded-3xl'} overflow-hidden ${isMobile ? 'min-h-screen' : 'min-h-0 h-[calc(100vh-110px)]'} flex items-center`}
      >
        {/* Image Hero avec fetchpriority high pour LCP */}
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-white ${isMobile ? 'mb-4' : 'mb-6'} leading-tight`}>
              {t('hero.title')}
            </h1>

            <p className={`text-base sm:text-lg text-white/90 ${isMobile ? 'mb-6' : 'mb-8'} leading-relaxed max-w-2xl`}>
              {t('hero.subtitle')}
            </p>

            <a 
              href={getFormUrl(currency)} 
              className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-flex items-center gap-2 ${isMobile ? 'mb-8' : 'mb-12'} text-white bg-blue-600 hover:bg-blue-700`}
              onClick={() => {
                trackPlausibleCTAClick('hero', null, window.location.pathname, {
                  ctaText: t('nav.notarizeNow'),
                  destination: getFormUrl(currency),
                  elementId: 'hero_primary'
                });
                trackCTAClick('hero', null, window.location.pathname);
              }}
            >
              <IconOpenNew />
              <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
            </a>

            {/* Features */}
            <div className={`flex ${isMobile ? 'flex-col items-start gap-3 mt-6' : 'flex-row items-center gap-8 mt-8'}`}>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconWorld />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature1')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconFlash />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature2')}</span>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <IconLock />
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
