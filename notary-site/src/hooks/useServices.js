/**
 * Hook pour charger les services depuis les données prebuild
 * 
 * IMPORTANT: Les données sont importées STATIQUEMENT dans le bundle
 * pour éviter tout décalage de mise en page (CLS).
 * 
 * Avantages:
 * - ZERO CLS: Données disponibles immédiatement au premier rendu
 * - Performance: Pas de fetch async au runtime
 * - SEO: Contenu disponible pour le rendu initial
 */

import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatServiceForLanguage, formatServicesForLanguage } from '../utils/services';

// IMPORT STATIQUE - Les données sont incluses dans le bundle JS
// Vite transforme ces imports en données inline (pas de fetch!)
import servicesData from '../../public/data/services.json';

// Créer un map pour accès rapide par service_id
const servicesMap = new Map(servicesData.map(s => [s.service_id, s]));

/**
 * Hook principal pour charger les services pour les listes (homepage, etc.)
 * 
 * ZERO FETCH - Les données sont déjà dans le bundle !
 * 
 * @param {Object} options - Options de filtrage
 * @param {boolean} options.showInListOnly - Filtrer par show_in_list (défaut: true)
 * @param {string} options.excludeServiceId - Exclure un service par son ID
 * @param {number} options.limit - Nombre maximum de services à retourner
 * @returns {Object} { services, isLoading, error }
 */
export function useServicesList(options = {}) {
  const { showInListOnly = true, excludeServiceId = null, limit = null } = options;
  const { language } = useLanguage();

  // useMemo pour calculer les services filtrés - PAS de useEffect/useState async !
  const services = useMemo(() => {
    let data = [...servicesData];

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
    return formatServicesForLanguage(data, language);
  }, [language, showInListOnly, excludeServiceId, limit]);

  // Toujours loaded immédiatement - pas de CLS !
  return { services, isLoading: false, error: null };
}

/**
 * Hook pour charger un service spécifique par son ID
 * 
 * ZERO FETCH - Lookup synchrone dans le Map !
 * 
 * @param {string} serviceId - L'ID du service à charger
 * @returns {Object} { service, isLoading, error }
 */
export function useService(serviceId) {
  const { language } = useLanguage();

  // useMemo pour le lookup - SYNCHRONE !
  const { service, error } = useMemo(() => {
    if (!serviceId) {
      return { service: null, error: 'Service ID manquant' };
    }

    const data = servicesMap.get(serviceId);
    
    if (!data) {
      return { service: null, error: 'Service non trouvé' };
    }

    // Formater selon la langue
    return { 
      service: formatServiceForLanguage(data, language), 
      error: null 
    };
  }, [serviceId, language]);

  // Toujours loaded immédiatement - pas de CLS !
  return { service, isLoading: false, error };
}

/**
 * Hook pour charger tous les services avec toutes les données
 * 
 * @returns {Object} { services, isLoading, error }
 */
export function useAllServices() {
  const { language } = useLanguage();

  const services = useMemo(() => {
    return formatServicesForLanguage(servicesData, language);
  }, [language]);

  return { services, isLoading: false, error: null };
}

/**
 * Exporte les données brutes pour un accès direct si nécessaire
 */
export const rawServicesData = servicesData;

