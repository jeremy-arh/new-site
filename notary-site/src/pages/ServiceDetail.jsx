import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { cache } from '../utils/cache';
import { Icon } from '@iconify/react';
import { trackServiceClick } from '../utils/plausible';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFormUrl } from '../utils/formUrl';
import { getCanonicalUrl } from '../utils/canonicalUrl';
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

  useEffect(() => {
    fetchServices();
  }, [currentServiceId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .neq('service_id', currentServiceId)
        .order('created_at', { ascending: true })
        .limit(6);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching other services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="other-services" className="py-20 px-[30px] bg-white">
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
    <section id="other-services" className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            Other services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 scroll-slide-up">
            Explore Our <span className="gradient-text">Other Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serviceItem) => (
            <Link
              key={serviceItem.id}
              to={`/services/${serviceItem.service_id}`}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up"
              onClick={() => trackServiceClick(serviceItem.service_id, serviceItem.name, 'service_detail_other_services')}
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

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed">{serviceItem.short_description || serviceItem.description}</p>

              <div className="flex items-center justify-between">
                <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span className="btn-text inline-block">Learn more</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                {serviceItem.base_price && (
                  <div className="flex items-center gap-2">
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
  const { serviceId } = useParams();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { formatPrice, currency } = useCurrency();
  const [ctaPrice, setCtaPrice] = useState('');

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    if (service?.base_price) {
      formatPrice(service.base_price).then(setCtaPrice);
    }
  }, [service?.base_price, formatPrice]);

  const fetchService = async () => {
    // Check cache first
    const cachedService = cache.get('service', serviceId);
    if (cachedService) {
      setService(cachedService);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        // Cache the data
        cache.set('service', serviceId, data, 10 * 60 * 1000);
        setService(data);
        // Track service view
        trackServiceClick(serviceId, data.name, 'service_detail_page');
      } else {
        setError('Service not found');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Failed to load service');
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight">Service Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link to="/" className="primary-cta text-lg px-8 py-4">
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{service.meta_title || service.name || 'Service'}</title>
        <link rel="canonical" href={getCanonicalUrl(location.pathname)} />
        <meta name="description" content={service.meta_description || service.short_description || service.description || ''} />
        <meta property="og:url" content={getCanonicalUrl(location.pathname)} />
      </Helmet>
      {/* Hero Section - Similar to Home Hero */}
      <section className="md:px-5 md:pt-[90px]">
        <div
          className="relative md:rounded-3xl overflow-hidden min-h-screen md:min-h-0 md:h-[calc(100vh-110px)] flex items-center"
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight animate-fade-in">
                {service.name}
              </h1>

              <p className="text-base sm:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed max-w-2xl animate-fade-in animation-delay-200">
                {service.short_description || service.description}
              </p>

              <a href={getFormUrl(currency)} className="primary-cta text-base md:text-lg inline-block mb-8 md:mb-12 bg-white text-black hover:bg-gray-100 animate-fade-in animation-delay-400">
                <span className="btn-text inline-block">
                  {service.cta || 'Notarize now'}{ctaPrice ? ` - ${ctaPrice}` : ''}
                </span>
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

      {/* What's Included Section */}
      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
            What's <span className="gradient-text">Included</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Icon icon="hugeicons:legal-hammer" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg font-semibold">Legally valid worldwide</h3>
              <p className="text-gray-600 text-sm">Your documents are legally recognized and valid across all countries, ensuring international acceptance and compliance with legal standards worldwide.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon icon="mingcute:flash-line" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg font-semibold">Fast & fully online</h3>
              <p className="text-gray-600 text-sm">Complete the entire notarization process online from anywhere in the world, with fast turnaround times and no need for in-person visits.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Icon icon="meteor-icons:badge-check" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg font-semibold">Secure & privacy-focused</h3>
              <p className="text-gray-600 text-sm">Your data and documents are protected with bank-level encryption and strict privacy measures, ensuring complete confidentiality throughout the process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section */}
      <section className="py-20 px-[30px] bg-gray-50">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
            What is <span className="gradient-text">{service.name}</span>?
          </h2>
          <div className="max-w-4xl mx-auto">
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
                    <span>Show less</span>
                    <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Read more</span>
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
          <Link to="/#services" className="inline-flex items-center gap-3 text-black font-semibold hover:underline">
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Back to all services</span>
          </Link>
        </div>
      </section>

      {/* Mobile CTA with service-specific text */}
      <MobileCTA ctaText={service.cta || 'Notarize now'} price={service.base_price} />
    </div>
  );
};

export default ServiceDetail;
