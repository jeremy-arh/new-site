import { memo, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { getImageUrl } from '../utils/imageLoader';

const Hero = memo(() => {
  const heroBg = useMemo(() => getImageUrl('hero-bg'), []);

  return (
    <section className="md:px-5 md:pt-[90px]">
      {/* Hero Block with Background Image - LCP Element */}
      <div
        className="relative md:rounded-3xl overflow-hidden min-h-screen md:min-h-0 md:h-[calc(100vh-110px)] flex items-center"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight animate-fade-in">
              Notarize and Apostille <br />
              Your Documents <br />
              100% Online
            </h1>

            <p className="text-base sm:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed max-w-2xl animate-fade-in animation-delay-200">
              Secure, legally valid, recognized internationally through the Hague Convention<br />
              from anywhere, in just a few minutes.
            </p>

            <a href="https://app.mynotary.io/form" className="primary-cta text-base md:text-lg inline-block mb-8 md:mb-12 bg-white text-black hover:bg-gray-100 animate-fade-in animation-delay-400">
              <span className="btn-text inline-block">Book an appointment</span>
            </a>

            {/* Features */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 mt-6 md:mt-8 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2">
                <Icon icon="hugeicons:legal-hammer" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-white font-medium text-sm md:text-base">Legally valid worldwide</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="mingcute:flash-line" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-white font-medium text-sm md:text-base">Fast &amp; fully online</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="meteor-icons:badge-check" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="text-white font-medium text-sm md:text-base">Secure &amp; privacy-focused</span>
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
