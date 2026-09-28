import {
    Card,
    Group,
    Image,
    Stack,
    Text,
} from "@mantine/core";

import "./CheapestMatchedProduct.css";

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

interface CheapestMatchedProductProps {
    stores: ProductsByStore;
}

export function CheapestMatchedProduct({
                                           stores
                                       }: CheapestMatchedProductProps) {

    const cheapestProduct = Object.entries(stores)
        .flatMap(([storeName, products]) =>
            products.map(product => ({
                ...product,
                storeName,
            }))
        )
        .filter(product =>
            product.price > 0
        )
        .sort((a, b) =>
            a.price - b.price
        )[0];

    if (!cheapestProduct) {
        return (
            <Card
                className="cheapest-matched-product"
                radius="lg"
                padding="lg"
                withBorder
            >
                <Text
                    fw={700}
                    size="lg"
                >
                    Producto más barato coincidente
                </Text>

                <Text
                    mt="lg"
                    size="sm"
                    c="dimmed"
                >
                    No se encontraron productos.
                </Text>
            </Card>
        );
    }

    return (
        <Card
            className="cheapest-matched-product"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text
                fw={700}
                size="lg"
            >
                Producto más barato coincidente
            </Text>

            <Group
                mt="lg"
                gap="lg"
                wrap="nowrap"
            >

                {cheapestProduct.imageUrl && (
                    <Image
                        src={cheapestProduct.imageUrl}
                        alt={cheapestProduct.name}
                        className="cheapest-matched-product__image"
                        fit="contain"
                    />
                )}

                <Stack gap={3}>

                    <Text fw={600}>
                        {cheapestProduct.name}
                    </Text>

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        {cheapestProduct.storeName}
                    </Text>

                    <Text
                        fw={700}
                        size="xl"
                    >
                        {formatPrice(
                            cheapestProduct.price
                        )}
                    </Text>

                </Stack>

            </Group>
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