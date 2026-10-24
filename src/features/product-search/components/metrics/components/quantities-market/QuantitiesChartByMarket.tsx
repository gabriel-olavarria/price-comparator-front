
import {
    Card,
    RingProgress,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";

import { ChartPie } from "lucide-react";
import { useState } from "react";

import { useSearchResultStore } from "../../../../stores/searchResultStore.ts";
import "../styles/QuantitiesChartByMarket.css";

interface StoreSection {
    store: string;
    quantity: number;
    value: number;
    color: string;
}

const STORE_COLORS: Record<string, string> = {
    Lider: "#228BE6",
    Jumbo: "#FD7E14",
    Unimarc: "#FA5252",
    Tottus: "#40C057",
    SantaIsabel: "#7950F2",
    SantalIsabel: "#7950F2",
};

const FALLBACK_COLORS = [
    "#15AABF",
    "#BE4BDB",
    "#FAB005",
    "#E64980",
];

function getStoreColor(store: string, index: number): string {
    return (
        STORE_COLORS[store] ??
        FALLBACK_COLORS[index % FALLBACK_COLORS.length]
    );
}

export function QuantitiesChartByMarket() {
    const totalProductsByCanonicalKey =
        useSearchResultStore(
            (state) => state.metrics?.totalProductsByCanonicalKey
        ) ?? [];

    const [hoveredStore, setHoveredStore] = useState<StoreSection | null>(null);

    const totalProducts = totalProductsByCanonicalKey.reduce(
        (total, item) => total + item.totalCanonicalKey,
        0
    );

    const sections: StoreSection[] =
        totalProductsByCanonicalKey.map((item, index) => ({
            store: item.store,
            quantity: item.totalCanonicalKey,
            value: totalProducts > 0 ? (item.totalCanonicalKey / totalProducts) * 100 : 0,
            color: getStoreColor(item.store, index),
        }));

    return (
        <Card className="canonical-card" padding={0} radius={0}>
            <div className="canonical-card__header">
                <div className="canonical-card__heading">
                    <div className="canonical-card__title">
                        <ChartPie size={30} strokeWidth={2} />
                        <Text component="h2">
                            Productos canónicos
                        </Text>
                    </div>

                    <Text className="canonical-card__subtitle">
                        Distribución por supermercado
                    </Text>
                </div>

                <div className="canonical-card__chart">
                    <Tooltip
                        label={hoveredStore ? `${hoveredStore.store}: ${hoveredStore.quantity} canónicos` : ""}
                        opened={hoveredStore !== null}
                        position="top"
                        withArrow
                    >
                        <div className="canonical-card__ring" onMouseLeave={() => setHoveredStore(null)}>
                            <RingProgress
                                className="canonical-card__ring-chart"
                                thickness={17}
                                roundCaps={false}
                                sections={sections
                                    .filter((section) => section.quantity > 0)
                                    .map((section) => ({
                                        value: section.value,
                                        color: section.color,
                                        tooltip: `${section.store}: ${section.quantity}`,
                                    }))}
                                label={
                                    <Stack gap={0} align="center">
                                        <Text className="canonical-card__total">
                                            {totalProducts}
                                        </Text>

                                        <Text className="canonical-card__total-label">
                                            canónicos
                                        </Text>
                                    </Stack>
                                }
                            />
                        </div>
                    </Tooltip>
                </div>
            </div>

            <div className="canonical-card__footer">
                <div className="canonical-card__stores">
                    {sections.map((section) => (
                        <div
                            key={section.store}
                            className="canonical-card__store"
                            onMouseEnter={() => setHoveredStore(section)}
                            onMouseLeave={() => setHoveredStore(null)}
                        >
                            <div className="canonical-card__store-info">
                <span
                    className="canonical-card__store-dot"
                    style={{
                        backgroundColor: section.color,
                    }}
                />

                                <Text className="canonical-card__store-name">
                                    {section.store}
                                </Text>
                            </div>

                            <Text className="canonical-card__store-count">
                                {section.quantity}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
