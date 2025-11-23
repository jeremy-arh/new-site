import { useState, useEffect } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

/**
 * Component to display price with automatic currency conversion
 */
const PriceDisplay = ({ price, showFrom = false, className = '' }) => {
  const { formatPrice, isLoading } = useCurrency();
  const [formattedPrice, setFormattedPrice] = useState(`${price}€`);

  useEffect(() => {
    if (price && !isLoading) {
      formatPrice(price).then(setFormattedPrice);
    }
  }, [price, formatPrice, isLoading]);

  if (!price) return null;

  return (
    <span className={className}>
      {showFrom && <span className="text-sm text-gray-500 mr-2">From</span>}
      {formattedPrice}
    </span>
  );
};

export default PriceDisplay;






