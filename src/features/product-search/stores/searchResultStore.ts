import { create } from "zustand";
import type { SearchResultStore } from "../models/SearchResponse.ts";

 

export const useSearchResultStore = 
    create<SearchResultStore>((set) => ({
    result: null,
    search: null,
    metrics: null,
    isLoading: false,
    error: null,

    setResult: (result) =>
        set({
            result,
            search: result?.search ?? null,
            metrics: result?.metrics ?? null,
        }),

    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    clearSearch: () =>
        set({
            result: null,
            search: null,
            metrics: null,
            isLoading: false,
            error: null,
        }),
}));