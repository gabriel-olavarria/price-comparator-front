
import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

import { ProductSearchForm } from "../components/search-bar/ProductSearchForm";
import { useProductSearch } from "../hooks/useProductSearch";
import { StoreCarousel } from "../components/carousel/StoreCarousel";
import { ProductResults } from "../components/product-results/ProductResults";
import { TurnstileVerification } from "../security/TurnstileVerification";

interface PendingSearch {
    query: string;
    categories: string[];
}

const title = "Comparador de Precios";

export function ProductSearchPage() {
    const { result, isLoading, error, search } = useProductSearch();

    const turnstileRef = useRef<TurnstileInstance>(null);
    const searchInProgressRef = useRef(false);
    const pendingSearchRef = useRef<PendingSearch | null>(null);

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);

    /**
     * 1. El usuario presiona Buscar.
     *
     * Guardamos temporalmente la búsqueda y solicitamos
     * la verificación de Cloudflare Turnstile.
     *
     * Todavía NO llamamos al backend.
     */
    const handleSearch = useCallback(
        async (query: string, categories: string[]): Promise<void> => {
            if (searchInProgressRef.current || isLoading) {
                return;
            }

            const normalizedQuery = query.trim();

            if (!normalizedQuery) {
                return;
            }

            if (!turnstileRef.current) {
                setVerificationError("La verificación de seguridad todavía no está disponible. Inténtalo nuevamente.");
                return;
            }

            searchInProgressRef.current = true;
            pendingSearchRef.current = {
                query: normalizedQuery,
                categories,
            };

            setVerificationError(null);
            setIsVerifying(true);

            try {
                turnstileRef.current.execute();
            } 
            catch (error) {
                console.error("No se pudo iniciar Turnstile:", error);
                pendingSearchRef.current = null;
                searchInProgressRef.current = false;
                setIsVerifying(false);
                setVerificationError("No se pudo iniciar la verificación de seguridad.");
            }
        },
        [isLoading]
    );

    /**
     * 2. Cloudflare completa la verificación.
     *
     * Recibimos un token nuevo y ejecutamos la búsqueda
     * que estaba pendiente.
     */
    const handleVerified = useCallback(
        async (token: string): Promise<void> => {
            const pendingSearch = pendingSearchRef.current;
           
            if (!pendingSearch) {
                return;
            }

            // Consumimos la búsqueda pendiente para evitar
            // procesarla más de una vez.
            pendingSearchRef.current = null;

            try {
                await search(pendingSearch.query, pendingSearch.categories, token);
            } 
            catch (error) {
                console.error("Error al ejecutar la búsqueda:", error);
            } 
            finally {
                // El token de Turnstile es de un solo uso.
                // Preparamos el widget para la siguiente búsqueda.
                turnstileRef.current?.reset();
                searchInProgressRef.current = false;
                setIsVerifying(false);
            }
        },
        [search]
    );

    /**
     * 3. El token expira antes de completar la búsqueda.
     */
    const handleExpired = useCallback(() => {
        // Si la búsqueda ya comenzó, su token fue entregado
        // al backend y no debemos cancelar esa operación.
        if (!pendingSearchRef.current) {
            return;
        }

        pendingSearchRef.current = null;
        searchInProgressRef.current = false;
        setIsVerifying(false);
        setVerificationError("La verificación de seguridad expiró. Presiona Buscar nuevamente.");

        turnstileRef.current?.reset();
    }, []);

    /**
     * 4. Cloudflare no puede completar la verificación.
     */
    const handleError = useCallback(() => {
        if (!pendingSearchRef.current) {
            return;
        }
        pendingSearchRef.current = null;
        searchInProgressRef.current = false;
        setIsVerifying(false);
        setVerificationError("No se pudo completar la verificación de seguridad. Inténtalo nuevamente.");

        console.warn("Turnstile: error de verificación.");
    }, []);

    return (
        <main className={result ? "search-page search-page--results" : "search-page"}>
            <section className="search-hero">
                <h1 className="search-hero__title" aria-label={title}>
                    {title.split("").map((char, index) => (
                        <motion.span key={index} aria-hidden="true" 
                                     style={{display: "inline-block",}}
                                initial={{opacity: 0, y: 40,}} 
                                animate={{opacity: 1, y: 0,}} 
                                transition={{duration: 0.5, delay: index * 0.035, ease: [0.22, 1, 0.36, 1],}}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h1>

                <p className="search-hero__subtitle">
                    Compara precios disponibles entre distintas marcas de supermercados
                </p>

                <ProductSearchForm isLoading={isLoading || isVerifying} onSearch={handleSearch}/>

                <div className="turnstile-container">
                    <TurnstileVerification ref={turnstileRef} onVerified={handleVerified} onExpired={handleExpired} onError={handleError}/>
                </div>

                {verificationError && (
                    <p className="search-error" role="alert">
                        {verificationError}
                    </p>
                )}

                {!result && <StoreCarousel />}
            </section>

            {error && (
                <p className="search-error" role="alert">{error}</p>
            )}

            {result && (
                <section className="store-products-container">
                    <ProductResults />
                </section>
            )}
        </main>
    );
}
