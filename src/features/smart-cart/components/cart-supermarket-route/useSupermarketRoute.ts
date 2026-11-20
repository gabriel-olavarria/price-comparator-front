import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { SelectedLocation } from "../../models/location.models";
import type { NearbySupermarkets } from "../../models/supermarketLocation.models";
import { useRoutes } from "../../hooks/useRoutes";
import { useLocationStore } from "../../stores/locationStore.ts";
import { useSupermarketStore } from "../../stores/supermarketsStore.ts";

export interface SupermarketRouteProps {
  nearestByStore: NearbySupermarkets["nearestByStore"];
  selectedLocationMap: SelectedLocation | null;
  setSelectedLocationMap: Dispatch<SetStateAction<SelectedLocation | null>>;
}


export function useSupermarketRoute(props: SupermarketRouteProps) {
  const { nearestByStore,  selectedLocationMap, setSelectedLocationMap } = props;
  
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  
  const loadingSupermarkets = useSupermarketStore((state) => state.loadingSupermarkets);
  const errorSupermarkets = useSupermarketStore((state) => state.errorSupermarkets,);
  const setLoadingSupermarkets = useSupermarketStore((state) => state.setLoadingSupermarkets,);
  
  const location = selectedLocationMap == null ? selectedLocation : selectedLocationMap;
  const [locationModalOpened, setLocationModalOpened] = useState(false);
  
  // Hook encargado de construir las rutas
  const { route } = useRoutes({ selectedLocation: selectedLocationMap, nearestByStore, });

  const handleConfirmLocation = (location: SelectedLocation) => {
    setSelectedLocationMap(location);
    setLocationModalOpened(false);
    setLoadingSupermarkets(true);
  };

  useEffect(() => {
 
    if (selectedLocationMap == null) {
      setSelectedLocationMap(selectedLocation);
    }
  }, [selectedLocation, loadingSupermarkets]);
  
  return {
    route,
    loadingSupermarkets,
    errorSupermarkets,
    location,
    locationModalOpened,
    locationLabel: selectedLocationMap?.address ?? "Sin configurar",
    formatDistance: (distanceKm: number) =>
      `${distanceKm.toLocaleString("es-CL", { maximumFractionDigits: 2 })} km`,
    openLocationModal: () => setLocationModalOpened(true),
    closeLocationModal: () => setLocationModalOpened(false),
    handleConfirmLocation,
  };
}
