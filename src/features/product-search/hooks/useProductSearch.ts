import { useRef, useState } from "react";
import { searchProductOffers } from "../api/searchProductOffers.ts";
import type { SearchProductOffersResponse, SearchProductOffersParams } from "../models/ProductOffer.ts";

export function useProductSearch() {
    const [result, setResult] = useState<SearchProductOffersResponse | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    async function search(query: string, categories: string[]): Promise<void> {
        abortControllerRef.current?.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const params: SearchProductOffersParams = {
            query,
            categories,
        };

        try {
            setIsLoading(true);
            setError(null);

            const response = await searchProductOffers(params, controller.signal);
            console.log(response);
            setResult(response);
        } catch (requestError) {
            if (requestError instanceof DOMException && requestError.name === "AbortError") {
                return;
            }

            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "No fue posible buscar los productos.",
            );
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLoading(false);
            }
        }
    }

    return {
        result,
        isLoading,
        error,
        search,
    };
}