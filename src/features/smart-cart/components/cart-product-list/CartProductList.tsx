import { Plus, Trash2 } from "lucide-react";

import { useCartProductList } from "./useCartProductList";

import "./CartProductList.css";

export function CartProductList() {
  const {
    items,
    totalUnits,
    totalPrice,
    formatPrice,
    updateQuantity,
    removeItem,
    clearCart,
    addMore,
  } = useCartProductList();

  return (
    <section className="cart-product-list">
      {/* ENCABEZADO */}
      <header className="cart-product-list-header">
        <div>
          <h2>Productos seleccionados</h2>

          <p>
            {items.length} ofertas seleccionadas · {totalUnits} unidades
          </p>
        </div>

        <span className="cart-product-list-count">{totalUnits} unidades</span>
      </header>

      {/* LISTADO */}
      <div className="cart-product-list-items">
        {items.map((item) => {
          const unitPrice = item.referenceOffer.unitPrice;
          const subtotal = unitPrice * item.quantity;

          return (
            <article key={item.offerId} className="cart-product-list-item">
              {/* IMAGEN */}
              <div className="cart-product-list-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} loading="lazy" />
                ) : (
                  <span aria-hidden="true">🛒</span>
                )}
              </div>

              {/* INFORMACIÓN */}
              <div className="cart-product-list-info">
                <h3>{item.name}</h3>

                <p className="cart-product-list-store">
                  {item.referenceOffer.store}
                  <span className="cart-product-list-dot">·</span>
                  {formatPrice(unitPrice)} c/u
                </p>
              </div>

              {/* CANTIDAD */}
              <div className="cart-product-list-quantity">
                <button
                  type="button"
                  disabled={item.quantity <= 1}
                  aria-label={`Disminuir cantidad de ${item.name}`}
                  onClick={() =>
                    updateQuantity(item.offerId, item.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  aria-label={`Aumentar cantidad de ${item.name}`}
                  onClick={() =>
                    updateQuantity(item.offerId, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* SUBTOTAL */}
              <div className="cart-product-list-subtotal">
                {formatPrice(subtotal)}
              </div>

              {/* ELIMINAR */}
              <button
                type="button"
                className="cart-product-list-remove"
                aria-label={`Eliminar ${item.name} de ${item.referenceOffer.store}`}
                title="Eliminar producto"
                onClick={() => removeItem(item.offerId)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 15h10l1-15" />
                  <path d="M10 10v7M14 10v7" />
                </svg>
              </button>
            </article>
          );
        })}
      </div>

      {/* ACCIONES */}
      <footer className="cart-product-list-footer">
        <button
          type="button"
          className="cart-product-list-add"
          onClick={addMore}
        >
          <span className="cart-product-list-add-icon">
            <Plus size={22} strokeWidth={2.0} aria-hidden="true" />
          </span>

          <span>Agregar otro producto</span>
        </button>

        <div className="cart-product-list-footer-right">
          {/* TOTAL */}
          <div className="cart-product-list-total">
            <span>Total seleccionado</span>

            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          {/* VACIAR CARRITO */}
          <button
            type="button"
            className="cart-clear-button"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            <Trash2 size={18} strokeWidth={1.8} />

            <span>Vaciar carrito</span>
          </button>
        </div>
      </footer>
    </section>
  );
}
