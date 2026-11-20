import { useEffect, useState } from "react";

import type { SelectedLocation } from "../models/location.models.ts";
import type { NearbySupermarkets } from "../models/supermarketLocation.models";
import type { RouteLocation, RouteSegment } from "../models/route.models";

import { mapHomeToRouteLocation } from "../mappers/homeRoute.mapper";
import { mapSupermarketToRouteLocation } from "../mappers/supermarketRoute.mapper";

interface UseRoutesProps {
  selectedLocation: SelectedLocation | null;
  nearestByStore: NearbySupermarkets["nearestByStore"];
}

export function useRoutes({ selectedLocation, nearestByStore, }: UseRoutesProps) {
  const [route, setRoute] = useState<RouteSegment[]>([]);

  /**
   * Calcula la distancia entre dos coordenadas
   * utilizando la fórmula de Haversine.
   */
  const distanceBetween = (a: RouteLocation, b: RouteLocation): number => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const dLat = toRadians(b.latitude - a.latitude);
    const dLon = toRadians(b.longitude - a.longitude);

    const lat1 = toRadians(a.latitude);
    const lat2 = toRadians(b.latitude);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };

  /**
   * Construye los segmentos del recorrido.
   */
  const buildRouteSegments = (home: RouteLocation, stores: RouteLocation[],): RouteSegment[] => {
    if (stores.length === 0) return [];

    const points: RouteLocation[] = [home, ...stores, home];

    return points.slice(1).map((to, index) => {
      const from = points[index];

      return {
        from,
        to,
        distanceKm: distanceBetween(from, to),
      };
    });
  };

  /**
   * Transforma las ubicaciones y construye
   * el recorrido completo.
   */
  const createSupermarketRoute = (location: SelectedLocation | null, supermarkets: NearbySupermarkets["nearestByStore"],): RouteSegment[] => {
    if (!location || supermarkets.length === 0) {
      return [];
    }

    const home = mapHomeToRouteLocation(location);

    const stores = supermarkets
      .filter((store) => {
        const [longitude, latitude] = store.geometry.coordinates;

        return Number.isFinite(latitude) && Number.isFinite(longitude);
      })
      .map(mapSupermarketToRouteLocation);

    return buildRouteSegments(home, stores);
  };

  /**
   * Actualiza la ruta cuando cambian
   * la ubicación o los supermercados.
   */
  useEffect(() => {
    const segments = createSupermarketRoute(selectedLocation, nearestByStore);

    setRoute(segments);
  }, [selectedLocation, nearestByStore]);

  return {
    route,
  };
}
