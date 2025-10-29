import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      // Only apply hide/show logic on mobile
      if (window.innerWidth < 768) {
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 px-[10px] md:px-0 pt-[10px] md:pt-0 ${
        !isHeaderVisible && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div
          className="transition-all duration-300 rounded-2xl md:rounded-none md:bg-[#FEFEFE]"
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
          <div className="max-w-[1300px] mx-auto px-[20px] md:px-[30px]">
            <div className="flex justify-between items-center h-14 md:h-20">
            {/* Logo */}
            <a href="#" className="flex-shrink-0 relative z-[60]">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ded4e7d28006679024b42f_Group%208.svg"
                alt="Logo"
                className={`h-6 md:h-8 w-auto md:brightness-100 md:invert-0 ${
                  isMenuOpen ? 'brightness-100 invert-0' : 'brightness-0 invert'
                }`}
                width="130"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#services" className="nav-link text-base">Our services</a>
              <a href="/#how-it-works" className="nav-link text-base">How it work</a>
              <a href="/#faq" className="nav-link text-base">FAQ</a>

              <div className="w-px h-6 bg-gray-300"></div>

              <a href="#" className="nav-link text-base font-semibold">Connexion</a>
              <a href="#" className="primary-cta text-sm"><span className="btn-text inline-block">Book an appointement</span></a>
            </div>

            {/* Animated Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-[60] w-8 h-8 flex flex-col items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 md:bg-gray-900 rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5 bg-gray-900' : 'bg-white'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 md:bg-gray-900 rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 scale-0 bg-gray-900' : 'opacity-100 scale-100 bg-white'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 md:bg-gray-900 rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5 bg-gray-900' : 'bg-white'
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
        className={`md:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-8 pt-24 pb-12">
          <div className="w-full max-w-md space-y-6">
            <a
              href="/#services"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              Our services
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              How it work
            </a>
            <a
              href="/#faq"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              FAQ
            </a>

            <div className="border-t border-gray-200 my-6"></div>

            <a
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              Connexion
            </a>
            <a
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center primary-cta text-lg py-4 mt-8"
            >
              <span className="btn-text inline-block">Book an appointement</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
