import { useMemo, useState } from "react";
import type { Product } from "../../models/Product.ts";
import { StoreSection } from "./components/StoreSection.tsx";
import { FilterCategoryButton } from "./components/filters/FilterCategoryButton.tsx";
import "./ProductResults.css";
import { useSearchResultStore } from "../../stores/searchResultStore.ts";
import {Search} from "lucide-react";
import {Text} from "@mantine/core";

const EMPTY_STORES: Record<string, Product[]> = {};

export function ProductResults() {
    const stores = useSearchResultStore(state => state.search?.stores) ?? EMPTY_STORES;
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

 
    const availableCategories = useMemo(() => {
        return Array.from(
            new Set(Object.values(stores).flat().flatMap(product => product.categories)),
        ).sort((a, b) => a.localeCompare(b, "es"));
    }, [stores]);

 
    const filteredTotal = Object.values(stores).reduce((total, products) => total + products.length, 0,);

    return (
        <section className="search-results">
            {/* ENCABEZADO */}
            <div className="search-results-init">
                <div className="search-results__heading">
                <div className="search-results__title">
                    <div className="search-results__icon">
                        <Search size={28} strokeWidth={2.4} />
                    </div>
                    <Text component="h2">
                        Resultados de Búsqueda 
                    </Text>
                </div>
                <div className="search-results-container__subtitle">
                    <Text  className="search-results__subtitle">
                        Listado de súpermercados
                    </Text>
                </div>
            </div>
                <div className="search-results__toolbar">
                <FilterCategoryButton
                    availableCategories={availableCategories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                />
            </div>
            </div>
            <header className="search-results__header">
                <p>{filteredTotal} productos encontrados</p>
            </header>

            <div className="search-results__stores">
         
                {Object.entries(stores).map(([storeName, products]) => {
                    const store = products[0]?.store;

                    return (
                        <StoreSection
                            key={store?.code ?? storeName}
                            storeName={store?.name ?? storeName}
                            products={products}
                            storeCode={store?.code ?? storeName}
                        />
                    );
                })}
            </div>
        </section>
    );
}