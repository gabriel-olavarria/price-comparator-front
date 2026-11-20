import type { SelectedLocation } from "../models/location.models";
import type { NearbySupermarkets } from "../models/supermarketLocation.models";
import type {
  FuelCalculationRequest,
  FuelType,
} from "../models/fuelCalculation.models";
import type { VehicleConfiguration } from "../models/vehicle.models.ts";

type FuelCalculationMapperParams = {
  selectedLocationMap: SelectedLocation;
  selectedFuelType: FuelType;
  nearestByStore: NearbySupermarkets["nearestByStore"];
  selectedVehicle: VehicleConfiguration;
};
 

export function toFuelCalculationRequest({
  selectedLocationMap,
  selectedFuelType,
  nearestByStore,
  selectedVehicle
}: FuelCalculationMapperParams): FuelCalculationRequest {
  console.log(selectedLocationMap);
 
  
  return {
    direccion: selectedLocationMap.address,
    latitud: selectedLocationMap.latitude,
    longitud: selectedLocationMap.longitude,
    region: selectedLocationMap.state,
    comuna: selectedLocationMap.city,
    tipoCombustible: selectedFuelType,
    rendimientoMixto: selectedVehicle.efficiency!,
    supermercados: nearestByStore.map((store) => ({
      name: store.name,
      geometry: store.geometry,
    })),
  };
}
