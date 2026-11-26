import { httpClient } from "../../../shared/api/axios";

import type {
  NearbySupermarketsRequest,
  NearbySupermarketsResponse,
} from "../models/supermarketLocation.models";

export async function fetchNearbySupermarkets(
  request: NearbySupermarketsRequest,
  signal?: AbortSignal,
): Promise<NearbySupermarketsResponse> {
  const response = await httpClient.post<NearbySupermarketsResponse>(
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
