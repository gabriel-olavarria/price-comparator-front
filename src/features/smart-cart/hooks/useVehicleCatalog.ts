import { useCallback } from "react";

import { getVehicleCatalog } from "../services/fuel.service.ts";
import { useVehicleCatalogStore } from "../stores/useVehicleStore.ts";

export function useVehicleCatalog() {
  const catalog = useVehicleCatalogStore((state) => state.catalog);
  const loading = useVehicleCatalogStore((state) => state.loading);
  const error = useVehicleCatalogStore((state) => state.error);
  const vehicleStore = useVehicleCatalogStore((state) => state.selectedVehicle);

  const setCatalog = useVehicleCatalogStore((state) => state.setCatalog);
  const setLoading = useVehicleCatalogStore((state) => state.setLoading);
  const setError = useVehicleCatalogStore((state) => state.setError);

  const load = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      const state = useVehicleCatalogStore.getState();

      // Evitar consultar nuevamente si ya existe el catálogo.
      if (state.catalog !== null) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getVehicleCatalog(signal);
          console.log(response);
        if (!signal.aborted) {
          setCatalog(response);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al obtener el catálogo vehicular.",
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [setCatalog, setLoading, setError],
  );

  
  return {
    load,
    brands: catalog?.brands ?? [],
    labels: catalog?.labels ?? [],
    models: catalog?.models ?? [],
    loading,
    error,
    vehicleStore,
  };
}
