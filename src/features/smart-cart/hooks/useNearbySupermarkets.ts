import { useCallback } from "react";
import { toNearbySupermarketsRequest } from "../mappers/nearbySupermark.mapper.ts";
import { useSupermarketStore } from "../stores/supermarketsStore.ts";
import { fetchNearbySupermarkets } from "../services/supermarket.service.ts";
import type { SelectedLocation } from "../models/location.models.ts";

interface UseNearbySupermarketsProps {
  locationUser: SelectedLocation;
  storeKeys: string[];
}

let supermarketRequestId = 0;

export function useNearbySupermarkets() {
  const supermarketsSegments = useSupermarketStore(
    (state) => state.supermarketsSegments,
  );
  const nearestByStore = useSupermarketStore((state) => state.nearestByStore);
  const loadingSupermarkets = useSupermarketStore((state) => state.loadingSupermarkets,);
  const errorSupermarkets = useSupermarketStore((state) => state.errorSupermarkets,);
  const load = useCallback(
    async (
      { locationUser, storeKeys }: UseNearbySupermarketsProps,
      signal: AbortSignal,
    ): Promise<void> => {
      const requestId = ++supermarketRequestId;
      const request = toNearbySupermarketsRequest({
        latitude: locationUser.latitude,
        longitude: locationUser.longitude,
        storeKeys,
      });

      useSupermarketStore.setState({
        loadingSupermarkets: true,
        errorSupermarkets: null,
      });

      try {
        const response = await fetchNearbySupermarkets(request, signal);

        if (signal.aborted || requestId !== supermarketRequestId) {
          return;
        }

        useSupermarketStore.setState({
          supermarketsSegments: response.routeResult,
          nearestByStore: response.nearestByStore,
          loadingSupermarkets: false,
          errorSupermarkets: null,
        });
      } catch (error) {
        if (signal.aborted || requestId !== supermarketRequestId) {
          return;
        }

        useSupermarketStore.setState({
          errorSupermarkets:
            error instanceof Error
              ? error.message
              : "Error al obtener la ruta de los supermercados.",
          loadingSupermarkets: false,
        });
      } finally {
        if (
          requestId === supermarketRequestId &&
          useSupermarketStore.getState().loadingSupermarkets
        ) {
          useSupermarketStore.setState({ loadingSupermarkets: false });
        }
      }
    },
    [],
  );
  

  return {
    load,
    supermarketsSegments,
    nearestByStore,
    loadingSupermarkets,
    errorSupermarkets,
  };
}
