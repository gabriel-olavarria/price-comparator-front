import {
    Card,
    Group,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";

import { BarChart } from "@mantine/charts";

import "./MatchedProductsBar.css";

export function MatchedProductsBar() {
    const data = [
        {
            product: "Coca-Cola Zero 3L",
            Lider: 2490,
            Jumbo: 2690,
        },
        {
            product: "Coca-Cola Original 2L",
            Lider: 2190,
            Jumbo: 1990,
        },
        {
            product: "Coca-Cola Light 1.5L",
            Lider: 1790,
            Jumbo: 1690,
        },
        {
            product: "Coca-Cola Zero 1.5L",
            Lider: 1590,
            Jumbo: 1890,
        },
        {
            product: "Coca-Cola Original 3L",
            Lider: 2790,
            Jumbo: 2890,
        },
        {
            product: "Coca-Cola Sin Azúcar 2L",
            Lider: 1990,
            Jumbo: 2090,
        },
    ];

    return (
        <Card
            className="matched-products-bar"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Stack gap={4}>
                <Text fw={700} size="lg">
                    Comparación de precios
                </Text>

                <Text size="sm" c="dimmed">
                    Comparación de precios entre productos coincidentes
                </Text>
            </Stack>

            {/* Leyenda personalizada */}
            <Group
                className="matched-products-bar__legend"
                justify="center"
                gap="xl"
            >
                <Group gap={8}>
                    <span className="matched-products-bar__dot matched-products-bar__dot--lider" />

                    <Text size="sm" fw={600}>
                        Lider
                    </Text>
                </Group>

                <Group gap={8}>
                    <span className="matched-products-bar__dot matched-products-bar__dot--jumbo" />

                    <Text size="sm" fw={600}>
                        Jumbo
                    </Text>
                </Group>
            </Group>

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
                        series={[
                            {
                                name: "Lider",
                                color: "blue.6",
                            },
                            {
                                name: "Jumbo",
                                color: "orange.6",
                            },
                        ]}
                        valueFormatter={(value) =>
                            `$${Number(value).toLocaleString("es-CL")}`
                        }
                        withBarValueLabel
                        tickLine="y"
                        gridAxis="y"
                        tooltipProps={{
                            cursor: {
                                fill: "rgba(0, 0, 0, 0.06)",
                            },
                            content: () => null,
                        }}
                    />
                </div>
            </ScrollArea>
        </Card>
    );
}