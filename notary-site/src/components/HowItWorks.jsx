const HowItWorks = () => {
  return (
    <section className="py-32 px-[30px] bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column - Title and steps list */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="mb-12 animate-fade-in">
                <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-slide-up">
                  How it work ?
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up animation-delay-100">
                  Notarization <span className="gradient-text">Made Easy</span>
                </h2>
              </div>

              <div className="space-y-6">
                <div className="animate-slide-up animation-delay-200">
                  <p className="text-lg font-semibold text-gray-900">1- Upload your document (secure upload)</p>
                </div>
                <div className="animate-slide-up animation-delay-300">
                  <p className="text-lg font-semibold text-gray-900">2- Book an appointment</p>
                </div>
                <div className="animate-slide-up animation-delay-400">
                  <p className="text-lg font-semibold text-gray-900">3- Verify & notarize online with an EU notary</p>
                </div>
                <div className="animate-slide-up animation-delay-500">
                  <p className="text-lg font-semibold text-gray-900">4- Receive your certified, apostilled, or notarized document</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Nested stacking cards */}
          <div className="lg:col-span-7">
            {/* Card 1 - Transparent background */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200 animate-slide-up animation-delay-200">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Upload your document (secure upload)</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Easily upload your document to our platform through a fully encrypted channel. All files are protected with bank-level encryption and stored securely. Only you and the notary have access.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5efbb1d5400424393_Group%2010.svg"
                  alt="Upload document"
                  className="w-full max-w-[300px] h-auto"
                />
              </div>

              {/* Card 2 - Nested inside Card 1 */}
              <div className="mt-8 bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 animate-slide-up animation-delay-400">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Book an appointment</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Schedule a secure video appointment at a time that suits you. Identity verification and signature are performed remotely in real time.
                  </p>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5fd4bae6a5650e0af_Group%2012.svg"
                    alt="Book appointment"
                    className="w-full max-w-[300px] h-auto"
                  />
                </div>

                {/* Card 3 - Nested inside Card 2 */}
                <div className="mt-8 bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 animate-slide-up animation-delay-600">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Verify & notarize online with an EU notary</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      During the live session, the notary confirms your identity, witnesses the signature when required, and finalizes the notarization digitally. Your notarized document is <strong>immediately uploaded to your secure dashboard</strong>.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5bc7e2c51e4e7fc90_Group%2014.svg"
                      alt="Verify and notarize"
                      className="w-full max-w-[300px] h-auto"
                    />
                  </div>

                  {/* Card 4 - Nested inside Card 3 */}
                  <div className="mt-8 bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 animate-slide-up animation-delay-800">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Receive your document</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        If your document needs to be used internationally, an apostille is added <strong>in accordance with the Hague Convention of 5 October 1961</strong>, confirming its global legal validity.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5635f02fe66ef88503_Group%2016.svg"
                        alt="Receive document"
                        className="w-full max-w-[300px] h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-32 animate-fade-in animation-delay-1000">
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
