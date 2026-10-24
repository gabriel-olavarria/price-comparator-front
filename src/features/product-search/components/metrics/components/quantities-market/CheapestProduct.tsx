import { Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { ArrowDown } from "lucide-react";
import { useProductFocusStore } from "../../../../stores/productFocusStore";
import type { CanonicalProductWithStore } from "../../../../services/productCanonical.ts";
import "../styles/CheapestProduct.css";

interface CheapestProductProps {
    cheapestComparableProduct: CanonicalProductWithStore | null;
}

/**
 * TERCERA TARJETA
 *
 * Producto más barato dentro de los grupos comparables.
 */
export function CheapestProduct({cheapestComparableProduct}: CheapestProductProps) {
    const setFocusedProduct = useProductFocusStore(state => state.setFocusedProduct);

    function goToProduct() {
        if (!cheapestComparableProduct?.product.productUrl) {
            return;
        }

        const productUrl = cheapestComparableProduct.product.productUrl;

        setFocusedProduct(productUrl, "purple");

        requestAnimationFrame(() => {
            const element = document.querySelector(
                `[data-product-url="${CSS.escape(productUrl)}"]`
            );

            element?.scrollIntoView({behavior: "smooth", block: "center"});
        });
    }

    if (!cheapestComparableProduct) {
        return (
            <Card className="cheapest-matched-product" radius="lg" padding="lg" withBorder>
                <Text fw={700} size="lg">Producto más barato coincidente</Text>
                <Text mt="lg" size="sm" c="dimmed">No se encontraron productos comparables.</Text>
            </Card>
        );
    }

    const product = cheapestComparableProduct.product;

    return (
        <Card className="cheapest-matched-product" radius="lg" padding="lg" withBorder>
            <Text fw={700} size="lg">
                Producto más barato coincidente
            </Text>

            <Group mt="lg" gap="lg" wrap="nowrap">
                {product.imageUrl && (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        className="cheapest-matched-product__image"
                        fit="contain"
                    />
                )}

                <Stack gap={3}>
                    <Text fw={600}>{product.name}</Text>
                    <Text size="sm" c="dimmed">{cheapestComparableProduct.storeName}</Text>
                    <Text fw={700} size="xl">{formatPrice(product.price)}</Text>
                </Stack>
            </Group>

            <Button mt="lg" fullWidth className="cheapest-matched-product__button" leftSection={<ArrowDown size={17}/>} onClick={goToProduct}>
                Ir a Producto
            </Button>
        </Card>
    );
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(price);
}