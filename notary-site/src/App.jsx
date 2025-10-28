import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Testimonial from './components/Testimonial'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { useScrollAnimation } from './hooks/useScrollAnimation'

function App() {
  useScrollAnimation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonial />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
