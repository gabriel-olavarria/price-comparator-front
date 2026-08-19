import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import {
    Button,
    Checkbox,
    Popover,
    Stack,
    Text,
} from "@mantine/core";

import type {ProductOffer, SearchProductOffersResponse,} from "../models/ProductOffer.ts";
import { StoreProductsSection } from "./store-products/StoreProductSection.tsx";
import "./SearchResults.css";

interface SearchResultsProps {
    result: SearchProductOffersResponse;
}

export function SearchResults({ result }: SearchResultsProps) {
    console.log(result);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const availableCategories = useMemo(() => {
        return Array.from(
            new Set(Object.values(result.stores).flat().flatMap((product) => product.categories),),
        ).sort((a, b) => a.localeCompare(b, "es"));
    }, [result.stores]);
    console.log(availableCategories);
    const filteredStores = useMemo(() => {
        if (selectedCategories.length === 0) {
            return result.stores;
        }

        return Object.fromEntries(
            Object.entries(result.stores).map(
                ([storeName, products]) => {
                    const filteredProducts = products.filter(
                        (product) =>
                            selectedCategories.some(
                                (selectedCategory) =>
                                    product.categories.some(
                                        (productCategory) => {
                                            const selected = selectedCategory.toLowerCase();
                                            const current = productCategory.toLowerCase();
                                            return (current.includes(selected) || selected.includes(current));
                                        },
                                    ),
                            ),
                    );
                    return [storeName, filteredProducts,];
                },
            ),
        ) as Record<string, ProductOffer[]>;
    }, [result.stores, selectedCategories]);

    const filteredTotal = Object.values(filteredStores).reduce(
        (total, products) =>
            total + products.length,
        0,
    );

    return (
        <section className="search-results">
            <Popover opened={filtersOpen} onChange={setFiltersOpen} position="bottom-start" shadow="md" width={320}>
                <Popover.Target>
                    <Button variant="default" leftSection={<Filter size={18} />} onClick={() => setFiltersOpen((current) => !current)}>
                        Filtros
                    </Button>
                </Popover.Target>

                <Popover.Dropdown>
                    <Stack gap="sm">
                        <Text fw={600}>Filtrar resultados</Text>
                        <Text size="sm" c="dimmed">Categorías</Text>
                        {availableCategories.length === 0 ? (
                            <Text size="sm" c="dimmed">No se encontraron categorías.</Text>
                        ) : (
                            <Checkbox.Group value={selectedCategories} onChange={setSelectedCategories}>
                                <Stack gap="xs">
                                    {availableCategories.map(
                                        (category) => (
                                            <Checkbox key={category} value={category} label={category} styles={{label: {color: "#202124"}}}/>
                                        ),
                                    )}
                                </Stack>
                            </Checkbox.Group>
                        )}

                    </Stack>
                </Popover.Dropdown>
            </Popover>

            <header className="search-results__header">
                <h2>
                    Resultados para “{result.query}”
                </h2>

                <p>
                    {filteredTotal} productos encontrados
                </p>
            </header>

            <div className="search-results__stores">
                {Object.entries(filteredStores).map(
                    ([storeName, products]) => (
                        <StoreProductsSection
                            key={storeName}
                            storeName={storeName}
                            products={products}
                        />
                    ),
                )}
            </div>

        </section>
    );
}