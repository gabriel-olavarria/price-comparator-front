import { useCallback} from "react";
import { calculate } from "../services/fuel.service";
import { toFuelCalculationRequest } from "../mappers/fuelCalculation.mapper";
import { useFuelCalculationStore } from "../stores/fuelCalculationStore";

import type { SelectedLocation } from "../models/location.models";
import type { NearbySupermarkets } from "../models/supermarketLocation.models";
import type {
  FuelType,
} from "../models/fuelCalculation.models";
import { useLocationStore } from "../stores/locationStore.ts";
import type { VehicleConfiguration, } from "../models/vehicle.models.ts";
import { useVehicleCatalogStore } from "../stores/useVehicleStore.ts";

interface LoadParams {
  selectedLocationMap: SelectedLocation;
  selectedFuelType: FuelType;
  nearestByStore: NearbySupermarkets["nearestByStore"];
  selectedVehicle: VehicleConfiguration;
}
 

export function useFuel() {
  const data = useFuelCalculationStore((state) => state.data);
  const loadingCalculate = useFuelCalculationStore((state) => state.loading);
  const errorCalculate = useFuelCalculationStore((state) => state.error);
  const setData = useFuelCalculationStore((state) => state.setData);
  const setLoading = useFuelCalculationStore((state) => state.setLoading);
  const setError = useFuelCalculationStore((state) => state.setError);
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);
  const setSelectedVehicle = useVehicleCatalogStore((state) => state.setSelectedVehicle);

  
  const load = useCallback(
    async (
      {
        selectedLocationMap,
        selectedFuelType,
        nearestByStore,
        selectedVehicle,
      }: LoadParams,
      signal: AbortSignal,
    ): Promise<void> => {
      const request = toFuelCalculationRequest({
        selectedLocationMap,
        selectedFuelType,
        nearestByStore,
        selectedVehicle,
      });
      const requestKey = JSON.stringify(request);

      setLoading(true);
      setError(null);

      try {
        const response = await calculate(request, signal);
        console.log(response);
        if (!signal.aborted) {
          setData(response, requestKey!);
          setSelectedLocation(selectedLocationMap);
          setSelectedVehicle(selectedVehicle);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al calcular combustible",
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [setData, setLoading, setError],
  );

 

  return {
    load,
    data,
    loadingCalculate,
    errorCalculate,
  };
}
