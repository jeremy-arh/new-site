-- Migration pour ajouter les champs list_title, page_h1 et show_in_list à la table services
-- list_title: titre à afficher dans les listes de services (ex: "Certified True Copy")
-- page_h1: titre H1 à afficher sur les pages de service (ex: "Get your certified true copy")
-- show_in_list: boolean pour afficher ou masquer une page service de la liste des services

-- Ajouter les colonnes pour les titres de liste multilingues (anglais par défaut)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS list_title TEXT,
ADD COLUMN IF NOT EXISTS list_title_fr TEXT,
ADD COLUMN IF NOT EXISTS list_title_es TEXT,
ADD COLUMN IF NOT EXISTS list_title_de TEXT,
ADD COLUMN IF NOT EXISTS list_title_it TEXT,
ADD COLUMN IF NOT EXISTS list_title_pt TEXT;

-- Ajouter les colonnes pour les titres H1 de page multilingues (anglais par défaut)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS page_h1 TEXT,
ADD COLUMN IF NOT EXISTS page_h1_fr TEXT,
ADD COLUMN IF NOT EXISTS page_h1_es TEXT,
ADD COLUMN IF NOT EXISTS page_h1_de TEXT,
ADD COLUMN IF NOT EXISTS page_h1_it TEXT,
ADD COLUMN IF NOT EXISTS page_h1_pt TEXT;

-- Ajouter le boolean pour afficher/masquer dans les listes (par défaut true pour ne pas casser les données existantes)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS show_in_list BOOLEAN DEFAULT true;

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_services_show_in_list ON services(show_in_list);
CREATE INDEX IF NOT EXISTS idx_services_list_title_fr ON services(list_title_fr);

-- Commentaires pour la documentation
COMMENT ON COLUMN services.list_title IS 'Service title for display in service lists in English (default language)';
COMMENT ON COLUMN services.list_title_fr IS 'Service title for display in service lists in French';
COMMENT ON COLUMN services.list_title_es IS 'Service title for display in service lists in Spanish';
COMMENT ON COLUMN services.list_title_de IS 'Service title for display in service lists in German';
COMMENT ON COLUMN services.list_title_it IS 'Service title for display in service lists in Italian';
COMMENT ON COLUMN services.list_title_pt IS 'Service title for display in service lists in Portuguese';

COMMENT ON COLUMN services.page_h1 IS 'H1 title for service detail page in English (default language)';
COMMENT ON COLUMN services.page_h1_fr IS 'H1 title for service detail page in French';
COMMENT ON COLUMN services.page_h1_es IS 'H1 title for service detail page in Spanish';
COMMENT ON COLUMN services.page_h1_de IS 'H1 title for service detail page in German';
COMMENT ON COLUMN services.page_h1_it IS 'H1 title for service detail page in Italian';
COMMENT ON COLUMN services.page_h1_pt IS 'H1 title for service detail page in Portuguese';

COMMENT ON COLUMN services.show_in_list IS 'Boolean to show or hide service from service lists (default: true)';

