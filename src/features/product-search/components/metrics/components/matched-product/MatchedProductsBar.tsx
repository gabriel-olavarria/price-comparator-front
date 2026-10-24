import { Box, Card, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import type { CanonicalProductGroup } from "../../../../services/productCanonical.ts";
import "../styles/MatchedProductsBar.css";

interface MatchedProductsBarProps {
    comparableGroups: CanonicalProductGroup[];
}

interface ChartRow {
    product: string;
    [storeName: string]: string | number;
}

/**
 * GRÁFICO DE BARRAS
 *
 * Compara los precios únicamente entre
 * productos comparables entre supermercados.
 */
export function MatchedProductsBar({comparableGroups}: MatchedProductsBarProps) {
    const storeNames = Array.from(
        new Set(
            comparableGroups.flatMap(group =>
                group.products.map(product => product.storeName)
            )
        )
    );

    const data: ChartRow[] = comparableGroups
        .slice(0, 10)
        .map(group => {
            const row: ChartRow = {
                product: getGroupName(group),
            };

            for (const product of group.products) {
                if (product.product.price > 0) {
                    row[product.storeName] = product.product.price;
                }
            }

            return row;
        });

    const series = storeNames.map((storeName, index) => ({
        name: storeName,
        color: getStoreColor(storeName, index),
    }));

    const chartWidth = Math.max(900, data.length * 180);

    return (
        <Card className="matched-products-bar" radius="lg" padding="lg" withBorder>
            <Stack gap={4}>
                <Text fw={700} size="lg">Comparación de precios</Text>
                <Text size="sm" c="dimmed">Comparación de precios entre productos comparables</Text>
            </Stack>

            <Group className="matched-products-bar__legend" justify="center" gap="xl">
                {storeNames.map((storeName, index) => (
                    <Group key={storeName} gap={8}>
                        <Box
                            w={10}
                            h={10}
                            bg={getStoreColor(storeName, index)}
                            style={{borderRadius: "50%", flexShrink: 0}}
                        />

                        <Text size="sm" fw={600}>{storeName}</Text>
                    </Group>
                ))}
            </Group>

            {data.length === 0 ? (
                <Text mt="lg" c="dimmed" size="sm">No hay productos comparables para comparar.</Text>
            ) : (
                <ScrollArea type="auto" scrollbarSize={8} offsetScrollbars>
                    <div className="matched-products-bar__content" style={{width: chartWidth}}>
                        <BarChart
                            h={420}
                            data={data}
                            dataKey="product"
                            series={series}
                            valueFormatter={value => formatPrice(Number(value))}
                            tickLine="xy"
                            gridAxis="y"
                            xAxisProps={{
                                interval: 0,
                                height: 70,
                                axisLine: {
                                    stroke: "#868e96",
                                    strokeWidth: 1,
                                },
                                tickLine: {
                                    stroke: "#868e96",
                                },
                                tickFormatter: value => formatProductLabel(String(value)),
                            }}
                            yAxisProps={{
                                width: 75,
                                axisLine: {
                                    stroke: "#868e96",
                                    strokeWidth: 1,
                                },
                                tickLine: {
                                    stroke: "#868e96",
                                },
                            }}
                            barProps={{
                                radius: 4,
                            }}
                            tooltipProps={{
                                cursor: {
                                    fill: "rgba(81, 48, 168, 0.035)",
                                },
                                content: ({active, payload}) => {
                                    if (!active || !payload?.length) {
                                        return null;
                                    }

                                    return (
                                        <div className="matched-products-bar__tooltip">
                                            {payload.map(item => (
                                                <div key={item.name} className="matched-products-bar__tooltip-row">
                                                    <Group gap={8} wrap="nowrap">
                                                        <Box
                                                            w={10}
                                                            h={10}
                                                            bg={item.color}
                                                            style={{borderRadius: "50%", flexShrink: 0}}
                                                        />

                                                        <span className="matched-products-bar__tooltip-store">
                                                            {item.name}
                                                        </span>
                                                    </Group>

                                                    <span className="matched-products-bar__tooltip-price">
                                                        {formatPrice(Number(item.value))}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                },
                            }}
                        />
                    </div>
                </ScrollArea>
            )}
        </Card>
    );
}

function getGroupName(group: CanonicalProductGroup): string {
    const product = group.products[0];

    if (!product) {
        return group.canonicalKey;
    }

    const subtype = product.subtype
        ? product.subtype.replaceAll("-", " ")
        : "";

    const quantity = product.quantity && product.unit
        ? `${product.quantity} ${product.unit}`
        : "";

    return [product.family, subtype, quantity]
        .filter(Boolean)
        .map(value => capitalize(String(value)))
        .join(" ");
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatProductLabel(name: string): string {
    const maxLength = 26;

    if (name.length <= maxLength) {
        return name;
    }

    return `${name.slice(0, maxLength).trim()}...`;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(price);
}

function getStoreColor(store: string, index: number): string {
    const colors: Record<string, string> = {
        Lider: "blue.6",
        Jumbo: "orange.6",
        Unimarc: "red.6",
        Tottus: "green.6",
        SantaIsabel: "violet.6",
    };

    const fallbackColors = [
        "cyan.6",
        "grape.6",
        "yellow.6",
        "pink.6",
    ];

    return colors[store] ?? fallbackColors[index % fallbackColors.length];
}