import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';
import HowItWorks from '../components/HowItWorks';
import Testimonial from '../components/Testimonial';
import FAQ from '../components/FAQ';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        setService(data);
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
        <h1 className="text-3xl sm:text-5xl lg:text-7xl text-gray-900 mb-4 md:mb-6 leading-tight">Service Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link to="/" className="primary-cta text-lg px-8 py-4">
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - 100vh */}
      <section className="min-h-screen flex items-center justify-center px-[30px] bg-gray-50 relative">
        <div className="max-w-[1100px] mx-auto w-full">
          {/* Breadcrumb - Positioned at top */}
          <nav className="flex items-center gap-2 text-sm mb-12 animate-fade-in absolute top-32 left-[30px] right-[30px]">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/#services" className="text-gray-600 hover:text-gray-900 transition-colors">
              Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{service.name}</span>
          </nav>

          {/* Service Header - Centered */}
          <div className="flex flex-col items-center text-center animate-fade-in animation-delay-100">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8">
              {service.icon ? (
                <Icon icon={service.icon} className="w-14 h-14 text-black" />
              ) : (
                <Icon icon="iconoir:badge-check" className="w-14 h-14 text-black" />
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl text-gray-900 mb-4 md:mb-6 leading-tight max-w-4xl">
              {service.name}
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              {service.description}
            </p>

            {service.base_price && (
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-gray-600 text-xl">Starting from</span>
                <span className="text-5xl text-gray-900">${service.base_price}</span>
              </div>
            )}

            <a
              href="#"
              className="primary-cta text-lg px-10 py-5 inline-flex items-center gap-3 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span className="btn-text inline-block">Book an appointment</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1300px] mx-auto">
          <h2 className="text-4xl sm:text-5xl text-gray-900 mb-12 text-center animate-fade-in">
            What's <span className="gradient-text">Included</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg">Secure Online Process</h3>
              <p className="text-gray-600 text-sm">Complete the entire process online through a secure encrypted platform</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg">Licensed Notary</h3>
              <p className="text-gray-600 text-sm">Work with experienced, licensed notaries who guide you through every step</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg">Internationally Recognized</h3>
              <p className="text-gray-600 text-sm">Documents are valid internationally through the Hague Convention</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="text-gray-900 mb-2 text-lg">Fast Turnaround</h3>
              <p className="text-gray-600 text-sm">Receive your notarized documents within minutes of completion</p>
            </div>
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
    </div>
  );
};

export default ServiceDetail;
