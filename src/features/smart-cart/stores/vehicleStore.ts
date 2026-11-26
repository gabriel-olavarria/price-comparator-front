import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type { VehicleConfiguration } from "../models/vehicle.models";

interface VehicleStore {
  vehicleUser: VehicleConfiguration | null;
  setVehicleUser: (vehicle: VehicleConfiguration) => void;
}

export const useVehicleStore = create<VehicleStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        vehicleUser: null,
        setVehicleUser: (vehicleUser) => set({ vehicleUser }),
      }),
      {
        name: "price-comparator-user-vehicle",
        version: 1,
        partialize: (state) => ({
          vehicleUser: state.vehicleUser,
        }),
      },
    ),
  ),
);
