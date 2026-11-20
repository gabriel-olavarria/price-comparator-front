import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FuelCalculationResponse } from "../models/fuelCalculation.models";

interface FuelCalculationStore {
  data: FuelCalculationResponse | null;
  requestKey: string | null;
  loading: boolean;
  error: string | null;

  setData: (data: FuelCalculationResponse, requestKey: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFuelCalculationStore = create<FuelCalculationStore>()(
  persist(
    (set) => ({
      data: null,
      requestKey: null,
      loading: false,
      error: null,

      setData: (data, requestKey) =>
        set({
          data,
          requestKey,
          loading: false,
          error: null,
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      reset: () =>
        set({
          data: null,
          requestKey: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "price-comparator-fuel-calculation-v1",
      version: 1,
      partialize: (state) => ({
        data: state.data,
        requestKey: state.requestKey,
      }),
    },
  ),
);
