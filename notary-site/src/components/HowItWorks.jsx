import { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: 'Upload your document',
      subtitle: '(secure upload)',
      description: 'Easily upload your document to our platform through a fully encrypted channel. All files are protected with bank-level encryption and stored securely. Only you and the notary have access.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5efbb1d5400424393_Group%2010.svg'
    },
    {
      number: 2,
      title: 'Book an appointment',
      subtitle: '',
      description: 'Schedule a secure video appointment at a time that suits you. Identity verification and signature are performed remotely in real time.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5fd4bae6a5650e0af_Group%2012.svg'
    },
    {
      number: 3,
      title: 'Verify & notarize online',
      subtitle: 'with an EU notary',
      description: 'During the live session, the notary confirms your identity, witnesses the signature when required, and finalizes the notarization digitally. Your notarized document is immediately uploaded to your secure dashboard.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5bc7e2c51e4e7fc90_Group%2014.svg'
    },
    {
      number: 4,
      title: 'Receive your document',
      subtitle: 'certified, apostilled or notarized',
      description: 'If your document needs to be used internationally, an apostille is added in accordance with the Hague Convention of 5 October 1961, confirming its global legal validity.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5635f02fe66ef88503_Group%2016.svg'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const progress = (scrollPosition - sectionTop) / sectionHeight;
        const newActiveStep = Math.min(Math.floor(progress * steps.length), steps.length - 1);
        setActiveStep(newActiveStep);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <section ref={sectionRef} className="py-32 px-[30px] bg-gray-50 relative" style={{ minHeight: '400vh' }}>
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-slide-up">
            How it work ?
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up animation-delay-100">
            Notarization <span className="gradient-text">Made Easy</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Four simple steps to get your documents notarized online
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div className="relative">
          <div className="sticky top-32 h-[600px]">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPassed = index < activeStep;

              return (
                <div
                  key={step.number}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    transform: isPassed
                      ? `translateY(-${(activeStep - index) * 100}%) scale(0.95)`
                      : `translateY(${(index - activeStep) * 20}px) scale(${1 - (index - activeStep) * 0.05})`,
                    opacity: isPassed ? 0 : 1,
                    zIndex: steps.length - index,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 h-full overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12 items-center h-full">
                      {/* Content */}
                      <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} space-y-6`}>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                            {step.number}
                          </div>
                          <div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                              {step.title}
                            </h3>
                            {step.subtitle && (
                              <p className="text-gray-600 text-lg mt-1">{step.subtitle}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 text-lg leading-relaxed">
                          {step.description}
                        </p>

                        <div className="flex items-center gap-3 pt-4">
                          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-500 text-sm font-medium">
                            Step {step.number} of {steps.length}
                          </span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                        <div className="relative">
                          <div className="bg-gray-100 rounded-3xl p-12">
                            <img
                              src={step.image}
                              alt={`Step ${step.number}`}
                              className="w-full h-auto max-w-[300px] mx-auto transform hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-32 animate-fade-in animation-delay-400">
          <a href="#" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
            Get Started Now
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
