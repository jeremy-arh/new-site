const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload your document',
      subtitle: '(secure upload)',
      description: 'Easily upload your document to our platform through a fully encrypted channel. All files are protected with bank-level encryption and stored securely. Only you and the notary have access.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5efbb1d5400424393_Group%2010.svg',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      number: 2,
      title: 'Book an appointment',
      subtitle: '',
      description: 'Schedule a secure video appointment at a time that suits you. Identity verification and signature are performed remotely in real time.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5fd4bae6a5650e0af_Group%2012.svg',
      color: 'from-pink-500 to-rose-600'
    },
    {
      number: 3,
      title: 'Verify & notarize online',
      subtitle: 'with an EU notary',
      description: 'During the live session, the notary confirms your identity, witnesses the signature when required, and finalizes the notarization digitally. Your notarized document is immediately uploaded to your secure dashboard.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5bc7e2c51e4e7fc90_Group%2014.svg',
      color: 'from-orange-500 to-amber-600'
    },
    {
      number: 4,
      title: 'Receive your document',
      subtitle: 'certified, apostilled or notarized',
      description: 'If your document needs to be used internationally, an apostille is added in accordance with the Hague Convention of 5 October 1961, confirming its global legal validity.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5635f02fe66ef88503_Group%2016.svg',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-32 px-[30px] bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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

        {/* Stacking Cards */}
        <div className="relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="sticky top-24 mb-8"
              style={{
                transform: `translateY(${index * 40}px)`,
              }}
            >
              <div
                className={`relative bg-gradient-to-br ${step.color} rounded-3xl p-8 md:p-12 shadow-2xl transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl`}
                style={{
                  animation: `cardSlideUp 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'} space-y-6`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                          {step.title}
                        </h3>
                        {step.subtitle && (
                          <p className="text-white/80 text-lg mt-1">{step.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-white/90 text-lg leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-12 h-1 bg-white/50 rounded-full"></div>
                      <span className="text-white/70 text-sm font-medium">
                        Step {step.number} of {steps.length}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl transform scale-110"></div>
                      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
                        <img
                          src={step.image}
                          alt={`Step ${step.number}`}
                          className="w-full h-auto max-w-[300px] mx-auto drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
