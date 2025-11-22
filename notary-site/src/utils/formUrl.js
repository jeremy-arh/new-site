/**
 * Génère l'URL du formulaire avec la currency et optionnellement le serviceId en paramètres
 * @param {string} currency - La devise sélectionnée (ex: 'EUR', 'USD', 'GBP')
 * @param {string} serviceId - L'ID du service (optionnel, ex: 'apostille-hague-convention')
 * @returns {string} L'URL complète du formulaire avec les paramètres
 */
export const getFormUrl = (currency = 'EUR', serviceId = null) => {
  const baseUrl = 'https://app.mynotary.io/form';
  const url = new URL(baseUrl);
  url.searchParams.set('currency', currency);
  // Ajouter le serviceId seulement s'il existe et n'est pas vide
  if (serviceId && serviceId.trim() !== '') {
    url.searchParams.set('service', serviceId);
  }
  return url.toString();
};


