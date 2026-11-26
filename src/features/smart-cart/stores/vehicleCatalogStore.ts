import { create } from "zustand";

import type { ConsumoVehicularResponse } from "../models/vehicleCatalog.models";
 
interface VehicleCatalogStore {
  catalog: ConsumoVehicularResponse | null;
  loading: boolean;
  error: string | null;

  setCatalog: (catalog: ConsumoVehicularResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVehicleCatalogStore = create<VehicleCatalogStore>()((set) => ({
  catalog: null,
  loading: false,
  error: null,

  setCatalog: (catalog) => set({ catalog }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
