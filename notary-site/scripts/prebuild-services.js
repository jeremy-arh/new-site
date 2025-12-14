/**
 * Script de prebuild pour importer les services depuis Supabase
 * 
 * Ce script est exécuté avant chaque build pour récupérer les données
 * dynamiques de la table services et les sauvegarder localement.
 * 
 * Usage: node scripts/prebuild-services.js
 * 
 * Variables d'environnement requises:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env si disponible
async function loadEnv() {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch {
    // dotenv n'est pas disponible, utiliser les variables d'environnement système
    console.log('ℹ️  dotenv non disponible, utilisation des variables d\'environnement système');
  }
}

// Liste complète de toutes les colonnes de la table services
const ALL_SERVICE_COLUMNS = `
  id,
  service_id,
  name,
  description,
  icon,
  color,
  base_price,
  is_active,
  created_at,
  updated_at,
  short_description,
  cta,
  meta_title,
  meta_description,
  name_fr,
  name_es,
  name_de,
  name_it,
  name_pt,
  short_description_fr,
  short_description_es,
  short_description_de,
  short_description_it,
  short_description_pt,
  description_fr,
  description_es,
  description_de,
  description_it,
  description_pt,
  cta_fr,
  cta_es,
  cta_de,
  cta_it,
  cta_pt,
  meta_title_fr,
  meta_title_es,
  meta_title_de,
  meta_title_it,
  meta_title_pt,
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
  list_title,
  list_title_fr,
  list_title_es,
  list_title_de,
  list_title_it,
  list_title_pt,
  page_h1,
  page_h1_fr,
  page_h1_es,
  page_h1_de,
  page_h1_it,
  page_h1_pt,
  show_in_list
`.replace(/\s+/g, ' ').trim();

async function fetchServices() {
  await loadEnv();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables d\'environnement manquantes:');
    console.error('   - VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
    console.error('\n   Veuillez configurer ces variables dans votre fichier .env ou dans Cloudflare Pages.');
    process.exit(1);
  }

  console.log('🔌 Connexion à Supabase...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Récupérer tous les services actifs avec TOUTES les colonnes
    console.log('📥 Récupération des services depuis Supabase...');
    const { data: services, error } = await supabase
      .from('services')
      .select(ALL_SERVICE_COLUMNS)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!services || services.length === 0) {
      console.warn('⚠️  Aucun service trouvé dans la base de données');
      return [];
    }

    console.log(`✅ ${services.length} service(s) récupéré(s)`);
    return services;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des services:', error.message);
    throw error;
  }
}

async function saveServices(services) {
  const publicDataDir = path.join(__dirname, '..', 'public', 'data');

  // Créer le dossier public/data s'il n'existe pas
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
    console.log('📁 Dossier public/data créé');
  }

  // Sauvegarder tous les services (fichier complet)
  const servicesPath = path.join(publicDataDir, 'services.json');
  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2), 'utf-8');
  console.log(`💾 Fichier services.json sauvegardé (${services.length} services)`);

  // Créer un index léger pour les listes (seulement les champs essentiels)
  const servicesIndex = services.map(service => ({
    id: service.id,
    service_id: service.service_id,
    name: service.name,
    name_fr: service.name_fr,
    name_es: service.name_es,
    name_de: service.name_de,
    name_it: service.name_it,
    name_pt: service.name_pt,
    list_title: service.list_title,
    list_title_fr: service.list_title_fr,
    list_title_es: service.list_title_es,
    list_title_de: service.list_title_de,
    list_title_it: service.list_title_it,
    list_title_pt: service.list_title_pt,
    short_description: service.short_description,
    short_description_fr: service.short_description_fr,
    short_description_es: service.short_description_es,
    short_description_de: service.short_description_de,
    short_description_it: service.short_description_it,
    short_description_pt: service.short_description_pt,
    icon: service.icon,
    color: service.color,
    base_price: service.base_price,
    show_in_list: service.show_in_list
  }));

  const servicesIndexPath = path.join(publicDataDir, 'services-index.json');
  fs.writeFileSync(servicesIndexPath, JSON.stringify(servicesIndex, null, 2), 'utf-8');
  console.log(`💾 Fichier services-index.json sauvegardé (version légère)`);

  // Sauvegarder chaque service individuellement pour les pages de détail
  for (const service of services) {
    const serviceFilePath = path.join(publicDataDir, `service-${service.service_id}.json`);
    fs.writeFileSync(serviceFilePath, JSON.stringify(service, null, 2), 'utf-8');
  }
  console.log(`💾 ${services.length} fichiers service-*.json individuels sauvegardés`);

  // Créer un fichier manifest avec les métadonnées du build
  const manifest = {
    buildTime: new Date().toISOString(),
    servicesCount: services.length,
    serviceIds: services.map(s => s.service_id),
    columns: ALL_SERVICE_COLUMNS.split(',').map(c => c.trim()).filter(Boolean)
  };

  const manifestPath = path.join(publicDataDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('📋 Fichier manifest.json mis à jour');
}

async function fetchBlogPosts(supabaseUrl, supabaseAnonKey) {
  console.log('📥 Récupération des blog posts pour le footer...');
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    console.log(`✅ ${(data || []).length} blog post(s) récupéré(s)`);
    return data || [];
  } catch (error) {
    console.warn('⚠️  Erreur lors de la récupération des blog posts:', error.message);
    return [];
  }
}

async function saveBlogIndex(posts) {
  const publicDataDir = path.join(__dirname, '..', 'public', 'data');
  const blogIndexPath = path.join(publicDataDir, 'blog-index.json');
  
  fs.writeFileSync(blogIndexPath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`💾 Fichier blog-index.json sauvegardé (${posts.length} posts)`);
}

async function main() {
  console.log('\n🚀 Prebuild Services - Début\n');
  console.log('=' .repeat(50));

  await loadEnv();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables d\'environnement manquantes');
    console.log('⚠️  Utilisation des données existantes dans public/data/');
    process.exit(0);
  }

  try {
    // 1. Récupérer et sauvegarder les services
    const services = await fetchServices();
    if (services.length > 0) {
      await saveServices(services);
    }

    // 2. Récupérer et sauvegarder l'index des blog posts (pour le footer)
    const blogPosts = await fetchBlogPosts(supabaseUrl, supabaseAnonKey);
    if (blogPosts.length > 0) {
      await saveBlogIndex(blogPosts);
    }

    console.log('=' .repeat(50));
    console.log('\n✅ Prebuild terminé avec succès!\n');
  } catch (error) {
    console.error('\n❌ Erreur durant le prebuild:', error.message);
    // Ne pas faire échouer le build, utiliser les données existantes
    console.log('⚠️  Utilisation des données existantes dans public/data/');
    process.exit(0);
  }
}

main();

