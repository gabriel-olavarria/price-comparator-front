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

export function useFuelCalculate() {
  const routeSegments = useSupermarketStore(
    (state) => state.supermarketsSegments,
  );

  // Ubicación seleccionada
  const locationUser = useLocationStore((state) => state.locationUser);

  // Combustible seleccionado
  const [selectedFuelType, setSelectedFuelType] =
    useState<StationFuelPrice | null>(null);

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

  type FuelCalculationTrigger = "vehicle" | "segments";

  // Ejecutar cálculo de combustible
  const executeLoad = useCallback(
    (trigger: FuelCalculationTrigger) => {
      console.log("Origen del cálculo:", trigger);

      controllerRef.current?.abort();

      const currentLocation = useLocationStore.getState().locationUser;

      const currentVehicle = useVehicleStore.getState().vehicleUser;

      const {
        supermarketsSegments: currentSegments,
        loadingSupermarkets,
        errorSupermarkets,
      } = useSupermarketStore.getState();

      if (
        !currentLocation ||
        !currentVehicle ||
        !currentSegments ||
        loadingSupermarkets ||
        errorSupermarkets ||
        typeof currentVehicle.efficiency !== "number" ||
        !Number.isFinite(currentVehicle.efficiency) ||
        currentVehicle.efficiency <= 0
      ) {
        return;
      }

      const controller = new AbortController();

      controllerRef.current = controller;

      console.log("Calculando combustible:", {
        trigger,
        location: currentLocation,
        vehicle: currentVehicle,
        segments: currentSegments,
        totalDistanceKm: currentSegments.totalDistanceKm,
      });

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
      (current, previous) => {
        console.log("Nuevo rendimiento:", current);
        console.log("Anterior rendimiento:", previous);

        executeLoad("vehicle");
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
          return;
        }

        const segmentsChanged = current.segments !== previous.segments;

        const loadingFinished = previous.loading && !current.loading;

        const errorRecovered = !!previous.error && !current.error;

        if (segmentsChanged || loadingFinished || errorRecovered) {
          executeLoad("segments");
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
    };
  }, [executeLoad]);

  // Información de la estación
  const station: CneFuelStation | null = fuelCalculate?.station ?? null;

  const fuels = Object.entries(station?.combustibles ?? {});

  // Seleccionar combustible por defecto y actualizar sus valores
  useEffect(() => {
    const combustibles = station?.combustibles;

    if (!combustibles) {
      setSelectedFuelType(null);
      return;
    }

    setSelectedFuelType((previous) => {
      // Mantener el combustible seleccionado con los precios actualizados
      if (previous?.combustible) {
        const updatedFuel = Object.values(combustibles).find(
          (fuel) => fuel.combustible === previous.combustible,
        );

        if (updatedFuel) {
          return updatedFuel;
        }
      }

      // Seleccionar gasolina 95 por defecto
      return combustibles["95"] ?? Object.values(combustibles)[0] ?? null;
    });
  }, [station]);

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
  const stationDistance = station?.distanceToUserKm ?? 0;

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

  useEffect(() => {
    console.count("Cambió la referencia de load");
  }, [load]);

  useEffect(() => {
    console.count("Cambió la referencia de executeLoad");
  }, [executeLoad]);

  useEffect(() => {
    console.count("Cambió la estación");
  }, [station]);

  useEffect(() => {
    console.count("Cambió el combustible seleccionado");
  }, [selectedFuelType]);

  useEffect(() => {
    console.log("Combustible seleccionado:", selectedFuelType);
  }, [selectedFuelType]);
  
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
