import { useProductFocusStore } from "../../../stores/productFocusStore";
import type { Product } from "../../../models/Product.ts";
import "./styles/ProductCard.css";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({product}: ProductCardProps) {

    const focusedProductUrl = useProductFocusStore(state => state.focusedProductUrl);
    const focusedProductColor = useProductFocusStore(state => state.focusedProductColor);
    const isFocused = focusedProductUrl === product.productUrl;
    const focusClass = isFocused && focusedProductColor ? `product-card--focused-${focusedProductColor}` : "";

    return (
        <article className={`product-card ${focusClass}`} data-product-url={product.productUrl}>
            <img src={product.imageUrl ?? ''} alt={product.name} className="product-card__image"/>
            <h3 className="product-card__name">{product.name}</h3>
            <span className="product-card__price">${product.price.toLocaleString("es-CL")}</span>
            <a href={product.productUrl} target="_blank" rel="noreferrer" className="product-card__link"> Ver producto</a>
        </article>
    );
}