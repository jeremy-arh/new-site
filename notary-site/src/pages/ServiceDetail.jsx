import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { cache } from '../utils/cache';
import { Icon } from '@iconify/react';
import { trackServiceClick } from '../utils/plausible';
import HowItWorks from '../components/HowItWorks';
import Testimonial from '../components/Testimonial';
import FAQ from '../components/FAQ';
import MobileCTA from '../components/MobileCTA';
import bgService from '../assets/bg-service.svg';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

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
        <meta name="description" content={service.meta_description || service.short_description || service.description || ''} />
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

              <a href="https://app.mynotary.io/form" className="primary-cta text-base md:text-lg inline-block mb-8 md:mb-12 bg-white text-black hover:bg-gray-100 animate-fade-in animation-delay-400">
                <span className="btn-text inline-block">
                  {service.cta || 'Notarize now'}{service.base_price ? ` - ${service.base_price}€` : ''}
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
            <div
              className="blog-content animate-fade-in animation-delay-200"
              dangerouslySetInnerHTML={{ __html: service.detailed_description || service.description }}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

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
