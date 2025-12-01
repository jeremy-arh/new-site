import { createContext, useContext, useState, useEffect } from 'react';
import { initializeLanguage, saveLanguageToStorage, getLanguageFromStorage, extractLanguageFromPath, removeLanguageFromPath, addLanguageToPath, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/language';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  isLoading: true,
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
  const [isLoading, setIsLoading] = useState(true);
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

  // Initialise la langue au chargement
  useEffect(() => {
    const init = async () => {
      try {
        // Vérifie d'abord si une langue est présente dans l'URL
        const urlLanguage = extractLanguageFromPath(location.pathname);
        
        if (urlLanguage !== DEFAULT_LANGUAGE) {
          // Si une langue est dans l'URL, l'utilise et la sauvegarde
          setLanguageState(urlLanguage);
          saveLanguageToStorage(urlLanguage);
          setIsLoading(false);
          return;
        }

        // Sinon, vérifie le localStorage
        const savedLanguage = getLanguageFromStorage();
        if (savedLanguage !== DEFAULT_LANGUAGE) {
          setLanguageState(savedLanguage);
          setIsLoading(false);
          // Redirige vers l'URL avec la langue si nécessaire
          const newPath = getLocalizedPath(location.pathname, savedLanguage);
          if (newPath !== location.pathname) {
            navigate(newPath, { replace: true });
          }
          return;
        }

        // Sinon, détecte via IP
        const detectedLanguage = await initializeLanguage();
        setLanguageState(detectedLanguage);
        saveLanguageToStorage(detectedLanguage);
        
        // Redirige vers l'URL avec la langue si nécessaire
        if (detectedLanguage !== DEFAULT_LANGUAGE) {
          const newPath = getLocalizedPath(location.pathname, detectedLanguage);
          if (newPath !== location.pathname) {
            navigate(newPath, { replace: true });
          }
        }
      } catch (error) {
        console.warn('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []); // Seulement au montage initial

  // Met à jour la langue quand l'URL change (mais seulement si c'est un changement d'URL, pas un changement de langue manuel)
  useEffect(() => {
    const urlLanguage = extractLanguageFromPath(location.pathname);
    // Ne mettre à jour que si la langue dans l'URL est différente ET que ce n'est pas juste un changement de langue manuel
    // On vérifie aussi que la langue dans l'URL est valide pour éviter les boucles
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
      isLoading,
      setLanguage,
      getLocalizedPath,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

