import { useSmartCartPage } from "./useSmartCartPage";
import { useSmartCart } from "../hooks/useSmartCart";

import { CartTabs } from "../components/cart-tabs/CartTabs";
import { CartProductList } from "../components/cart-product-list/CartProductList";
import { Cart } from "../components/cart/Cart";
import CartSummary from "../components/cart-summary/CartSummary";

import "./SmartCartPage.css";

export function SmartCartPage() {
  const { activeTab, setActiveTab } = useSmartCartPage();
  const { isEmpty } = useSmartCart();

  return (
    <div className="smart-cart-page">
      <div className="smart-cart-container">
        {/* ENCABEZADO */}
        <header className="smart-cart-header">
          <div className="smart-cart-header-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </div>

          <div className="smart-cart-header-text">
            <h1>Mi carrito inteligente</h1>

            <p>
              Agrega los productos de tu lista y te mostramos dónde comprarlos
              más barato.
            </p>
          </div>
        </header>

        {/* PESTAÑAS */}
        <CartTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MI CARRITO */}
        {activeTab === "cart" && (
          <div className="smart-cart-tab-content">
            {isEmpty ? <Cart /> : <CartProductList />}
          </div>
        )}

        {/* OPTIMIZACIÓN */}
        {activeTab === "optimization" && (
          <section className="smart-cart-placeholder">
            <div className="smart-cart-placeholder-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 17l6-6 4 4 8-8" />
                <path d="M15 7h6v6" />
              </svg>
            </div>

            <h2>Optimización de compra</h2>

            <p>
              Aquí compararemos los supermercados para encontrar la combinación
              más económica, considerando precios y costos de traslado.
            </p>
          </section>
        )}

        {/* MI RESUMEN */}
        {activeTab === "summary" && <CartSummary />}
      </div>
    </div>
  );
}
