/**
 * Prebuild Script - Fetch Supabase data at build time
 * 
 * Ce script fetch toutes les données nécessaires depuis Supabase
 * et les sauvegarde en fichiers JSON statiques.
 * 
 * Résultat : Le client charge les JSON instantanément sans appel API.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger dotenv seulement en local (optionnel en production)
try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
} catch {
  // dotenv non disponible en production - les variables sont déjà dans l'environnement
}

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Service fields to fetch (same as getServiceFields() in utils/services.js)
const SERVICE_FIELDS = `
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
  icon,
  color,
  base_price,
  is_active,
  show_in_list,
  created_at,
  updated_at
`;

async function fetchServices() {
  console.log('📦 Fetching services...');
  
  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_FIELDS)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching services:', error);
    return [];
  }

  console.log(`✅ Fetched ${data.length} services`);
  return data;
}

async function fetchBlogPosts() {
  console.log('📦 Fetching blog posts...');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching blog posts:', error);
    return [];
  }

  console.log(`✅ Fetched ${data.length} blog posts`);
  return data;
}

// Note: Les tables FAQs et Testimonials n'existent pas dans ce projet
// Si vous les ajoutez plus tard, décommentez ces fonctions

function writeJSON(filename, data) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`📄 Written ${filepath}`);
}

async function main() {
  console.log('\n🚀 Starting prebuild...\n');
  const startTime = Date.now();

  try {
    // Fetch all data in parallel
    const [services, blogPosts] = await Promise.all([
      fetchServices(),
      fetchBlogPosts(),
    ]);

    // Write main data files
    writeJSON('services.json', services);
    writeJSON('blog-posts.json', blogPosts);

    // Write individual service files for faster loading
    console.log('\n📦 Writing individual service files...');
    for (const service of services) {
      writeJSON(`service-${service.service_id}.json`, service);
    }

    // Write services index (lightweight version for listings)
    const servicesIndex = services.map(s => ({
      id: s.id,
      service_id: s.service_id,
      name: s.name,
      name_fr: s.name_fr,
      name_es: s.name_es,
      list_title: s.list_title,
      list_title_fr: s.list_title_fr,
      list_title_es: s.list_title_es,
      short_description: s.short_description,
      short_description_fr: s.short_description_fr,
      short_description_es: s.short_description_es,
      base_price: s.base_price,
      show_in_list: s.show_in_list,
    }));
    writeJSON('services-index.json', servicesIndex);

    // Write blog posts index (lightweight)
    const blogIndex = blogPosts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      featured_image: p.featured_image,
      published_at: p.published_at,
      category: p.category,
    }));
    writeJSON('blog-index.json', blogIndex);

    // Write manifest with build info
    const manifest = {
      buildTime: new Date().toISOString(),
      servicesCount: services.length,
      blogPostsCount: blogPosts.length,
    };
    writeJSON('manifest.json', manifest);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Prebuild completed in ${duration}s`);
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  } catch (error) {
    console.error('\n❌ Prebuild failed:', error);
    process.exit(1);
  }
}

main();

