import type { CartItem } from "../models/cartItem.models.ts";

interface ProductCartInput {
  offerId: string;
  canonicalKey: string;
  name: string;
  imageUrl?: string;
  store: string;
  price: number;
}

export function toCartItem(product: ProductCartInput,): Omit<CartItem, "quantity"> {
  return {
    offerId: product.offerId,
    canonicalKey: product.canonicalKey,
    name: product.name,
    imageUrl: product.imageUrl,
    referenceOffer: {
      store: product.store,
      unitPrice: product.price,
    },
  };
}
