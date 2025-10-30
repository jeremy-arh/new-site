import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ctaText, setCtaText] = useState('Book an appointment');

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMenuState = () => {
      setIsMenuOpen(document.body.classList.contains('mobile-menu-open'));
    };

    // Check initial state
    checkMenuState();

    // Observe changes to body classes
    const observer = new MutationObserver(checkMenuState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchCTA();
  }, []);

  const fetchCTA = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('cta')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      console.log('MobileCTA - Fetched data:', data);

      if (data?.cta) {
        console.log('MobileCTA - Setting CTA text to:', data.cta);
        setCtaText(data.cta);
      } else {
        console.log('MobileCTA - No CTA found in data');
      }

      if (error) {
        console.error('MobileCTA - Supabase error:', error);
      }
    } catch (error) {
      console.error('MobileCTA - Error fetching CTA:', error);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible && !isMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="px-4 py-3">
          <a
            href="#"
            className="block w-full text-center px-6 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileCTA;
