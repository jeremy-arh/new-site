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
    <section id="servive" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            Our services
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            All the Notarial Services You Need.<br />
            <span className="text-blue-600">In One Place</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.link}
              className="block bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8b6196784dbd395a2dfe_iconoir--badge-check%202.svg"
                  alt="Icon"
                  className="w-10 h-10"
                  height="40"
                />
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
              </div>

              <p className="text-gray-600 mb-6 min-h-[60px]">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="primary-cta text-sm inline-block">Learn more</div>
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
