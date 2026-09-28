import { useState } from "react";

import {
    ActionIcon,
    Collapse,
    Group,
    Stack,
    Text,
} from "@mantine/core";

import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { SummaryBySupermarket } from "./summary/SummaryBySupermarket.tsx";
import { ProductMatches } from "./matches/ProductMatches.tsx";
import { ComparableProducts } from "./summary/ComparableProducts.tsx";
import { MatchedProductsBar } from "./charts/MatchedProductsBar.tsx";
import { CheapestMatchedProduct } from "./summary/CheapestMatchedProduct.tsx";

import "./MetricsPanel.css";

export interface ProductOffer {
    name: string;
    price: number;
    categories: string[];
    productUrl: string;
    imageUrl?: string | null;
    brand?: string | null;
    sellerName?: string | null;
    isMarketplace: boolean;
}

export type ProductsByStore = Record<
    string,
    ProductOffer[]
>;

interface MetricsPanelProps {
    stores: ProductsByStore;
}

export function MetricsPanel({stores}: MetricsPanelProps) {

    const [opened, setOpened] = useState(true);

    return (
        <div className="metrics-panel">

            <Group
                justify="space-between"
                className="metrics-panel__header"
                onClick={() =>
                    setOpened(current => !current)
                }
            >
                <div>
                    <Text
                        fw={700}
                        size="lg"
                        c="dark"
                    >
                        Métricas de comparación
                    </Text>

                    <Text
                        size="sm"
                        c="gray.5"
                    >
                        Resumen de los resultados encontrados
                    </Text>
                </div>

                <ActionIcon
                    variant="subtle"
                    size="lg"
                    radius="md"
                    aria-label={
                        opened
                            ? "Minimizar métricas"
                            : "Mostrar métricas"
                    }
                    onClick={(event) => {
                        event.stopPropagation();

                        setOpened(
                            current => !current
                        );
                    }}
                >
                    {opened ? (
                        <ChevronUp size={22} />
                    ) : (
                        <ChevronDown size={22} />
                    )}
                </ActionIcon>
            </Group>

            <Collapse expanded={opened}>

                <Stack
                    className="metrics-panel__content"
                    gap="xl"
                >

                    <div className="metrics-panel__summary">

                        <SummaryBySupermarket
                            stores={stores}
                        />

                        <ComparableProducts
                            stores={stores}
                        />

                        <CheapestMatchedProduct
                            stores={stores}
                        />

                    </div>

                    <ProductMatches
                        stores={stores}
                    />

                    <MatchedProductsBar
                        stores={stores}
                    />

                </Stack>

            </Collapse>

        </div>
    );
}