import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Icon } from '@iconify/react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            Our services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 scroll-slide-up">
            All the Notarial Services You Need.<br />
            <span className="gradient-text">In One Place</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No services available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.id}
                to={`/services/${service.service_id}`}
                className="group block bg-gray-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 border border-gray-200 transform hover:-translate-y-2 scroll-slide-up"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                    {service.icon ? (
                      <Icon icon={service.icon} className="w-10 h-10 text-black" />
                    ) : (
                      <Icon icon="iconoir:badge-check" className="w-10 h-10 text-black" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                </div>

                <p className="text-gray-600 mb-6 min-h-[60px] leading-relaxed">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="primary-cta text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span className="btn-text inline-block">Learn more</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  {service.base_price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-lg font-bold text-gray-900">${service.base_price}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
