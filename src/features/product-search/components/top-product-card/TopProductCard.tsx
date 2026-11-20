
import type { CanonicalGroupResponse } from "../../models/MetricResponse.ts";

import { AddToCartButton } from "../add-cart-button/AddToCartButton.tsx";
import { useTopProductCard } from "./useTopProductCard.ts";

import "./TopProductCard.css";

interface TopProductCardProps {
    group: CanonicalGroupResponse;
    onViewDetail?: (group: CanonicalGroupResponse) => void;
}

const priceFormatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
});

export function TopProductCard({
                                   group,
                                   onViewDetail
                               }: TopProductCardProps) {

    const {
        products,
        cheapestProduct,
        otherProducts,
        imageUrl,
        carouselRef,
        canScrollLeft,
        canScrollRight,
        scroll,
        openProduct
    } = useTopProductCard(group);

    // DATOS PARA EL CARRITO
    const cartItem = cheapestProduct
        ? {
            offerId: `${cheapestProduct.store}:${group.canonicalKey}`,
            canonicalKey: group.canonicalKey,
            name: group.canonicalName,
            imageUrl:
                cheapestProduct.imageUrl ??
                imageUrl ??
                undefined,
            referenceOffer: {
                store: cheapestProduct.store,
                unitPrice: cheapestProduct.price
            }
        }
        : null;

    return (
        <article className="product-result-card">

            {/* INFORMACIÓN DEL PRODUCTO */}
            <div className="product-summary">

                {cartItem && (
                    <AddToCartButton item={cartItem} />
                )}

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={group.canonicalName}
                        className="product-image"
                        loading="lazy"
                    />
                )}

                <div className="product-description">
                    <h2>{group.canonicalName}</h2>

                    <p>
                        {products.length}{" "}
                        {products.length === 1
                            ? "supermercado"
                            : "supermercados"}
                    </p>
                </div>

            </div>

            {/* COMPARACIÓN DE PRECIOS */}
            <div className="price-comparison">

                {/* OFERTA MÁS ECONÓMICA */}
                {cheapestProduct && (
                    <div className="store-price cheapest">

                        <span className="store-name">
                            {cheapestProduct.store}
                        </span>

                        <strong>
                            {priceFormatter.format(
                                cheapestProduct.price
                            )}
                        </strong>

                        <span className="cheapest-label">
                            Más barato
                        </span>

                        <button
                            type="button"
                            className="view-product-button"
                            onClick={() =>
                                openProduct(cheapestProduct.productUrl)
                            }
                            disabled={!cheapestProduct.productUrl}
                        >
                            Ver producto
                        </button>

                    </div>
                )}

                {/* OTRAS OFERTAS */}
                {otherProducts.length > 0 && (
                    <div className="price-carousel-wrapper">

                        {/* DESPLAZAR A LA IZQUIERDA */}
                        {canScrollLeft && (
                            <button
                                type="button"
                                className="carousel-arrow carousel-arrow-left"
                                onClick={() => scroll(-1)}
                                aria-label="Ver supermercados anteriores"
                            >
                                ‹
                            </button>
                        )}

                        {/* LISTADO DE SUPERMERCADOS */}
                        <div
                            className="price-carousel"
                            ref={carouselRef}
                        >
                            <div className="price-carousel-track">

                                {otherProducts.map((product, index) => (
                                    <div
                                        key={`${product.store}-${index}`}
                                        className="store-price"
                                    >

                                        <span className="store-name">
                                            {product.store}
                                        </span>

                                        <strong>
                                            {priceFormatter.format(
                                                product.price
                                            )}
                                        </strong>

                                        <button
                                            type="button"
                                            className="view-product-button"
                                            onClick={() =>
                                                openProduct(product.productUrl)
                                            }
                                            disabled={!product.productUrl}
                                        >
                                            Ver producto
                                        </button>

                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* DESPLAZAR A LA DERECHA */}
                        {canScrollRight && (
                            <button
                                type="button"
                                className="carousel-arrow carousel-arrow-right"
                                onClick={() => scroll(1)}
                                aria-label="Ver más supermercados"
                            >
                                ›
                            </button>
                        )}

                    </div>
                )}

            </div>

            {/* DETALLE DEL PRODUCTO */}
            <button
                type="button"
                className="detail-button"
                onClick={() => onViewDetail?.(group)}
                disabled={!onViewDetail}
            >
                Ver detalle
            </button>

        </article>
    );
}
