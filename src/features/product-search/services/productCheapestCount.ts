import type { MatchedProduct } from "../models/MatchedProduct";

export interface CheapestStoreCount {
    storeName: string;
    count: number;
}

export function getCheapestProductCounts(matchedProducts: MatchedProduct[]): CheapestStoreCount[] {
    const counts: Record<string, number> = {};

    for (const match of matchedProducts) {
        for (const storeName of Object.keys(match.productsByStore)) {
            counts[storeName] ??= 0;
        }

        const availableProducts = Object.entries(match.productsByStore)
            .filter(([, product]) => product !== null && product.price > 0);

        if (availableProducts.length === 0) {
            continue;
        }

        const lowestPrice = Math.min(
            ...availableProducts.map(([, product]) => product!.price)
        );

        for (const [storeName, product] of availableProducts) {
            if (product!.price === lowestPrice) {
                counts[storeName]++;
            }
        }
    }

    return Object.entries(counts)
        .map(([storeName, count]) => ({
            storeName,
            count,
        }))
        .sort((a, b) => b.count - a.count);
}