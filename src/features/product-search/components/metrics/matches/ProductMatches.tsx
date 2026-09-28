import {
    Badge,
    Card,
    Group,
    Stack,
    Table,
    Text,
} from "@mantine/core";

import "./ProductMatches.css";

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

type ProductsByStore = Record<
    string,
    ProductOffer[]
>;

interface ProductMatchesProps {
    stores: ProductsByStore;
}

interface MatchRow {
    name: string;
    pricesByStore: Record<
        string,
        ProductOffer | null
    >;
}

export function ProductMatches({
                                   stores
                               }: ProductMatchesProps) {

    const storeEntries =
        Object.entries(stores);

    const storeNames =
        Object.keys(stores);

    /*
     * PROVISIONAL:
     * emparejamos por índice.
     *
     * Esto NO es matching real todavía.
     */
    const maxProducts = Math.max(
        0,
        ...storeEntries.map(
            ([, products]) =>
                products.length
        )
    );

    const rows: MatchRow[] =
        Array.from({
            length: Math.min(
                maxProducts,
                10
            )
        }).map((_, index) => {

            const pricesByStore:
                Record<
                    string,
                    ProductOffer | null
                > = {};

            for (const [
                storeName,
                products
            ] of storeEntries) {

                pricesByStore[storeName] =
                    products[index] ?? null;
            }

            const firstProduct =
                storeEntries
                    .map(
                        ([, products]) =>
                            products[index]
                    )
                    .find(Boolean);

            return {
                name:
                    firstProduct?.name ??
                    `Producto ${index + 1}`,
                pricesByStore,
            };
        });

    return (
        <Card
            className="product-matches"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Stack
                gap={4}
                mb="lg"
            >
                <Text
                    fw={700}
                    size="lg"
                >
                    Productos coincidentes
                </Text>

                <Text
                    size="sm"
                    c="dimmed"
                >
                    Productos similares encontrados entre supermercados
                </Text>
            </Stack>

            <Table.ScrollContainer
                minWidth={800}
            >
                <Table
                    verticalSpacing="md"
                    horizontalSpacing="lg"
                    highlightOnHover
                >
                    <Table.Thead>
                        <Table.Tr>

                            <Table.Th>
                                Producto
                            </Table.Th>

                            {storeNames.map(
                                storeName => (
                                    <Table.Th
                                        key={storeName}
                                    >
                                        {storeName}
                                    </Table.Th>
                                )
                            )}

                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>

                        {rows.map(
                            (row, index) => {

                                const availablePrices =
                                    Object.values(
                                        row.pricesByStore
                                    )
                                        .filter(
                                            (
                                                product
                                            ): product is ProductOffer =>
                                                product !== null &&
                                                product.price > 0
                                        )
                                        .map(
                                            product =>
                                                product.price
                                        );

                                const bestPrice =
                                    availablePrices.length > 0
                                        ? Math.min(
                                            ...availablePrices
                                        )
                                        : null;

                                return (
                                    <Table.Tr
                                        key={index}
                                    >

                                        <Table.Td>
                                            <Text fw={600}>
                                                {row.name}
                                            </Text>
                                        </Table.Td>

                                        {storeNames.map(
                                            storeName => {

                                                const product =
                                                    row.pricesByStore[
                                                        storeName
                                                        ];

                                                if (!product) {
                                                    return (
                                                        <Table.Td
                                                            key={storeName}
                                                        >
                                                            <Text
                                                                c="dimmed"
                                                                size="sm"
                                                            >
                                                                -
                                                            </Text>
                                                        </Table.Td>
                                                    );
                                                }

                                                const isBestPrice =
                                                    bestPrice !== null &&
                                                    product.price ===
                                                    bestPrice;

                                                return (
                                                    <Table.Td
                                                        key={storeName}
                                                    >
                                                        <Group
                                                            justify="space-between"
                                                            wrap="nowrap"
                                                        >
                                                            <Text>
                                                                {formatPrice(
                                                                    product.price
                                                                )}
                                                            </Text>

                                                            {isBestPrice && (
                                                                <Badge
                                                                    variant="light"
                                                                    size="sm"
                                                                >
                                                                    Mejor precio
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                    </Table.Td>
                                                );
                                            }
                                        )}

                                    </Table.Tr>
                                );
                            }
                        )}

                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Card>
    );
}

function formatPrice(
    price: number
): string {
    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        }
    ).format(price);
}