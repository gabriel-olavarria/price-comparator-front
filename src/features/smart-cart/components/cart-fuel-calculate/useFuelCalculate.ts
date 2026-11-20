import { useEffect, useMemo, useState } from "react";

import { useFuel } from "../../hooks/useFuel.ts";

import type { SelectedLocation } from "../../models/location.models";
import type {
  FuelCalculateProps,
  FuelType,
} from "../../models/fuelCalculation.models";
import type { VehicleConfiguration } from "../../models/vehicle.models.ts";


 

const FUEL_TYPES: { type: FuelType; label: string }[] = [
  { type: "93", label: "Gasolina 93" },
  { type: "95", label: "Gasolina 95" },
  { type: "97", label: "Gasolina 97" },
  { type: "diesel", label: "Diésel" },
];
 
export function useFuelCalculate(props: FuelCalculateProps) {

  const { nearestByStore, selectedLocationMap } = props;

  
  // Combustible seleccionado
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>("95");

  // Auto seleccionado
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleConfiguration | null>(null);

  // Modales
  const [locationModalOpened, setLocationModalOpened] = useState(false);
  const [vehicleModalOpened, setVehicleModalOpened] = useState(false);

  // Ubicación seleccionada
 
  // Cálculo de combustible
  const { load, data, loadingCalculate, errorCalculate } = useFuel();

  // Ejecutar cálculo cuando cambien los datos necesarios
  useEffect(() => {
    if (selectedLocationMap == null) {
      return;
    }

    if (selectedVehicle == null) {
      return;
    }

    const controller = new AbortController();

    void load(
      {
        selectedLocationMap,
        selectedFuelType,
        nearestByStore,
        selectedVehicle,
      },
      controller.signal,
    );

    return () => controller.abort();
  }, [selectedLocationMap, selectedVehicle, load]);

  // Información de la estación
  const station = data?.estacionCercana?.station ?? null;
  const stationPrices = data?.estacionCercana?.precios;
  const route = data?.recorrido;
  const estimatedCost = data?.gastoEstimado;

 
  
  // Precios de combustibles
  const fuelPrices = useMemo(() => {
    const prices: Record<FuelType, number | null> = {
      "93": stationPrices?.gasolina93?.precio ?? null,
      "95": stationPrices?.gasolina95?.precio ?? null,
      "97": stationPrices?.gasolina97?.precio ?? null,
      diesel: stationPrices?.diesel?.precio ?? null,
    };

    return FUEL_TYPES.map((fuel) => ({
      ...fuel,
      price: prices[fuel.type],
    }));
  }, [stationPrices]);

  const selectedFuelPrice =
    fuelPrices.find((fuel) => fuel.type === selectedFuelType)?.price ?? null;

  // Métricas del recorrido
  const distanceKm = route?.totalDistanceKm ?? null;

  const fuelEfficiency = estimatedCost?.fuelEfficiencyKmPerLiter ?? null;

  const fuelLiters = estimatedCost?.estimatedLiters ?? null;

  const fuelCost = estimatedCost?.estimatedCost ?? null;
 

  // Ubicación de la estación
  const stationLocation: SelectedLocation | null = station?.ubicacion
    ? {
        latitude: Number(station.ubicacion.latitud),
        longitude: Number(station.ubicacion.longitud),
        address: station.ubicacion.direccion,
      }
    : null;

  const stationName = station?.distribuidor?.marca ?? "Sin estación disponible";

  const stationAddress = station?.ubicacion?.direccion ?? "";

  const stationDistance = data?.estacionCercana?.distanceKm ?? null;

  const stationUpdatedAt =
    stationPrices?.gasolina93?.fechaActualizacion ??
    stationPrices?.gasolina95?.fechaActualizacion ??
    stationPrices?.gasolina97?.fechaActualizacion ??
    stationPrices?.diesel?.fechaActualizacion ??
    null;

  // URL de OpenStreetMap
  const stationLatitude = stationLocation?.latitude ?? null;
  const stationLongitude = stationLocation?.longitude ?? null;

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

  const handleConfirmFuelLocation = (location: SelectedLocation) => {
    console.log(location);
    setLocationModalOpened(false);
  };

  // Modal de vehículo
  const handleOpenVehicleModal = () => {
    setVehicleModalOpened(true);
  };

  const handleCloseVehicleModal = () => {
    setVehicleModalOpened(false);
  };

  const handleConfirmVehicle = (vehicle: VehicleConfiguration) => {
    setSelectedVehicle(vehicle);
    handleCloseVehicleModal();
  };

  return {
    selectedLocationMap,
    
    // Combustible
    selectedFuelType,
    setSelectedFuelType,

    //Vehiculo
    selectedVehicle,

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
    loadingCalculate,
    errorCalculate,

    // Precios
    fuelPrices,
    selectedFuelPrice,

    // Métricas
    distanceKm,
    fuelEfficiency,
    fuelLiters,
    fuelCost,

    // Estación de servicio
    stationName,
    stationAddress,
    stationDistance,
    stationUpdatedAt,
    stationUrl,
    stationLocation,
  };
}
