import { useProductSearchStore } from "../../../../stores/productSearchStore";
import {QuantitiesByMarket} from "./QuantitiesByMarket.tsx";
import {QuantitiesChartByMarket} from "./QuantitiesChartByMarket.tsx";
import {CheapestProduct} from "./CheapestProduct.tsx";
import type {CanonicalProductWithStore} from "../../../../services/productCanonical.ts";

interface QuantitiesSectionProps {
    cheapestComparableProduct: CanonicalProductWithStore | null;
}
export function QuantitiesSection({cheapestComparableProduct}: QuantitiesSectionProps) {

    const stores = useProductSearchStore(state => state.result?.stores ?? {});
    //const matchedProducts = useMatchedProducts();

    return (
        <div className="metrics-panel__counts">
            <QuantitiesByMarket stores={stores}/>
            <QuantitiesChartByMarket stores={stores}/>
            <CheapestProduct cheapestComparableProduct={cheapestComparableProduct}/>
        </div>
    );
}