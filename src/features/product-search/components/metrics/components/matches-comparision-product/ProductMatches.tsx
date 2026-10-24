import { useMemo, useState } from "react";
import { Button, Card, Group, Select, Stack, Table, Text } from "@mantine/core";
import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from "lucide-react";
import { useProductFocusStore } from "../../../../stores/productFocusStore";
import type { CanonicalProductGroup, CanonicalProductWithStore } from "../../../../services/productCanonical.ts";
import "../styles/ProductMatches.css";

interface ProductMatchesProps {
    comparableGroups: CanonicalProductGroup[];
}

type SortDirection = "asc" | "desc";
type SortColumn = string;
type GeneralSort = "lowestPriceAsc" | "lowestPriceDesc" | "nameAsc" | "nameDesc";

interface SortState {
    column: SortColumn;
    direction: SortDirection;
}

interface SortIndicatorProps {
    active: boolean;
    direction: SortDirection;
}

export function ProductMatches({comparableGroups}: ProductMatchesProps) {
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
        () => Array.from(new Set(comparableGroups.flatMap(group => group.products.map(product => product.storeName)))),
        [comparableGroups]
    );

    const sortedGroups = useMemo(() => {
        const groups = [...comparableGroups];

        if (columnSort) {
            groups.sort((a, b) => compareGroupsByColumn(a, b, columnSort));
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
            <Stack gap={4} mb="lg">
                <Text fw={700} size="lg">Productos Comparables</Text>
                <Text size="sm" c="dimmed">Comparación de precios entre supermercados</Text>
            </Stack>

            <Group justify="flex-end" align="flex-end" gap="sm" mb="sm" className="product-matches__controls">
                <Button variant="light" leftSection={<RotateCcw size={16}/>} onClick={handleReset}>
                    Restablecer
                </Button>

                <Select
                    label="Mostrar"
                    value={limit}
                    onChange={value => {
                        if (value) {
                            setLimit(value);
                        }
                    }}
                    data={quantityOptions}
                    w={150}
                    allowDeselect={false}
                    comboboxProps={{withinPortal: true}}
                    styles={{
                        option: {color: "var(--mantine-color-text)"},
                        dropdown: {color: "var(--mantine-color-text)"},
                    }}
                />

                <Select
                    label="Ordenar por"
                    value={generalSort}
                    onChange={handleGeneralSortChange}
                    data={orderOptions}
                    w={180}
                    allowDeselect={false}
                    comboboxProps={{withinPortal: true}}
                    styles={{
                        option: {color: "var(--mantine-color-text)"},
                        dropdown: {color: "var(--mantine-color-text)"},
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
                                <Table.Th
                                    onClick={() => handleColumnSort("name")}
                                    title="Ordenar por producto"
                                    style={{cursor: "pointer", userSelect: "none"}}
                                >
                                    <Group gap={6} wrap="nowrap">
                                        <Text fw={700}>Producto</Text>
                                        <SortIndicator
                                            active={columnSort?.column === "name"}
                                            direction={columnSort?.direction ?? "asc"}
                                        />
                                    </Group>
                                </Table.Th>

                                {storeNames.map(storeName => (
                                    <Table.Th
                                        key={storeName}
                                        onClick={() => handleColumnSort(storeName)}
                                        title={`Ordenar por precio en ${storeName}`}
                                        style={{cursor: "pointer", userSelect: "none"}}
                                    >
                                        <Group gap={6} wrap="nowrap">
                                            <Text fw={700}>{storeName}</Text>
                                            <SortIndicator
                                                active={columnSort?.column === storeName}
                                                direction={columnSort?.direction ?? "asc"}
                                            />
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
                                            <Text fw={600}>{getGroupName(group)}</Text>
                                        </Table.Td>

                                        {storeNames.map(storeName => {
                                            const product = getProductByStore(group, storeName);
                                            const isLowestPrice = product && lowestPrice !== null && product.product.price === lowestPrice;

                                            if (!product) {
                                                return (
                                                    <Table.Td key={storeName}>
                                                        <Text c="dimmed" size="sm">-</Text>
                                                    </Table.Td>
                                                );
                                            }

                                            return (
                                                <Table.Td key={storeName}>
                                                    <Text
                                                        className={isLowestPrice ? "product-matches__best-price" : undefined}
                                                        onClick={isLowestPrice ? () => goToProduct(product.product.productUrl) : undefined}
                                                    >
                                                        {formatPrice(product.product.price)}
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

function getProductByStore(group: CanonicalProductGroup, storeName: string): CanonicalProductWithStore | null {
    return group.products.find(product => product.storeName === storeName) ?? null;
}

function getLowestPrice(group: CanonicalProductGroup): number | null {
    if (group.products.length === 0) {
        return null;
    }

    return Math.min(...group.products.map(product => product.product.price));
}

function getGroupName(group: CanonicalProductGroup): string {
    const product = group.products[0];

    if (!product) {
        return group.canonicalKey;
    }

    const subtype = product.subtype ? capitalize(product.subtype.replaceAll("-", " ")) : "";
    const quantity = product.quantity && product.unit ? `${product.quantity} ${product.unit}` : "";

    return [product.family, subtype, quantity]
        .filter(Boolean)
        .map(value => capitalize(String(value)))
        .join(" ");
}

function compareGroupsGeneral(a: CanonicalProductGroup, b: CanonicalProductGroup, sort: GeneralSort): number {
    switch (sort) {
        case "lowestPriceAsc":
            return compareNullablePrices(getLowestPrice(a), getLowestPrice(b), "asc");

        case "lowestPriceDesc":
            return compareNullablePrices(getLowestPrice(a), getLowestPrice(b), "desc");

        case "nameAsc":
            return compareNames(getGroupName(a), getGroupName(b));

        case "nameDesc":
            return compareNames(getGroupName(b), getGroupName(a));

        default:
            return 0;
    }
}

function compareGroupsByColumn(a: CanonicalProductGroup, b: CanonicalProductGroup, sort: SortState): number {
    if (sort.column === "name") {
        const result = compareNames(getGroupName(a), getGroupName(b));
        return sort.direction === "asc" ? result : -result;
    }

    return compareNullablePrices(
        getStorePrice(a, sort.column),
        getStorePrice(b, sort.column),
        sort.direction
    );
}

function getStorePrice(group: CanonicalProductGroup, storeName: string): number | null {
    const product = getProductByStore(group, storeName);

    if (!product || product.product.price <= 0) {
        return null;
    }

    return product.product.price;
}

function compareNullablePrices(priceA: number | null, priceB: number | null, direction: SortDirection): number {
    if (priceA === null && priceB === null) {
        return 0;
    }

    if (priceA === null) {
        return 1;
    }

    if (priceB === null) {
        return -1;
    }

    return direction === "asc" ? priceA - priceB : priceB - priceA;
}

function compareNames(a: string, b: string): number {
    return a.localeCompare(b, "es", {sensitivity: "base"});
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function SortIndicator({active, direction}: SortIndicatorProps) {
    if (!active) {
        return <ArrowUpDown size={15} strokeWidth={1.8} style={{opacity: 0.35}}/>;
    }

    return direction === "asc"
        ? <ArrowUp size={15} strokeWidth={2}/>
        : <ArrowDown size={15} strokeWidth={2}/>;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(price);
}