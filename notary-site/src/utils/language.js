// Utility functions for language detection and management

const LANGUAGE_STORAGE_KEY = 'user_selected_language';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'pt']; // Langues supportées
const DEFAULT_LANGUAGE = 'en';

/**
 * Détecte la langue basée sur l'IP de l'utilisateur
 * Utilise l'API ipapi.co (gratuite, sans clé API requise)
 */
export const detectLanguageFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.error) {
      console.warn('Error detecting language from IP:', data.reason);
      return DEFAULT_LANGUAGE;
    }

    // Récupère le code de langue (ex: 'FR', 'ES', 'DE')
    const countryCode = data.country_code;
    
    // Mappe les codes pays aux codes langue
    const countryToLanguage = {
      'FR': 'fr',
      'ES': 'es',
      'DE': 'de',
      'IT': 'it',
      'PT': 'pt',
      'BE': 'fr', // Belgique -> français
      'CH': 'fr', // Suisse -> français
      'CA': 'en', // Canada -> anglais
      'US': 'en',
      'GB': 'en',
      'AU': 'en',
      'NZ': 'en',
      'IE': 'en',
    };

    const detectedLanguage = countryToLanguage[countryCode] || DEFAULT_LANGUAGE;
    
    // Vérifie que la langue détectée est supportée
    if (SUPPORTED_LANGUAGES.includes(detectedLanguage)) {
      return detectedLanguage;
    }
    
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Error detecting language from IP:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Initialise la langue : vérifie localStorage, sinon détecte via IP
 */
export const initializeLanguage = async () => {
  // Vérifie d'abord le localStorage
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage;
  }

  // Sinon, détecte via IP
  return await detectLanguageFromIP();
};

/**
 * Récupère la langue depuis localStorage
 */
export const getLanguageFromStorage = () => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage) 
    ? savedLanguage 
    : DEFAULT_LANGUAGE;
};

/**
 * Sauvegarde la langue dans localStorage
 */
export const saveLanguageToStorage = (language) => {
  if (SUPPORTED_LANGUAGES.includes(language)) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
};

/**
 * Extrait la langue du pathname
 * Exemples: '/fr/services' -> 'fr', '/services' -> 'en'
 */
export const extractLanguageFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return firstSegment;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * Retire la langue du pathname
 * Exemples: '/fr/services' -> '/services', '/services' -> '/services'
 */
export const removeLanguageFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

/**
 * Ajoute la langue au pathname (seulement si ce n'est pas 'en')
 * Exemples: '/services', 'fr' -> '/fr/services', '/services', 'en' -> '/services'
 */
export const addLanguageToPath = (pathname, language) => {
  if (language === DEFAULT_LANGUAGE) {
    return pathname;
  }
  
  // Retire le slash initial s'il existe
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  
  // Vérifie si la langue est déjà dans le path
  const segments = cleanPath.split('/').filter(Boolean);
  if (SUPPORTED_LANGUAGES.includes(segments[0])) {
    return pathname; // La langue est déjà présente
  }
  
  return `/${language}/${cleanPath}`;
};

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY };



