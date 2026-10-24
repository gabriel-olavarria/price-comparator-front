import { Card, Stack, Text } from "@mantine/core";
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CanonicalProductGroup } from "../../../../services/productCanonical.ts";
import "../styles/CheapestProductBar.css";

interface CheapestProductBarProps {
    comparableGroups: CanonicalProductGroup[];
}

interface CheapestStoreCount {
    storeName: string;
    count: number;
}

const storeColors: Record<string, string> = {
    Unimarc: "#fa5252",
    Jumbo: "#fd7e14",
    SantaIsabel: "#7950f2",
    Lider: "#228be6",
    Tottus: "#40c057",
};

export function CheapestProductBar({comparableGroups}: CheapestProductBarProps) {
    const data = getCheapestProductCounts(comparableGroups);

    return (
        <Card className="cheapest-product-bar" radius="lg" padding="lg" withBorder>
            <Stack gap={4}>
                <Text fw={700} size="lg">Supermercados con más precios bajos</Text>
                <Text size="sm" c="dimmed">
                    Cantidad de productos comparables donde cada supermercado tuvo el menor precio
                </Text>
            </Stack>

            <div className="cheapest-product-bar__chart">
                <ResponsiveContainer width="100%" height={Math.max(320, data.length * 70)}>
                    <BarChart data={data} layout="vertical" margin={{top: 20, right: 40, bottom: 30, left: 30}}>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,.08)"/>

                        <XAxis
                            type="number"
                            allowDecimals={false}
                            axisLine={{stroke: "#868e96"}}
                            tickLine={{stroke: "#868e96"}}
                            tickFormatter={value => `${value} veces`}
                        />

                        <YAxis
                            type="category"
                            dataKey="storeName"
                            width={110}
                            axisLine={{stroke: "#868e96"}}
                            tickLine={{stroke: "#868e96"}}
                        />

                        <Tooltip
                            cursor={{fill: "rgba(81,48,168,.035)"}}
                            content={({active, payload}) => {
                                if (!active || !payload?.length) {
                                    return null;
                                }

                                const item = payload[0].payload;
                                const count = Number(item.count);

                                return (
                                    <div className="cheapest-product-bar__tooltip">
                                        <span className="cheapest-product-bar__tooltip-store">
                                            {item.storeName}
                                        </span>

                                        <span className="cheapest-product-bar__tooltip-count">
                                            {count} {count === 1 ? "vez" : "veces"}
                                        </span>
                                    </div>
                                );
                            }}
                        />

                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                            {data.map(item => (
                                <Cell
                                    key={item.storeName}
                                    fill={storeColors[item.storeName] ?? "#7950f2"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function getCheapestProductCounts(comparableGroups: CanonicalProductGroup[]): CheapestStoreCount[] {
    const storeNames = Array.from(
        new Set(
            comparableGroups.flatMap(group =>
                group.products.map(product => product.storeName)
            )
        )
    );

    const counts = new Map<string, number>(
        storeNames.map(storeName => [storeName, 0])
    );

    for (const group of comparableGroups) {
        const validProducts = group.products.filter(product => product.product.price > 0);

        if (validProducts.length === 0) {
            continue;
        }

        const lowestPrice = Math.min(
            ...validProducts.map(product => product.product.price)
        );

        for (const product of validProducts) {
            if (product.product.price === lowestPrice) {
                counts.set(
                    product.storeName,
                    (counts.get(product.storeName) ?? 0) + 1
                );
            }
        }
    }

    return Array.from(counts.entries())
        .map(([storeName, count]) => ({
            storeName,
            count,
        }))
        .sort((a, b) => b.count - a.count);
}