/**
 * useDashboardData Hook
 * Hook maestro que combina todos los estados de conexión
 * para el dashboard completo
 */
import { useInstagramData } from './useInstagramData';
import { useMetaAdsData } from './useMetaAdsData';

export function useDashboardData() {
  const instagram = useInstagramData();
  const metaAds = useMetaAdsData();

  // Estado general del dashboard
  const isLoading = instagram.isLoading || metaAds.isLoading;
  const hasAnyData = instagram.hasData || metaAds.hasData;

  // Refresh all connections
  const refreshAll = () => {
    instagram.refresh();
    metaAds.refresh();
  };

  return {
    instagram,
    metaAds,
    isLoading,
    hasAnyData,
    refreshAll
  };
}
