import type {Product} from "./Product.ts";
import type {MetricResponse} from "./MetricResponse.ts";

export interface SearchResponse {
    query: string;
    totalResults: number;
    stores: Record<string, Product[]>;
}

export interface SearchParams {
    query: string;
    categories: string[];
}

export interface SearchResultResponse {
    search: SearchResponse;
    metrics: MetricResponse;
}

export interface SearchResultStore {
    result: SearchResultResponse | null;
    search: SearchResponse | null;
    metrics: MetricResponse | null;
    isLoading: boolean;
    error: string | null;
    setResult: (result: SearchResultResponse | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearSearch: () => void;
}