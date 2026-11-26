import { useEffect, useState } from "react";

import type {
  FuelType,
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
  const { loadVehicle, loadingVehicle, errorVehicle, resetVehicle } =
    useVehicleCharacteristics();
  const { loadCatalog, catalog, loadingCatalog, errorCatalog } = useVehicleCatalog();
  const setVehicleUser = useVehicleStore((state) => state.setVehicleUser);

  const [vehicleType, setVehicleType] = useState<VehicleType>(
    vehicleUser?.vehicleType ?? "car",
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    vehicleUser?.brandId == null ? null : String(vehicleUser.brandId),
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    vehicleUser?.labelId ?? null,
  );
  const [selectedModel, setSelectedModel] = useState<string | null>(
    vehicleUser?.modelId == null ? null : String(vehicleUser.modelId),
  );

  const [fuelType, setFuelType] = useState<FuelType>(
    vehicleUser?.fuelType ?? "gasoline",
  );
  const [efficiency, setEfficiency] = useState<number | string>(
    vehicleUser?.efficiency ?? "",
  );

  useEffect(() => {
    if (!opened) return;

    const controller = new AbortController();
    void loadCatalog(controller.signal);

    return () => controller.abort();
  }, [opened, loadCatalog]);

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
    resetVehicle();
    setVehicleType(value);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedLabel(null);
    setEfficiency("");
  };

  const handleBrandChange = (value: string | null) => {
    resetVehicle();
    setSelectedBrand(value);
    setSelectedModel(null);
    setSelectedLabel(null);
    setEfficiency("");
  };

  const handleModelChange = (value: string | null) => {
    resetVehicle();
    setSelectedModel(value);
    setSelectedLabel(null);
    setEfficiency("");
  };

  const handleLabelChange = async (value: string | null) => {
    setSelectedLabel(value);

    if (value == null || selectedBrand == null || selectedModel == null) {
      return;
    }

    const response = await loadVehicle({
      marcaId: Number(selectedBrand),
      modeloId: Number(selectedModel),
      etiquetaId: value,
    });

    if (!response) {
      return;
    }

    setEfficiency(response.rendimientoMixto ?? "");
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
    setFuelType,
    setEfficiency,
    handleConfirm,
    loadingVehicle,
    errorVehicle,
    handleLabelChange,
    handleModelChange,
  };
}
