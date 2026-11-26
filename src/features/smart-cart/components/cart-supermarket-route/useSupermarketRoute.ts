
import type { SelectedLocation } from "../../models/location.models";
import type { NearbySupermarketsResponse } from "../../models/supermarketLocation.models";
import { useLocationStore } from "../../stores/locationStore.ts";
import { useSupermarketStore } from "../../stores/supermarketsStore.ts";
import {  useState } from "react";

export interface SupermarketRouteProps {
  routeSegments: NearbySupermarketsResponse["routeResult"] | null;
}


export function useSupermarketRoute() {
 
  //Store Location user
  const locationUser = useLocationStore((state) => state.locationUser);
  const setLocationUser = useLocationStore((state) => state.setLocationUser);

  //Store Supermarkets Cart
  const loadingSupermarkets = useSupermarketStore((state) => state.loadingSupermarkets,);
  const errorSupermarkets = useSupermarketStore((state) => state.errorSupermarkets,);

  const [locationModalOpened, setLocationModalOpened] = useState(false);

  const handleConfirmLocation = (location: SelectedLocation) => {
    setLocationUser(location);
    setLocationModalOpened(false);
  };
 
  return {
    loadingSupermarkets,
    errorSupermarkets,
    locationModalOpened,
    locationLabel: locationUser?.address ?? "Sin configurar",
    formatDistance: (distanceKm: number) => `${distanceKm.toLocaleString("es-CL", { maximumFractionDigits: 2 })} km`,
    openLocationModal: () => setLocationModalOpened(true),
    closeLocationModal: () => setLocationModalOpened(false),
    handleConfirmLocation,
    locationUser,
  };
}
