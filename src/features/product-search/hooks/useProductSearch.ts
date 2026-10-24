
import { useCallback, useEffect, useRef } from "react";

import { useSearchResultStore } from "../stores/searchResultStore";
import type {SearchParams} from "../models/SearchResponse.ts";
import {searchProduct} from "../api/searchProduct.ts";


export function useProductSearch() {
    const result = useSearchResultStore(state => state.result);
    const isLoading = useSearchResultStore(state => state.isLoading);
    const error = useSearchResultStore(state => state.error);

    const setResult = useSearchResultStore(state => state.setResult);
    const setIsLoading = useSearchResultStore(state => state.setIsLoading);
    const setError = useSearchResultStore(state => state.setError);

    const abortControllerRef = useRef<AbortController | null>(null);

    const search = 
        useCallback(async (query: string, categories: string[], turnstileToken: string): Promise<void> => {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            const params: SearchParams = {query, categories};

            try {
                setIsLoading(true);
                setError(null);

                const response = await searchProduct(params, turnstileToken, controller.signal);

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
