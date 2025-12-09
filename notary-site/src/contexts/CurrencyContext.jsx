import { createContext, useContext, useState, useEffect } from 'react';
import { initializeCurrency, convertPrice } from '../utils/currency';

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

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState('EUR');
  const [conversionCache, setConversionCache] = useState({});

  // Load user-selected currency from localStorage or detect from IP
  useEffect(() => {
    const init = async () => {
      try {
        // Check if user has manually selected a currency
        const savedCurrency = localStorage.getItem(USER_CURRENCY_KEY);
        if (savedCurrency) {
          setCurrencyState(savedCurrency);
          return;
        }

        // Otherwise, detect from IP
        const detectedCurrency = await initializeCurrency();
        setCurrencyState(detectedCurrency);
      } catch (error) {
        console.warn('Error initializing currency:', error);
      }
    };

    init();
  }, []);

  // Function to set currency (called by CurrencySelector)
  const setCurrency = (newCurrency) => {
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

