import type { Coordinates } from "../../features/smart-cart/models/location.models.ts";

export function isValidCoordinates(latitude: number, longitude: number,): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function isValidRadius(radiusMeters: number): boolean {
  return (
    Number.isInteger(radiusMeters) &&
    radiusMeters >= 100 &&
    radiusMeters <= 30000
  );
}

export function validateGeoSearch(origin: Coordinates, radiusMeters: number,): void {
  if (!isValidCoordinates(origin.latitude, origin.longitude)) {
    throw new Error("Las coordenadas no son válidas.");
  }

  if (!isValidRadius(radiusMeters)) {
    throw new Error(
      "El radio de búsqueda debe estar entre 100 y 30000 metros.",
    );
  }
}
