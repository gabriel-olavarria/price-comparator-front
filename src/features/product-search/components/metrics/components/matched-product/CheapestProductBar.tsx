import { Card, Text } from "@mantine/core";
import { ChartBar } from "lucide-react";
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../styles/CheapestProductBar.css";
import {useSearchResultStore} from "../../../../stores/searchResultStore.ts";
import type {CheapestStoreResponse} from "../../../../models/MetricResponse.ts";
import {StoreLogoTick} from "./StoreLogoTick.tsx";
import type {CheapestStoreCount} from "../../../../models/productCheapestCount.ts";


const storeColors: Record<string, string> = {
    UNIMARC: "#fa5252",
    JUMBO: "#40c057",
    SANTA_ISABEL: "#E7180B",
    LIDER: "#228be6",
    TOTTUS: "#9AE630",
};


export function CheapestProductBar() {
 
    const cheapestCanonicalStore =
        useSearchResultStore(
            (state) => state.metrics?.cheapestCanonicalStore
        ) ?? [];

    const data = getCheapestProductCounts(cheapestCanonicalStore);
    return (
        <Card className="cheapest-product-bar" radius="lg" padding="lg" withBorder>

            <div className="cheapest-product-bar__heading">
                <div className="cheapest-product-bar__title">
                    <div className="cheapest-product-bar__icon">
                        <ChartBar size={28} strokeWidth={2.4} />
                    </div>
                    <Text component="h2">
                        Supermercados con más precios bajos
                    </Text>
                </div>
                <div className="cheapest-product-bar-container__subtitle">
                    <Text  className="cheapest-product-bar__subtitle">
                        Mejor precio en los resultados
                    </Text>
                </div>


            </div>
            
         {/*   <Stack gap={4}>
                <Text fw={700} size="lg">Supermercados con más precios bajos</Text>
                <Text size="sm" c="dimmed">
                    Cantidad de productos comparables donde cada supermercado tuvo el menor precio
                </Text>
            </Stack>
*/}
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
                            dataKey="sellerName"
                            width={85}
                            axisLine={false}
                            tickLine={false}
                            tick={<StoreLogoTick data={data} />}
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
                                            {item.sellerName}
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
                                    key={item.store}
                                    fill={storeColors[item.store] ?? "#7950f2"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function getCheapestProductCounts(data: CheapestStoreResponse[]): CheapestStoreCount[] {
console.log(data);
    return data
        .map(item => ({
            store: item.store,
            sellerName: item.sellerName,
            count: item.totalCanonicalEconomic,
        }))
        .sort((a, b) => b.count - a.count);
}