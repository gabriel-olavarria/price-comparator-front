import { PiggyBank, Plus } from "lucide-react";
import { useSummaryEmpty } from "./useSummaryEmpty";
 

export function SummaryEmpty() {
  const { addMore } = useSummaryEmpty();

  return (
    <section className="smart-cart-empty">
      <div className="smart-cart-empty-icon">
        <PiggyBank />
      </div>

      <h2>Tu carrito está vacío</h2>

      <p>
        Agrega productos obtener el resumen de tu lista
      </p>

      <button type="button" className="smart-cart-add-more" onClick={addMore}>
        <span className="smart-cart-add-icon">
          <Plus size={24} strokeWidth={2.5} />
        </span>

        <span>Agregar Productos</span>
      </button>
    </section>
  );
}
