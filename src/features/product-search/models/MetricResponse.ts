export interface MetricResponse {
    totalProductsByStore: StoreProductTotal[];
    totalProductsByCanonicalKey: CanonicalProductTotal[];
    economicProduct: EconomicProduct | null;
    topCanonicalGroups: CanonicalGroupResponse[];
    cheapestCanonicalStore: CheapestStoreResponse[];
}

export interface StoreProductTotal {
    totalProducts: number;
    store: string;
}

export interface CanonicalProductTotal {
    totalCanonicalKey: number;
    store: string;
}

export interface EconomicProduct {
    name: string;
    price: number;
    store: string;
    productUrl: string | null;
    imageUrl: string | null;
    canonicalKey: string | null;
    canonicalName: string | null;
}

export interface CanonicalGroupResponse {
    canonicalKey: string;
    canonicalName: string;
    products: EconomicProduct[];
}

export interface CheapestStoreResponse {
    store: string;
    sellerName: string;
    totalCanonicalEconomic: number;
    Canonical: Canonical[]
}

export interface Canonical {
    canonicalKey: string;
    product: EconomicProduct;
}