import { useEffect, useState } from "react";

import type {
  FuelType,
  UserVehicleRequest,
  VehicleConfiguration,
  VehicleType,
} from "../../models/vehicle.models";

import { useVehicleCatalog } from "../../hooks/useVehicleCatalog.ts";
import { useVehicleCharacteristics } from "../../hooks/useVehicleCharacteristics.ts";
import { useVehicleStore } from "../../stores/vehicleStore.ts";
 

export function useVehiclePicker(
  opened: boolean,
  onConfirm?: () => void
) {
  const vehicleUser = useVehicleStore((state) => state.vehicleUser);
  const { loadVehicle, vehicle, loadingVehicle } = useVehicleCharacteristics();
  const { loadCatalog, catalog, loadingCatalog, errorCatalog } = useVehicleCatalog();
  const setVehicleUser = useVehicleStore((state) => state.setVehicleUser);

  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [efficiency, setEfficiency] = useState<number | string>(12);

  // Cargar el catálogo al abrir el modal
  useEffect(() => {
    if (!opened) return;

    const controller = new AbortController();

    if (vehicleUser != null) {
      setVehicleType(vehicleUser.vehicleType);
      setSelectedBrand(vehicleUser.brandId == null ? null : String(vehicleUser.brandId),);
      setSelectedModel(vehicleUser.modelId == null ? null : String(vehicleUser.modelId),);
      setSelectedLabel(vehicleUser.labelId ?? vehicleUser.labelId);
      setFuelType(vehicleUser.fuelType ?? "gasoline");
      setEfficiency(vehicleUser.efficiency == null ? 0 : vehicleUser.efficiency,);
    }

    void loadCatalog(controller.signal);

    return () => controller.abort();
  }, [opened, loadVehicle]);

 
  
  useEffect(() => {
    if (vehicle === null) {
      return;
    }

    if (vehicle.rendimientoMixto != null) {
      setEfficiency(vehicle.rendimientoMixto);
    }
  }, [vehicle]);

  // Marcas disponibles para Mantine Select
  const catalogBrands = catalog?.brands
    .filter((item) => item.nombre !== null && item.nombre.trim() !== "")
    .map((item) => ({
      value: String(item.id),
      label: item.nombre!,
    }));

  const catalogLabels = catalog?.labels
    .filter((item) => item.nombre !== null && item.nombre.trim() !== "")
    .map((item) => ({
      value: String(item.id),
      label: item.nombre!,
    }));

  // Modelos correspondientes a la marca seleccionada
  const catalogModels = catalog?.models
    .filter(
      (item) =>
        selectedBrand !== null &&
        item.marcaId === Number(selectedBrand) &&
        item.nombre !== null &&
        item.nombre.trim() !== "",
    )
    .map((item) => ({
      value: String(item.id),
      label: item.nombre!,
    }));

  const handleVehicleTypeChange = (value: VehicleType) => {
    setVehicleType(value);
    setSelectedBrand(null);
    setSelectedModel(null);
  };

  const handleBrandChange = (value: string | null) => {
    setSelectedBrand(value);
    setSelectedModel(null);
  };

  const handleLabelChange = async (value: string | null) => {
    const selectLabel = value === null ? null : value;
    setSelectedLabel(value);

    if (selectLabel != null) {
      const enviarRequest: UserVehicleRequest = {
        marcaId: Number(selectedBrand),
        modeloId: Number(selectedModel),
        etiquetaId: selectLabel,
      };

      void loadVehicle(enviarRequest);
    }
  };

  const numericEfficiency = Number(efficiency);

  const isValid =
    vehicleType === "walking" ||
    (selectedBrand !== null && selectedModel !== null &&
      catalogBrands != null && catalogBrands.some((item) => item.value === selectedBrand) &&
      catalogModels != null && catalogModels.some((item) => item.value === selectedModel) &&
      String(efficiency).trim() !== "" && Number.isFinite(numericEfficiency) && numericEfficiency > 0);

  const handleConfirm = (): boolean => {
    if (!isValid) return false;

    const isWalking = vehicleType === "walking";

    const configuration: VehicleConfiguration = {
      vehicleType,
      brandId: isWalking ? null : Number(selectedBrand),
      modelId: isWalking ? null : Number(selectedModel),
      labelId: isWalking ? null : selectedLabel,
      fuelType: isWalking ? null : fuelType,
      efficiency: isWalking ? null : numericEfficiency,
    };
    setVehicleUser(configuration);
    onConfirm?.();

    return true;
  };

  return {
    vehicleType,
    selectedBrand,
    selectedModel,
    selectedLabel,
    fuelType,
    efficiency,
    catalogLabels,
    catalogBrands,
    catalogModels,
    loadingCatalog,
    errorCatalog,
    isValid,
    handleVehicleTypeChange,
    handleBrandChange,
    setSelectedModel,
    setFuelType,
    setEfficiency,
    handleConfirm,
    loadingVehicle,
    handleLabelChange,
  };
}
