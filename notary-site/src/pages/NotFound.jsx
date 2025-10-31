import { Link } from 'react-router-dom';
import MobileCTA from '../components/MobileCTA';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-[600px] mx-auto px-[30px] text-center py-20">
        {/* 404 Large Text */}
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[160px] lg:text-[200px] font-bold text-gray-900 leading-none animate-fade-in">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in animation-delay-200">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-400">
          <Link
            to="/"
            className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="btn-text inline-block">Back to Home</span>
          </Link>

          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:underline text-lg"
          >
            <span>View Our Services</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in animation-delay-600">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/#services" className="text-sm text-gray-600 hover:text-black transition-colors">
              Our Services
            </Link>
            <Link to="/#how-it-works" className="text-sm text-gray-600 hover:text-black transition-colors">
              How It Works
            </Link>
            <Link to="/#faq" className="text-sm text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
            <Link to="/blog" className="text-sm text-gray-600 hover:text-black transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </div>

      <MobileCTA />
    </div>
  );
};

export default NotFound;
