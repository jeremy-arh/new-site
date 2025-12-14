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

// Component to track page views - 100% tracking, non-bloquant
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll milestones for new page
    sessionStorage.removeItem('analytics_scroll_milestones');
    
    // Tracker dès que le navigateur est idle (après le rendu initial)
    const track = () => {
      const pageName = location.pathname === '/' ? 'Home' : location.pathname.split('/').pop();
      trackPlausiblePageView(pageName, location.pathname).catch(() => {});
      trackPageView(location.pathname);
    };
    
    // requestIdleCallback pour ne pas bloquer le rendu, mais tracker ASAP
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(track, { timeout: 1000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback: setTimeout court pour les navigateurs sans requestIdleCallback
      const timer = setTimeout(track, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Track scroll depth - Activé dès que idle, non-bloquant
  useEffect(() => {
    let scrollTrackingEnabled = false;
    let ticking = false;
    let cachedWindowHeight = 0;
    let cachedDocumentHeight = 0;
    let lastTrackedMilestone = 0;
    let idleId = null;
    
    // Activer le tracking dès que le navigateur est idle
    const enableTracking = () => {
      scrollTrackingEnabled = true;
      cachedWindowHeight = window.innerHeight;
      cachedDocumentHeight = document.documentElement.scrollHeight;
    };
    
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(enableTracking, { timeout: 2000 });
    } else {
      setTimeout(enableTracking, 500);
    }
    
    const handleScroll = () => {
      // Ne rien faire pendant les 5 premières secondes
      if (!scrollTrackingEnabled || ticking) return;
      
      ticking = true;
      // Utiliser setTimeout au lieu de rAF pour éviter les forced layouts
      setTimeout(() => {
        if (cachedDocumentHeight === 0) {
          ticking = false;
          return;
        }
        
        const scrollTop = window.scrollY;
        const scrollPercentage = Math.round(((scrollTop + cachedWindowHeight) / cachedDocumentHeight) * 100);
        
        const milestones = [25, 50, 75, 100];
        const currentMilestone = milestones.find(m => scrollPercentage >= m && m > lastTrackedMilestone);
        
        if (currentMilestone) {
          lastTrackedMilestone = currentMilestone;
          trackScrollDepth(scrollPercentage);
        }
        
        ticking = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (idleId && 'cancelIdleCallback' in window) cancelIdleCallback(idleId);
      window.removeEventListener('scroll', handleScroll);
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

// Render immédiat - ne pas bloquer sur la langue
const AppContent = () => {
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
