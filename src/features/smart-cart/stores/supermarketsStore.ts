import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { NearbySupermarkets } from "../models/supermarketLocation.models";

interface SupermarketStore {
  supermarkets: NearbySupermarkets | null;
  loadingSupermarkets: boolean;
  errorSupermarkets: string | null;
  setSupermarkets: (data: NearbySupermarkets) => void;
  setLoadingSupermarkets: (loading: boolean) => void;
  setErrorSupermarkets: (error: string | null) => void;
}

export const useSupermarketStore = create<SupermarketStore>()(
  persist(
    (set) => ({
      supermarkets: null,
      loadingSupermarkets: false,
      errorSupermarkets: null,

      setSupermarkets: (data) =>
        set((state) => ({
          supermarkets:
            JSON.stringify(state.supermarkets) === JSON.stringify(data)
              ? state.supermarkets
              : data
        })),

      setLoadingSupermarkets: (loadingSupermarkets) =>
        set({ loadingSupermarkets }),

      setErrorSupermarkets: (errorSupermarkets) =>
        set({ errorSupermarkets}),
 
    }),
    {
      name: "price-comparator-supermarkets-v1",
      version: 1,
      partialize: (state) => ({
        supermarkets: state.supermarkets,
      }),
    },
  ),
);
