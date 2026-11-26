import type { Coordinates } from "./location.models.ts";

export interface NearbySupermarketsRequest {
  origin: Coordinates;
  storeKeys: string[];
}

export interface NearbySupermarketsResponse {
  nearestByStore: NearbySupermarketsResult[];
  routeResult: RouteResult;
}


export interface RouteSegment {
  from: string;
  to: string;
  distanceKm: number;
}

export interface RouteResult {
  totalDistanceKm: number;
  segments: RouteSegment[];
}

export interface NearbySupermarketsResult {
    id: string | null;
    name: string | null;
    brand: string | null;
    operator: string | null;
    formatted: string | null;
    street: string | null;
    city: string | null;
    country: string | null;
    countryCode: string | null;
    categories: string[];
    distance: number | null;
    geometry: GeometryDto | null;
}
export interface GeometryDto {
    type: string | null;
    coordinates: number[];
}