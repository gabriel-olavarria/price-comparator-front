import { ProductSearchForm } from "../components/search-bar/ProductSearchForm";
import { SearchResults } from "../components/SearchResults";
import { useProductSearch } from "../hooks/useProductSearch";
import { StoreCarousel } from "../components/carousel/StoreCarousel.tsx";
import { motion } from "motion/react";

export function ProductSearchPage() {
    const {result, isLoading, error, search} = useProductSearch();
    const title = "Comparador de Precios";
    
    return (
        <main className={result ? "search-page search-page--results" : "search-page"}>
            <section className="search-hero">

                <h1 className="search-hero__title" aria-label={title}>
                    {title.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            aria-hidden="true"
                            style={{ display: "inline-block" }}
                            initial={{
                                opacity: 0,
                                y: 40,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.035,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>
                <p className="search-hero__subtitle">
                    Compara precios disponibles entre distintas marcas de súpermercados
                </p>
                <ProductSearchForm isLoading={isLoading} onSearch={search}/>
                {!result && (
                    <StoreCarousel />
                )}
              
            </section>

            {error && (
                <p className="search-error" role="alert">
                    {error}
                </p>
            )}
            

            {result && (
                <section className="store-products-container">
                    <SearchResults result={result} />
                </section>
            )}
        </main>
    );
}