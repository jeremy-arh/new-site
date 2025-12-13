import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';
import { trackServiceClick as trackPlausibleServiceClick, trackCTAClick as trackPlausibleCTAClick } from '../utils/plausible';
import { trackServiceClick, trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, formatServicesForLanguage, getServiceFields } from '../utils/services';
import PriceDisplay from '../components/PriceDisplay';
const HERO_IMG =
  'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/763a76aa-aa08-47d4-436f-ca7bea56e900/public?w=1800&fit=cover&format=auto&quality=80';

const HowItWorks = lazy(() => import('../components/HowItWorks'));
const Testimonial = lazy(() => import('../components/Testimonial'));
const FAQ = lazy(() => import('../components/FAQ'));
const MobileCTA = lazy(() => import('../components/MobileCTA'));
const ChatCTA = lazy(() => import('../components/ChatCTA'));

// Other Services Section Component
const OtherServicesSection = ({ currentServiceId }) => {
  const [services, setServices] = useState([]);
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    fetchServices();
  }, [currentServiceId, language]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(getServiceFields())
        .eq('is_active', true)
        .eq('show_in_list', true)
        .neq('service_id', currentServiceId)
        .order('created_at', { ascending: true })
        .limit(6);

      if (error) throw error;
      
      // Formater les services selon la langue
      const formattedServices = formatServicesForLanguage(data || [], language);
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching other services:', error);
    }
  };

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="other-services" className="py-20 px-4 sm:px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            {t('services.otherServices')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 scroll-slide-up">
            {t('services.otherServicesHeading').split(' ').slice(0, -2).join(' ')} <span>{t('services.otherServicesHeading').split(' ').slice(-2).join(' ')}</span>
          </h2>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serviceItem) => (
            <Link
              key={serviceItem.id}
              to={getLocalizedPath(`/services/${serviceItem.service_id}`)}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up flex flex-col"
              onClick={() => {
                trackPlausibleServiceClick(serviceItem.service_id, serviceItem.name, 'service_detail_other_services');
                trackServiceClick(serviceItem.service_id, serviceItem.name, 'service_detail_other_services', location.pathname);
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  {serviceItem.icon ? (
                    <Icon icon={serviceItem.icon} className="w-10 h-10 text-black" />
                  ) : (
                    <Icon icon="iconoir:badge-check" className="w-10 h-10 text-black" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{serviceItem.list_title || serviceItem.name}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{serviceItem.short_description || serviceItem.description}</p>

              <div className="flex flex-col gap-3 mt-auto items-center">
                <div className="inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center text-sm font-semibold text-black underline underline-offset-4 decoration-2">
                  <span className="btn-text inline-block">{t('services.learnMore')}</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
};

// Rend les sections non critiques uniquement lorsqu'elles approchent du viewport
const LazySection = ({ children, minHeight = 200, rootMargin = '200px 0px' }) => {
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={sectionRef} style={!isVisible ? { minHeight } : undefined}>
      {isVisible ? children : null}
    </div>
  );
};

const ServiceDetail = () => {
  const { serviceId: rawServiceId } = useParams();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
  const { formatPrice, currency } = useCurrency();
  const [ctaPrice, setCtaPrice] = useState('');
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();

  // Décoder le serviceId depuis l'URL (au cas où il contiendrait des caractères encodés)
  const serviceId = rawServiceId ? decodeURIComponent(rawServiceId) : null;

  useEffect(() => {
    if (serviceId) {
      fetchService();
    } else {
      setError(t('common.error'));
      setService(null);
      setIsLoading(false);
    }
  }, [serviceId, language]);

  useEffect(() => {
    if (service?.base_price) {
      formatPrice(service.base_price).then(setCtaPrice);
    }
  }, [service?.base_price, formatPrice]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1150);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchService = async () => {
    setIsLoading(true);
    setError(null);
    setService(null);

    if (!serviceId) {
      setError(t('common.error'));
      setIsLoading(false);
      return;
    }

    try {
      // Toujours charger depuis la DB pour avoir les dernières traductions
      // Le cache peut contenir des données obsolètes sans les traductions
      // Utiliser getServiceFields() pour s'assurer que tous les champs multilingues sont chargés
      const { data, error } = await supabase
        .from('services')
        .select(getServiceFields())
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!data) {
        setError(t('common.error'));
        return;
      }

      const serviceData = data;

      // Toujours formater le service selon la langue actuelle (même s'il vient du cache)
      const formattedService = formatServiceForLanguage(serviceData, language);
      
      // Debug: vérifier la langue et les données
      if (process.env.NODE_ENV === 'development') {
        console.log('[ServiceDetail] Language:', language);
        console.log('[ServiceDetail] Service data keys:', Object.keys(serviceData));
        console.log('[ServiceDetail] Formatted service name:', formattedService.name);
        console.log('[ServiceDetail] French name available:', serviceData.name_fr);
        console.log('[ServiceDetail] All multilingual fields:', {
          name_fr: serviceData.name_fr,
          description_fr: serviceData.description_fr,
          short_description_fr: serviceData.short_description_fr
        });
      }
      
      setService(formattedService);

      // Track service view
      trackPlausibleServiceClick(serviceId, formattedService.name, 'service_detail_page');
      trackServiceClick(serviceId, formattedService.name, 'service_detail_page', location.pathname);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError(t('serviceDetail.loadServiceError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // Masquer tout le contenu (y compris header/footer) pendant le chargement pour éviter le flash
    return <div className="fixed inset-0 bg-white z-50" aria-busy="true" />;
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{error || t('common.error')}</p>
        <Link to={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <Icon icon="lsicon:open-new-filled" className="w-5 h-5" />
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
      {/* Hero Section - Similar to Home Hero */}
      <section data-hero>
        <div
          className="relative overflow-hidden min-h-screen flex items-center"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 w-full">
            <div className="max-w-3xl">
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-white ${isMobile ? 'mb-4' : 'mb-6'} leading-tight animate-fade-in`}>
                {service.page_h1 || service.name}
              </h1>

              <p className={`text-base sm:text-lg text-white/90 ${isMobile ? 'mb-6' : 'mb-8'} leading-relaxed max-w-2xl animate-fade-in animation-delay-200`}>
                {service.short_description || service.description}
              </p>

              <div className={`flex flex-row flex-wrap ${isMobile ? 'items-center' : 'items-center'} gap-3 ${isMobile ? 'mb-8' : 'mb-12'} animate-fade-in animation-delay-400`}>
                <a 
                  href={getFormUrl(currency, service?.service_id || serviceId)} 
                  className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-flex items-center gap-2 text-white flex-shrink-0`}
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
                <Icon icon="lsicon:open-new-filled" className="w-5 h-5" />
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
              <div className={`flex ${isMobile ? 'flex-col items-start' : 'flex-row items-center'} ${isMobile ? 'gap-3' : 'gap-8'} ${isMobile ? 'mt-6' : 'mt-8'} animate-fade-in animation-delay-600`}>
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
                src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ab3815ee-dd67-4351-09f2-f661ee7d1000/public"
                alt={service.name}
                className="w-full h-auto rounded-2xl object-cover"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                sizes="(min-width: 1024px) 40vw, 90vw"
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
                {/* Benefits List */}
                <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                      <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                    </div>
                  </div>
                </div>

                  {/* CTA Button - Black for contrast on white background */}
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
                    className="block w-full text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-center bg-black hover:bg-gray-900 shadow-lg cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Icon icon="line-md:uploading-loop" className="w-5 h-5" />
                      Upload my document
                  </span>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section */}
      <section className="py-20 px-[30px] bg-gray-50">
        <div className="max-w-[1300px] mx-auto">
          {(() => {
            // Chercher le h2 dans detailed_description d'abord, puis dans description
            const detailedDesc = service.detailed_description || '';
            const desc = service.description || '';
            const descriptionHtml = detailedDesc || desc;
            
            // Extraire le premier h2 du HTML de manière très robuste
            // Gère les cas avec ou sans attributs, sur une ou plusieurs lignes
            // Utilise une regex non-greedy pour capturer le premier h2
            const h2Regex = /<h2(?:\s+[^>]*)?>([\s\S]*?)<\/h2>/i;
            let h2Match = null;
            let firstH2Content = null;
            let contentWithoutFirstH2 = descriptionHtml;
            
            // Chercher dans detailed_description d'abord
            if (detailedDesc) {
              h2Match = detailedDesc.match(h2Regex);
            }
            
            // Si pas trouvé dans detailed_description, chercher dans description
            if (!h2Match && desc) {
              h2Match = desc.match(h2Regex);
            }
            
            if (h2Match && h2Match[1]) {
              // Extraire le contenu du h2 et nettoyer les balises HTML internes
              firstH2Content = h2Match[1]
                .replace(/<[^>]+>/g, '') // Supprimer toutes les balises HTML internes
                .replace(/&nbsp;/g, ' ') // Remplacer &nbsp; par des espaces
                .replace(/&amp;/g, '&') // Remplacer &amp; par &
                .replace(/&lt;/g, '<') // Remplacer &lt; par <
                .replace(/&gt;/g, '>') // Remplacer &gt; par >
                .replace(/&quot;/g, '"') // Remplacer &quot; par "
                .replace(/&#39;/g, "'") // Remplacer &#39; par '
                .replace(/&#x27;/g, "'") // Remplacer &#x27; par '
                .replace(/\s+/g, ' ') // Normaliser les espaces multiples
                .trim();
              
              // Retirer le h2 du contenu pour éviter la duplication
              // Retirer dans le champ où il a été trouvé
              if (detailedDesc && detailedDesc.includes(h2Match[0])) {
                contentWithoutFirstH2 = detailedDesc.replace(h2Match[0], '').trim();
              } else if (desc && desc.includes(h2Match[0])) {
                contentWithoutFirstH2 = desc.replace(h2Match[0], '').trim();
              }
              
              // Debug en développement
              if (process.env.NODE_ENV === 'development') {
                console.log('[ServiceDetail] H2 found:', firstH2Content);
                console.log('[ServiceDetail] Found in:', detailedDesc ? 'detailed_description' : 'description');
              }
            } else {
              // Debug en développement
              if (process.env.NODE_ENV === 'development') {
                console.log('[ServiceDetail] No H2 found in description');
                console.log('[ServiceDetail] Detailed description preview:', detailedDesc.substring(0, 200));
                console.log('[ServiceDetail] Description preview:', desc.substring(0, 200));
              }
            }
            
            // Toujours utiliser le h2 s'il existe, sinon utiliser le titre par défaut
            return (
              <>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
                  {firstH2Content || `${t('serviceDetail.whatIs')} ${service.name}?`}
                </h2>
                <div className="max-w-6xl mx-auto">
                  <div className="relative animate-fade-in animation-delay-200">
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: contentWithoutFirstH2 }}
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Chat CTA Section */}
      <LazySection minHeight={220}>
        <Suspense fallback={<div className="py-16" aria-busy="true" />}>
          <ChatCTA />
        </Suspense>
      </LazySection>

      {/* Testimonial Section */}
      <LazySection minHeight={320}>
        <Suspense fallback={<div className="py-20" aria-busy="true" />}>
          <Testimonial />
        </Suspense>
      </LazySection>

      {/* How It Works Section */}
      <LazySection minHeight={480}>
        <Suspense fallback={<div className="py-20" aria-busy="true" />}>
          <HowItWorks />
        </Suspense>
      </LazySection>

      {/* Other Services Section */}
      <LazySection minHeight={420}>
        <OtherServicesSection currentServiceId={service.service_id} />
      </LazySection>

      {/* FAQ Section */}
      <LazySection minHeight={420}>
        <Suspense fallback={<div className="py-20" aria-busy="true" />}>
          <FAQ />
        </Suspense>
      </LazySection>

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <Link to={getLocalizedPath('/#services')} className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <Icon icon="tabler:arrow-left" className="w-5 h-5" />
            <span>{t('serviceDetail.backToServices')}</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA with service-specific text */}
      <LazySection minHeight={180}>
        <Suspense fallback={<div className="py-10" aria-busy="true" />}>
          <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} serviceId={service?.service_id || serviceId} />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default ServiceDetail;
