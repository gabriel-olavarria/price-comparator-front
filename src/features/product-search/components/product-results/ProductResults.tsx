import { useMemo, useState } from "react";
import type { Product } from "../../models/Product.ts";
import { StoreSection } from "./components/StoreSection.tsx";
import { FilterCategoryButton } from "./components/filters/FilterCategoryButton.tsx";
import "./ProductResults.css";
import { useSearchResultStore } from "../../stores/searchResultStore.ts";

const EMPTY_STORES: Record<string, Product[]> = {};

export function ProductResults() {
    const stores = useSearchResultStore(state => state.search?.stores) ?? EMPTY_STORES;
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

 
    const availableCategories = useMemo(() => {
        return Array.from(
            new Set(
                Object.values(stores)
                    .flat()
                    .flatMap(product => product.categories)
            ),
        ).sort((a, b) => a.localeCompare(b, "es"));
    }, [stores]);

    const filteredStores = useMemo(() => {
        if (selectedCategories.length === 0) {
            return stores;
        }

        return Object.fromEntries(
            Object.entries(stores).map(([storeName, products]) => {
                const filteredProducts = products.filter(product =>
                    selectedCategories.some(selectedCategory =>
                        product.categories.some(productCategory => {
                            const selected = selectedCategory.toLowerCase();
                            const current = productCategory.toLowerCase();

                            return current.includes(selected) || selected.includes(current);
                        })
                    )
                );

                return [storeName, filteredProducts];
            })
        ) as Record<string, Product[]>;
    }, [stores, selectedCategories]);

    const filteredTotal = Object.values(filteredStores).reduce(
        (total, products) => total + products.length,
        0,
    );

    return (
        <section className="search-results">
            <div className="search-results__toolbar">
                <FilterCategoryButton
                    availableCategories={availableCategories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                />
            </div>

            <header className="search-results__header">
                <p>{filteredTotal} productos encontrados</p>
            </header>

            <div className="search-results__stores">
                {Object.entries(filteredStores).map(([storeName, products]) => (
                    <StoreSection
                        key={storeName}
                        storeName={storeName}
                        products={products}
                    />
                ))}
            </div>
        </section>
    );
}