-- Migration pour ajouter les champs multilingues à la table services
-- Les colonnes existantes (name, description, short_description, cta) restent inchangées et servent de colonnes par défaut en anglais
-- Les colonnes meta_title, meta_description, detailed_description seront créées si elles n'existent pas encore
-- Ajoute uniquement les colonnes pour les autres langues (fr, es, de, it, pt)

-- Ajouter les colonnes pour les noms multilingues (sauf en anglais qui utilise les colonnes existantes)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS name_fr TEXT,
ADD COLUMN IF NOT EXISTS name_es TEXT,
ADD COLUMN IF NOT EXISTS name_de TEXT,
ADD COLUMN IF NOT EXISTS name_it TEXT,
ADD COLUMN IF NOT EXISTS name_pt TEXT;

-- Ajouter les colonnes pour les descriptions courtes multilingues (sauf en anglais)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS short_description_fr TEXT,
ADD COLUMN IF NOT EXISTS short_description_es TEXT,
ADD COLUMN IF NOT EXISTS short_description_de TEXT,
ADD COLUMN IF NOT EXISTS short_description_it TEXT,
ADD COLUMN IF NOT EXISTS short_description_pt TEXT;

-- Ajouter les colonnes pour les descriptions complètes multilingues (sauf en anglais)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_de TEXT,
ADD COLUMN IF NOT EXISTS description_it TEXT,
ADD COLUMN IF NOT EXISTS description_pt TEXT;

-- Ajouter les colonnes pour les CTA multilingues (sauf en anglais)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS cta_fr TEXT,
ADD COLUMN IF NOT EXISTS cta_es TEXT,
ADD COLUMN IF NOT EXISTS cta_de TEXT,
ADD COLUMN IF NOT EXISTS cta_it TEXT,
ADD COLUMN IF NOT EXISTS cta_pt TEXT;

-- Ajouter les colonnes pour les meta_title multilingues (sauf en anglais)
-- Note: Si ces colonnes n'existent pas encore, elles seront créées par cette migration
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_title_fr TEXT,
ADD COLUMN IF NOT EXISTS meta_title_es TEXT,
ADD COLUMN IF NOT EXISTS meta_title_de TEXT,
ADD COLUMN IF NOT EXISTS meta_title_it TEXT,
ADD COLUMN IF NOT EXISTS meta_title_pt TEXT;

-- Ajouter les colonnes pour les meta_description multilingues (sauf en anglais)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_description_fr TEXT,
ADD COLUMN IF NOT EXISTS meta_description_es TEXT,
ADD COLUMN IF NOT EXISTS meta_description_de TEXT,
ADD COLUMN IF NOT EXISTS meta_description_it TEXT,
ADD COLUMN IF NOT EXISTS meta_description_pt TEXT;

-- Ajouter les colonnes pour les detailed_description multilingues (sauf en anglais)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS detailed_description_fr TEXT,
ADD COLUMN IF NOT EXISTS detailed_description_es TEXT,
ADD COLUMN IF NOT EXISTS detailed_description_de TEXT,
ADD COLUMN IF NOT EXISTS detailed_description_it TEXT,
ADD COLUMN IF NOT EXISTS detailed_description_pt TEXT;

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_services_name_fr ON services(name_fr);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-- Commentaires pour la documentation
-- Note: Les colonnes name, description, short_description, cta existantes servent de colonnes par défaut en anglais
COMMENT ON COLUMN services.name IS 'Service name in English (default language - existing column)';
COMMENT ON COLUMN services.name_fr IS 'Service name in French';
COMMENT ON COLUMN services.name_es IS 'Service name in Spanish';
COMMENT ON COLUMN services.name_de IS 'Service name in German';
COMMENT ON COLUMN services.name_it IS 'Service name in Italian';
COMMENT ON COLUMN services.name_pt IS 'Service name in Portuguese';

COMMENT ON COLUMN services.description IS 'Service description in English (default language - existing column)';
COMMENT ON COLUMN services.description_fr IS 'Service description in French';
COMMENT ON COLUMN services.description_es IS 'Service description in Spanish';
COMMENT ON COLUMN services.description_de IS 'Service description in German';
COMMENT ON COLUMN services.description_it IS 'Service description in Italian';
COMMENT ON COLUMN services.description_pt IS 'Service description in Portuguese';

COMMENT ON COLUMN services.cta IS 'Service CTA in English (default language - existing column)';
COMMENT ON COLUMN services.cta_fr IS 'Service CTA in French';
COMMENT ON COLUMN services.cta_es IS 'Service CTA in Spanish';
COMMENT ON COLUMN services.cta_de IS 'Service CTA in German';
COMMENT ON COLUMN services.cta_it IS 'Service CTA in Italian';
COMMENT ON COLUMN services.cta_pt IS 'Service CTA in Portuguese';

COMMENT ON COLUMN services.meta_title IS 'Service meta title in English (default language)';
COMMENT ON COLUMN services.meta_title_fr IS 'Service meta title in French';
COMMENT ON COLUMN services.meta_title_es IS 'Service meta title in Spanish';
COMMENT ON COLUMN services.meta_title_de IS 'Service meta title in German';
COMMENT ON COLUMN services.meta_title_it IS 'Service meta title in Italian';
COMMENT ON COLUMN services.meta_title_pt IS 'Service meta title in Portuguese';

COMMENT ON COLUMN services.meta_description IS 'Service meta description in English (default language)';
COMMENT ON COLUMN services.meta_description_fr IS 'Service meta description in French';
COMMENT ON COLUMN services.meta_description_es IS 'Service meta description in Spanish';
COMMENT ON COLUMN services.meta_description_de IS 'Service meta description in German';
COMMENT ON COLUMN services.meta_description_it IS 'Service meta description in Italian';
COMMENT ON COLUMN services.meta_description_pt IS 'Service meta description in Portuguese';

COMMENT ON COLUMN services.detailed_description IS 'Service detailed description in English (default language)';
COMMENT ON COLUMN services.detailed_description_fr IS 'Service detailed description in French';
COMMENT ON COLUMN services.detailed_description_es IS 'Service detailed description in Spanish';
COMMENT ON COLUMN services.detailed_description_de IS 'Service detailed description in German';
COMMENT ON COLUMN services.detailed_description_it IS 'Service detailed description in Italian';
COMMENT ON COLUMN services.detailed_description_pt IS 'Service detailed description in Portuguese';

