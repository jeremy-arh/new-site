import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Testimonial from '../components/Testimonial'
import FAQ from '../components/FAQ'
import BlogSection from '../components/BlogSection'
import MobileCTA from '../components/MobileCTA'

function Home() {
  return (
    <>
      <Helmet>
        <title>My notary - Notarize and Apostille Your Documents 100% Online</title>
        <meta property="og:title" content="My notary - Notarize and Apostille Your Documents 100% Online" />
        <meta name="twitter:title" content="My notary - Notarize and Apostille Your Documents 100% Online" />
      </Helmet>
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonial />
      <FAQ />
      <BlogSection />
      <MobileCTA />
    </>
  )
}

export default Home
