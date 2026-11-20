import { useMemo } from "react";

import { useSmartCartStore } from "../../stores/smartCartStore";


export function useCartStats() {
  const items = useSmartCartStore((state) => state.items);
 
  const totalUniqueProducts = items.length;

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );
  const totalSupermarkets = useMemo(
    () => new Set(items.map((item) => item.referenceOffer.store)).size,
    [items],
  );

  return {
    totalUniqueProducts,
    totalItems,
    totalSupermarkets,
  };
}
