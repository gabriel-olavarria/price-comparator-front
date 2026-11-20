export interface ConsumoVehicularResponse {
  brands: VehicleBrand[];
  labels: VehicleLabel[];
  models: VehicleModel[];
}

export interface VehicleBrand {
  id: number;
  nombre: string | null;
}

export interface VehicleLabel {
  id: string | null;
  nombre: string | null;
}

export interface VehicleModel {
  id: number;
  nombre: string | null;
  marcaId: number;
}
