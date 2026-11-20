import type { SelectedLocation } from "./location.models.ts";
import type { NearbySupermarkets } from "./supermarketLocation.models.ts";


export type FuelType = "93" | "95" | "97" | "diesel";

 
export interface FuelCalculationSupermarket {
  name: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface FuelCalculationRequest {
  direccion: string;
  latitud: number;
  longitud: number;
  region: string;
  comuna: string;
  tipoCombustible: FuelType;
  rendimientoMixto: number;
  supermercados: FuelCalculationSupermarket[];
}

export interface StationFuelPrice {
  precio: string;
  fecha_actualizacion: string;
}

export interface FuelStation {
  codigo: string;
  en_mantenimiento: number;
  distribuidor: {
    marca: string;
    logo: string;
  };
  ubicacion: {
    nombre_region: string;
    nombre_comuna: string;
    direccion: string;
    latitud: string;
    longitud: string;
  };
  precios: Partial<Record<"93" | "95" | "97" | "DI", StationFuelPrice>>;
}

export interface FuelPriceDetail {
  precio: number;
  fechaActualizacion: string;
}

export interface NearestFuelStation {
  station: FuelStation;
  distanceKm: number;
  precios: {
    gasolina93?: FuelPriceDetail;
    gasolina95?: FuelPriceDetail;
    gasolina97?: FuelPriceDetail;
    diesel?: FuelPriceDetail;
  };
}

export interface FuelRouteSegment {
  from: string;
  to: string;
  distanceKm: number;
}

export interface FuelCalculationResponse {
  estacionCercana: NearestFuelStation | null;

  recorrido: {
    totalDistanceKm: number;
    segments: FuelRouteSegment[];
  };

  gastoEstimado: {
    distanceKm: number;
    fuelEfficiencyKmPerLiter: number;
    fuelPrice: number;
    estimatedLiters: number;
    estimatedCost: number;
  };
}
export interface FuelCalculateProps {
  nearestByStore: NearbySupermarkets["nearestByStore"];
  selectedLocationMap: SelectedLocation | null;
}
