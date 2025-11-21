/**
 * Génère l'URL du formulaire avec la currency en paramètre
 * @param {string} currency - La devise sélectionnée (ex: 'EUR', 'USD', 'GBP')
 * @returns {string} L'URL complète du formulaire avec le paramètre currency
 */
export const getFormUrl = (currency = 'EUR') => {
  const baseUrl = 'https://app.mynotary.io/form';
  const url = new URL(baseUrl);
  url.searchParams.set('currency', currency);
  return url.toString();
};


