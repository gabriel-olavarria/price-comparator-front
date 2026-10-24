import type { ProductOffer } from "../../../models/ProductOffer";
import { ProductCard } from "./ProductCard";
import "./styles/StoreSection.css";
import { useState } from "react";
import {ChevronDown} from "lucide-react";

interface StoreSectionProps {
    storeName: string;
    products: ProductOffer[];
}
export function StoreSection({storeName, products}: StoreSectionProps) {
    const [expanded, setExpanded] = useState(true);
    if (products.length === 0) {
        return null;
    }

    
    return (
        <section className="store-products-section">
            <header className="store-products-section__header">
                <div>
                    <h2 className="store-products-section__title">
                        {storeName}
                    </h2>

                    <p className="store-products-section__subtitle">
                        Productos disponibles en {storeName}
                    </p>
                </div>
             
                <button
                    type="button"
                    className="store-products-section__toggle"
                    onClick={() => setExpanded(!expanded)}
                >
        <span>
            {products.length} productos
        </span>

                    <ChevronDown
                        size={18}
                        className={
                            expanded
                                ? "arrow open"
                                : "arrow"
                        }
                    />

                </button>

            </header>
            {expanded && (

                <div className="store-products-section__grid">

                    {products.map(product => (

                        <ProductCard
                            key={`${storeName}-${product.productUrl}`}
                            product={product}
                        />

                    ))}

                </div>

            )}
        </section>
    );
}