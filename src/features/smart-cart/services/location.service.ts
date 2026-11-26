import axios from "axios";
import type { AddressSuggestion } from "../models/addressSuggestion.models.ts";

export const searchAddresses = async (
  address: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> => {
 
  const { data } = await axios.get(
    "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
    {
      params: {
        SingleLine: address,
        f: "pjson",
        outSR: 4326,
        outFields: "*",
        countryCode: "CL",
      },
      signal,
    },
  );

  if (data.error) {
    throw new Error(data.error.message);
  }
 
  return data.candidates.map(
    ({
      attributes,
      score,
    }: {
      attributes: Record<string, any>;
      score: number;
    }): AddressSuggestion => ({
      matchId: attributes.MatchID || null,
      formatted: attributes.Match_addr,
      shortLabel: attributes.ShortLabel,
      street: attributes.StName || null,
      streetType: attributes.StPreType || null,
      houseNumber: attributes.AddNum || null,
      city: attributes.City || null,
      region: attributes.Region || null,
      country: attributes.CntryName || null,
      postalCode: attributes.Postal || null,
      addressType: attributes.Addr_type,
      score,
      latitude: attributes.Y,
      longitude: attributes.X,
    }),
  );
};
