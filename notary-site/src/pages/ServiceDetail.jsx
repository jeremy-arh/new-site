import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { supabase } from '../lib/supabase';
import { cache } from '../utils/cache';
import { Icon } from '@iconify/react';
import { trackServiceClick as trackPlausibleServiceClick } from '../utils/plausible';
import { trackServiceClick, trackCTAClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, formatServicesForLanguage, getServiceFields } from '../utils/services';
import HowItWorks from '../components/HowItWorks';
import Testimonial from '../components/Testimonial';
import FAQ from '../components/FAQ';
import MobileCTA from '../components/MobileCTA';
import PriceDisplay from '../components/PriceDisplay';
import bgService from '../assets/bg-service.svg';

// Other Services Section Component
const OtherServicesSection = ({ currentServiceId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="other-services" className="py-20 px-4 sm:px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

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
                <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center">
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

const ServiceDetail = () => {
  const { serviceId: rawServiceId } = useParams();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    if (!serviceId) {
      setError(t('common.error'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

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
        setLoading(false);
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">{t('common.notFound')}</h1>
        <p className="text-gray-600 mb-8">{error || t('common.error')}</p>
        <Link to={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-2">
          <Icon icon="f7:doc-checkmark" className="w-5 h-5" />
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
      <section>
        <div
          className="relative overflow-hidden min-h-screen flex items-center"
          style={{
            backgroundImage: `url(${bgService})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
                  className={`primary-cta ${isMobile ? 'text-base' : 'text-lg'} inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 flex-shrink-0`}
                  onClick={() => {
                    trackCTAClick('service_detail_hero', service?.service_id || serviceId, location.pathname);
                  }}
                >
                  <Icon icon="f7:doc-checkmark" className="w-5 h-5" />
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

      {/* Pricing Section - Full Height Glassy Design */}
      <section className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-[30px] py-8 sm:py-16 relative">
        <div className="max-w-[1300px] w-full mx-auto">
          {/* Glassy Pricing Card */}
          <div 
            className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
            style={{
              background: 'rgba(20, 20, 20, 0.6)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Price */}
              <div className="lg:w-2/5 relative overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center items-center lg:items-start border-b lg:border-b-0 lg:border-r border-white/10">
                {/* Badge - Top Left Corner */}
                <div 
                  className="absolute top-0 left-0 z-20 inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3"
                  style={{
                    background: 'white',
                    color: '#047857',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '0',
                    borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '16px'
                  }}
                >
                  <span 
                    className="relative inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#047857',
                      animation: 'pulseDot 2s ease-in-out infinite'
                    }}
                  >
                    <span 
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: '#047857',
                        animation: 'pingDot 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                      }}
                    ></span>
                  </span>
                  <span className="whitespace-nowrap text-xs sm:text-sm">{t('serviceDetail.pricing.availableNow')}</span>
                </div>

                {/* Ultra glassy background with BLACK gradient */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(0, 0, 0, 1) 100%)',
                    backdropFilter: 'blur(120px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(120px) saturate(200%)'
                  }}
                ></div>
                
                {/* Glass reflection effect */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1/3 opacity-20"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                ></div>
                
                {/* Content */}
                <div className="relative z-10 text-white w-full mt-8 sm:mt-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">{service.name}</h2>
                  
                  {service.base_price ? (
                    <>
                      <div className="text-center lg:text-left w-full mb-4 sm:mb-6">
                        <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-2 sm:mb-3">
                          <PriceDisplay 
                            price={service.base_price} 
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400">{t('services.perDocument')}</p>
                      </div>
                      <div className="flex flex-col gap-3 sm:gap-4 w-full">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                          <Icon icon="iconoir:check-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                          <span>{t('serviceDetail.pricing.noHiddenFee')}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                          <Icon icon="iconoir:clock" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                          <span>{t('serviceDetail.pricing.sameDayDelivery')}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
                          <Icon icon="iconoir:shield-check" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                          <span>{t('serviceDetail.pricing.secure')}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center lg:text-left">
                      <p className="text-base sm:text-lg text-gray-300">{t('serviceDetail.pricing.contactForPricing')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Benefits and CTA */}
              <div className="lg:w-3/5 flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12 bg-white/5">
                {/* Benefits List */}
                <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.legallyValid.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.legallyValid.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.sameDay.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.sameDay.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.officialNotarization.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.officialNotarization.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.available247.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.available247.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.transparentFee.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.transparentFee.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.bankGradeSecurity.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.bankGradeSecurity.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon icon="iconoir:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white text-sm sm:text-base font-semibold mb-1">{t('serviceDetail.pricing.benefits.globalCompliance.title')}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{t('serviceDetail.pricing.benefits.globalCompliance.description')}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Ultra Glassy with Blue Gradient */}
                <a
                  href={getFormUrl(currency, service?.service_id || serviceId)}
                  onClick={() => {
                    trackCTAClick('service_detail_pricing', service?.service_id || serviceId, location.pathname);
                  }}
                  className="block w-full text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-center relative overflow-hidden group cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(51, 31, 226, 0.8) 0%, rgba(42, 26, 199, 0.9) 50%, rgba(51, 31, 226, 0.8) 100%)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    boxShadow: '0 8px 32px 0 rgba(51, 31, 226, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {/* Blue gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-80"
                    style={{
                      background: 'linear-gradient(135deg, rgba(51, 31, 226, 0.6) 0%, rgba(42, 26, 199, 0.8) 50%, rgba(51, 31, 226, 0.6) 100%)'
                    }}
                  ></div>
                  
                  <span className="inline-block flex items-center justify-center gap-2 relative z-10">
                    <Icon icon="f7:doc-checkmark" className="w-5 h-5" />
                    {service.cta || t('nav.notarizeNow')}
                  </span>
                </a>
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

      {/* Testimonial Section */}
      <Testimonial />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Other Services Section */}
      <OtherServicesSection currentServiceId={service.service_id} />

      {/* FAQ Section */}
      <FAQ />

      {/* Back to Services */}
      <section className="px-[30px] py-12">
        <div className="max-w-[1100px] mx-auto text-center">
          <Link to={getLocalizedPath('/#services')} className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>{t('serviceDetail.backToServices')}</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA with service-specific text */}
      <MobileCTA ctaText={service.cta || t('nav.notarizeNow')} price={service.base_price} serviceId={service?.service_id || serviceId} />
    </div>
  );
};

export default ServiceDetail;
