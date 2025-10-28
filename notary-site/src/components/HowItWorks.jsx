const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload your document (secure upload)',
      description: 'Easily upload your document to our platform through a fully encrypted channel. All files are protected with bank-level encryption and stored securely. Only you and the notary have access.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5efbb1d5400424393_Group%2010.svg'
    },
    {
      number: 2,
      title: 'Book an appointement',
      description: 'Schedule a secure video appointment at a time that suits you. Identity verification and signature are performed remotely in real time.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5fd4bae6a5650e0af_Group%2012.svg'
    },
    {
      number: 3,
      title: 'Verify & notarize online with an EU notary',
      description: 'During the live session, the notary confirms your identity, witnesses the signature when required, and finalizes the notarization digitally. Your notarized document is immediately uploaded to your secure dashboard.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5bc7e2c51e4e7fc90_Group%2014.svg'
    },
    {
      number: 4,
      title: 'Receive your certified, apostilled, or notarized document',
      description: 'If your document needs to be used internationally, an apostille is added in accordance with the Hague Convention of 5 October 1961, confirming its global legal validity.',
      image: 'https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ffa5c5635f02fe66ef88503_Group%2016.svg'
    }
  ];

  return (
    <section className="py-20 px-[30px] bg-gray-50">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4">
                How it work ?
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                Notarization <span className="text-blue-600">Made Easy</span>
              </h2>

              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-3">
                    <p className="text-gray-700 font-medium">
                      {step.number}- {step.title.replace(' (secure upload)', '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Content Cards */}
          <div className="lg:col-span-7 space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                <div className="flex justify-center">
                  <img
                    src={step.image}
                    alt={`Step ${step.number}`}
                    className="w-auto h-48 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
