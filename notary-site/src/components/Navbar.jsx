import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
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
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 2</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resource Link 3</a>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <a href="#" className="nav-link text-base font-semibold">Connexion</a>
            <a href="#" className="primary-cta text-sm">Book an appointement</a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Feature
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              User Examples
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Pricing
            </a>

            {/* Mobile Resources */}
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md"
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
                <div className="pl-4 space-y-1">
                  <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md">
                    Resource Link 1
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md">
                    Resource Link 2
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md">
                    Resource Link 3
                  </a>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            <a href="#" className="block px-3 py-2 text-base font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md">
              Connexion
            </a>
            <a href="#" className="block mx-3 my-2 text-center primary-cta">
              Book an appointement
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
