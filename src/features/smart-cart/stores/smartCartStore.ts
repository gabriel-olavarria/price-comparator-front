import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "../models/cartItem.models.ts";

interface SmartCartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  storeKeys: string[];
  removeItem: (offerId: string) => void;
  updateQuantity: (offerId: string, quantity: number) => void;
  clearCart: () => void;
}
const getStoreKeys = (items: CartItem[]): string[] =>
  [...new Set(items.map((item) => item.referenceOffer.store))].sort();

export const useSmartCartStore = create<SmartCartStore>()(
  persist(
    (set) => ({
      items: [],
      storeKeys: [],
      
      // Agregar la oferta seleccionada
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (current) => current.offerId === item.offerId,
          );

          const items = existingItem
            ? state.items.map((current) =>
                current.offerId === item.offerId
                  ? { ...current, quantity: current.quantity + 1 }
                  : current,
              )
            : [...state.items, { ...item, quantity: 1 }];

          const storeKeys = getStoreKeys(items);

          return { items, storeKeys };
        }),

      // Eliminar una oferta específica
      removeItem: (offerId) =>
        set((state) => {
          const items = state.items.filter((item) => item.offerId !== offerId);

          return {
            items,
            storeKeys: getStoreKeys(items),
          };
        }),

      // Actualizar cantidad de una oferta
      updateQuantity: (offerId, quantity) =>
        set((state) => {
          if (!Number.isFinite(quantity)) {
            return state;
          }

          const normalizedQuantity = Math.max(1, Math.trunc(quantity));

          return {
            items: state.items.map((item) =>
              item.offerId === offerId
                ? {
                    ...item,
                    quantity: normalizedQuantity,
                  }
                : item,
            ),
          };
        }),

      // Vaciar carrito
      clearCart: () =>
        set({
          items: [],
          storeKeys: [],
        }),
    }),
    {
      name: "price-comparator-smart-cart-v2",
      version: 2,
      partialize: (state) => ({
        items: state.items,
        storeKeys: state.storeKeys,
      }),
    },
  ),
);
