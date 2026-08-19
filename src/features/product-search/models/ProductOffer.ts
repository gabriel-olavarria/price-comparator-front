export interface ProductOffer {
    name: string;
    price: number;
    categories: string[];
    productUrl: string;
    imageUrl: string | null;
    brand: string | null;
    sellerName: string | null;
    isMarketplace: boolean;
}

export interface SearchProductOffersResponse {
    query: string | null;
    totalResults: number;
    stores: Record<string, ProductOffer[]>;
}

export interface SearchProductOffersParams {
    query: string;
    categories: string[];
}