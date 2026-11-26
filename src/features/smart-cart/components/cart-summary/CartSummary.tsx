import { CartStats } from "../cart-stats/CartStats";
import { SupermarketRoute } from "../cart-supermarket-route/SupermarketRoute";
import { FuelCalculate } from "../cart-fuel-calculate/FuelCalculate.tsx";

import "./CartSummary.css";
import { useCartSummary } from "./useCartSummary.ts";
import { SummaryEmpty } from "../summary-empty/SummaryEmpty.tsx";
 

export default function CartSummary() {
  const { storeKeys, supermarketsSegments } = useCartSummary();

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
              <SupermarketRoute routeSegments={supermarketsSegments} />
            </div>
          </div>
          <div className="cart-summary-bottom">
            <FuelCalculate routeSegments={supermarketsSegments} />
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
