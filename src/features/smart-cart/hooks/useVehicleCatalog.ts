import { useCallback } from "react";

import { getVehicleCatalog } from "../services/fuel.service.ts";
import { useVehicleCatalogStore } from "../stores/vehicleCatalogStore.ts";
 

export function useVehicleCatalog() {
  const catalog = useVehicleCatalogStore((state) => state.catalog);
  const loadingCatalog = useVehicleCatalogStore((state) => state.loading);
  const errorCatalog = useVehicleCatalogStore((state) => state.error);
 

  const setCatalog = useVehicleCatalogStore((state) => state.setCatalog);
  const setLoadingCatalog = useVehicleCatalogStore((state) => state.setLoading);
  const setErrorCatalog = useVehicleCatalogStore((state) => state.setError);

  const loadCatalog = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      const state = useVehicleCatalogStore.getState();

      // Evitar consultar nuevamente si ya existe el catálogo.
      if (state.catalog !== null) {
        return;
      }

      setLoadingCatalog(true);
      setErrorCatalog(null);

      try {
        const response = await getVehicleCatalog(signal);
        console.log(response);
        if (!signal.aborted) {
          setCatalog(response);
        }
      } catch (error) {
        if (!signal.aborted) {
          setErrorCatalog(
            error instanceof Error
              ? error.message
              : "Error al obtener el catálogo vehicular.",
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoadingCatalog(false);
        }
      }
    },
    [setCatalog, setLoadingCatalog, setErrorCatalog],
  );

  
  return {
    loadCatalog,
    loadingCatalog,
    errorCatalog,
    catalog,
  };
}
