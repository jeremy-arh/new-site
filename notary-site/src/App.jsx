import { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CTAPopup from './components/CTAPopup'
import LanguageRouter from './components/LanguageRouter'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { setupLinkPrefetch, prefetchVisibleLinks, prefetchBlogPosts, prefetchServices } from './utils/prefetch'
import { trackPageView as trackPlausiblePageView } from './utils/plausible'
import { trackPageView, trackScrollDepth } from './utils/analytics'

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

// Component to track page views and scroll depth
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll milestones for new page
    sessionStorage.removeItem('analytics_scroll_milestones');
    
    // Track page view on route change (both Plausible and Analytics)
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.split('/').pop();
    trackPlausiblePageView(pageName, location.pathname).catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Plausible trackPageView error:', err);
      }
    });
    trackPageView(location.pathname);
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollPercentage = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
          
          trackScrollDepth(scrollPercentage);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return null;
}

function App() {
  useScrollAnimation();

  // Initialize prefetching on app load
  useEffect(() => {
    // Setup link hover prefetch immediately
    setupLinkPrefetch();

    // Wait for DOM to be ready
    const initPrefetch = () => {
      // Prefetch visible links
      prefetchVisibleLinks();

      // Prefetch initial data (blog posts and services) in background
      // These will be cached and available instantly when needed
      prefetchBlogPosts(10).catch(console.error);
      prefetchServices().catch(console.error);
    };

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(initPrefetch, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(initPrefetch, 500);
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <CurrencyProvider>
        <Router>
          <LanguageProvider>
            <ScrollToTop />
            <PageViewTracker />
            <div className="min-h-screen">
              <Navbar />
              <Suspense fallback={<PageLoader />}>
                <LanguageRouter />
              </Suspense>
              <Footer />
              <CTAPopup />
            </div>
          </LanguageProvider>
        </Router>
      </CurrencyProvider>
    </HelmetProvider>
  )
}

export default App
