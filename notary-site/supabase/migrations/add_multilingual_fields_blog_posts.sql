-- Migration pour ajouter les champs multilingues à la table blog_posts
-- Les colonnes existantes (title, content, excerpt, meta_title, meta_description, cta, category) restent inchangées et servent de colonnes par défaut en anglais
-- Ajoute uniquement les colonnes pour les autres langues (fr, es, de, it, pt)

-- Ajouter les colonnes pour les titres multilingues (sauf en anglais qui utilise les colonnes existantes)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS title_fr TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS title_de TEXT,
ADD COLUMN IF NOT EXISTS title_it TEXT,
ADD COLUMN IF NOT EXISTS title_pt TEXT;

-- Ajouter les colonnes pour les contenus multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS content_fr TEXT,
ADD COLUMN IF NOT EXISTS content_es TEXT,
ADD COLUMN IF NOT EXISTS content_de TEXT,
ADD COLUMN IF NOT EXISTS content_it TEXT,
ADD COLUMN IF NOT EXISTS content_pt TEXT;

-- Ajouter les colonnes pour les extraits multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS excerpt_fr TEXT,
ADD COLUMN IF NOT EXISTS excerpt_es TEXT,
ADD COLUMN IF NOT EXISTS excerpt_de TEXT,
ADD COLUMN IF NOT EXISTS excerpt_it TEXT,
ADD COLUMN IF NOT EXISTS excerpt_pt TEXT;

-- Ajouter les colonnes pour les meta_title multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_title_fr TEXT,
ADD COLUMN IF NOT EXISTS meta_title_es TEXT,
ADD COLUMN IF NOT EXISTS meta_title_de TEXT,
ADD COLUMN IF NOT EXISTS meta_title_it TEXT,
ADD COLUMN IF NOT EXISTS meta_title_pt TEXT;

-- Ajouter les colonnes pour les meta_description multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_description_fr TEXT,
ADD COLUMN IF NOT EXISTS meta_description_es TEXT,
ADD COLUMN IF NOT EXISTS meta_description_de TEXT,
ADD COLUMN IF NOT EXISTS meta_description_it TEXT,
ADD COLUMN IF NOT EXISTS meta_description_pt TEXT;

-- Ajouter les colonnes pour les CTA multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS cta_fr TEXT,
ADD COLUMN IF NOT EXISTS cta_es TEXT,
ADD COLUMN IF NOT EXISTS cta_de TEXT,
ADD COLUMN IF NOT EXISTS cta_it TEXT,
ADD COLUMN IF NOT EXISTS cta_pt TEXT;

-- Ajouter les colonnes pour les catégories multilingues (sauf en anglais)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category_fr TEXT,
ADD COLUMN IF NOT EXISTS category_es TEXT,
ADD COLUMN IF NOT EXISTS category_de TEXT,
ADD COLUMN IF NOT EXISTS category_it TEXT,
ADD COLUMN IF NOT EXISTS category_pt TEXT;

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_blog_posts_title_fr ON blog_posts(title_fr);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Commentaires pour la documentation
-- Note: Les colonnes title, content, excerpt, meta_title, meta_description, cta, category existantes servent de colonnes par défaut en anglais
COMMENT ON COLUMN blog_posts.title IS 'Blog post title in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.title_fr IS 'Blog post title in French';
COMMENT ON COLUMN blog_posts.title_es IS 'Blog post title in Spanish';
COMMENT ON COLUMN blog_posts.title_de IS 'Blog post title in German';
COMMENT ON COLUMN blog_posts.title_it IS 'Blog post title in Italian';
COMMENT ON COLUMN blog_posts.title_pt IS 'Blog post title in Portuguese';

COMMENT ON COLUMN blog_posts.content IS 'Blog post content in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.content_fr IS 'Blog post content in French';
COMMENT ON COLUMN blog_posts.content_es IS 'Blog post content in Spanish';
COMMENT ON COLUMN blog_posts.content_de IS 'Blog post content in German';
COMMENT ON COLUMN blog_posts.content_it IS 'Blog post content in Italian';
COMMENT ON COLUMN blog_posts.content_pt IS 'Blog post content in Portuguese';

COMMENT ON COLUMN blog_posts.excerpt IS 'Blog post excerpt in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.excerpt_fr IS 'Blog post excerpt in French';
COMMENT ON COLUMN blog_posts.excerpt_es IS 'Blog post excerpt in Spanish';
COMMENT ON COLUMN blog_posts.excerpt_de IS 'Blog post excerpt in German';
COMMENT ON COLUMN blog_posts.excerpt_it IS 'Blog post excerpt in Italian';
COMMENT ON COLUMN blog_posts.excerpt_pt IS 'Blog post excerpt in Portuguese';

COMMENT ON COLUMN blog_posts.meta_title IS 'Blog post meta title in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.meta_title_fr IS 'Blog post meta title in French';
COMMENT ON COLUMN blog_posts.meta_title_es IS 'Blog post meta title in Spanish';
COMMENT ON COLUMN blog_posts.meta_title_de IS 'Blog post meta title in German';
COMMENT ON COLUMN blog_posts.meta_title_it IS 'Blog post meta title in Italian';
COMMENT ON COLUMN blog_posts.meta_title_pt IS 'Blog post meta title in Portuguese';

COMMENT ON COLUMN blog_posts.meta_description IS 'Blog post meta description in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.meta_description_fr IS 'Blog post meta description in French';
COMMENT ON COLUMN blog_posts.meta_description_es IS 'Blog post meta description in Spanish';
COMMENT ON COLUMN blog_posts.meta_description_de IS 'Blog post meta description in German';
COMMENT ON COLUMN blog_posts.meta_description_it IS 'Blog post meta description in Italian';
COMMENT ON COLUMN blog_posts.meta_description_pt IS 'Blog post meta description in Portuguese';

COMMENT ON COLUMN blog_posts.cta IS 'Blog post CTA in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.cta_fr IS 'Blog post CTA in French';
COMMENT ON COLUMN blog_posts.cta_es IS 'Blog post CTA in Spanish';
COMMENT ON COLUMN blog_posts.cta_de IS 'Blog post CTA in German';
COMMENT ON COLUMN blog_posts.cta_it IS 'Blog post CTA in Italian';
COMMENT ON COLUMN blog_posts.cta_pt IS 'Blog post CTA in Portuguese';

COMMENT ON COLUMN blog_posts.category IS 'Blog post category in English (default language - existing column)';
COMMENT ON COLUMN blog_posts.category_fr IS 'Blog post category in French';
COMMENT ON COLUMN blog_posts.category_es IS 'Blog post category in Spanish';
COMMENT ON COLUMN blog_posts.category_de IS 'Blog post category in German';
COMMENT ON COLUMN blog_posts.category_it IS 'Blog post category in Italian';
COMMENT ON COLUMN blog_posts.category_pt IS 'Blog post category in Portuguese';







