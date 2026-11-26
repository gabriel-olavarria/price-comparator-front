import { httpClient } from "../../../shared/api/axios";

import type {
  FuelCalculationRequest,
  FuelCalulateResponse,
} from "../models/fuelCalculation.models";
import type { ConsumoVehicularResponse } from "../models/vehicleCatalog.models.ts";
import type {
  UserVehicleRequest,
  VehicleResponseDto,
} from "../models/vehicle.models.ts";

export async function calculate(
  request: FuelCalculationRequest,
  signal?: AbortSignal,
): Promise<FuelCalulateResponse> {
  const response = await httpClient.post<FuelCalulateResponse>(
    "/api/fuels/calculate",
    request,
    {
      signal,
    },
  );

  return response.data;
}

export async function getVehicleCatalog(
  signal?: AbortSignal,
): Promise<ConsumoVehicularResponse> {
  const response = await httpClient.get<ConsumoVehicularResponse>(
    "/api/fuels/catalog",
    {
      signal,
    },
  );

  return response.data;
}

export async function getVehicleConsumption(
  request: UserVehicleRequest,
  signal?: AbortSignal,
): Promise<VehicleResponseDto> {
  const response = await httpClient.get<VehicleResponseDto>(
    "/api/fuels/characteristics",
    {
      params: request,
      signal,
    },
  );

  return response.data;
}