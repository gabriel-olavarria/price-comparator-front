import type { Coordinates } from "./location.models.ts";

export interface NearbySupermarketsRequest {
  origin: Coordinates;
  storeKeys: string[];
}

export interface NearbySupermarketsResponse {
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