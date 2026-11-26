export interface AddressSuggestion {
  matchId: string | null;
  formatted: string;
  shortLabel: string;
  street: string | null;
  streetType: string | null;
  houseNumber: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  postalCode: string | null;
  addressType: string;
  score: number;
  latitude: number;
  longitude: number;
}
