export interface RouteLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isHome: boolean;
}

export interface RouteSegment {
  from: RouteLocation;
  to: RouteLocation;
  distanceKm: number;
}
