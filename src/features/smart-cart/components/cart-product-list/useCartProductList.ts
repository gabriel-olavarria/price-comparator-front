import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSmartCartStore } from "../../stores/smartCartStore";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function useCartProductList() {
  const navigate = useNavigate();

  const items = useSmartCartStore((state) => state.items);

  const removeItem = useSmartCartStore((state) => state.removeItem);

  const updateQuantity = useSmartCartStore((state) => state.updateQuantity);

  const clearCart = useSmartCartStore((state) => state.clearCart);

  const totalUnits = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.referenceOffer.unitPrice * item.quantity,
        0,
      ),
    [items],
  );

  const formatPrice = (price: number): string => {
    return priceFormatter.format(price);
  };

  const addMore = () => {
    navigate("/comparar");
  };

  return {
    items,
    totalUnits,
    totalPrice,
    formatPrice,
    updateQuantity,
    removeItem,
    clearCart,
    addMore,
  };
}
