/**
 * Hook pour charger les services depuis les données prebuild
 * 
 * Ce hook charge les données statiques générées par le script prebuild
 * au lieu de faire des requêtes dynamiques à Supabase.
 * 
 * Avantages:
 * - Performance: Données chargées instantanément depuis des fichiers statiques
 * - Fiabilité: Pas de dépendance au réseau au runtime
 * - SEO: Contenu disponible immédiatement pour le rendu
 * - Coût: Pas de requêtes à Supabase côté client
 */

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, formatServicesForLanguage } from '../utils/services';

// Cache en mémoire pour éviter les rechargements
const servicesCache = {
  all: null,
  index: null,
  individual: new Map(),
  lastFetch: null
};

// Durée du cache en ms (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

/**
 * Vérifie si le cache est encore valide
 */
function isCacheValid() {
  if (!servicesCache.lastFetch) return false;
  return (Date.now() - servicesCache.lastFetch) < CACHE_DURATION;
}

/**
 * Charge tous les services (données complètes)
 */
async function fetchAllServices() {
  if (servicesCache.all && isCacheValid()) {
    return servicesCache.all;
  }

  try {
    const response = await fetch('/data/services.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    servicesCache.all = data;
    servicesCache.lastFetch = Date.now();
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des services:', error);
    // Retourner le cache même expiré si disponible
    return servicesCache.all || [];
  }
}

/**
 * Charge l'index des services (version légère pour les listes)
 */
async function fetchServicesIndex() {
  if (servicesCache.index && isCacheValid()) {
    return servicesCache.index;
  }

  try {
    const response = await fetch('/data/services-index.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    servicesCache.index = data;
    servicesCache.lastFetch = Date.now();
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'index des services:', error);
    return servicesCache.index || [];
  }
}

/**
 * Charge un service individuel par son ID
 */
async function fetchServiceById(serviceId) {
  if (servicesCache.individual.has(serviceId) && isCacheValid()) {
    return servicesCache.individual.get(serviceId);
  }

  try {
    // Essayer d'abord le fichier individuel
    const response = await fetch(`/data/service-${serviceId}.json`);
    if (response.ok) {
      const data = await response.json();
      servicesCache.individual.set(serviceId, data);
      return data;
    }

    // Fallback: chercher dans le fichier complet
    const allServices = await fetchAllServices();
    const service = allServices.find(s => s.service_id === serviceId);
    if (service) {
      servicesCache.individual.set(serviceId, service);
    }
    return service || null;
  } catch (error) {
    console.error(`Erreur lors du chargement du service ${serviceId}:`, error);
    return servicesCache.individual.get(serviceId) || null;
  }
}

/**
 * Hook principal pour charger les services pour les listes (homepage, etc.)
 * Utilise l'index léger pour de meilleures performances
 * 
 * @param {Object} options - Options de filtrage
 * @param {boolean} options.showInListOnly - Filtrer par show_in_list (défaut: true)
 * @param {string} options.excludeServiceId - Exclure un service par son ID
 * @param {number} options.limit - Nombre maximum de services à retourner
 * @returns {Object} { services, isLoading, error, refetch }
 */
export function useServicesList(options = {}) {
  const { showInListOnly = true, excludeServiceId = null, limit = null } = options;
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Charger les données complètes pour avoir accès à l'icône et tous les champs multilingues
      let data = await fetchAllServices();

      // Filtrer par show_in_list si nécessaire
      if (showInListOnly) {
        data = data.filter(s => s.show_in_list === true);
      }

      // Exclure un service si spécifié
      if (excludeServiceId) {
        data = data.filter(s => s.service_id !== excludeServiceId);
      }

      // Limiter le nombre de résultats
      if (limit && limit > 0) {
        data = data.slice(0, limit);
      }

      // Formater selon la langue
      const formattedServices = formatServicesForLanguage(data, language);
      setServices(formattedServices);
    } catch (err) {
      console.error('Erreur dans useServicesList:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [language, showInListOnly, excludeServiceId, limit]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return { services, isLoading, error, refetch: loadServices };
}

/**
 * Hook pour charger un service spécifique par son ID
 * Charge toutes les données du service pour les pages de détail
 * 
 * @param {string} serviceId - L'ID du service à charger
 * @returns {Object} { service, isLoading, error, refetch }
 */
export function useService(serviceId) {
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadService = useCallback(async () => {
    if (!serviceId) {
      setService(null);
      setIsLoading(false);
      setError('Service ID manquant');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchServiceById(serviceId);

      if (!data) {
        setError('Service non trouvé');
        setService(null);
        return;
      }

      // Formater selon la langue
      const formattedService = formatServiceForLanguage(data, language);
      setService(formattedService);
    } catch (err) {
      console.error(`Erreur dans useService(${serviceId}):`, err);
      setError(err.message);
      setService(null);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId, language]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  return { service, isLoading, error, refetch: loadService };
}

/**
 * Hook pour charger tous les services avec toutes les données
 * Utile quand on a besoin de l'ensemble complet des données
 * 
 * @returns {Object} { services, isLoading, error, refetch }
 */
export function useAllServices() {
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllServices();
      const formattedServices = formatServicesForLanguage(data, language);
      setServices(formattedServices);
    } catch (err) {
      console.error('Erreur dans useAllServices:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return { services, isLoading, error, refetch: loadServices };
}

/**
 * Précharge les données des services pour améliorer les performances
 * À appeler au démarrage de l'application ou lors du prefetch
 */
export async function preloadServices() {
  try {
    await Promise.all([
      fetchAllServices(),
      fetchServicesIndex()
    ]);
    console.log('✅ Services préchargés');
  } catch (error) {
    console.warn('⚠️ Erreur lors du préchargement des services:', error);
  }
}

/**
 * Invalide le cache des services
 * Utile pour forcer un rechargement après une mise à jour
 */
export function invalidateServicesCache() {
  servicesCache.all = null;
  servicesCache.index = null;
  servicesCache.individual.clear();
  servicesCache.lastFetch = null;
  console.log('🔄 Cache des services invalidé');
}

