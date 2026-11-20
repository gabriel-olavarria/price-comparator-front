import { useMemo } from "react";
import { useSmartCartStore } from "../stores/smartCartStore";

export function useSmartCart() {
  const items = useSmartCartStore((state) => state.items);
  const addItem = useSmartCartStore((state) => state.addItem);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalUniqueProducts = items.length;
  const isEmpty = items.length === 0;

  const hasItem = (offerId: string): boolean => {
    return items.some((item) => item.offerId === offerId);
  };

  const getItem = (offerId: string) => {
    return items.find((item) => item.offerId === offerId);
  };

  return {
    items,
    totalItems,
    totalUniqueProducts,
    isEmpty,
    hasItem,
    getItem,
    addItem,
  };
}
