
import { ProductCard } from "./ProductCard";
import "./styles/StoreSection.css";
import { useState } from "react";
import {ChevronDown} from "lucide-react";
import type {Product} from "../../../models/Product.ts";
import unimarcLogo from "../../../../../assets/unimarc-logo.svg";
import jumboLogo from "../../../../../assets/jumbo-logo.png";
import liderLogo from "../../../../../assets/lider-logo.png";
import santeIsabelLogo from "../../../../../assets/santaIsabel.png";
import tottusLogo from "../../../../../assets/tottus-logo.png";

interface StoreSectionProps {
    storeName: string;
    products: Product[];
    storeCode: string;
}

const storeLogos: Record<string, string> = {
    UNIMARC: unimarcLogo,
    JUMBO: jumboLogo,
    LIDER: liderLogo,
    SANTA_ISABEL: santeIsabelLogo,
    TOTTUS: tottusLogo,
};

export function StoreSection({storeName, products, storeCode}: StoreSectionProps) {
    const [expanded, setExpanded] = useState(true);
    if (products.length === 0) {
        return null;
    }

    
    return (
        <section className="store-products-section">
            <header className="store-products-section__header">
                <div className="store-products-section-container__header">
                    <div className={`search-results__store-logo ${storeCode == "UNIMARC" ? "results-logo-unimarc" : ""}`}>
                        <img  src={storeLogos[storeCode]}
                              alt={`Logo de ${storeName}`} />
                    </div>
                    <div>
                        <h2 className="store-products-section__title">
                            {storeName}
                        </h2>
                        <p className="store-products-section__subtitle">
                            Productos disponibles en {storeName}
                        </p>
                    </div>
                   
                    
                </div>
             
                
                    <button type="button" className="store-products-section__toggle" onClick={() => setExpanded(!expanded)}>
                    <span>
                        {products.length} productos
                    </span>
                        <ChevronDown size={18} className={expanded ? "arrow open" : "arrow"}/>
                    </button>
           
                 

            </header>
            {expanded && (

                <div className="store-products-section__grid">
                    {products.map(product => (
                        <ProductCard key={`${storeName}-${product.productUrl}`} product={product}/>
                    ))}
                </div>

            )}
        </section>
    );
}