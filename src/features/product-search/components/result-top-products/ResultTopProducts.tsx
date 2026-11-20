import "./ResultTopProducts.css";
import { useSearchResultStore } from "../../stores/searchResultStore.ts";
import { TopProductCard } from "../top-product-card/TopProductCard.tsx";


export function ResultTopProducts() {
    const groups = useSearchResultStore(
        state => state.metrics?.topCanonicalGroups
    );

    
    return (
        <section className="product-results">
            {groups?.map(group => (
                <TopProductCard
                    key={group.canonicalKey}
                    group={group}
                />
            ))}
       
        </section>
    );
}