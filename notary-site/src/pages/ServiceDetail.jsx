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
            {t('services.otherServicesHeading').split(' ').slice(0, -2).join(' ')} <span className="gradient-text">{t('services.otherServicesHeading').split(' ').slice(-2).join(' ')}</span>
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
                <h3 className="text-xl font-bold text-gray-900">{serviceItem.name}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{serviceItem.short_description || serviceItem.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-auto items-center sm:items-end">
                <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center sm:justify-start">
                  <span className="btn-text inline-block">{t('services.learnMore')}</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                {serviceItem.base_price && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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
      <section className={isMobile ? '' : 'px-5 pt-[90px]'}>
        <div
          className={`relative ${isMobile ? '' : 'rounded-3xl'} overflow-hidden ${isMobile ? 'min-h-screen' : 'min-h-0 h-[calc(100vh-110px)]'} flex items-center`}
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
                {service.name}
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
                    <span className="text-xs font-normal text-white/70">{t('services.perDocument')}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className={`flex ${isMobile ? 'flex-col items-start gap-3' : 'flex-row items-center gap-8'} ${isMobile ? 'mt-6' : 'mt-8'} animate-fade-in animation-delay-600`}>
                <div className="flex items-center gap-2">
                  <Icon icon="lets-icons:world-2-light" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                  <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature1')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="fluent:flash-32-regular" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                  <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature2')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="si:lock-line" className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                  <span className={`text-white font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{t('hero.feature3')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose My Notary Section */}
      <section className="py-20 px-[30px] bg-white overflow-hidden">
        <div className="max-w-full mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
            {t('serviceDetail.whyChooseTitle')}
          </h2>
          <div className="relative w-full">
            <div className="infinite-scroll-container">
              <div className="flex flex-nowrap gap-6 animate-scroll-infinite">
                {/* First set of cards */}
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]">
                  <Icon icon="lets-icons:world-2-light" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.legallyValid.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.legallyValid.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]">
                  <Icon icon="fluent:flash-32-regular" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.fastOnline.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.fastOnline.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]">
                  <Icon icon="si:lock-line" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.securePrivacy.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.securePrivacy.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]">
                  <Icon icon="streamline-ultimate:certified-diploma" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.certifiedNotary.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.certifiedNotary.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]">
                  <Icon icon="ci:wavy-check" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.guaranteedAcceptance.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.guaranteedAcceptance.description')}</p>
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]" aria-hidden="true">
                  <Icon icon="lets-icons:world-2-light" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.legallyValid.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.legallyValid.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]" aria-hidden="true">
                  <Icon icon="fluent:flash-32-regular" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.fastOnline.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.fastOnline.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]" aria-hidden="true">
                  <Icon icon="si:lock-line" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.securePrivacy.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.securePrivacy.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]" aria-hidden="true">
                  <Icon icon="streamline-ultimate:certified-diploma" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.certifiedNotary.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.certifiedNotary.description')}</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 flex-shrink-0 w-[350px]" aria-hidden="true">
                  <Icon icon="ci:wavy-check" className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-gray-900 mb-2 text-base font-semibold">{t('serviceDetail.whyChoose.guaranteedAcceptance.title')}</h3>
                  <p className="text-gray-600 text-xs">{t('serviceDetail.whyChoose.guaranteedAcceptance.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section */}
      <section className="py-20 px-[30px] bg-gray-50">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
            {t('serviceDetail.whatIs')} <span className="gradient-text">{service.name}</span>?
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="relative animate-fade-in animation-delay-200">
              <div
                className={`blog-content ${!isDescriptionExpanded ? 'max-h-[400px] overflow-hidden' : ''}`}
                dangerouslySetInnerHTML={{ __html: service.detailed_description || service.description }}
              />
              {!isDescriptionExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
              )}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-black font-semibold hover:text-gray-600 transition-colors duration-200 inline-flex items-center gap-2"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>{t('serviceDetail.showLess')}</span>
                    <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>{t('serviceDetail.readMore')}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Other Services Section */}
      <OtherServicesSection currentServiceId={service.service_id} />

      {/* Testimonial Section */}
      <Testimonial />

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
