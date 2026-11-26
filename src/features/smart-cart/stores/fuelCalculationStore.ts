import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FuelCalulateResponse } from "../models/fuelCalculation.models.ts";

interface FuelCalculationStore {
  data: FuelCalulateResponse | null;
  loading: boolean;
  error: string | null;

  setData: (data: FuelCalulateResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFuelCalculationStore = create<FuelCalculationStore>()(
  persist(
    (set) => ({
      data: null,
      loading: false,
      error: null,

      setData: (data) =>
        set({
          data,
          loading: false,
          error: null,
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),
      
    }),
    {
      name: "price-comparator-fuel-calculation-v1",
      version: 1,
      partialize: (state) => ({
        data: state.data,
      }),
    },
  ),
);
