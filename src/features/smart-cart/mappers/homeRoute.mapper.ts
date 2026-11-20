import type { SelectedLocation,  } from "../models/location.models.ts";
import type { RouteLocation } from "../models/route.models.ts";
 
export function mapHomeToRouteLocation(
  location: SelectedLocation,
): RouteLocation {
  return {
    id: "home",
    name: "Tu casa",
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    isHome: true,
  };
}
