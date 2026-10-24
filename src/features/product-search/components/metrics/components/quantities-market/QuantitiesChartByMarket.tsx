import {
    Card,
    Group,
    RingProgress,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";

import { useState } from "react";

import type { ProductOffer } from "../../../../models/ProductOffer";

import "../styles/QuantitiesChartByMarket.css";

type ProductsByStore = Record<string, ProductOffer[]>;

interface QuantitiesChartByMarketProps {
    stores: ProductsByStore;
}

export function QuantitiesChartByMarket({
                                            stores,
                                        }: QuantitiesChartByMarketProps) {

    const [hoveredStore, setHoveredStore] =
        useState<{
            store: string;
            quantity: number;
        } | null>(null);

    const storeEntries =
        Object.entries(stores);

    const totalProducts =
        storeEntries.reduce(
            (total, [, products]) =>
                total + products.length,
            0
        );

    const sections =
        totalProducts > 0
            ? storeEntries
                .filter(
                    ([, products]) =>
                        products.length > 0
                )
                .map(
                    ([store, products], index) => ({
                        value:
                            (
                                products.length /
                                totalProducts
                            ) * 100,

                        color:
                            getStoreColor(
                                store,
                                index
                            ),

                        store,
                        quantity:
                        products.length,
                    })
                )
            : [];

    return (
        <Card
            className="comparable-products"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text
                fw={700}
                size="lg"
            >
                Productos encontrados
            </Text>

            <Group
                mt="lg"
                justify="space-between"
                align="center"
                wrap="nowrap"
            >
                <Tooltip
                    label={
                        hoveredStore
                            ? `${hoveredStore.store}: ${hoveredStore.quantity} productos`
                            : ""
                    }
                    opened={hoveredStore !== null}
                    position="top"
                    withArrow
                >
                    <div
                        onMouseLeave={() =>
                            setHoveredStore(null)
                        }
                    >
                        <RingProgress
                            size={130}
                            thickness={14}
                            sections={sections.map(
                                section => ({
                                    value:
                                    section.value,
                                    color:
                                    section.color,
                                })
                            )}
                            label={
                                <Stack
                                    gap={0}
                                    align="center"
                                >
                                    <Text
                                        fw={700}
                                        size="xl"
                                    >
                                        {totalProducts}
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        productos
                                    </Text>
                                </Stack>
                            }
                        />
                    </div>
                </Tooltip>

                <Stack gap="md">
                    {sections.map(
                        section => (
                            <Group
                                key={section.store}
                                gap="sm"
                                wrap="nowrap"
                                onMouseEnter={() =>
                                    setHoveredStore({
                                        store:
                                        section.store,
                                        quantity:
                                        section.quantity,
                                    })
                                }
                                onMouseLeave={() =>
                                    setHoveredStore(null)
                                }
                            >
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius:
                                            "50%",
                                        backgroundColor:
                                        section.color,
                                        display:
                                            "inline-block",
                                    }}
                                />

                                <Text
                                    size="sm"
                                    style={{
                                        minWidth: 110,
                                    }}
                                >
                                    {section.store}
                                </Text>

                                <Text fw={700}>
                                    {section.quantity}
                                </Text>
                            </Group>
                        )
                    )}
                </Stack>
            </Group>
        </Card>
    );
}

function getStoreColor(
    store: string,
    index: number
): string {

    const colors: Record<
        string,
        string
    > = {
        Lider: "#228BE6",
        Jumbo: "#FD7E14",
        Unimarc: "#FA5252",
        Tottus: "#40C057",
        SantaIsabel: "#7950F2",
    };

    const fallbackColors = [
        "#15AABF",
        "#BE4BDB",
        "#FAB005",
        "#E64980",
    ];

    return (
        colors[store] ??
        fallbackColors[
        index %
        fallbackColors.length
            ]
    );
}