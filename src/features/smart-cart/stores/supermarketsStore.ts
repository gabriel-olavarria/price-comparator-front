import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type {
    NearbySupermarketsResult, RouteResult,
} from "../models/supermarketLocation.models";

interface SupermarketSegmentsStore {
  supermarketsSegments: RouteResult | null;
  nearestByStore: NearbySupermarketsResult[];
  loadingSupermarkets: boolean;
  errorSupermarkets: string | null;

  setSupermarkets: (
    supermarketsSegments: RouteResult | null,
    nearestByStore: NearbySupermarketsResult[],
  ) => void;
  setLoadingSupermarkets: (loading: boolean) => void;
  setErrorSupermarkets: (error: string | null) => void;
}

export const useSupermarketStore = create<SupermarketSegmentsStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        supermarketsSegments: null,
        nearestByStore: [],
        loadingSupermarkets: false,
        errorSupermarkets: null,

        setSupermarkets: (supermarketsSegments, nearestByStore) =>
          set({ supermarketsSegments, nearestByStore }),

        setLoadingSupermarkets: (loadingSupermarkets) =>
          set({ loadingSupermarkets }),

        setErrorSupermarkets: (errorSupermarkets) => set({ errorSupermarkets }),
      }),
      {
        name: "price-comparator-supermarkets",
        version: 2,
        partialize: (state) => ({
          supermarketsSegments: state.supermarketsSegments,
          nearestByStore: state.nearestByStore,
        }),
      },
    ),
  ),
);
