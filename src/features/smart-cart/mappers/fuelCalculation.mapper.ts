
import type {
  FuelCalculationRequest,
} from "../models/fuelCalculation.models";
import type { SelectedLocation } from "../models/location.models.ts";
import type { VehicleConfiguration } from "../models/vehicle.models.ts";
import type { NearbySupermarketsResponse } from "../models/supermarketLocation.models.ts";
 
 


type FuelCalculationMapperParams = {
  currentLocation: SelectedLocation;
  routeSegments: NearbySupermarketsResponse["routeResult"];
  currentVehicle: VehicleConfiguration;
};
 

export function toFuelCalculationRequest({
  currentLocation,
  routeSegments,
  currentVehicle,
}: FuelCalculationMapperParams): FuelCalculationRequest {
  return {
    userLocation: {
      region: currentLocation.state,
      comuna: currentLocation.city,
      longitud: currentLocation.longitude,
      latitud: currentLocation.latitude,
    },
    rendimientoMixto: currentVehicle.efficiency!,
    tramo: {
      TotalDistanceKm: routeSegments.totalDistanceKm,
      segments: routeSegments.segments,
    },
  };
}
