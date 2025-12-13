/**
 * Hook pour charger les données prebuild
 * 
 * En développement : charge depuis Supabase
 * En production : charge depuis les fichiers JSON statiques
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getServiceFields } from '../utils/services';

// Détecter si on est en production (build) ou développement
const IS_PRODUCTION = import.meta.env.PROD;

// Cache en mémoire pour éviter les re-fetch
const cache = new Map();

/**
 * Charge un fichier JSON depuis /data/
 */
async function loadJSON(filename) {
  const cacheKey = `json:${filename}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

/**
 * Hook pour charger un service par son ID
 */
export function useService(serviceId) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (IS_PRODUCTION) {
          // Production: charger depuis JSON statique
          const data = await loadJSON(`service-${serviceId}.json`);
          if (data) {
            setService(data);
          } else {
            // Fallback: essayer le fichier services.json complet
            const allServices = await loadJSON('services.json');
            const found = allServices?.find(s => s.service_id === serviceId);
            if (found) {
              setService(found);
            } else {
              setError('Service not found');
            }
          }
        } else {
          // Développement: charger depuis Supabase
          const { data, error: supabaseError } = await supabase
            .from('services')
            .select(getServiceFields())
            .eq('service_id', serviceId)
            .eq('is_active', true)
            .single();

          if (supabaseError) throw supabaseError;
          setService(data);
        }
      } catch (err) {
        console.error('Error loading service:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [serviceId]);

  return { service, loading, error };
}

/**
 * Hook pour charger tous les services
 */
export function useServices(options = {}) {
  const { showInListOnly = false, excludeId = null, limit = null } = options;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (IS_PRODUCTION) {
          // Production: charger depuis JSON statique
          data = await loadJSON('services.json');
        } else {
          // Développement: charger depuis Supabase
          let query = supabase
            .from('services')
            .select(getServiceFields())
            .eq('is_active', true)
            .order('created_at', { ascending: true });

          if (showInListOnly) {
            query = query.eq('show_in_list', true);
          }
          if (excludeId) {
            query = query.neq('service_id', excludeId);
          }
          if (limit) {
            query = query.limit(limit);
          }

          const { data: supabaseData, error: supabaseError } = await query;
          if (supabaseError) throw supabaseError;
          data = supabaseData;
        }

        // Appliquer les filtres côté client en production
        if (IS_PRODUCTION && data) {
          if (showInListOnly) {
            data = data.filter(s => s.show_in_list);
          }
          if (excludeId) {
            data = data.filter(s => s.service_id !== excludeId);
          }
          if (limit) {
            data = data.slice(0, limit);
          }
        }

        setServices(data || []);
      } catch (err) {
        console.error('Error loading services:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [showInListOnly, excludeId, limit]);

  return { services, loading, error };
}

/**
 * Hook pour charger les FAQs
 */
export function useFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (IS_PRODUCTION) {
          const data = await loadJSON('faqs.json');
          setFaqs(data || []);
        } else {
          const { data, error: supabaseError } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

          if (supabaseError) throw supabaseError;
          setFaqs(data || []);
        }
      } catch (err) {
        console.error('Error loading FAQs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { faqs, loading, error };
}

/**
 * Hook pour charger les témoignages
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (IS_PRODUCTION) {
          const data = await loadJSON('testimonials.json');
          setTestimonials(data || []);
        } else {
          const { data, error: supabaseError } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (supabaseError) throw supabaseError;
          setTestimonials(data || []);
        }
      } catch (err) {
        console.error('Error loading testimonials:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { testimonials, loading, error };
}

/**
 * Hook pour charger les articles de blog
 */
export function useBlogPosts(options = {}) {
  const { limit = null } = options;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (IS_PRODUCTION) {
          data = await loadJSON('blog-posts.json');
          if (limit && data) {
            data = data.slice(0, limit);
          }
        } else {
          let query = supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

          if (limit) {
            query = query.limit(limit);
          }

          const { data: supabaseData, error: supabaseError } = await query;
          if (supabaseError) throw supabaseError;
          data = supabaseData;
        }

        setPosts(data || []);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * Précharge toutes les données en production
 * À appeler au démarrage de l'app pour warmup
 */
export async function preloadAllData() {
  if (!IS_PRODUCTION) return;

  await Promise.all([
    loadJSON('services.json'),
    loadJSON('faqs.json'),
    loadJSON('testimonials.json'),
    loadJSON('blog-index.json'),
  ]);
}

