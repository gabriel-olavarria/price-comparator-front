import { useSmartCartStore } from "../../stores/smartCartStore";
 
import { useNearbySupermarkets } from "../../hooks/useNearbySupermarkets.ts";
import { useEffect, useRef } from "react";

import { useLocationStore } from "../../stores/locationStore.ts";


export function useCartSummary() {
  const storeKeys = useSmartCartStore((state) => state.storeKeys);
  const storeKeysRef = useRef(storeKeys);
  storeKeysRef.current = storeKeys;

  const { supermarketsSegments, loadingSupermarkets, errorSupermarkets, load } = useNearbySupermarkets();
  const locationUser = useLocationStore((state) => state.locationUser,);



  useEffect(() => {
    let controller: AbortController | null = null;

    const unsubscribe = useLocationStore.subscribe(
      (state) => state.locationUser,
      (current, previous) => {
        if (!current || current === previous) return;

        controller?.abort();
        controller = new AbortController();
        void load(
          { locationUser: current, storeKeys: storeKeysRef.current },
          controller.signal,
        );
      },
    );

    return () => {
      unsubscribe();
      controller?.abort();
    };
  }, [load]);
  
  return {
    storeKeys,
    supermarketsSegments,
    loadingSupermarkets,
    errorSupermarkets,
    locationUser,
  };
}
