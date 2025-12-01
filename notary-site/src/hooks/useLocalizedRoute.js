import { useLanguage } from '../contexts/LanguageContext';
import { removeLanguageFromPath } from '../utils/language';

/**
 * Hook pour obtenir des routes localisées
 * Utilisez ce hook pour créer des liens qui préservent la langue actuelle
 */
export const useLocalizedRoute = () => {
  const { getLocalizedPath } = useLanguage();

  /**
   * Retourne le path localisé pour une route donnée
   * @param {string} path - Le path de la route (ex: '/services', '/blog')
   * @returns {string} - Le path localisé (ex: '/fr/services' si langue = 'fr', '/services' si langue = 'en')
   */
  const getRoute = (path) => {
    return getLocalizedPath(path);
  };

  return { getRoute };
};

/**
 * Hook pour obtenir le path actuel sans la langue
 * Utile pour comparer les routes indépendamment de la langue
 */
export const useBasePath = () => {
  const { language } = useLanguage();

  const getBasePath = (pathname) => {
    return removeLanguageFromPath(pathname);
  };

  return { getBasePath, language };
};



