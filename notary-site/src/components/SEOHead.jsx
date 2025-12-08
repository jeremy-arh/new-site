import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getCanonicalUrl } from '../utils/canonicalUrl';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, removeLanguageFromPath, addLanguageToPath } from '../utils/language';

/**
 * Mapping des codes de langue vers les codes de locale pour og:locale
 */
const LANGUAGE_TO_LOCALE = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
  pt: 'pt_PT',
};

/**
 * Mapping des codes de langue vers les codes hreflang
 * Certaines langues peuvent avoir des variantes régionales
 */
const LANGUAGE_TO_HREFLANG = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it',
  pt: 'pt',
};

/**
 * Composant SEO global qui gère :
 * - L'attribut lang sur <html>
 * - Les balises hreflang pour toutes les langues
 * - Les balises meta de base (peut être étendu)
 */
const SEOHead = ({ 
  title, 
  description, 
  ogTitle, 
  ogDescription, 
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalPath,
  noindex = false,
  nofollow = false
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Met à jour l'attribut lang sur <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Génère les URLs hreflang pour toutes les langues
  const generateHreflangUrls = () => {
    const basePath = canonicalPath || location.pathname;
    const cleanPath = removeLanguageFromPath(basePath);
    const hreflangUrls = [];

    // Pour chaque langue supportée, génère l'URL correspondante
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const localizedPath = addLanguageToPath(cleanPath, lang);
      const url = getCanonicalUrl(localizedPath);
      hreflangUrls.push({
        lang: LANGUAGE_TO_HREFLANG[lang],
        url,
      });
    });

    // Ajoute aussi x-default qui pointe vers la langue par défaut
    const defaultPath = addLanguageToPath(cleanPath, DEFAULT_LANGUAGE);
    hreflangUrls.push({
      lang: 'x-default',
      url: getCanonicalUrl(defaultPath),
    });

    return hreflangUrls;
  };

  const hreflangUrls = generateHreflangUrls();
  const canonicalUrl = getCanonicalUrl(canonicalPath || location.pathname);
  const locale = LANGUAGE_TO_LOCALE[language] || LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];

  // Génère les meta robots
  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  if (robotsContent.length === 0) robotsContent.push('index', 'follow');
  const robotsMeta = robotsContent.join(', ');

  return (
    <Helmet>
      {/* Attribut lang sur html - géré via useEffect mais aussi via Helmet pour SSR */}
      <html lang={language} />
      
      {/* Title */}
      {title && <title>{title}</title>}
      
      {/* Description */}
      {description && <meta name="description" content={description} />}
      
      {/* Robots */}
      <meta name="robots" content={robotsMeta} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags pour toutes les langues */}
      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hreflang={lang} href={url} />
      ))}
      
      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      
      {/* Open Graph alternate locales */}
      {SUPPORTED_LANGUAGES.filter(lang => lang !== language).map((lang) => (
        <meta 
          key={`og:locale:alternate-${lang}`}
          property="og:locale:alternate" 
          content={LANGUAGE_TO_LOCALE[lang]} 
        />
      ))}
      
      {/* Twitter Card */}
      {twitterTitle && <meta name="twitter:card" content="summary_large_image" />}
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  );
};

export default SEOHead;





