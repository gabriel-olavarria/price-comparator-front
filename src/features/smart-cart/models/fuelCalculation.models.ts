//REQUEST
export interface FuelCalculationRequest {
  rendimientoMixto: number;
  userLocation: UserLocationRequest;
  tramo: Route;
}
export interface UserLocationRequest {
  latitud: number;
  longitud: number;
  region: string;
  comuna: string;
}

export interface Route {
  TotalDistanceKm: number;
  segments: RouteSegment[];
}

export interface RouteSegment {
  from: string;
  to: string;
  distanceKm: number;
}

export interface FuelCalulateResponse {
  station: CneFuelStation;
  totalDistanceRouteKm: number;
  consumptionValue: number;
  consumptionUnit: string;
}

export interface CneFuelStation {
  codigo: string | null;
  distribuidor: StationDistributor | null;
  distanceToUserKm: number;
  ubicacion: StationLocation | null;
  combustibles: Record<string, StationFuelPrice>;
}

export interface StationDistributor {
  marca: string | null;
  logo: string | null;
}

export interface StationLocation {
  nombreRegion: string | null;
  nombreComuna: string | null;
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface StationFuelPrice {
  combustible: string | null;
  precioLitro: number | null;
  precioDistancia: number | null;
  fechaActualizacion: string | null;
}