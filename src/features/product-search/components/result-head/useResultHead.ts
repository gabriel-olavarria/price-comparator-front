
import { useState } from "react";

import {
    useStores,
    useTotalProducts,
    useSearchQuery
} from "../../hooks/useMetrics";

export type SortOption =
    | "price-asc"
    | "price-desc"
    | "name";

export function useResultHead() {
    const stores = useStores();
    const totalResults = useTotalProducts();
    const query = useSearchQuery();

    const [selectedStore, setSelectedStore] = useState<string | null>(null);

    const [sortBy, setSortBy] = useState<SortOption>("price-asc");

    const onStoreChange = (storeId: string | null): void => {
        setSelectedStore(storeId);
    };

    const onSortChange = (sort: SortOption): void => {
        setSortBy(sort);
    };

    return {
        stores,
        totalResults,
        query,
        selectedStore,
        sortBy,
        onStoreChange,
        onSortChange
    };
}
