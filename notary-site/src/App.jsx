import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { useScrollAnimation } from './hooks/useScrollAnimation'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

function App() {
  useScrollAnimation();

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
