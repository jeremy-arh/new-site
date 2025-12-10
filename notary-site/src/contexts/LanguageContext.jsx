import { createContext, useContext, useState, useEffect } from 'react';
import { detectLanguageFromIP, saveLanguageToStorage, getLanguageFromStorage, extractLanguageFromPath, removeLanguageFromPath, addLanguageToPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/language';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  getLocalizedPath: () => {},
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const location = useLocation();
  const navigate = useNavigate();

  // Fonction pour obtenir le path localisé
  const getLocalizedPath = (path, lang) => {
    const targetLang = lang || language;
    // Retire la langue actuelle du path
    const cleanPath = removeLanguageFromPath(path);
    
    // Ajoute la nouvelle langue si ce n'est pas 'en'
    return addLanguageToPath(cleanPath, targetLang);
  };

  // Initialise la langue au chargement (sans bloquer le rendu)
  useEffect(() => {
    // 1) Langue dans l'URL prioritaire (inclut 'en' si présent)
    const urlLanguage = extractLanguageFromPath(location.pathname);
    if (urlLanguage) {
      setLanguageState(urlLanguage);
      saveLanguageToStorage(urlLanguage);
      return;
    }

    // 2) Langue sauvegardée (respecter même si 'en' pour ne pas écraser le choix utilisateur)
    const savedLanguage = getLanguageFromStorage();
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      const newPath = getLocalizedPath(location.pathname, savedLanguage);
      if (newPath !== location.pathname) {
        navigate(newPath, { replace: true });
      }
      return;
    }

    // 3) Langue par défaut immédiate, détection IP différée uniquement si rien en cache
    const applyDetectedLanguage = async () => {
      try {
        const detectedLanguage = await detectLanguageFromIP();
        if (detectedLanguage && detectedLanguage !== language) {
          setLanguageState(detectedLanguage);
          saveLanguageToStorage(detectedLanguage);
          if (detectedLanguage !== DEFAULT_LANGUAGE) {
            const newPath = getLocalizedPath(location.pathname, detectedLanguage);
            if (newPath !== location.pathname) {
              navigate(newPath, { replace: true });
            }
          }
        }
      } catch (error) {
        console.warn('Error detecting language from IP:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(applyDetectedLanguage, { timeout: 2000 });
    } else {
      setTimeout(applyDetectedLanguage, 1500);
    }
  }, []); // Seulement au montage initial

  // Met à jour la langue quand l'URL change (mais seulement si c'est un changement d'URL, pas un changement de langue manuel)
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(location.pathname);
    if (urlLanguage !== language && SUPPORTED_LANGUAGES.includes(urlLanguage)) {
      setLanguageState(urlLanguage);
      saveLanguageToStorage(urlLanguage);
    }
  }, [location.pathname]); // Ne pas inclure 'language' dans les dépendances pour éviter les boucles

  // Fonction pour changer la langue
  const setLanguage = (newLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`);
      return;
    }

    setLanguageState(newLanguage);
    saveLanguageToStorage(newLanguage);

    // Met à jour l'URL avec la nouvelle langue
    const currentPath = removeLanguageFromPath(location.pathname);
    const newPath = getLocalizedPath(currentPath, newLanguage);
    navigate(newPath);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      getLocalizedPath,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

