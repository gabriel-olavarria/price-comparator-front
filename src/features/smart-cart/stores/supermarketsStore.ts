import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type {
  RouteResult,
} from "../models/supermarketLocation.models";

interface SupermarketSegmentsStore {
  supermarketsSegments: RouteResult | null;
  loadingSupermarkets: boolean;
  errorSupermarkets: string | null;

  setSupermarkets: (supermarketsSegments: RouteResult | null) => void;
  setLoadingSupermarkets: (loading: boolean) => void;
  setErrorSupermarkets: (error: string | null) => void;
}

export const useSupermarketStore = create<SupermarketSegmentsStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        supermarketsSegments: null,
        loadingSupermarkets: false,
        errorSupermarkets: null,

        setSupermarkets: (supermarketsSegments) =>
          set({ supermarketsSegments }),

        setLoadingSupermarkets: (loadingSupermarkets) =>
          set({ loadingSupermarkets }),

        setErrorSupermarkets: (errorSupermarkets) => set({ errorSupermarkets }),
      }),
      {
        name: "price-comparator-supermarkets",
        version: 1,
        partialize: (state) => ({
          supermarketsSegments: state.supermarketsSegments,
        }),
      },
    ),
  ),
);
