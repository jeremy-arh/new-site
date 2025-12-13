import { useEffect } from 'react'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CTAPopup from './components/CTAPopup'
import LanguageRouter from './components/LanguageRouter'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { setupLinkPrefetch, prefetchVisibleLinks, prefetchBlogPosts, prefetchServices, prefetchForm } from './utils/prefetch'
import { trackPageView as trackPlausiblePageView } from './utils/plausible'
import { trackPageView, trackScrollDepth } from './utils/analytics'

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
    // Cache les valeurs de layout pour éviter les forced reflows
    let cachedWindowHeight = 0;
    let cachedDocumentHeight = 0;
    
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          // Lire toutes les propriétés de layout en une seule fois
          cachedWindowHeight = window.innerHeight;
          cachedDocumentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.pageYOffset;
          const scrollPercentage = Math.round(((scrollTop + cachedWindowHeight) / cachedDocumentHeight) * 100);
          
          trackScrollDepth(scrollPercentage);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return null;
}

// Component to prefetch form on app load
function FormPrefetcher() {
  const { currency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    // Detect serviceId from URL if on a service page
    const serviceMatch = location.pathname.match(/\/services\/([^/]+)/);
    const serviceId = serviceMatch ? serviceMatch[1] : null;

    // Prefetch the form page after a short delay to not block initial page load
    // Prefetch with the current currency and serviceId (if on service page)
    const prefetchTimer = setTimeout(() => {
      prefetchForm(currency, serviceId);
    }, 1000);

    return () => clearTimeout(prefetchTimer);
  }, [currency, location.pathname]);

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
      // Prefetch visible links (including form links)
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
            <AppContent />
          </LanguageProvider>
        </Router>
      </CurrencyProvider>
    </HelmetProvider>
  )
}

export default App

// Render gated on language readiness to avoid any flash/404
const AppContent = () => {
  const { isReady } = useLanguage();

  if (!isReady) {
    return null;
  }

  return (
    <>
      <ScrollToTop />
      <PageViewTracker />
      <FormPrefetcher />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LanguageRouter />
        </main>
        <Footer />
        <CTAPopup />
      </div>
    </>
  );
};
