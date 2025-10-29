import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

const HowItWorks = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
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
  ];

  return (
    <section className="py-32 px-[30px] bg-gray-50 relative">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            How it work ?
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 scroll-slide-up">
            Notarization <span className="gradient-text">Made Easy</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto scroll-slide-up">
            Four simple steps to get your documents notarized online
          </p>
        </div>

        {/* Stacking Cards */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="sticky transition-all duration-500"
              style={{
                top: isMobile ? `${80 + index * 15}px` : `${100 + index * 30}px`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow duration-300 animate-slide-up min-h-[500px] flex flex-col">
                <div className="grid md:grid-cols-2 gap-8 items-start flex-1">
                  {/* Content */}
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
                        Step {index + 1} of {steps.length}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
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

        {/* Bottom CTA */}
        <div className="text-center mt-32 animate-fade-in animation-delay-1000">
          <a href="#" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
            <span className="btn-text inline-block">Get Started Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
