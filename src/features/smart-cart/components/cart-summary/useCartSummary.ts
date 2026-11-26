import { useSmartCartStore } from "../../stores/smartCartStore";
 
import { useNearbySupermarkets } from "../../hooks/useNearbySupermarkets.ts";
import { useEffect } from "react";

import { useLocationStore } from "../../stores/locationStore.ts";


export function useCartSummary() {
  const storeKeys = useSmartCartStore((state) => state.storeKeys);
  const { supermarketsSegments, loadingSupermarkets, errorSupermarkets, load } = useNearbySupermarkets();
  const locationUser = useLocationStore((state) => state.locationUser,);



  useEffect(() => {
    let controller: AbortController | null = null;

    const unsubscribe = useLocationStore.subscribe(
      (state) => state.locationUser,
      (current, previous) => {
        controller?.abort();
        controller = new AbortController();
        if (!current) return;
        if (previous != current) {
          void load({ locationUser: current, storeKeys }, controller.signal);
        }
      },
      {
        fireImmediately: true,
      },
    );

    return () => {
      unsubscribe();
      controller?.abort();
    };
  }, [storeKeys, load]);
  
  return {
    storeKeys,
    supermarketsSegments,
    loadingSupermarkets,
    errorSupermarkets,
    locationUser,
  };
}
