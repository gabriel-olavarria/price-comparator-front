import { useSmartCartStore } from "../../stores/smartCartStore";
import { useLocationStore } from "../../stores/locationStore";
import { useNearbySupermarkets } from "../../hooks/useNearbySupermarkets.ts";
import { useEffect, useState } from "react";
import type { SelectedLocation } from "../../models/location.models.ts";


export function useCartSummary() {
  const [selectedLocationMap, setSelectedLocationMap] = useState<SelectedLocation | null>(null);
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const storeKeys = useSmartCartStore((state) => state.storeKeys);
 
  const { dataMarket, loadingSupermarkets, errorSupermarkets, load } = useNearbySupermarkets();
  
  useEffect(() => {
  
    if(selectedLocationMap == null) {
      return;
    }
    if (selectedLocation != null && selectedLocation == selectedLocationMap) {
      return;
    }

    if (storeKeys.length == 0) {
      return;
    } 
    
    const controller = new AbortController();

    void load({ selectedLocationMap, storeKeys }, controller.signal);

    return () => controller.abort();
  }, [selectedLocationMap, storeKeys, load]);
  
  return {
    storeKeys,
    dataMarket,
    loadingSupermarkets,
    errorSupermarkets,
    selectedLocationMap,
    setSelectedLocationMap,
  };
}
