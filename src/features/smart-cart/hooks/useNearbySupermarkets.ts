import { useCallback } from "react";
import { toNearbySupermarketsRequest } from "../mappers/nearbySupermark.mapper.ts";
import { useSupermarketStore } from "../stores/supermarketsStore.ts";
import { fetchNearbySupermarkets } from "../services/supermarket.service.ts";
import type { SelectedLocation } from "../models/location.models.ts";

interface UseNearbySupermarketsProps {
  selectedLocationMap: SelectedLocation;
  storeKeys: string[];
}

export function useNearbySupermarkets() {
  const dataMarket = useSupermarketStore((state) => state.supermarkets);
  const loadingSupermarkets = useSupermarketStore(
    (state) => state.loadingSupermarkets,
  );
  const errorSupermarkets = useSupermarketStore(
    (state) => state.errorSupermarkets,
  );
  const setLoadingSupermarkets = useSupermarketStore(
    (state) => state.setLoadingSupermarkets,
  );
  const setErrorSupermarkets = useSupermarketStore(
    (state) => state.setErrorSupermarkets,
  );
  const setSupermarkets = useSupermarketStore((state) => state.setSupermarkets);
  
  const load = useCallback(
    async (
      { selectedLocationMap, storeKeys }: UseNearbySupermarketsProps,
      signal: AbortSignal,
    ): Promise<void> => {
      const request = toNearbySupermarketsRequest({
        latitude: selectedLocationMap.latitude,
        longitude: selectedLocationMap.longitude,
        storeKeys,
      });

      setErrorSupermarkets(null);

      try {

        const response = await fetchNearbySupermarkets(request, signal);
 
        if (!signal.aborted) {
          setSupermarkets(response);
        }
      } catch (error) {
        if (!signal.aborted) {
          (
            error instanceof Error
              ? error.message
              : "Error al obtener la ruta de los supermercados."
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoadingSupermarkets(false);
        }
      }
    },
    [setSupermarkets, setLoadingSupermarkets, setErrorSupermarkets],
  );
  

  return {
    load,
    dataMarket,
    loadingSupermarkets,
    errorSupermarkets,
  };
}
