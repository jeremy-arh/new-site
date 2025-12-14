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

  // Track scroll depth - Optimisé pour éviter les forced layouts
  useEffect(() => {
    let ticking = false;
    let cachedWindowHeight = 0;
    let cachedDocumentHeight = 0;
    let lastTrackedMilestone = 0;
    
    // Cache les dimensions une seule fois au chargement et au resize
    const updateDimensions = () => {
      cachedWindowHeight = window.innerHeight;
      cachedDocumentHeight = document.documentElement.scrollHeight;
    };
    
    // Différer la lecture initiale pour ne pas bloquer le rendu
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateDimensions, { timeout: 500 });
    } else {
      setTimeout(updateDimensions, 100);
    }
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Utiliser scrollY qui est plus performant que pageYOffset
          const scrollTop = window.scrollY;
          
          // Éviter les calculs si les dimensions ne sont pas encore cachées
          if (cachedDocumentHeight === 0) {
            ticking = false;
            return;
          }
          
          const scrollPercentage = Math.round(((scrollTop + cachedWindowHeight) / cachedDocumentHeight) * 100);
          
          // Éviter les appels redondants si on n'a pas atteint un nouveau milestone
          const milestones = [25, 50, 75, 100];
          const currentMilestone = milestones.find(m => scrollPercentage >= m && m > lastTrackedMilestone);
          
          if (currentMilestone) {
            lastTrackedMilestone = currentMilestone;
            trackScrollDepth(scrollPercentage);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Mettre à jour les dimensions au resize (throttled)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
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
