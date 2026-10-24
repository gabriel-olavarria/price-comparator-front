import {Card, Divider, Group, Stack, Text,} from "@mantine/core";
import type { ProductOffer } from "../../../../models/ProductOffer";
import "../styles/QuantitiesByMarket.css";


type ProductsByStore = Record<string, ProductOffer[]>;

interface QuantitiesByMarketProps {
    stores: ProductsByStore;
}
/*
 * (PRIMERA TARJETA
 * TABLA COMPARATIVA DE SUPERMERCADOS 
 */
export function QuantitiesByMarket({stores}: QuantitiesByMarketProps) {

    const supermarkets = Object.entries(stores);

    return (
        <Card className="summary-by-supermarket" radius="lg" padding="lg" withBorder>
            <Text fw={700} size="lg">Cantidad de productos</Text>
            <Stack gap={0} mt="md">
                {supermarkets.map(
                    ([storeName, products], index) => (
                        <div key={storeName}>
                            <Group justify="space-between" py="sm">
                                <Text>{storeName}</Text>
                                <Text fw={700}>{products.length}</Text>
                            </Group>
                            {index < supermarkets.length - 1 && (<Divider />)}
                        </div>
                    )
                )}
            </Stack>
        </Card>
    );
}