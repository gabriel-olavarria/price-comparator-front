import type {ProductOffer} from "../models/ProductOffer.ts";

interface ProductCardProps {
    product: ProductOffer;
}

export function ProductCard({product}: ProductCardProps) {

    return (
        <article className="product-card">

            <img
                src={product.imageUrl ?? ''}
                alt={product.name}
                className="product-card__image"
            />

            <h3 className="product-card__name">
                {product.name}
            </h3>

            <span className="product-card__price">
                ${product.price.toLocaleString("es-CL")}
            </span>

            <a
                href={product.productUrl}
                target="_blank"
                rel="noreferrer"
                className="product-card__link">
                Ver producto
            </a>
        </article>
    );
}
