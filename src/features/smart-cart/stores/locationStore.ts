import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SelectedLocation } from "../models/location.models.ts";

interface LocationState {
  selectedLocation: SelectedLocation | null;

  setSelectedLocation: (location: SelectedLocation) => void;

  clearSelectedLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocation: null,

      setSelectedLocation: (location) =>
        set({
          selectedLocation: location,
        }),

      clearSelectedLocation: () =>
        set({
          selectedLocation: null,
        }),
    }),
    {
      name: "price-comparator-user-location",
    },
  ),
);
