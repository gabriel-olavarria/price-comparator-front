import { httpClient } from "../../../shared/api/axios";

import type {
  NearbySupermarkets,
  NearbySupermarketsRequest,
} from "../models/supermarketLocation.models";

export async function fetchNearbySupermarkets(
  request: NearbySupermarketsRequest,
  signal?: AbortSignal,
): Promise<NearbySupermarkets> {
  const response = await httpClient.post<NearbySupermarkets>(
    "/api/supermarkets/nearby",
    {
      latitude: request.origin.latitude,
      longitude: request.origin.longitude,
      storeKeys: request.storeKeys,
    },
    {
      signal,
    },
  );

  return response.data;
}
