import { useSmartCart } from "../../../smart-cart/hooks/useSmartCart.ts";
import type { CartItem } from "../../../smart-cart/models/cartItem.models.ts";
import { toast } from "sonner";

interface UseAddToCartButtonProps {
    item?: Omit<CartItem, "quantity">;
    disabled?: boolean;
    onClick?: () => void;
}

export function useAddToCartButton({item, disabled = false, onClick}: UseAddToCartButtonProps) {

    const { addItem, hasItem } = useSmartCart();

    const isInCart = item ? hasItem(item.offerId) : false;

    const handleAddToCart = (): void => {
        if (disabled || !item) {
            return;
        }

        addItem(item);
        toast.success(isInCart
                ? "Se agregó otra unidad al carrito"
                : "Producto agregado al carrito",
            {
                description: item.name,
                duration: 3000,
                id: `cart-${item.offerId}`
            }
        );
        
        onClick?.();
    };

    return {
        isInCart,
        isDisabled: disabled || !item,
        handleAddToCart
    };
}