import { useCallback, useEffect, useRef, useState } from "react";

import { useFuel } from "../../hooks/useFuel.ts";

import type { SelectedLocation } from "../../models/location.models";

import type {
  CneFuelStation,
  StationFuelPrice,
} from "../../models/fuelCalculation.models";

import { useVehicleStore } from "../../stores/vehicleStore.ts";
import { useLocationStore } from "../../stores/locationStore.ts";
import { useSupermarketStore } from "../../stores/supermarketsStore.ts";
import { useFuelCalculationStore } from "../../stores/fuelCalculationStore.ts";

function resolveSelectedFuel(
  combustibles: Record<string, StationFuelPrice> | undefined,
  selectedFuelKey: string | null,
): StationFuelPrice | null {
  if (!combustibles) {
    return null;
  }

  if (selectedFuelKey) {
    const selected = Object.values(combustibles).find(
      (fuel) => fuel.combustible === selectedFuelKey,
    );

    if (selected) {
      return selected;
    }
  }

  return combustibles["95"] ?? Object.values(combustibles)[0] ?? null;
}

export function useFuelCalculate() {
  const routeSegments = useSupermarketStore(
    (state) => state.supermarketsSegments,
  );

  // Ubicación seleccionada
  const locationUser = useLocationStore((state) => state.locationUser);

  // Clave del combustible elegido. El objeto se deriva de la estación actual.
  const [selectedFuelKey, setSelectedFuelKey] = useState<string | null>(null);

  // Auto seleccionado
  const vehicleUser = useVehicleStore((state) => state.vehicleUser);

  // Estado de carga de supermercados
  const loadingSupermarkets = useSupermarketStore(
    (state) => state.loadingSupermarkets,
  );

  // Modales
  const [locationModalOpened, setLocationModalOpened] = useState(false);
  const [vehicleModalOpened, setVehicleModalOpened] = useState(false);

  // Cálculo de combustible
  const { load, fuelCalculate, loadingCalculate, errorCalculate } = useFuel();

  // Controlador de peticiones
  const controllerRef = useRef<AbortController | null>(null);

  const executeLoad = useCallback(() => {
      controllerRef.current?.abort();
      controllerRef.current = null;

      const currentLocation = useLocationStore.getState().locationUser;

      const currentVehicle = useVehicleStore.getState().vehicleUser;

      const {
        supermarketsSegments: currentSegments,
        loadingSupermarkets,
        errorSupermarkets,
      } = useSupermarketStore.getState();

      const efficiency = currentVehicle?.efficiency;
      const hasUsableEfficiency =
        typeof efficiency === "number" &&
        Number.isFinite(efficiency) &&
        efficiency > 0;

      if (currentVehicle && !hasUsableEfficiency) {
        useFuelCalculationStore.getState().clear();
        return;
      }

      if (
        !currentLocation ||
        !currentVehicle ||
        !currentSegments ||
        loadingSupermarkets ||
        errorSupermarkets
      ) {
        useFuelCalculationStore.getState().setLoading(false);
        return;
      }

      const controller = new AbortController();

      controllerRef.current = controller;

      void load(
        {
          currentLocation,
          currentVehicle,
          routeSegments: currentSegments,
        },
        controller.signal,
      );
    },
    [load],
  );

  // Suscripción a cambios de rendimiento del vehículo
  useEffect(() => {
    return useVehicleStore.subscribe(
      (state) => state.vehicleUser?.efficiency,
      () => {
        executeLoad();
      },
      {
        fireImmediately: false,
      },
    );
  }, [executeLoad]);
  
  // Suscripción a cambios de segmentos del recorrido
  useEffect(() => {
    const unsubscribeSegments = useSupermarketStore.subscribe(
      (state) => ({
        segments: state.supermarketsSegments,
        loading: state.loadingSupermarkets,
        error: state.errorSupermarkets,
      }),
      (current, previous) => {
        if (current.loading || !current.segments || current.error) {
          controllerRef.current?.abort();
          controllerRef.current = null;
          useFuelCalculationStore.getState().setLoading(false);
          return;
        }

        if (current.segments !== previous.segments) {
          executeLoad();
        }
      },
      {
        fireImmediately: false,
        equalityFn: (a, b) =>
          a.segments === b.segments &&
          a.loading === b.loading &&
          a.error === b.error,
      },
    );

    return () => {
      unsubscribeSegments();
      controllerRef.current?.abort();
      controllerRef.current = null;
      useFuelCalculationStore.getState().setLoading(false);
    };
  }, [executeLoad]);

  // Información de la estación
  const station: CneFuelStation | null = fuelCalculate?.station ?? null;

  const fuels = Object.entries(station?.combustibles ?? {});
  const selectedFuelType = resolveSelectedFuel(
    station?.combustibles,
    selectedFuelKey,
  );

  const setSelectedFuelType = (fuel: StationFuelPrice) => {
    if (fuel.combustible == null) {
      return;
    }

    setSelectedFuelKey(fuel.combustible);
  };

  // Métricas del recorrido
  const distanceKm = routeSegments?.totalDistanceKm ?? null;
  const fuelEfficiency = vehicleUser?.efficiency ?? null;
  const consumption =
    fuelCalculate?.consumptionValue != null &&
    fuelCalculate?.consumptionUnit != null
      ? `${fuelCalculate.consumptionValue.toLocaleString("es-CL", { maximumFractionDigits: 2 })} ${fuelCalculate.consumptionUnit}`
      : "Pendiente";

  // Ubicación de la estación
  const stationLocation: SelectedLocation = {
    latitude: Number(station?.ubicacion?.latitud ?? 0),
    longitude: Number(station?.ubicacion?.longitud ?? 0),
    address: station?.ubicacion?.direccion ?? "",
    city: station?.ubicacion?.nombreComuna ?? "",
    state: station?.ubicacion?.nombreRegion ?? "",
  };

  const stationName = station?.distribuidor?.marca ?? "Sin estación disponible";
  const stationAddress = stationLocation.address;
  const stationDistance =
    typeof station?.distanceToUserKm === "number" &&
    Number.isFinite(station.distanceToUserKm)
      ? station.distanceToUserKm
      : null;

  // URL de OpenStreetMap
  const stationLatitude = station?.ubicacion?.latitud ?? null;
  const stationLongitude = station?.ubicacion?.longitud ?? null;
  const stationUrl =
    stationLatitude !== null &&
    stationLongitude !== null &&
    Number.isFinite(stationLatitude) &&
    Number.isFinite(stationLongitude)
      ? `https://www.openstreetmap.org/?mlat=${stationLatitude}&mlon=${stationLongitude}#map=17/${stationLatitude}/${stationLongitude}`
      : null;

  // Modal de ubicación
  const handleOpenFuelLocationModal = () => {
    setLocationModalOpened(true);
  };

  const handleCloseFuelLocationModal = () => {
    setLocationModalOpened(false);
  };

  const handleConfirmFuelLocation = () => {
    setLocationModalOpened(false);
  };

  // Modal de vehículo
  const handleOpenVehicleModal = () => {
    setVehicleModalOpened(true);
  };

  const handleCloseVehicleModal = () => {
    setVehicleModalOpened(false);
  };

  const handleConfirmVehicle = () => {
    handleCloseVehicleModal();
  };

  return {
    locationUser,
    fuelCalculate,

    // Combustible
    selectedFuelType,
    setSelectedFuelType,

    // Vehículo
    vehicleUser,

    // Modal de ubicación
    locationModalOpened,
    handleOpenFuelLocationModal,
    handleCloseFuelLocationModal,
    handleConfirmFuelLocation,

    // Modal de vehículo
    vehicleModalOpened,
    handleOpenVehicleModal,
    handleCloseVehicleModal,
    handleConfirmVehicle,

    // Estados de API
    loadingCalculate: loadingCalculate || loadingSupermarkets,

    errorCalculate,

    // Métricas
    distanceKm,
    fuelEfficiency,

    // Estación de servicio
    stationName,
    stationAddress,
    stationDistance,
    stationUrl,
    stationLocation,
    fuels,
    consumption,
  };
}
