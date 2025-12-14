import { createContext, useContext, useState, useEffect } from 'react';
import { initializeCurrency, convertPrice, getCachedCurrency } from '../utils/currency';

const CurrencyContext = createContext({
  currency: 'EUR',
  formatPrice: (price) => `${price}€`,
  setCurrency: () => {},
});

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

const USER_CURRENCY_KEY = 'user_selected_currency';

// Liste des devises supportées
const SUPPORTED_CURRENCIES = [
  'EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL',
  'MXN', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK',
  'RUB', 'TRY', 'ZAR', 'KRW', 'SGD', 'HKD', 'NZD', 'THB', 'MYR', 'PHP',
  'IDR', 'VND'
];

// Fonction pour récupérer la devise depuis l'URL (SYNCHRONE)
const getCurrencyFromURL = () => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const urlCurrency = urlParams.get('currency')?.toUpperCase();
  
  if (urlCurrency && SUPPORTED_CURRENCIES.includes(urlCurrency)) {
    return urlCurrency;
  }
  return null;
};

// Fonction d'initialisation synchrone de la devise
const getInitialCurrency = () => {
  // 1) PRIORITÉ: Paramètre URL ?currency=XXX
  const urlCurrency = getCurrencyFromURL();
  if (urlCurrency) {
    return urlCurrency;
  }
  
  // 2) Choix utilisateur stocké
  if (typeof localStorage !== 'undefined') {
    const savedCurrency = localStorage.getItem(USER_CURRENCY_KEY);
    if (savedCurrency && SUPPORTED_CURRENCIES.includes(savedCurrency)) {
      return savedCurrency;
    }
  }
  
  // 3) Cache
  const cached = getCachedCurrency();
  if (cached && SUPPORTED_CURRENCIES.includes(cached)) {
    return cached;
  }
  
  // 4) Défaut
  return 'EUR';
};

export const CurrencyProvider = ({ children }) => {
  // Initialisation SYNCHRONE pour éviter le CLS
  const [currency, setCurrencyState] = useState(getInitialCurrency);
  const [conversionCache, setConversionCache] = useState({});

  // Sauvegarder la devise si elle vient de l'URL
  useEffect(() => {
    const urlCurrency = getCurrencyFromURL();
    if (urlCurrency) {
      // Sauvegarder pour les prochaines visites
      localStorage.setItem(USER_CURRENCY_KEY, urlCurrency);
    }
    
    // Détection différée uniquement si pas de devise définie
    if (!urlCurrency && !localStorage.getItem(USER_CURRENCY_KEY)) {
      const runDetection = async () => {
        try {
          const detectedCurrency = await initializeCurrency();
          if (detectedCurrency && SUPPORTED_CURRENCIES.includes(detectedCurrency)) {
            setCurrencyState(detectedCurrency);
          }
        } catch (error) {
          console.warn('Error initializing currency:', error);
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(runDetection, { timeout: 2000 });
      } else {
        setTimeout(runDetection, 1500);
      }
    }
  }, []);

  // Function to set currency (called by CurrencySelector)
  const setCurrency = (newCurrency) => {
    if (!SUPPORTED_CURRENCIES.includes(newCurrency)) {
      console.warn(`Currency ${newCurrency} is not supported`);
      return;
    }
    setCurrencyState(newCurrency);
    localStorage.setItem(USER_CURRENCY_KEY, newCurrency);
    // Clear conversion cache when currency changes
    setConversionCache({});
  };

  const formatPrice = async (eurPrice) => {
    if (!eurPrice) return '';
    
    // Check cache first
    const cacheKey = `${eurPrice}_${currency}`;
    if (conversionCache[cacheKey]) {
      return conversionCache[cacheKey];
    }

    try {
      const converted = await convertPrice(eurPrice, currency);
      const formatted = converted.formatted;
      
      // Cache the result
      setConversionCache(prev => ({
        ...prev,
        [cacheKey]: formatted
      }));
      
      return formatted;
    } catch (error) {
      console.warn('Error formatting price:', error);
      return `${eurPrice}€`;
    }
  };

  // Synchronous version for immediate use (may return EUR if not converted yet)
  const formatPriceSync = (eurPrice) => {
    if (!eurPrice) return '';
    const cacheKey = `${eurPrice}_${currency}`;
    return conversionCache[cacheKey] || `${eurPrice}€`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      formatPrice,
      formatPriceSync,
      setCurrency,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
