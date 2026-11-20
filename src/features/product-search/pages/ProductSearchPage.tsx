import "./ProductSearchPage.css";

import { TurnstileVerification } from "../../../shared/security/TurnstileVerification";
import { useProductSearchPage } from "./useProductSearchPage.ts";
import { ProductSearchForm } from "../components/product-search-form/ProductSearchForm";
import { ResultTopProducts } from "../components/result-top-products/ResultTopProducts";
import { Hero } from "../../../app/components/hero/Hero.tsx";
import { StoreMarket } from "../components/store-market/StoreMarket.tsx";
import { ResultHead } from "../components/result-head/ResultHead.tsx";
import { ResultSearch } from "../components/result-search/ResultSearch.tsx";
import { Center, Loader } from "@mantine/core";

export function ProductSearchPage() {
  const { result, isLoading, isSearching, error, handleSearch, turnstile } =
    useProductSearchPage();

  return (
    <>
      <main className="search-content">
        <Hero />
        <ProductSearchForm
          isLoading={isLoading || isSearching}
          onSearch={handleSearch}
        />
        <div className="turnstile-container">
          <TurnstileVerification
            action="product_search"
            ref={turnstile.turnstileRef}
            onVerified={turnstile.onVerified}
            onExpired={turnstile.onExpired}
            onError={turnstile.onError}
          />
        </div>

        {turnstile.verificationError && (
          <p className="search-error" role="alert">
            {turnstile.verificationError}
          </p>
        )}

        <StoreMarket />

        {error && (
          <p className="search-error" role="alert">
            {error}
          </p>
        )}
      </main>
      {isLoading ? (
        <Center mih={300}>
          <Loader size={36} color="violet" type="dots" />
        </Center>
      ) : (
        result && (
          <>
            <main className="results-content">
              <ResultHead />
              <ResultTopProducts />
            </main>
            <main className="results-content">
              <ResultSearch />
            </main>
          </>
        )
      )}
    </>
  );
}
