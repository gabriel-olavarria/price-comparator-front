import {
    Card,
    Group,
    RingProgress,
    Stack,
    Text,
} from "@mantine/core";

import "./ComparableProducts.css";

interface ProductOffer {
    name: string;
    price: number;
    categories: string[];
    productUrl: string;
    imageUrl?: string | null;
    brand?: string | null;
    sellerName?: string | null;
    isMarketplace: boolean;
}

type ProductsByStore = Record<string, ProductOffer[]>;

interface ComparableProductsProps {
    stores: ProductsByStore;
}

export function ComparableProducts({
                                       stores
                                   }: ComparableProductsProps) {

    /*
     * Por ahora usamos la cantidad de productos
     * por supermercado.
     *
     * Después reemplazaremos esto por los matches
     * reales entre productos equivalentes.
     */
    const storeEntries = Object.entries(stores);

    const totalProducts = storeEntries.reduce(
        (total, [, products]) =>
            total + products.length,
        0
    );

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
                Productos comparables
            </Text>

            <Group
                mt="lg"
                justify="space-between"
                align="center"
                wrap="nowrap"
            >
                <RingProgress
                    size={130}
                    thickness={14}
                    roundCaps
                    sections={
                        totalProducts > 0
                            ? storeEntries.map(
                                ([store, products], index) => ({
                                    value:
                                        (products.length /
                                            totalProducts) *
                                        100,

                                    color: getStoreColor(
                                        store,
                                        index
                                    ),
                                })
                            )
                            : []
                    }
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

                <Stack gap="md">

                    {storeEntries.map(
                        ([store, products], index) => (

                            <Group
                                key={store}
                                gap="xs"
                            >
                                <span
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background:
                                            getStoreColor(
                                                store,
                                                index
                                            ),
                                        display: "inline-block"
                                    }}
                                />

                                <Text size="sm">
                                    {store}
                                </Text>

                                <Text fw={700}>
                                    {products.length}
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

    const colors: Record<string, string> = {
        Lider: "blue.6",
        Jumbo: "orange.6",
        Unimarc: "red.6",
        Tottus: "green.6",
    };

    const fallbackColors = [
        "violet.6",
        "cyan.6",
        "grape.6",
        "yellow.6",
    ];

    return (
        colors[store] ??
        fallbackColors[
        index % fallbackColors.length
            ]
    );
}