import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';
import { trackServiceClick } from '../utils/plausible';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServicesForLanguage, getServiceFields } from '../utils/services';
import PriceDisplay from '../components/PriceDisplay';
import MobileCTA from '../components/MobileCTA';

const ServicesList = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { language, getLocalizedPath } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, [language]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(getServiceFields())
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Formater les services selon la langue
      const formattedServices = formatServicesForLanguage(data || [], language);
      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Our Services - My notary</title>
        <link rel="canonical" href={getCanonicalUrl(location.pathname)} />
        <meta name="description" content="Discover all our notarial services: apostille, power of attorney, certified translations, and more. Secure, legally valid, and recognized internationally." />
        <meta property="og:url" content={getCanonicalUrl(location.pathname)} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-[30px] bg-gray-50">
        <div className="max-w-[1300px] mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
            {t('services.title')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-100">
            {t('services.heading')}<br />
            <span className="gradient-text">{t('services.headingHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={getLocalizedPath(`/services/${service.service_id}`)}
                  className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up flex flex-col"
                  onClick={() => trackServiceClick(service.service_id, service.name, 'services_page')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      {service.icon ? (
                        <Icon icon={service.icon} className="w-10 h-10 text-black" />
                      ) : (
                        <Icon icon="iconoir:badge-check" className="w-10 h-10 text-black" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed flex-1">{service.short_description || service.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-auto items-center sm:items-end">
                    <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all justify-center sm:justify-start">
                      <span className="btn-text inline-block">{t('services.learnMore')}</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    {service.base_price && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <PriceDisplay price={service.base_price} showFrom className="text-lg font-bold text-gray-900" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <MobileCTA />
    </div>
  );
};

export default ServicesList;

