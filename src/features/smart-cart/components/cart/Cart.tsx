import { Plus } from "lucide-react";
import { useCart } from "./useCart";

export function Cart() {
  const { addMore } = useCart();

  return (
    <section className="smart-cart-empty">
      <div className="smart-cart-empty-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
      </div>

      <h2>Tu carrito está vacío</h2>

      <p>
        Agrega productos desde el comparador para comenzar a optimizar tu
        compra.
      </p>

      <button type="button" className="smart-cart-add-more" onClick={addMore}>
        <span className="smart-cart-add-icon">
          <Plus size={24} strokeWidth={2.5} />
        </span>

        <span>Agregar otro producto</span>
      </button>
    </section>
  );
}
