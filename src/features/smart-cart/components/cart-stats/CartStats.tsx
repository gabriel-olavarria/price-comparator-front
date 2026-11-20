import { ClipboardList } from "lucide-react";

import { useCartStats } from "./useCartStats";

import "./CartStats.css";

export function CartStats() {
  const { totalUniqueProducts, totalItems, totalSupermarkets } = useCartStats();

  return (
    <section className="cart-stats">
      {/* ENCABEZADO */}
      <header className="summary-header">
        <div className="summary-heading">
          <div className="summary-heading-icon">
            <ClipboardList />
          </div>

          <h3>Resumen de Productos </h3>
        </div>
      </header>

      {/* ESTADÍSTICAS */}
      <div className="cart-stats-list">
        <div className="cart-stats-item">
          <span className="cart-stats-label">Productos diferentes</span>

          <strong className="cart-stats-value">{totalUniqueProducts}</strong>
        </div>

        <div className="cart-stats-item">
          <span className="cart-stats-label">Unidades en el carrito</span>

          <strong className="cart-stats-value">{totalItems}</strong>
        </div>
        <div className="cart-stats-item">
          <span className="cart-stats-label">Total de Supermercados</span>

          <strong className="cart-stats-value">{totalSupermarkets}</strong>
        </div>
      </div>
    </section>
  );
}
