import { CartStats } from "../cart-stats/CartStats";
import { SupermarketRoute } from "../cart-supermarket-route/SupermarketRoute";
import { FuelCalculate } from "../cart-fuel-calculate/FuelCalculate.tsx";

import "./CartSummary.css";
import { useCartSummary } from "./useCartSummary.ts";
import { SummaryEmpty } from "../summary-empty/SummaryEmpty.tsx";
 

export default function CartSummary() {
  const {
    storeKeys,
    dataMarket,
    selectedLocationMap,
    setSelectedLocationMap,
  } = useCartSummary();

  return (
    <>
      {storeKeys.length == 0 ? (
        <SummaryEmpty />
      ) : (
        <section className="cart-summary">
          <div className="cart-summary-top">
            <div className="cart-summary-stats">
              <CartStats />
            </div>
            <div className="cart-summary-route">
              <SupermarketRoute
                nearestByStore={dataMarket?.nearestByStore ?? []}
                selectedLocationMap={selectedLocationMap}
                setSelectedLocationMap={setSelectedLocationMap}
              />
            </div>
          </div>
          <div className="cart-summary-bottom">
            <FuelCalculate
              nearestByStore={dataMarket?.nearestByStore ?? []}
              selectedLocationMap={selectedLocationMap}
            />
          </div>

          <footer className="cart-summary-footer">
            <p>
              El ahorro estimado y el costo total estarán disponibles cuando
              implementemos la optimización.
            </p>
          </footer>
        </section>
      )}
    </>
  );
}
