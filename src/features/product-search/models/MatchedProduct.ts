import type { ProductOffer } from "./ProductOffer";

export interface MatchedProduct {
    name: string;
    productsByStore: Record<string, ProductOffer | null>;
}