import { CarFront, Plus } from "lucide-react";
import { useLocationStore } from "../../stores/locationStore.ts";

export interface FuelCalculateEmptyProps {
  onOpened: () => void;
}


export function FuelCalculateEmpty(props: FuelCalculateEmptyProps){
  const {  onOpened } = props;
  const locationUser = useLocationStore((state) => state.locationUser);


  return (
    <section className="smart-cart-empty">
      <div className="smart-cart-empty-icon">
        <CarFront size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>

      <h2>Tu medio de transporte</h2>

      <p>
        {locationUser == null
          ? "Debe configurar su ubicación para calcular la ruta"
          : "Debe configurar su medio de transporte para medir las métricas"}
      </p>
      {locationUser && (
        <button
          type="button"
          className="smart-cart-add-more"
          onClick={onOpened}
        >
          <span className="smart-cart-add-icon">
            <Plus size={24} strokeWidth={2.5} />
          </span>

          <span>Configurar Vehículo</span>
        </button>
      )}
    </section>
  );
}
