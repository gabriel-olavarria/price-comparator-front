import { create } from "zustand";

export type ProductFocusColor = "purple" | "green";

interface ProductFocusStore {
    focusedProductUrl: string | null;
    focusedProductColor: ProductFocusColor | null;
    setFocusedProduct: (productUrl: string | null, color: ProductFocusColor | null) => void;
}

export const useProductFocusStore = create<ProductFocusStore>(set => ({
    focusedProductUrl: null,
    focusedProductColor: null,
    setFocusedProduct: (focusedProductUrl, focusedProductColor) => set({
        focusedProductUrl,
        focusedProductColor,
    }),
}));