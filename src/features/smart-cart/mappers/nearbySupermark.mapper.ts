import type {
  NearbySupermarketsRequest,
} from "../models/supermarketLocation.models";

export interface NearbySupermarketsMapperParams {
  latitude: number;
  longitude: number;
  storeKeys: string[];
}

export function toNearbySupermarketsRequest({
  latitude,
  longitude,
  storeKeys,
}: NearbySupermarketsMapperParams): NearbySupermarketsRequest  {

  return {
    origin: {
      latitude,
      longitude,
    },
    storeKeys,
  };
}
