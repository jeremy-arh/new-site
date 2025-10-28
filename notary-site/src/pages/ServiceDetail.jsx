import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';
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

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl">
              {service.name}
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              {service.description}
            </p>

            {service.base_price && (
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-gray-600 text-xl">Starting from</span>
                <span className="text-5xl font-bold text-gray-900">${service.base_price}</span>
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
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">
            What's <span className="gradient-text">Included</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Secure Online Process</h3>
              <p className="text-gray-600 text-sm">Complete the entire process online through a secure encrypted platform</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Licensed Notary</h3>
              <p className="text-gray-600 text-sm">Work with experienced, licensed notaries who guide you through every step</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Internationally Recognized</h3>
              <p className="text-gray-600 text-sm">Documents are valid internationally through the Hague Convention</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Icon icon="carbon:checkmark-filled" className="w-12 h-12 text-black mb-4" />
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Fast Turnaround</h3>
              <p className="text-gray-600 text-sm">Receive your notarized documents within minutes of completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-[30px] bg-gray-50 relative">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-fade-in">
              How it work ?
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Notarization <span className="gradient-text">Made Easy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Four simple steps to get your documents notarized online
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: 'f7:doc',
                title: 'Upload your document',
                subtitle: '(secure upload)',
                description: 'Easily upload your document to our platform through a fully encrypted channel. All files are protected with bank-level encryption and stored securely. Only you and the notary have access.',
                image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5efbb1d5400424393_Group%2010.svg'
              },
              {
                icon: 'solar:calendar-broken',
                title: 'Book an appointment',
                subtitle: '',
                description: 'Schedule a secure video appointment at a time that suits you. Identity verification and signature are performed remotely in real time.',
                image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5fd4bae6a5650e0af_Group%2012.svg'
              },
              {
                icon: 'icon-park-outline:camera-two',
                title: 'Verify & notarize online',
                subtitle: 'with an EU notary',
                description: 'During the live session, the notary confirms your identity, witnesses the signature when required, and finalizes the notarization digitally. Your notarized document is immediately uploaded to your secure dashboard.',
                image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5bc7e2c51e4e7fc90_Group%2014.svg'
              },
              {
                icon: 'f7:doc-checkmark',
                title: 'Receive your document',
                subtitle: 'certified, apostilled or notarized',
                description: 'If your document needs to be used internationally, an apostille is added in accordance with the Hague Convention of 5 October 1961, confirming its global legal validity.',
                image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5635f02fe66ef88503_Group%2016.svg'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="sticky transition-all duration-500 animate-fade-in"
                style={{
                  top: `${100 + index * 30}px`,
                  animationDelay: `${0.3 + index * 0.1}s`
                }}
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow duration-300 min-h-[500px] flex flex-col">
                  <div className="grid md:grid-cols-2 gap-8 items-start flex-1">
                    <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} space-y-6 flex flex-col justify-between h-full`}>
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <Icon icon={step.icon} className="w-10 h-10 text-black flex-shrink-0" />
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                              {step.title}
                            </h3>
                            {step.subtitle && (
                              <p className="text-gray-600 text-base mt-1">{step.subtitle}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-500 text-sm font-medium">
                          Step {index + 1} of 4
                        </span>
                      </div>
                    </div>
                    <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex items-center justify-center h-full`}>
                      <img
                        src={step.image}
                        alt={`Step ${index + 1}`}
                        className="w-full max-w-[450px] h-auto transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-32 animate-fade-in" style={{ animationDelay: '1s' }}>
            <a href="#" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
              <span className="btn-text inline-block">Get Started Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-[30px] bg-white overflow-hidden">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 animate-fade-in">
            <div className="h-64 lg:h-auto relative overflow-hidden group">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1).jpg"
                srcSet="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1)-p-500.jpg 500w, https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1).jpg 800w"
                sizes="(max-width: 800px) 100vw, 800px"
                alt="Callum Davis"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
              <div className="relative">
                <svg className="w-12 h-12 text-gray-300 opacity-50 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 relative z-10">
                  "A smooth and fully digital experience"
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                My Notary made what used to be a complex process incredibly simple. I was able to sign,
                certify, and apostille my documents online, fully legally, in just a few minutes. Their
                team is responsive, reliable, and the platform is extremely intuitive
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-1 h-16 bg-black rounded-full"></div>
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">Callum Davis</div>
                  <div className="text-sm gradient-text font-semibold">CEO of Akkar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
