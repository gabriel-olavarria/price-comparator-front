import { useCallback } from "react";

import { getVehicleCatalog } from "../services/fuel.service.ts";
import { useVehicleCatalogStore } from "../stores/vehicleCatalogStore.ts";

let catalogRequestId = 0;

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
        if (state.loading) {
          setLoadingCatalog(false);
        }
        return;
      }

      const requestId = ++catalogRequestId;

      setLoadingCatalog(true);
      setErrorCatalog(null);

      try {
        const response = await getVehicleCatalog(signal);
        if (signal.aborted || requestId !== catalogRequestId) {
          return;
        }

        setCatalog(response);
      } catch (error) {
        if (signal.aborted || requestId !== catalogRequestId) {
          return;
        }

        setErrorCatalog(
          error instanceof Error
            ? error.message
            : "Error al obtener el catálogo vehicular.",
        );
      } finally {
        if (requestId === catalogRequestId) {
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
