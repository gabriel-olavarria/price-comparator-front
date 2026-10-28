
import { Button, Card, Image, Text } from "@mantine/core";
import {ArrowDown, Star} from "lucide-react";

import { useProductFocusStore } from "../../../../stores/productFocusStore";
import { useSearchResultStore } from "../../../../stores/searchResultStore.ts";

import "../styles/CheapestProduct.css";

export function CheapestProduct() {
    const product = useSearchResultStore(
        (state) => state.metrics?.economicProduct
    );

    const setFocusedProduct = useProductFocusStore(
        (state) => state.setFocusedProduct
    );

    function goToProduct() {
        if (!product?.productUrl) return;

        const productUrl = product.productUrl;
        setFocusedProduct(productUrl, "purple");
        requestAnimationFrame(() => {
            const element = document.querySelector(`[data-product-url="${CSS.escape(productUrl)}"]`);
            element?.scrollIntoView({behavior: "smooth", block: "center",});
        });
    }

    if (!product) return null;

    return (
        <Card className="cheapest-matched-product">
            {/* ENCABEZADO */}
            <div className="cheapest-matched-product__heading">
                <div className="cheapest-matched-product__title">
                    <div className="cheapest-matched-product__icon">
                        <Star size={28} strokeWidth={2.4} />
                    </div>
                    <Text component="h2">
                        Producto más barato
                    </Text>
                </div>
                <div className="cheapest-matched-product-container__subtitle">
                    <Text  className="cheapest-matched-product__subtitle">
                        Mejor precio en los resultados
                    </Text>
                </div>

 
            </div>
            

            {/* PRODUCTO */}
            <div className="cheapest-matched-product__content">
                {/* NOMBRE ARRIBA DE LA IMAGEN */}
                <Text component="h3" className="cheapest-matched-product__name">
                    {product.name}
                </Text>

                {/* IMAGEN */}
                <div className="cheapest-matched-product__image-container">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            className="cheapest-matched-product__image"
                            fit="contain"
                        />
                    ) : (
                        <Text className="cheapest-matched-product__placeholder">
                            Sin imagen
                        </Text>
                    )}
                </div>

                {/* SUPERMERCADO Y PRECIO */}
                <div className="cheapest-matched-product__information">
                    <Text className="cheapest-matched-product__store">
                        {product.store}
                    </Text>

                    <Text className="cheapest-matched-product__price">
                        {formatPrice(Number(product.price))}
                    </Text>
                </div>
            </div>

            {/* CÍRCULOS DECORATIVOS */}
            <div
                className="cheapest-matched-product__circles"
                aria-hidden="true"
            >
                <span className="cheapest-matched-product__circle cheapest-matched-product__circle--outer" />
                <span className="cheapest-matched-product__circle cheapest-matched-product__circle--middle" />
                <span className="cheapest-matched-product__circle cheapest-matched-product__circle--inner" />
            </div>

            {/* ONDA LAVANDA */}
            <div className="cheapest-matched-product__wave" aria-hidden="true">
                <svg viewBox="0 0 400 110" preserveAspectRatio="none">
                    <path d="M0 42 C105 -4 185 14 278 39 C326 53 364 55 400 43 L400 110 L0 110 Z" fill="#eee7ff"/>
                </svg>
            </div>

            {/* BOTÓN */}
            <div className="cheapest-matched-product__footer">
                <Button fullWidth className="product__button" leftSection={<ArrowDown size={22} strokeWidth={2.5} />} onClick={goToProduct} disabled={!product.productUrl}>
                    Ir a Producto
                </Button>
            </div>
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
