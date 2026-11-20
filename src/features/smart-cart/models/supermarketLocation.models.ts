import type { Coordinates } from "./location.models.ts";

export interface SupermarketLocation {
  id: string;
  name: string;
  brand: string | null;
  operator: string | null;
  formatted: string;
  street: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  categories: string[];
  distance: number;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface NearbySupermarkets {
  nearestByStore: SupermarketLocation[];
}

export interface NearbySupermarketsRequest {
  origin: Coordinates;
  storeKeys: string[];
}