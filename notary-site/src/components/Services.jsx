const Services = () => {
  const services = [
    {
      title: 'Proxi',
      description: 'lorem slorem sipum lorem sipum lorem sipum ipum lorem sipum',
      price: '',
      link: '/services/proxi'
    },
    {
      title: 'Affidavit',
      description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      price: '',
      link: '/services/affidavit'
    },
    {
      title: 'Verification of Identity',
      description: 'lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum',
      price: '119',
      link: '/services/verification-of-identity'
    },
    {
      title: 'Power of Attorney',
      description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem',
      price: '119',
      link: '/services/power-of-attorney'
    },
    {
      title: 'Apostille',
      description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem',
      price: '119',
      link: '/services/apostille'
    }
  ];

  return (
    <section id="servive" className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 animate-slide-up">
            Our services
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-100">
            All the Notarial Services You Need.<br />
            <span className="gradient-text">In One Place</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.link}
              className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <img
                    src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8b6196784dbd395a2dfe_iconoir--badge-check%202.svg"
                    alt="Icon"
                    className="w-12 h-12"
                    height="40"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">From</span>
                  {service.price && (
                    <span className="text-lg font-bold text-gray-900">{service.price}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
