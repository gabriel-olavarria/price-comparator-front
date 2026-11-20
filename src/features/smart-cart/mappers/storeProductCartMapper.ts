import type { CartItem } from "../models/cartItem.models.ts";

interface StoreProductInput {
  name: string;
  price: number;
  productUrl?: string | null;
  imageUrl?: string | null;
  canonicalKey?: string | null;
  offerId?: string | null;
}

export function toStoreCartItem(product: StoreProductInput, store: string,): Omit<CartItem, "quantity"> | null {
  const offerId = product.offerId ?? product.productUrl;

  if (!offerId) {
    return null;
  }

  return {
    offerId,
    canonicalKey: product.canonicalKey ?? product.name,
    name: product.name,
    imageUrl: product.imageUrl ?? undefined,
    referenceOffer: {
      store,
      unitPrice: product.price,
    },
  };
}
