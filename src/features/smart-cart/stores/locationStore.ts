import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type { SelectedLocation } from "../models/location.models";

interface LocationState {
  locationUser: SelectedLocation | null;
  setLocationUser: (location: SelectedLocation) => void;
}

export const useLocationStore = create<LocationState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        locationUser: null,
        setLocationUser: (locationUser) => set({ locationUser }),
      }),
      {
        name: "price-comparator-user-location",
        version: 1,
        partialize: (state) => ({
          locationUser: state.locationUser,
        }),
      },
    ),
  ),
);
