import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-white shadow-lg'
      }`}>
        <div className="max-w-[1300px] mx-auto px-[30px]">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href="#" className="flex-shrink-0 relative z-[60]">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ded4e7d28006679024b42f_Group%208.svg"
                alt="Logo"
                className="h-8 w-auto"
                width="130"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="nav-link text-base">Feature</a>
              <a href="#" className="nav-link text-base">User Examples</a>
              <a href="#" className="nav-link text-base">Pricing</a>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="nav-link text-base flex items-center space-x-1"
                >
                  <span>Resources</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-lg py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 1</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 2</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 3</a>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              <a href="#" className="nav-link text-base font-semibold">Connexion</a>
              <a href="#" className="header-cta text-sm">Book an appointement</a>
            </div>

            {/* Animated Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-gray-900 rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </div>
            </button>
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
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              Feature
            </a>
            <a
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              User Examples
            </a>
            <a
              href="#"
              onClick={() => setIsMenuOpen(false)}
              className="block text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
            >
              Pricing
            </a>

            {/* Mobile Resources */}
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between text-3xl font-bold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-3"
              >
                <span>Resources</span>
                <svg
                  className={`w-6 h-6 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="pl-6 mt-2 space-y-3">
                  <a
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                  >
                    Resource Link 1
                  </a>
                  <a
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                  >
                    Resource Link 2
                  </a>
                  <a
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-xl text-gray-600 hover:text-gray-900 transition-colors duration-200 py-2"
                  >
                    Resource Link 3
                  </a>
                </div>
              )}
            </div>

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
              Book an appointement
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
