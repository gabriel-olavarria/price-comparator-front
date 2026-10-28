
export interface Product {
    name: string;
    price: number;
    store: ProductStore;
    productUrl: string;
    imageUrl: string | null;
    brand: string | null;
    sellerName: string | null;
    categories: string[];
    availability: string | null;
    canonicalKey: string | null;
    canonicalName: string | null;
    score: number;
    normalized: ProductNormalized;
    clasification: ProductClasification | null;
}

export interface ProductStore {
    code: string;
    name: string;
}

export interface ProductNormalized {
    query: string;
    name: string;
    brand: string | null;
}

export interface ProductClasification {
    id: string;
    category: string;
    subtype: string | null;
    measurement: ProductMeasurement | null;
}

export interface ProductMeasurement {
    unitType: number;
    quantity: number;
    quantityUnit: number;
    unit: number;
}