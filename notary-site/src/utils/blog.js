/**
 * Utilitaires pour charger les articles de blog selon la langue
 */

/**
 * Obtient le nom du champ selon la langue
 * @param {string} field - Nom du champ (title, content, excerpt, meta_title, meta_description, cta)
 * @param {string} language - Code de langue (en, fr, es, de, it, pt)
 * @returns {string} - Nom du champ avec suffixe de langue (ou sans suffixe pour 'en')
 */
export const getLocalizedBlogField = (field, language) => {
  // Si la langue est 'en', utiliser les colonnes existantes (sans suffixe)
  if (language === 'en') {
    return field;
  }
  
  // Pour les autres langues, utiliser le suffixe de langue
  return `${field}_${language}`;
};

/**
 * Obtient la valeur localisée d'un article de blog
 * @param {object} post - Objet article de blog de la base de données
 * @param {string} field - Nom du champ (title, content, excerpt, meta_title, meta_description, cta)
 * @param {string} language - Code de langue
 * @returns {string} - Valeur localisée ou valeur par défaut
 */
export const getLocalizedBlogValue = (post, field, language) => {
  if (!post) return '';
  
  // Essayer d'abord le champ localisé
  const localizedField = getLocalizedBlogField(field, language);
  const localizedValue = post[localizedField];
  
  if (localizedValue) {
    return localizedValue;
  }
  
  // Fallback sur le champ par défaut (en ou sans suffixe)
  return post[field] || '';
};

/**
 * Formate un article de blog pour l'affichage selon la langue
 * @param {object} post - Objet article de blog de la base de données
 * @param {string} language - Code de langue
 * @returns {object} - Article formaté avec les valeurs localisées
 */
export const formatBlogPostForLanguage = (post, language) => {
  if (!post) return null;
  
  return {
    ...post,
    title: getLocalizedBlogValue(post, 'title', language),
    content: getLocalizedBlogValue(post, 'content', language),
    excerpt: getLocalizedBlogValue(post, 'excerpt', language),
    meta_title: getLocalizedBlogValue(post, 'meta_title', language) || getLocalizedBlogValue(post, 'title', language),
    meta_description: getLocalizedBlogValue(post, 'meta_description', language) || getLocalizedBlogValue(post, 'excerpt', language),
    cta: getLocalizedBlogValue(post, 'cta', language),
    category: getLocalizedBlogValue(post, 'category', language),
  };
};

/**
 * Formate une liste d'articles de blog pour l'affichage selon la langue
 * @param {array} posts - Liste d'articles de blog
 * @param {string} language - Code de langue
 * @returns {array} - Liste d'articles formatés
 */
export const formatBlogPostsForLanguage = (posts, language) => {
  if (!posts || !Array.isArray(posts)) return [];
  
  return posts.map(post => formatBlogPostForLanguage(post, language));
};

