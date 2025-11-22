import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { getImageUrl } from '../utils/imageLoader';
import { trackCTAClick } from '../utils/plausible';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';

const Hero = memo(() => {
  const heroBg = useMemo(() => getImageUrl('hero-bg'), []);
  const { currency } = useCurrency();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1150);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <section className={isMobile ? '' : 'px-5 pt-[90px]'}>
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
              Notarize and Apostille <br />
              Your Documents <br />
              100% Online
            </h1>

            <p className={`text-base sm:text-lg text-white/90 ${isMobile ? 'mb-6' : 'mb-8'} leading-relaxed max-w-2xl animate-fade-in animation-delay-200`}>
              Secure, legally valid, recognized internationally through the Hague Convention<br />
              from anywhere, in just a few minutes.
            </p>

            <a 
              href={getFormUrl(currency)} 
              className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-block ${isMobile ? 'mb-8' : 'mb-12'} bg-white text-black hover:bg-gray-100 animate-fade-in animation-delay-400`}
              onClick={() => trackCTAClick('hero')}
            >
              <span className="btn-text inline-block">Notarize now</span>
            </a>

            {/* Features */}
            <div className={`flex ${isMobile ? 'flex-col items-start gap-3' : 'flex-row items-center gap-8'} ${isMobile ? 'mt-6' : 'mt-8'} animate-fade-in animation-delay-600`}>
              <div className="flex items-center gap-2">
                <Icon icon="lets-icons:world-2-light" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Legally valid worldwide</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="fluent:flash-32-regular" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Fast &amp; fully online</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="si:lock-line" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Secure &amp; privacy-focused</span>
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
