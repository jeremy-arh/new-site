/**
 * Utilitaires pour charger les services selon la langue
 * 
 * Champs supportés pour la traduction :
 * - name, description, short_description, cta (colonnes existantes en anglais)
 * - meta_title, meta_description, detailed_description (colonnes créées si nécessaire)
 * 
 * Pour chaque champ, les versions multilingues sont disponibles avec les suffixes :
 * _fr, _es, _de, _it, _pt
 */

/**
 * Liste de tous les champs multilingues à sélectionner depuis Supabase
 * Cette fonction garantit que tous les champs multilingues sont chargés
 */
export const getServiceFields = () => {
  return `
    id,
    service_id,
    name,
    name_fr,
    name_es,
    name_de,
    name_it,
    name_pt,
    description,
    description_fr,
    description_es,
    description_de,
    description_it,
    description_pt,
    short_description,
    short_description_fr,
    short_description_es,
    short_description_de,
    short_description_it,
    short_description_pt,
    cta,
    cta_fr,
    cta_es,
    cta_de,
    cta_it,
    cta_pt,
    meta_title,
    meta_title_fr,
    meta_title_es,
    meta_title_de,
    meta_title_it,
    meta_title_pt,
    meta_description,
    meta_description_fr,
    meta_description_es,
    meta_description_de,
    meta_description_it,
    meta_description_pt,
    detailed_description,
    detailed_description_fr,
    detailed_description_es,
    detailed_description_de,
    detailed_description_it,
    detailed_description_pt,
    icon,
    color,
    base_price,
    is_active,
    created_at,
    updated_at
  `.replace(/\s+/g, ' ').trim();
};

/**
 * Obtient le nom du champ selon la langue
 * @param {string} field - Nom du champ (name, description, short_description, cta, meta_title, meta_description, detailed_description)
 * @param {string} language - Code de langue (en, fr, es, de, it, pt)
 * @returns {string} - Nom du champ avec suffixe de langue (ou sans suffixe pour 'en')
 */
export const getLocalizedField = (field, language) => {
  // Si la langue est 'en', utiliser les colonnes existantes (sans suffixe)
  // Les colonnes name, description, short_description, cta sont les colonnes par défaut en anglais
  if (language === 'en') {
    return field;
  }
  
  // Pour les autres langues, utiliser le suffixe de langue
  return `${field}_${language}`;
};

/**
 * Obtient la valeur localisée d'un service
 * @param {object} service - Objet service de la base de données
 * @param {string} field - Nom du champ (name, description, short_description, cta, meta_title, meta_description, detailed_description)
 * @param {string} language - Code de langue
 * @returns {string} - Valeur localisée ou valeur par défaut
 */
export const getLocalizedServiceValue = (service, field, language) => {
  if (!service) return '';
  
  // Essayer d'abord le champ localisé
  const localizedField = getLocalizedField(field, language);
  const localizedValue = service[localizedField];
  
  // Vérifier si la valeur existe et n'est pas vide/null/undefined
  // Les chaînes vides sont considérées comme non valides
  if (localizedValue !== null && localizedValue !== undefined && localizedValue !== '') {
    // Si c'est une chaîne, vérifier qu'elle n'est pas vide après trim
    if (typeof localizedValue === 'string' && localizedValue.trim() !== '') {
      return localizedValue;
    }
    // Si ce n'est pas une chaîne, retourner la valeur telle quelle
    if (typeof localizedValue !== 'string') {
      return localizedValue;
    }
  }
  
  // Fallback sur le champ par défaut (en ou sans suffixe)
  return service[field] || '';
};

/**
 * Formate un service pour l'affichage selon la langue
 * @param {object} service - Objet service de la base de données
 * @param {string} language - Code de langue
 * @returns {object} - Service formaté avec les valeurs localisées
 */
export const formatServiceForLanguage = (service, language) => {
  if (!service) return null;
  
  return {
    ...service,
    name: getLocalizedServiceValue(service, 'name', language),
    description: getLocalizedServiceValue(service, 'description', language),
    short_description: getLocalizedServiceValue(service, 'short_description', language),
    cta: getLocalizedServiceValue(service, 'cta', language),
    meta_title: getLocalizedServiceValue(service, 'meta_title', language) || getLocalizedServiceValue(service, 'name', language),
    meta_description: getLocalizedServiceValue(service, 'meta_description', language) || getLocalizedServiceValue(service, 'short_description', language) || getLocalizedServiceValue(service, 'description', language),
    detailed_description: getLocalizedServiceValue(service, 'detailed_description', language) || getLocalizedServiceValue(service, 'description', language),
  };
};

/**
 * Formate une liste de services pour l'affichage selon la langue
 * @param {array} services - Liste de services
 * @param {string} language - Code de langue
 * @returns {array} - Liste de services formatés
 */
export const formatServicesForLanguage = (services, language) => {
  if (!services || !Array.isArray(services)) return [];
  
  return services.map(service => formatServiceForLanguage(service, language));
};

