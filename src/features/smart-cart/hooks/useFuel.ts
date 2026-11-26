import { useCallback} from "react";
import { calculate } from "../services/fuel.service";
import { toFuelCalculationRequest } from "../mappers/fuelCalculation.mapper";
import { useFuelCalculationStore } from "../stores/fuelCalculationStore";
import type {
  NearbySupermarketsResponse,
} from "../models/supermarketLocation.models";
import type { SelectedLocation } from "../models/location.models.ts";
import type { VehicleConfiguration } from "../models/vehicle.models.ts";

interface LoadParams {
  currentLocation: SelectedLocation;
  currentVehicle: VehicleConfiguration;
  routeSegments: NearbySupermarketsResponse["routeResult"];
}
 

export function useFuel() {

  const fuelCalculate = useFuelCalculationStore((state) => state.data);
  const loadingCalculate = useFuelCalculationStore((state) => state.loading);
  const errorCalculate = useFuelCalculationStore((state) => state.error);
  const setFuelCalculate = useFuelCalculationStore((state) => state.setData);
  const setLoadingFuel = useFuelCalculationStore((state) => state.setLoading);
  const setErrorFuel = useFuelCalculationStore((state) => state.setError);

  const load = useCallback(
    async (
      { currentLocation, routeSegments, currentVehicle }: LoadParams,
      signal: AbortSignal,
    ): Promise<void> => {
      setLoadingFuel(true);
      const request = toFuelCalculationRequest({
        currentLocation,
        routeSegments,
        currentVehicle,
      });

      try {
        console.log("reques useFuel",request);
        const response = await calculate(request, signal);
        console.log("response useFuel", response);

        if (!signal.aborted) {
          setFuelCalculate(response);
        }
      } catch (error) {
        if (!signal.aborted) {
          setErrorFuel(
            error instanceof Error
              ? error.message
              : "Error al calcular combustible",
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoadingFuel(false);
        }
      }
    },
    [setFuelCalculate, setLoadingFuel, setErrorFuel],
  );

  return {
    load,
    fuelCalculate,
    loadingCalculate,
    errorCalculate,
  };
}
