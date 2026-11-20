import type { NearbySupermarkets } from "../models/supermarketLocation.models.ts";
import type { RouteLocation } from "../models/route.models.ts";



export function mapSupermarketToRouteLocation(
  store: NearbySupermarkets["nearestByStore"][number],
  index: number,
): RouteLocation {
  const [longitude, latitude] = store.geometry.coordinates;

  return {
    id: `${store.name}-${index}`,
    name: store.name,
    address: store.formatted ?? store.name,
    latitude,
    longitude,
    isHome: false,
  };
}
