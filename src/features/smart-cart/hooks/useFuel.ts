import { useCallback } from "react";
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

let fuelRequestId = 0;
 

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
      const requestId = ++fuelRequestId;

      setLoadingFuel(true);
      const request = toFuelCalculationRequest({
        currentLocation,
        routeSegments,
        currentVehicle,
      });

      try {
        const response = await calculate(request, signal);

        if (signal.aborted || requestId !== fuelRequestId) {
          return;
        }

        setFuelCalculate(response);
      } catch (error) {
        if (signal.aborted || requestId !== fuelRequestId) {
          return;
        }

        setErrorFuel(
          error instanceof Error
            ? error.message
            : "Error al calcular combustible",
        );
      } finally {
        if (requestId === fuelRequestId) {
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
