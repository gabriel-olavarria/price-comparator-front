import { create } from "zustand";
import type {SearchProductOffersResponse} from "../models/ProductOffer";

interface ProductSearchStore {
    result: SearchProductOffersResponse | null;
    isLoading: boolean;
    error: string | null;
    setResult: (result: SearchProductOffersResponse | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearSearch: () => void;
}

export const useProductSearchStore =
    create<ProductSearchStore>((set) => ({
        result: null,
        isLoading: false,
        error: null,
        setResult: (result) => set({result,}),
        setIsLoading: (isLoading) => set({isLoading,}),
        setError: (error) => set({error,}),
        clearSearch: () => set({result: null, isLoading: false, error: null,}),
    }));