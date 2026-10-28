import { useMemo, useState } from "react";
import { Button, Card, Group, Select, Table, Text } from "@mantine/core";
import {ArrowDown, ArrowUp, ArrowUpDown, PiggyBank, RotateCcw} from "lucide-react";
import { useProductFocusStore } from "../../../../stores/productFocusStore";
import "../styles/ProductMatches.css";
import {useSearchResultStore} from "../../../../stores/searchResultStore.ts";
import type {CanonicalGroupResponse, EconomicProduct} from "../../../../models/MetricResponse.ts";

type SortDirection = "asc" | "desc";
type SortColumn = string;
type GeneralSort = "lowestPriceAsc" | "lowestPriceDesc" | "nameAsc" | "nameDesc";
interface SortIndicatorProps {
    active: boolean;
    direction: SortDirection;
}
interface SortState {
    column: SortColumn;
    direction: SortDirection;
}


export function ProductMatches() {
    const comparableGroups =
        useSearchResultStore(
            (state) => state.metrics?.topCanonicalGroups
        ) ?? [];

    console.log(comparableGroups);
    const [limit, setLimit] = useState("5");
    const [generalSort, setGeneralSort] = useState<GeneralSort>("lowestPriceAsc");
    const [columnSort, setColumnSort] = useState<SortState | null>(null);
    const setFocusedProduct = useProductFocusStore(state => state.setFocusedProduct);

    const quantityOptions = [
        {value: "5", label: "5 productos"},
        {value: "10", label: "10 productos"},
    ];

    const orderOptions = [
        {value: "lowestPriceAsc", label: "Menor precio"},
        {value: "lowestPriceDesc", label: "Mayor precio"},
        {value: "nameAsc", label: "Nombre A-Z"},
        {value: "nameDesc", label: "Nombre Z-A"},
    ];

    const storeNames = useMemo(
        () => Array.from(
            new Set(comparableGroups.flatMap(group => 
                group.products.map(product => product.store)
            ))),
        [comparableGroups]
    );

    const sortedGroups = useMemo(() => {
        const groups = [...comparableGroups];

      
        if (columnSort) {
            groups.sort((a, b) => 
                compareGroupsByColumn(a, b, columnSort)
            );
        } else {
            groups.sort((a, b) => compareGroupsGeneral(a, b, generalSort));
        }

        return groups.slice(0, Number(limit));
    }, [comparableGroups, generalSort, columnSort, limit]);

    function handleReset() {
        setLimit("5");
        setGeneralSort("lowestPriceAsc");
        setColumnSort(null);
    }

    function handleColumnSort(column: SortColumn) {
        setColumnSort(current => {
            if (current?.column === column) {
                return {
                    column,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }

            return {
                column,
                direction: "asc",
            };
        });
    }

    function handleGeneralSortChange(value: string | null) {
        if (!value) {
            return;
        }

        setGeneralSort(value as GeneralSort);
        setColumnSort(null);
    }

    function goToProduct(productUrl: string) {
        setFocusedProduct(productUrl, "green");

        requestAnimationFrame(() => {
            const element = document.querySelector(
                `[data-product-url="${CSS.escape(productUrl)}"]`
            );

            element?.scrollIntoView({behavior: "smooth", block: "center"});
        });
    }

    return (
        <Card className="product-matches" radius="lg" padding="lg" withBorder>
            {/* ENCABEZADO */}
            <div className="product-matches__best-price__heading">
                <div className="product-matches__best-price__title">
                    <div className="product-matches__best-price__icon">
                        <PiggyBank size={28} strokeWidth={2.4} />
                    </div>
                    <Text component="h2">
                        Comparación de Ofertas
                    </Text>
                </div>
                <div className="product-matches__best-price-container__subtitle">
                    <Text  className="product-matches__best-price__subtitle">
                        Los productos más económicos 
                    </Text>
                </div>


            </div>
            <Group justify="flex-end" align="flex-end" gap="sm" mb="sm" className="product-matches__best-price__controls">
                <Button className="product__button"   style={{ transform: "translateY(14px)" }} leftSection={<RotateCcw size={22} strokeWidth={2.5}/>} onClick={handleReset}>
                    Restablecer
                </Button>
                <Select
                    label="Mostrar"
                    value={limit}
                    onChange={value => {if (value) {setLimit(value);}}}
                    data={quantityOptions}
                    w={150}
                    allowDeselect={false}
                    comboboxProps={{withinPortal: true}}
                    styles={{option: {color: "var(--mantine-color-text)"}, dropdown: {color: "var(--mantine-color-text)"},}}
                />

                <Select
                    label="Ordenar por"
                    value={generalSort}
                    onChange={handleGeneralSortChange}
                    data={orderOptions}
                    w={180}
                    allowDeselect={false}
                    comboboxProps={{withinPortal: true}}
                    styles={{option: {color: "var(--mantine-color-text)"}, dropdown: {color: "var(--mantine-color-text)"},
                    }}
                />
            </Group>

            {sortedGroups.length === 0 ? (
                <Text c="dimmed" size="sm">No se encontraron productos comparables.</Text>
            ) : (
                <Table.ScrollContainer minWidth={950}>
                    <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th onClick={() => handleColumnSort("name")} title="Ordenar por producto" style={{cursor: "pointer", userSelect: "none"}}>
                                    <Group gap={6} wrap="nowrap">
                                        <Text fw={700} >Producto</Text>
                                        <SortIndicator active={columnSort?.column === "name"} direction={columnSort?.direction ?? "asc"}/>
                                    </Group>
                                </Table.Th>

                                {storeNames.map(storeName => (
                                    <Table.Th key={storeName} onClick={() => handleColumnSort(storeName)} title={`Ordenar por precio en ${storeName}`} style={{cursor: "pointer", userSelect: "none"}}>
                                        <Group gap={6} wrap="nowrap">
                                            <Text fw={700} >{storeName}</Text>
                                            <SortIndicator active={columnSort?.column === storeName} direction={columnSort?.direction ?? "asc"}/>
                                        </Group>
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {sortedGroups.map(group => {
                                const lowestPrice = getLowestPrice(group);

                                return (
                                    <Table.Tr key={group.canonicalKey}>
                                        <Table.Td>
                                            <Text fw={600} >{getGroupCanonicalName(group)}</Text>
                                        </Table.Td>

                                        {storeNames.map(storeName => {
                                            const product = getProductByStore(group, storeName);
                                            const isLowestPrice = product !== null && lowestPrice !== null && product.price === lowestPrice;
                                            
                                            if (!product) {
                                                return (
                                                    <Table.Td key={storeName}>
                                                        <Text c="dimmed" size="sm">-</Text>
                                                    </Table.Td>
                                                );
                                            }

                                            return (
                                                <Table.Td key={storeName}>
                                                    <Text className={isLowestPrice ? "product-matches__best-price-lower-price" : "product-matches__best-price-great-price" } onClick={isLowestPrice && product.productUrl ? () => goToProduct(product.productUrl!) : undefined}>
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                </Table.Td>
                                            );
                                        })}
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            )}
        </Card>
    );
}

function getProductByStore(group: CanonicalGroupResponse, storeName: string): EconomicProduct | null {
    return group.products.find(
        product => product.store === storeName
    ) ?? null;
}

function getLowestPrice(group: CanonicalGroupResponse): number | null {
    if (group.products.length === 0) {
        return null;
    }

    return Math.min(
        ...group.products.map(product => product.price)
    );
}

function getGroupCanonicalName(group: CanonicalGroupResponse): string {
    return group.canonicalName;
}

function compareGroupsGeneral(a: CanonicalGroupResponse, b: CanonicalGroupResponse, sort: GeneralSort): number {
    switch (sort) {
        case "lowestPriceAsc":
            return compareNullablePrices(getLowestPrice(a), getLowestPrice(b),
                "asc");

        case "lowestPriceDesc":
            return compareNullablePrices(
                getLowestPrice(a),
                getLowestPrice(b),
                "desc"
            );

        case "nameAsc":
            return compareNames(
                getGroupCanonicalName(a),
                getGroupCanonicalName(b)
            );

        case "nameDesc":
            return compareNames(
                getGroupCanonicalName(b),
                getGroupCanonicalName(a)
            );

        default:
            return 0;
    }
}

function compareGroupsByColumn(a: CanonicalGroupResponse, b: CanonicalGroupResponse, sort: SortState): number {
    if (sort.column === "name") {
        const result = compareNames(
            getGroupCanonicalName(a),
            getGroupCanonicalName(b)
        );

        return sort.direction === "asc" ? result : -result;
    }

    return compareNullablePrices(getStorePrice(a, sort.column), getStorePrice(b, sort.column), sort.direction);
}

function getStorePrice(group: CanonicalGroupResponse, storeName: string): number | null {
    const product = getProductByStore(group, storeName);

    if (!product || product.price <= 0) {
        return null;
    }

    return product.price;
}

function compareNullablePrices(priceA: number | null, priceB: number | null, direction: SortDirection): number {
    if (priceA === null && priceB === null) return 0;
    if (priceA === null) return 1;
    if (priceB === null) return -1;

    return direction === "asc" ? priceA - priceB : priceB - priceA;
}

function compareNames(a: string, b: string): number {
    return a.localeCompare(b, "es", {
        sensitivity: "base"
    });
}


function SortIndicator({active, direction}: SortIndicatorProps) {
    if (!active) {
        return <ArrowUpDown size={15} strokeWidth={1.8} style={{opacity: 0.35}}/>;
    }

    return direction === "asc" ? <ArrowUp size={15} strokeWidth={2}/> : <ArrowDown size={15} strokeWidth={2}/>;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {style: "currency", currency: "CLP", maximumFractionDigits: 0,}).format(price);
}