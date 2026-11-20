
import { useMemo } from "react";
import { useSearchResultStore } from "../stores/searchResultStore";

export function useStores(): string[] {
    const totalProductsByStore = useSearchResultStore(
        state => state.metrics?.totalProductsByStore
    );

    return useMemo(
        () => totalProductsByStore?.map(item => item.store) ?? [],
        [totalProductsByStore]
    );
}

export function useTotalProducts(): number {
    const totalProductsByStore = useSearchResultStore(
        state => state.metrics?.totalProductsByStore
    );

    return useMemo(
        () => totalProductsByStore?.reduce(
            (total, item) => total + item.totalProducts,
            0
        ) ?? 0,
        [totalProductsByStore]
    );
}

export function useSearchQuery(): string {
    return useSearchResultStore(
        state => state.search?.query ?? ""
    );
}
