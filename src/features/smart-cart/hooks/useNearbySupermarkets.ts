import { useCallback } from "react";
import { toNearbySupermarketsRequest } from "../mappers/nearbySupermark.mapper.ts";
import { useSupermarketStore } from "../stores/supermarketsStore.ts";
import { fetchNearbySupermarkets } from "../services/supermarket.service.ts";
import type { SelectedLocation } from "../models/location.models.ts";

interface UseNearbySupermarketsProps {
  locationUser: SelectedLocation;
  storeKeys: string[];
}

export function useNearbySupermarkets() {
  const supermarketsSegments = useSupermarketStore(
    (state) => state.supermarketsSegments,
  );
  const loadingSupermarkets = useSupermarketStore((state) => state.loadingSupermarkets,);
  const errorSupermarkets = useSupermarketStore((state) => state.errorSupermarkets,);
  const setLoadingSupermarkets = useSupermarketStore((state) => state.setLoadingSupermarkets,);
  const setErrorSupermarkets = useSupermarketStore((state) => state.setErrorSupermarkets,);
  const setSupermarkets = useSupermarketStore((state) => state.setSupermarkets);
  
  const load = useCallback(
    async (
      { locationUser, storeKeys }: UseNearbySupermarketsProps,
      signal: AbortSignal,
    ): Promise<void> => {
      const request = toNearbySupermarketsRequest({
        latitude: locationUser.latitude,
        longitude: locationUser.longitude,
        storeKeys,
      });

      setErrorSupermarkets(null);

      try {
        const response = await fetchNearbySupermarkets(request, signal);
        console.log("response supermarkets",response);
        if (!signal.aborted) {
          setSupermarkets(response.routeResult);
        }
      } catch (error) {
        if (!signal.aborted) {
          setErrorSupermarkets(
            error instanceof Error
              ? error.message
              : "Error al obtener la ruta de los supermercados.",
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
    supermarketsSegments,
    loadingSupermarkets,
    errorSupermarkets,
  };
}
