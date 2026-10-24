
import { useCallback, useEffect, useRef } from "react";

import { searchProductOffers } from "../api/searchProductOffers";

import type {
    SearchProductOffersParams,
} from "../models/ProductOffer";

import { useProductSearchStore } from "../stores/productSearchStore";

export function useProductSearch() {
    const result = useProductSearchStore(state => state.result);
    const isLoading = useProductSearchStore(state => state.isLoading);
    const error = useProductSearchStore(state => state.error);

    const setResult = useProductSearchStore(state => state.setResult);
    const setIsLoading = useProductSearchStore(state => state.setIsLoading);
    const setError = useProductSearchStore(state => state.setError);

    const abortControllerRef = useRef<AbortController | null>(null);

    const search = useCallback(
        async (
            query: string,
            categories: string[],
            turnstileToken: string
        ): Promise<void> => {
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

                const response = await searchProductOffers(
                    params,
                    turnstileToken,
                    controller.signal
                );

                if (abortControllerRef.current !== controller) {
                    return;
                }

                setResult(response);
            } catch (requestError) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "No fue posible buscar los productos."
                );
            } finally {
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                    setIsLoading(false);
                }
            }
        },
        [setResult, setIsLoading, setError]
    );

    // Cancela cualquier petición pendiente al desmontar el componente.
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return {
        result,
        isLoading,
        error,
        search,
    };
}
