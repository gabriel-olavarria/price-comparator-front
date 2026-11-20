import type { AddressResult,  Coordinates } from "../models/location.models.ts";

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  residential?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
  city?: string;
  state?: string;
}

interface NominatimReverseResult {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimAddress;
  error?: string;
}

export interface ReverseGeocodeResult {
  address: string;
  city: string;
  state: string;
}

const BASE_URL = "https://nominatim.openstreetmap.org";

const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Accept-Language": "es",
};

/**
 * Valida que las coordenadas sean correctas.
 */
function validateCoordinates(coordinates: Coordinates): void {
  const { latitude, longitude } = coordinates;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Las coordenadas proporcionadas no son válidas.");
  }
}

/**
 * Construye una dirección legible utilizando
 * los datos estructurados de OpenStreetMap.
 */
function formatAddress(address?: NominatimAddress, fallback?: string): string {
  if (!address) {
    return fallback ?? "Dirección no disponible";
  }

  const street = address.road ?? address.pedestrian ?? address.residential;

  const streetAddress = street
    ? address.house_number
      ? `${street} ${address.house_number}`
      : street
    : undefined;

  const neighbourhood = address.neighbourhood ?? address.suburb;

  const city =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county;

  const parts = [
    streetAddress,
    neighbourhood,
    city,
    address.state,
    address.country,
  ].filter((value): value is string => Boolean(value?.trim()));

  // Evita repetir componentes idénticos.
  const uniqueParts = parts.filter(
    (value, index) =>
      parts.findIndex(
        (item) =>
          item.toLocaleLowerCase("es") === value.toLocaleLowerCase("es"),
      ) === index,
  );

  return uniqueParts.join(", ") || fallback || "Dirección no disponible";
}

/**
 * Maneja los errores HTTP de Nominatim.
 */
function validateResponse(response: Response, operation: string): void {
  if (response.ok) return;

  if (response.status === 429) {
    throw new Error(
      "Se alcanzó el límite de consultas. Intenta nuevamente más tarde.",
    );
  }

  if (response.status === 403) {
    throw new Error("El servicio de ubicaciones rechazó la solicitud.");
  }

  if (response.status >= 500) {
    throw new Error(
      "El servicio de OpenStreetMap no está disponible temporalmente.",
    );
  }

  throw new Error(
    `No fue posible ${operation}. Código HTTP: ${response.status}`,
  );
}


export async function searchAddresses(query: string, signal?: AbortSignal,): Promise<AddressResult[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 3) {
    throw new Error("Debes ingresar al menos 3 caracteres para buscar.");
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "cl",
    "accept-language": "es",
  });

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`, {
    method: "GET",
    signal,
    headers: DEFAULT_HEADERS,
  });

  validateResponse(response, "buscar direcciones");

  const data: NominatimResult[] = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("El servicio devolvió una respuesta inesperada.");
  }
 
  return data
    .map((item): AddressResult => ({
      id: String(item.place_id),
      displayName: formatAddress(item.address, item.display_name),
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      city: item.city ?? "",
      state: item.state ?? ""
    }))
    .filter(
      (item) =>
        Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
    );
}

/**
 * Convierte coordenadas GPS en una dirección.
 *
 * Se utiliza cuando:
 * - El usuario autoriza su ubicación.
 * - Presiona "Mi ubicación".
 * - Selecciona un punto del mapa.
 * - Arrastra el marcador.
 *
 * Retorna una dirección legible para mostrar
 * en el input de búsqueda y en el resumen.
 */
export async function reverseGeocode(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  validateCoordinates(coordinates);

  const params = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
    format: "jsonv2",
    addressdetails: "1",
    zoom: "18",
    "accept-language": "es",
  });

  const response = await fetch(`${BASE_URL}/reverse?${params.toString()}`, {
    method: "GET",
    signal,
    headers: DEFAULT_HEADERS,
  });

  validateResponse(response, "obtener la dirección");

  const data: NominatimReverseResult = await response.json();

  const city = data.address?.city?.trim();
  const state = data.address?.state?.trim();
  
  if (data.error) {
    throw new Error(`No se encontró una dirección: ${data.error}`);
  }

  if (!data.display_name && !data.address) {
    throw new Error(
      "No se encontró una dirección para las coordenadas seleccionadas.",
    );
  }

  if (!city || !state) {
    throw new Error(
      "No se encontró Ciudad ni Comuna para las coordenadas seleccionadas.",
    );
  }
  
  return {
    address: formatAddress(data.address, data.display_name),
    city,
    state
  };
}
