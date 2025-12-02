import { useState, useEffect, useCallback, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import logoNoir from '../assets/logo-noir.svg';
import logoBlanc from '../assets/logo-blanc.svg';
import { trackCTAClick as trackPlausibleCTAClick, trackLoginClick as trackPlausibleLoginClick, trackNavigationClick as trackPlausibleNavigationClick } from '../utils/plausible';
import { trackCTAClick, trackLoginClick, trackNavigationClick } from '../utils/analytics';
import { useCurrency } from '../contexts/CurrencyContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { getFormUrl } from '../utils/formUrl';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, getServiceFields } from '../utils/services';

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [ctaText, setCtaText] = useState('');
  const [servicePrice, setServicePrice] = useState(null);
  const [formattedPrice, setFormattedPrice] = useState('');
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const location = useLocation();
  const { formatPrice, currency } = useCurrency();
  const { t } = useTranslation();
  const { language } = useLanguage();
  // Note: Navbar is outside specific Route elements, so useParams is not reliable here

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsScrolled(currentScrollY > 50);

    // Only apply hide/show logic on mobile
    if (window.innerWidth < 1150) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
    } else {
      setIsHeaderVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1150);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  // Fetch CTA from blog post or service detail page based on pathname
  useEffect(() => {
    const fetchBlogCTA = async () => {
      const path = location.pathname || '';

      // Blog post detail
      const blogMatch = path.match(/^\/blog\/([^/]+)/);
      if (blogMatch && blogMatch[1]) {
        const slug = decodeURIComponent(blogMatch[1]);
        setCurrentServiceId(null); // Reset serviceId on blog pages
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('cta')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

          if (!error && data?.cta) {
            setCtaText(data.cta);
          } else {
            setCtaText('');
          }
        } catch (error) {
          console.error('Error fetching blog CTA:', error);
          setCtaText('');
        }
      } else {
        // Service detail
        const serviceMatch = path.match(/^\/services\/([^/]+)/);
        if (serviceMatch && serviceMatch[1]) {
          const serviceId = decodeURIComponent(serviceMatch[1]);
          setCurrentServiceId(serviceId); // Set serviceId for service pages
          try {
            const { data, error } = await supabase
              .from('services')
              .select(getServiceFields())
              .eq('service_id', serviceId)
              .single();

            if (!error && data) {
              // Formater le service selon la langue actuelle
              const formattedService = formatServiceForLanguage(data, language);
              setCtaText(formattedService.cta || '');
              // Set price only if it exists and is not empty/null
              const price = formattedService.base_price;
              setServicePrice(price != null && price !== '' && price !== undefined ? price : null);
            } else {
              setCtaText('');
              setServicePrice(null);
            }
          } catch (error) {
            console.error('Error fetching service CTA:', error);
            setCtaText('');
            setServicePrice(null);
          }
        } else {
          // Reset to default if not on blog/service detail page
          setCtaText('');
          setServicePrice(null);
          setCurrentServiceId(null); // Reset serviceId on other pages
        }
      }
    };

    fetchBlogCTA();
  }, [location.pathname, language]);

  useEffect(() => {
    if (servicePrice) {
      formatPrice(servicePrice).then(setFormattedPrice);
    } else {
      setFormattedPrice('');
    }
  }, [servicePrice, formatPrice]);

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isMobile ? 'px-[10px] pt-[10px]' : 'px-0 pt-0'} ${
        !isHeaderVisible && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div
          className={`transition-all duration-300 ${isMobile ? 'rounded-2xl' : 'rounded-none bg-[#FEFEFE]'}`}
          style={isMobile ? (isMenuOpen ? {
            background: 'transparent',
            borderRadius: '16px',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          } : {
            background: 'rgba(0, 0, 0, 0.26)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(15.6px)',
            WebkitBackdropFilter: 'blur(15.6px)',
          }) : {
            background: '#FEFEFE',
          }}
        >
          <div className={`max-w-[1300px] mx-auto ${isMobile ? 'px-[20px]' : 'px-[30px]'}`}>
            <div className={`flex justify-between items-center ${isMobile ? 'h-14' : 'h-20'}`}>
            {/* Logo */}
            <a href="/" className="flex-shrink-0 relative z-[60]">
              <img
                src={isMobile && !isMenuOpen ? logoBlanc : logoNoir}
                alt="Logo"
                className={`${isMobile ? 'h-6' : 'h-8'} w-auto`}
                width="130"
              />
            </a>

            {/* Desktop Navigation */}
            <div className={`${isMobile ? 'hidden' : 'flex'} items-center space-x-8`}>
              <a 
                href={location.pathname.startsWith('/services/') ? '#other-services' : '/#services'} 
                className="nav-link text-base"
                onClick={(e) => {
                  const destination = location.pathname.startsWith('/services/') ? '#other-services' : '/#services';
                  if (location.pathname.startsWith('/services/')) {
                    e.preventDefault();
                    const element = document.getElementById('other-services');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                  trackPlausibleNavigationClick('Our services', destination);
                  trackNavigationClick('Our services', destination, location.pathname);
                }}
              >
                {t('nav.services')}
              </a>
              <a 
                href={location.pathname.startsWith('/services/') ? '#how-it-works' : '/#how-it-works'} 
                className="nav-link text-base"
                onClick={(e) => {
                  const destination = location.pathname.startsWith('/services/') ? '#how-it-works' : '/#how-it-works';
                  if (location.pathname.startsWith('/services/')) {
                    e.preventDefault();
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                  trackPlausibleNavigationClick('How it work', destination);
                  trackNavigationClick('How it work', destination, location.pathname);
                }}
              >
                {t('nav.howItWorks')}
              </a>
              <a 
                href={location.pathname.startsWith('/services/') ? '#faq' : '/#faq'} 
                className="nav-link text-base"
                onClick={(e) => {
                  const destination = location.pathname.startsWith('/services/') ? '#faq' : '/#faq';
                  if (location.pathname.startsWith('/services/')) {
                    e.preventDefault();
                    const element = document.getElementById('faq');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                  trackPlausibleNavigationClick('FAQ', destination);
                  trackNavigationClick('FAQ', destination, location.pathname);
                }}
              >
                {t('nav.faq')}
              </a>

              <div className="w-px h-6 bg-gray-300"></div>

              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <CurrencySelector />
              </div>

              <a 
                href="https://app.mynotary.io/login" 
                className="nav-link text-base font-semibold"
                onClick={() => {
                  trackPlausibleLoginClick('navbar_desktop');
                  trackLoginClick('navbar_desktop', location.pathname);
                }}
              >
                {t('nav.login')}
              </a>
              <div className={`relative inline-flex items-center gap-3 ${isMobile ? '' : 'overflow-visible'}`}>
                <a 
                  href={getFormUrl(currency, currentServiceId)} 
                  className="glassy-cta primary-cta text-sm relative z-10"
                  onClick={() => {
                    trackPlausibleCTAClick('navbar_desktop');
                    trackCTAClick('navbar_desktop', currentServiceId, location.pathname);
                  }}
                >
                  <span className="btn-text inline-block inline-flex items-center gap-2">
                    <Icon icon="f7:doc-checkmark" className="w-4 h-4 text-white" />
                    {ctaText || t('nav.notarizeNow')}
                  </span>
                </a>
                {formattedPrice && (
                  <div className="text-white flex items-center gap-1 whitespace-nowrap">
                    <span className="text-base font-semibold">{formattedPrice}</span>
                    <span className="text-xs font-normal text-white/70">{t('services.perDocument')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Animated Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className={`${isMobile ? '' : 'hidden'} relative z-[60] w-10 h-10 flex flex-col items-center justify-center focus:outline-none overflow-visible`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute ${
                    isMenuOpen ? 'rotate-45 bg-gray-900' : 'bg-white top-0'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 absolute ${
                    isMenuOpen ? 'opacity-0 scale-0 bg-gray-900' : 'opacity-100 scale-100 bg-white top-1/2 -translate-y-1/2'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 rounded-full transition-all duration-300 origin-center absolute ${
                    isMenuOpen ? '-rotate-45 bg-gray-900' : 'bg-white bottom-0'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`${isMobile ? '' : 'hidden'} fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <div className="h-full flex flex-col justify-center items-start px-8 pt-24 pb-12">
          <div className="w-full max-w-md space-y-4">
            <a
              href={location.pathname.startsWith('/services/') ? '#other-services' : '/#services'}
              onClick={(e) => {
                const destination = location.pathname.startsWith('/services/') ? '#other-services' : '/#services';
                if (location.pathname.startsWith('/services/')) {
                  e.preventDefault();
                  const element = document.getElementById('other-services');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
                trackPlausibleNavigationClick('Our services', destination);
                trackNavigationClick('Our services', destination, location.pathname);
                closeMenu();
              }}
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
            >
              {t('nav.services')}
            </a>
            <a
              href={location.pathname.startsWith('/services/') ? '#how-it-works' : '/#how-it-works'}
              onClick={(e) => {
                const destination = location.pathname.startsWith('/services/') ? '#how-it-works' : '/#how-it-works';
                if (location.pathname.startsWith('/services/')) {
                  e.preventDefault();
                  const element = document.getElementById('how-it-works');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
                trackPlausibleNavigationClick('How it work', destination);
                trackNavigationClick('How it work', destination, location.pathname);
                closeMenu();
              }}
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
            >
              {t('nav.howItWorks')}
            </a>
            <a
              href={location.pathname.startsWith('/services/') ? '#faq' : '/#faq'}
              onClick={(e) => {
                const destination = location.pathname.startsWith('/services/') ? '#faq' : '/#faq';
                if (location.pathname.startsWith('/services/')) {
                  e.preventDefault();
                  const element = document.getElementById('faq');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
                trackPlausibleNavigationClick('FAQ', destination);
                trackNavigationClick('FAQ', destination, location.pathname);
                closeMenu();
              }}
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
            >
              {t('nav.faq')}
            </a>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center gap-3 py-2">
              <LanguageSelector />
              <div className="w-px h-6 bg-gray-300"></div>
              <CurrencySelector />
            </div>

            <a
              href="https://app.mynotary.io/login"
              onClick={() => {
                trackPlausibleLoginClick('navbar_mobile');
                trackLoginClick('navbar_mobile', location.pathname);
                closeMenu();
              }}
              className="block text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-2"
            >
              {t('nav.login')}
            </a>
            <div className="w-full mt-8">
              <a
                href={getFormUrl(currency, currentServiceId)}
                onClick={() => {
                  trackPlausibleCTAClick('navbar_mobile');
                  trackCTAClick('navbar_mobile', currentServiceId, location.pathname);
                  closeMenu();
                }}
                className="block w-full text-center glassy-cta primary-cta text-lg py-4"
              >
                <span className="btn-text inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <Icon icon="f7:doc-checkmark" className="w-5 h-5 text-white" />
                  {ctaText || t('nav.notarizeNow')}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
