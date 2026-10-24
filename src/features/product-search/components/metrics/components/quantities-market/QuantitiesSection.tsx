import {QuantitiesByMarket} from "./QuantitiesByMarket.tsx";
import {QuantitiesChartByMarket} from "./QuantitiesChartByMarket.tsx";
import {CheapestProduct} from "./CheapestProduct.tsx";

export function QuantitiesSection() {
 
    return (
        <div className="metrics-panel__counts">
            <QuantitiesByMarket />
            <QuantitiesChartByMarket />
            <CheapestProduct />
        </div>
    );
}