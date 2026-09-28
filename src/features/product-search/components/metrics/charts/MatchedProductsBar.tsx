import {
    Card,
    Group,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";

import { BarChart } from "@mantine/charts";

import "./MatchedProductsBar.css";

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

interface MatchedProductsBarProps {
    stores: ProductsByStore;
}

interface ChartRow {
    product: string;
    [storeName: string]: string | number;
}

export function MatchedProductsBar({
                                       stores
                                   }: MatchedProductsBarProps) {

    const storeEntries =
        Object.entries(stores);

    const storeNames =
        Object.keys(stores);

    /*
     * PROVISIONAL:
     * estamos relacionando productos por posición.
     *
     * Más adelante esto debe recibir los productos
     * realmente coincidentes.
     */
    const maxProducts = Math.max(
        0,
        ...storeEntries.map(
            ([, products]) =>
                products.length
        )
    );

    /*
     * Mostramos máximo 10 productos
     * para que el gráfico no sea excesivamente grande.
     */
    const data: ChartRow[] =
        Array.from({
            length: Math.min(
                maxProducts,
                10
            )
        }).map((_, index) => {

            const firstProduct =
                storeEntries
                    .map(
                        ([, products]) =>
                            products[index]
                    )
                    .find(Boolean);

            const row: ChartRow = {
                product:
                    firstProduct?.name ??
                    `Producto ${index + 1}`,
            };

            for (const [
                storeName,
                products
            ] of storeEntries) {

                const product =
                    products[index];

                if (
                    product &&
                    product.price > 0
                ) {
                    row[storeName] =
                        product.price;
                }
            }

            return row;
        });

    const series =
        storeNames.map(
            (storeName, index) => ({
                name: storeName,
                color: getStoreColor(
                    storeName,
                    index
                ),
            })
        );

    return (
        <Card
            className="matched-products-bar"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Stack gap={4}>
                <Text
                    fw={700}
                    size="lg"
                >
                    Comparación de precios
                </Text>

                <Text
                    size="sm"
                    c="dimmed"
                >
                    Comparación de precios entre productos coincidentes
                </Text>
            </Stack>

            <Group
                className="matched-products-bar__legend"
                justify="center"
                gap="xl"
            >
                {storeNames.map(
                    (storeName, index) => (
                        <Group
                            key={storeName}
                            gap={8}
                        >
                            <span
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    background:
                                        getStoreColor(
                                            storeName,
                                            index
                                        ),
                                }}
                            />

                            <Text
                                size="sm"
                                fw={600}
                            >
                                {storeName}
                            </Text>
                        </Group>
                    )
                )}
            </Group>

            {data.length === 0 ? (
                <Text
                    mt="lg"
                    c="dimmed"
                    size="sm"
                >
                    No hay productos para comparar.
                </Text>
            ) : (
                <ScrollArea
                    type="auto"
                    scrollbarSize={8}
                    offsetScrollbars
                >
                    <div className="matched-products-bar__content">

                        <BarChart
                            h={350}
                            data={data}
                            dataKey="product"
                            series={series}
                            valueFormatter={(value) =>
                                formatPrice(
                                    Number(value)
                                )
                            }
                            withBarValueLabel
                            tickLine="y"
                            gridAxis="y"
                            tooltipProps={{
                                cursor: {
                                    fill: "rgba(0, 0, 0, 0.06)",
                                },
                            }}
                        />

                    </div>
                </ScrollArea>
            )}
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