import { useCallback, useRef, useState } from "react";

import { getVehicleConsumption } from "../services/fuel.service.ts";

import type {
  UserVehicleRequest,
  VehicleResponseDto,
} from "../models/vehicle.models.ts";
export function useVehicleCharacteristics() {
  const [vehicle, setVehicle] = useState<VehicleResponseDto | null>(null);
  const [loadingVehicle, setLoading] = useState(false);
  const [errorVehicle, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const loadVehicle = useCallback(
    async (request: UserVehicleRequest): Promise<VehicleResponseDto | null> => {
      // Cancelar una consulta anterior si existe.
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      setVehicle(null);

      try {
        const response = await getVehicleConsumption(
          request,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return null;
        }

        setVehicle(response);

        return response;
      } catch (error) {
        if (controller.signal.aborted) {
          return null;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Error al obtener las características del vehículo.",
        );

        return null;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }

        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    },
    [],
  );

  const resetVehicle = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;

    setVehicle(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    loadVehicle,
    vehicle,
    loadingVehicle,
    errorVehicle,
    resetVehicle,
  };
}
