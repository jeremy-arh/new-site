import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The service you\'re looking for doesn\'t exist.'}</p>
        <Link to="/" className="primary-cta text-lg px-8 py-4">
          <span className="btn-text inline-block">Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-[30px] bg-gray-50">
        <div className="max-w-[1100px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8 animate-fade-in">
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

          {/* Service Header */}
          <div className="flex items-start gap-6 mb-8 animate-fade-in animation-delay-100">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0">
              {service.icon ? (
                <Icon icon={service.icon} className="w-12 h-12 text-black" />
              ) : (
                <Icon icon="iconoir:badge-check" className="w-12 h-12 text-black" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {service.name}
              </h1>
              {service.base_price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600 text-lg">Starting from</span>
                  <span className="text-4xl font-bold text-gray-900">${service.base_price}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-[30px] bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg prose-gray max-w-none mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About this service</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features/Benefits */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What's included</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon icon="carbon:checkmark-filled" className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Secure Online Process</h3>
                      <p className="text-gray-600">Complete the entire process online through a secure encrypted platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon icon="carbon:checkmark-filled" className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Licensed Notary</h3>
                      <p className="text-gray-600">Work with experienced, licensed notaries who guide you through every step</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon icon="carbon:checkmark-filled" className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Internationally Recognized</h3>
                      <p className="text-gray-600">Documents are valid internationally through the Hague Convention</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Icon icon="carbon:checkmark-filled" className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Fast Turnaround</h3>
                      <p className="text-gray-600">Receive your notarized documents within minutes of completion</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">How it works</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Upload your document</h3>
                      <p className="text-gray-600">Securely upload the document you need notarized to our platform</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Schedule your session</h3>
                      <p className="text-gray-600">Book a convenient time for your video notarization session</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Meet with notary online</h3>
                      <p className="text-gray-600">Connect with a licensed notary via secure video call for verification</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Receive your document</h3>
                      <p className="text-gray-600">Download your notarized document immediately after the session</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
                  <p className="text-gray-600 mb-6">
                    Book your appointment now and get your documents notarized in minutes.
                  </p>

                  {service.base_price && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-baseline justify-between">
                        <span className="text-gray-600">Starting price</span>
                        <div>
                          <span className="text-3xl font-bold text-gray-900">${service.base_price}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <a
                    href="#"
                    className="block w-full text-center primary-cta text-lg px-6 py-4 mb-4"
                  >
                    <span className="btn-text inline-block">Book an appointment</span>
                  </a>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon icon="carbon:checkmark" className="w-5 h-5 text-black" />
                      <span>24/7 availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="carbon:checkmark" className="w-5 h-5 text-black" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="carbon:checkmark" className="w-5 h-5 text-black" />
                      <span>Secure & encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-[30px] bg-gray-50">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-[800px] mx-auto">
            <details className="group bg-white rounded-2xl border border-gray-200 p-6">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>How long does the process take?</span>
                <Icon icon="carbon:chevron-down" className="w-6 h-6 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600">Most sessions take 10-15 minutes. You'll receive your notarized document immediately after completion.</p>
            </details>
            <details className="group bg-white rounded-2xl border border-gray-200 p-6">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>Is this legally valid?</span>
                <Icon icon="carbon:chevron-down" className="w-6 h-6 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600">Yes, all documents are notarized by licensed notaries and are legally valid. They can be apostilled for international use.</p>
            </details>
            <details className="group bg-white rounded-2xl border border-gray-200 p-6">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span>What do I need for the session?</span>
                <Icon icon="carbon:chevron-down" className="w-6 h-6 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600">You'll need a valid government-issued ID, a device with camera and microphone, and your document ready to upload.</p>
            </details>
          </div>
        </div>
      </section>

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
