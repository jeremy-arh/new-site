import SEOHead from '../components/SEOHead';
import { useTranslation } from '../hooks/useTranslation';
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Testimonial from '../components/Testimonial'
import FAQ from '../components/FAQ'
import BlogSection from '../components/BlogSection'
import MobileCTA from '../components/MobileCTA'

function Home() {
  const { t } = useTranslation();
  
  return (
    <>
      <SEOHead
        title={t('seo.defaultTitle')}
        description={t('seo.defaultDescription')}
        ogTitle={t('seo.defaultOgTitle')}
        ogDescription={t('seo.defaultOgDescription')}
        twitterTitle={t('seo.defaultOgTitle')}
        twitterDescription={t('seo.defaultOgDescription')}
        canonicalPath="/"
      />
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
