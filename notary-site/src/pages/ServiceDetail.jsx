import { useEffect, useRef, useState, lazy, Suspense, useMemo, useCallback, memo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { trackServiceClick as trackPlausibleServiceClick, trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackServiceClick, trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useService, useServicesList } from '../hooks/useServices';
import PriceDisplay from '../components/PriceDisplay';
import { CF_IMAGES } from '../utils/cloudflareImage';

// Image Hero - via proxy avec cache 1 an
const HERO_IMG = CF_IMAGES.HERO_SERVICE;

// SVG Icons inline pour éviter les requêtes réseau d'@iconify
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
const IconCheckCircle = memo(() => (
  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
));
const IconUpload = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
));
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));
const IconOpenNew = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7h-7z"/>
  </svg>
));
const IconBadgeCheck = memo(() => (
  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
));
const IconArrowRight = memo(() => (
  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
));

const HowItWorks = lazy(() => import('../components/HowItWorks'));
const Testimonial = lazy(() => import('../components/Testimonial'));
const FAQ = lazy(() => import('../components/FAQ'));
const MobileCTA = lazy(() => import('../components/MobileCTA'));
const ChatCTA = lazy(() => import('../components/ChatCTA'));

// Other Services Section Component - memoized pour éviter re-renders
const OtherServicesSection = memo(({ currentServiceId }) => {
  const { t } = useTranslation();
  const { getLocalizedPath } = useLanguage();
  const location = useLocation();

  // Utiliser le hook prebuild au lieu de requêtes Supabase
  const { services, isLoading } = useServicesList({
    showInListOnly: true,
    excludeServiceId: currentServiceId,
    limit: 6
  });

  if (isLoading || services.length === 0) {
    return null;
  }

  return (
    <section id="other-services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden content-visibility-auto">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
            {t('services.otherServices')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('services.otherServicesHeading').split(' ').slice(0, -2).join(' ')} <span>{t('services.otherServicesHeading').split(' ').slice(-2).join(' ')}</span>
          </h2>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serviceItem) => (
            <Link
              key={serviceItem.id}
              to={getLocalizedPath(`/services/${serviceItem.service_id}`)}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col"
              onClick={() => {
                trackPlausibleServiceClick(serviceItem.service_id, serviceItem.name, 'service_detail_other_services');
                trackServiceClick(serviceItem.service_id, serviceItem.name, 'service_detail_other_services', location.pathname);
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <IconBadgeCheck />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{serviceItem.list_title || serviceItem.name}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{serviceItem.short_description || serviceItem.description}</p>

              <div className="flex flex-col gap-3 mt-auto items-center">
                <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                  <span className="btn-text inline-block">{t('services.learnMore')}</span>
                  <IconArrowRight />
                </div>
                {serviceItem.base_price && (
                  <div className="flex items-center gap-2 justify-center">
                    <PriceDisplay price={serviceItem.base_price} showFrom className="text-lg font-bold text-gray-900" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

// Rend les sections non critiques uniquement lorsqu'elles approchent du viewport
// Optimisé avec content-visibility pour le rendering
const LazySection = memo(({ children, minHeight = 200, rootMargin = '200px 0px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    const target = sectionRef.current;
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div 
      ref={sectionRef} 
      style={{ 
        minHeight: !isVisible ? minHeight : undefined,
        contentVisibility: !isVisible ? 'auto' : undefined,
        containIntrinsicSize: !isVisible ? `0 ${minHeight}px` : undefined
      }}
    >
      {isVisible ? children : null}
    </div>
  );
});

// Composant mémorisé pour le contenu "What is" - extrait la logique lourde
const WhatIsContent = memo(({ service, t }) => {
  const { firstH2Content, contentWithoutFirstH2 } = useMemo(() => {
    const detailedDesc = service.detailed_description || '';
    const desc = service.description || '';
    
    const h2Regex = /<h2(?:\s+[^>]*)?>([\s\S]*?)<\/h2>/i;
    let h2Match = detailedDesc ? detailedDesc.match(h2Regex) : null;
    if (!h2Match && desc) h2Match = desc.match(h2Regex);
    
    let firstH2 = null;
    let contentWithout = detailedDesc || desc;
    
    if (h2Match && h2Match[1]) {
      firstH2 = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      if (detailedDesc && detailedDesc.includes(h2Match[0])) {
        contentWithout = detailedDesc.replace(h2Match[0], '').trim();
      } else if (desc && desc.includes(h2Match[0])) {
        contentWithout = desc.replace(h2Match[0], '').trim();
      }
    }
    
    return { firstH2Content: firstH2, contentWithoutFirstH2: contentWithout };
  }, [service.detailed_description, service.description]);

  return (
    <>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
        {firstH2Content || `${t('serviceDetail.whatIs')} ${service.name}?`}
      </h2>
      <div className="max-w-6xl mx-auto">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentWithoutFirstH2 }} />
      </div>
    </>
  );
});

// Hook optimisé pour détecter mobile avec matchMedia (pas de resize listener)
const useIsMobile = (breakpoint = 1150) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    
    // Modern API
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    // Fallback for older browsers
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, [breakpoint]);

  return isMobile;
};

const ServiceDetail = () => {
  const { serviceId: rawServiceId } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile(1150);
  const { formatPrice, currency } = useCurrency();
  const [ctaPrice, setCtaPrice] = useState('');
  const { t } = useTranslation();
  const { getLocalizedPath } = useLanguage();

  // Décoder le serviceId depuis l'URL (au cas où il contiendrait des caractères encodés)
  const serviceId = useMemo(() => rawServiceId ? decodeURIComponent(rawServiceId) : null, [rawServiceId]);

  // Utiliser le hook prebuild au lieu de requêtes Supabase
  const { service, isLoading, error: serviceError } = useService(serviceId);
  const error = serviceError ? t('serviceDetail.loadServiceError') : null;

  useEffect(() => {
    if (service?.base_price) {
      formatPrice(service.base_price).then(setCtaPrice);
    }
  }, [service?.base_price, formatPrice]);

  // Track service view quand le service est chargé
  useEffect(() => {
    if (service && serviceId) {
      trackPlausibleServiceClick(serviceId, service.name, 'service_detail_page');
      trackServiceClick(serviceId, service.name, 'service_detail_page', location.pathname);
    }
  }, [service, serviceId, location.pathname]);

  // Afficher le Hero immédiatement pendant le chargement (skeleton)
  // IMPORTANT: Doit avoir exactement les mêmes dimensions que le contenu final pour éviter CLS
  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton - mêmes dimensions que le Hero final */}
        <section data-hero className="relative overflow-hidden h-screen flex items-center">
          <img
            src={HERO_IMG}
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ aspectRatio: '16/9' }}
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
            <div className="max-w-3xl">
              {/* Skeleton avec hauteurs fixes identiques au contenu */}
              <div className="h-[3.5rem] sm:h-[4rem] lg:h-[4.5rem] bg-white/20 rounded-lg w-3/4 mb-6"></div>
              <div className="h-6 bg-white/15 rounded w-full mb-2"></div>
              <div className="h-6 bg-white/15 rounded w-2/3 mb-8"></div>
              <div className="h-12 bg-blue-600 rounded-lg w-48"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{error || t('common.error')}</p>
        <Link to={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <IconOpenNew />
          <span className="btn-text inline-block">{t('nav.notarizeNow')}</span>
        </Link>
      </div>
    );
  }

  // Breadcrumbs pour données structurées
  const breadcrumbItems = [
    { name: t('common.home') || 'Home', url: '/' },
    { name: t('services.title') || 'Services', url: '/services' },
    { name: service.name, url: location.pathname },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        description={service.meta_description || service.short_description || service.description || ''}
        ogTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        ogDescription={service.meta_description || service.short_description || service.description || ''}
        twitterTitle={service.meta_title || service.name || t('serviceDetail.defaultTitle')}
        twitterDescription={service.meta_description || service.short_description || service.description || ''}
        canonicalPath={location.pathname}
      />
      <StructuredData
        type="Service"
        data={{
          serviceName: service.name,
          serviceDescription: service.meta_description || service.short_description || service.description || '',
          '@id': getCanonicalUrl(location.pathname),
        }}
        additionalData={[
          {
            type: 'BreadcrumbList',
            data: {
              items: breadcrumbItems,
            },
          },
        ]}
      />
      {/* Hero Section - hauteur fixe pour éviter CLS */}
      <section data-hero className="relative overflow-hidden h-screen flex items-center">
        {/* Image Hero avec dimensions fixes pour éviter CLS */}
        <img
          src={HERO_IMG}
          alt=""
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ aspectRatio: '16/9' }}
          fetchpriority="high"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
          <div className="max-w-3xl">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-white ${isMobile ? 'mb-4' : 'mb-6'} leading-tight`}>
              {service.page_h1 || service.name}
            </h1>

            <p className={`text-base sm:text-lg text-white/90 ${isMobile ? 'mb-6' : 'mb-8'} leading-relaxed max-w-2xl`}>
              {service.short_description || service.description}
            </p>

            <div className={`flex flex-row flex-wrap items-center gap-3 ${isMobile ? 'mb-8' : 'mb-12'}`}>
              <a 
                href={getFormUrl(currency, service?.service_id || serviceId)} 
                className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-flex items-center gap-2 text-white flex-shrink-0 bg-blue-600 hover:bg-blue-700`}
                onClick={() => {
                  const ctaCopy = service.cta || t('nav.notarizeNow');
                  const destination = getFormUrl(currency, service?.service_id || serviceId);

                  trackPlausibleCTAClick('service_detail_hero', service?.service_id || serviceId, location.pathname, {
                    ctaText: ctaCopy,
                    destination,
                    elementId: 'service_detail_hero'
                  });
                  trackCTAClick('service_detail_hero', service?.service_id || serviceId, location.pathname);
                }}
              >
                <IconOpenNew />
                <span className="btn-text inline-block">
                  {service.cta || t('nav.notarizeNow')}
                </span>
              </a>
              {ctaPrice && (
                <div className="text-white flex items-center gap-1">
                  <span className="text-base font-semibold">{ctaPrice}</span>
                  <span className="text-xs font-normal text-white/70">{t('services.perDocument')} - no hidden fee</span>
                </div>
              )}
            </div>

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
      </section>

      {/* Pricing Section - Two Column Layout */}
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-[30px] py-8 sm:py-16 relative"
        style={{ backgroundColor: '#F7F5F2' }}
      >
        <div className="max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Side - Image */}
            <div className="lg:w-2/5 flex items-center justify-center">
              <img
                src={CF_IMAGES.PRICING_IMAGE}
                alt={service.name}
                className="w-full h-auto rounded-2xl object-cover"
                loading="lazy"
                width="520"
                height="650"
                style={{ maxHeight: '800px', aspectRatio: '4 / 5' }}
              />
            </div>

            {/* Right Side - Pricing Block */}
            <div className="lg:w-3/5 flex flex-col">
          <div 
                className="rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full"
            style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
            }}
          >
                {/* Top Section - Black Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12"
                  style={{
                    background: '#000000'
                  }}
                >
                  {/* Price Section */}
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-white">{service.name}</h2>
                  
                  {service.base_price ? (
                    <>
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                          <PriceDisplay 
                            price={service.base_price} 
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                      </div>
                    </>
                  ) : (
                      <div>
                      <p className="text-base sm:text-lg text-gray-300">{t('serviceDetail.pricing.contactForPricing')}</p>
                    </div>
                  )}
                </div>
              </div>

                {/* Bottom Section - White Background */}
                <div 
                  className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col flex-1"
                  style={{
                    background: '#ffffff'
                  }}
                >
                {/* Benefits List - Optimisé sans animations coûteuses */}
                <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <IconCheckCircle />
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Simplifié sans animations coûteuses */}
                <a
                  href={getFormUrl(currency, service?.service_id || serviceId)}
                  onClick={() => {
                    const destination = getFormUrl(currency, service?.service_id || serviceId);
                    trackPlausibleCTAClick('service_detail_pricing', service?.service_id || serviceId, location.pathname, {
                      ctaText: 'Upload my document',
                      destination,
                      elementId: 'service_detail_pricing'
                    });
                    trackCTAClick('service_detail_pricing', service?.service_id || serviceId, location.pathname);
                  }}
                  className="block w-full text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-xl transition-colors duration-200 text-center bg-black hover:bg-gray-900 shadow-lg cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <IconUpload />
                    Upload my document
                  </span>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section - content-visibility pour optimisation */}
      <section className="py-20 px-[30px] bg-gray-50 content-visibility-auto">
        <div className="max-w-[1300px] mx-auto">
          <WhatIsContent service={service} t={t} />
        </div>
      </section>

      {/* Chat CTA Section - hauteur fixe pour éviter CLS */}
      <div style={{ minHeight: '200px', contain: 'layout' }}>
        <LazySection minHeight={200}>
          <Suspense fallback={<div style={{ height: '200px' }} />}>
            <ChatCTA />
          </Suspense>
        </LazySection>
      </div>

      {/* Testimonial Section */}
      <div style={{ minHeight: '400px', contain: 'layout' }}>
        <LazySection minHeight={400}>
          <Suspense fallback={<div style={{ height: '400px' }} />}>
            <Testimonial />
          </Suspense>
        </LazySection>
      </div>

      {/* How It Works Section */}
      <div style={{ minHeight: '600px', contain: 'layout' }}>
        <LazySection minHeight={600}>
          <Suspense fallback={<div style={{ height: '600px' }} />}>
            <HowItWorks />
          </Suspense>
        </LazySection>
      </div>

      {/* Other Services Section */}
      <div style={{ minHeight: '500px', contain: 'layout' }}>
        <LazySection minHeight={500}>
          <OtherServicesSection currentServiceId={service.service_id} />
        </LazySection>
      </div>

      {/* FAQ Section */}
      <div style={{ minHeight: '500px', contain: 'layout' }}>
        <LazySection minHeight={500}>
          <Suspense fallback={<div style={{ height: '500px' }} />}>
            <FAQ />
          </Suspense>
        </LazySection>
      </div>

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <Link to={getLocalizedPath('/#services')} className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <IconArrowLeft />
            <span>{t('serviceDetail.backToServices')}</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA - PAS dans LazySection car c'est fixed (ne prend pas d'espace) */}
      <Suspense fallback={null}>
        <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} serviceId={service?.service_id || serviceId} />
      </Suspense>
    </div>
  );
};

export default ServiceDetail;
