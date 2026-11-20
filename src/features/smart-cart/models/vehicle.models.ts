export type VehicleType = "car" | "motorcycle" | "truck" | "walking";

export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric";

export interface VehicleConfiguration {
  vehicleType: VehicleType;
  brandId: number | null;
  modelId: number | null;
  labelId: string | null;
  fuelType: FuelType | null;
  efficiency: number | null;
}

export interface VehiclePickerModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm?: (vehicle: VehicleConfiguration) => void;
  
}


export interface UserVehicleRequest {
  marcaId: number;
  modeloId: number;
  etiquetaId: string;
}


export interface VehicleResponseDto {
  id: number;
  nombre: string | null;
  marcaId: number;
  nombreMarca: string | null;
  modeloId: number;
  nombreModelo: string | null;
  detalle: string | null;
  traccion: string | null;
  transmision: string | null;
  combustible: string | null;
  propulsion: string | null;
  cilindrada: number | null;
  tipoVehiculo: string | null;
  codigoInformeTecnico: string | null;
  fechaHomologacion: string | null;
  categoria: string | null;
  empresaHomologa: string | null;
  norma: string | null;
  co2: number | null;
  rendimientoUrbano: number | null;
  rendimientoCarretera: number | null;
  rendimientoMixto: number | null;
  rendimientoElectrico: number | null;
  rendimientoPonderadoCombustible: number | null;
  rendimientoPonderadoElectrico: number | null;
  co2Combinado: number | null;
  rendimientoUrbanoSinAutoPista: number | null;
  rendimientoUrbanoConAutoPistaUrbana: number | null;
  rendimientoRuralConAutopista: number | null;
  rendimientoAutopistaInterUrbana: number | null;
  combinado: number | null;
  wltpRendimientoElectricoPuro: number | null;
  rendimientoCombinadoCombustible: number | null;
  rendimientoCombinadoElectrico: number | null;
  tipoConectorAc: string | null;
  tipoConectorDc: string | null;
  capacidadAcumulacionEnergia: number | null;
  capacidadConvertidor: number | null;
  fechaModificacion: string | null;
  etiquetaId: string | null;
}
