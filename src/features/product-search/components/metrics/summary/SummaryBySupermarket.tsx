import {
    Card,
    Divider,
    Group,
    Stack,
    Text,
} from "@mantine/core";

import "./SummaryBySupermarket.css";

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

interface SummaryBySupermarketProps {
    stores: ProductsByStore;
}

export function SummaryBySupermarket({
                                         stores
                                     }: SummaryBySupermarketProps) {

    const supermarkets =
        Object.entries(stores);

    return (
        <Card
            className="summary-by-supermarket"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text
                fw={700}
                size="lg"
            >
                Cantidad de productos
            </Text>

            <Stack
                gap={0}
                mt="md"
            >
                {supermarkets.map(
                    ([storeName, products], index) => (
                        <div key={storeName}>

                            <Group
                                justify="space-between"
                                py="sm"
                            >
                                <Text>
                                    {storeName}
                                </Text>

                                <Text fw={700}>
                                    {products.length}
                                </Text>
                            </Group>

                            {index <
                                supermarkets.length - 1 && (
                                    <Divider />
                                )}

                        </div>
                    )
                )}
            </Stack>
        </Card>
    );
}