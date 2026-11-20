import type { CartItem } from "../../../smart-cart/models/cartItem.models.ts";

import { useAddToCartButton } from "./useAddToCartButton.ts";

import "./AddToCartButton.css";

interface AddToCartButtonProps {
    item: Omit<CartItem, "quantity">;
    disabled?: boolean;
    onClick?: () => void;
}

export function AddToCartButton({ item, disabled = false, onClick }: AddToCartButtonProps) {

    const { isInCart, handleAddToCart } = useAddToCartButton({ item, disabled, onClick });

    return (
        <button
            type="button"
            className="store-product-add-cart"
            title={
                isInCart
                    ? "Agregar otra unidad al carrito"
                    : "Añadir al carrito inteligente"
            }
            aria-label={
                isInCart
                    ? `Agregar otra unidad de ${item.name}`
                    : `Añadir ${item.name} al carrito inteligente`
            }
            onClick={handleAddToCart}
            disabled={disabled}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </svg>
        </button>
    );
}