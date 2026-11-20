import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ConsumoVehicularResponse } from "../models/vehicleCatalog.models";
import type { VehicleConfiguration } from "../models/vehicle.models.ts";

interface VehicleCatalogState {
  catalog: ConsumoVehicularResponse | null;
  loading: boolean;
  error: string | null;
  selectedVehicle: VehicleConfiguration | null;
  setSelectedVehicle: (vehicle: VehicleConfiguration) => void;
  setCatalog: (catalog: ConsumoVehicularResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVehicleCatalogStore = create<VehicleCatalogState>()(
  persist(
    (set) => ({
      catalog: null,
      selectedVehicle: null,
      loading: false,
      error: null,

      setCatalog: (catalog) => set({ catalog }),
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "vehicle-catalog-storage",

      // Persistir únicamente el catálogo vehicular
      partialize: (state) => ({
        catalog: state.catalog,
        selectedVehicle: state.selectedVehicle,
      }),
    },
  ),
);
