import { useState } from "react";

import "./ResultSearch.css";

import { useSearchResultStore } from "../../stores/searchResultStore.ts";
import { AddToCartButton } from "../add-cart-button/AddToCartButton.tsx";

import type { CartItem } from "../../../smart-cart/models/cartItem.models.ts";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

interface StoreProduct {
  name: string;
  price: number;
  brand?: string | null;
  imageUrl?: string | null;
  availability?: string | null;
  productUrl?: string | null;
  canonicalKey?: string | null;
}

/**
 * Transforma un producto del supermercado
 * en un producto compatible con el carrito.
 */
function toStoreCartItem(product: StoreProduct, store: string,): Omit<CartItem, "quantity"> | null {
  if (!product.name || !Number.isFinite(product.price)) {
    return null;
  }

  const canonicalKey = product.canonicalKey?.trim() || product.name;

  const offerId = product.productUrl?.trim() || `${store}:${product.name}`;

  return {
    offerId,
    canonicalKey,
    name: product.name,
    imageUrl: product.imageUrl ?? undefined,
    referenceOffer: {
      store,
      unitPrice: product.price,
    },
  };
}

export function ResultSearch() {
  const storesProducts = useSearchResultStore((state) => state.search);

  const [selectedStore, setSelectedStore] = useState("");

  const stores = storesProducts?.stores ?? {};

  const storeNames = Object.keys(stores);

  // Mantener la selección si existe en la búsqueda actual.
  // Si no existe, seleccionar el primer supermercado disponible.
  const activeStore = storeNames.includes(selectedStore)
    ? selectedStore
    : (storeNames[0] ?? "");

  const products = stores[activeStore] ?? [];

  if (storeNames.length === 0) {
    return null;
  }

  return (
    <section className="store-products-section">
      {/* ENCABEZADO */}
      <div className="store-products-header">
        <div>
          <h2>Productos por supermercado</h2>

          <p>Resultados para "{storesProducts?.query}"</p>
        </div>

        <span className="store-total-results">
          {storesProducts?.totalResults} productos
        </span>
      </div>

      {/* FILTROS POR SUPERMERCADO */}
      <div className="store-tabs">
        {storeNames.map((store) => (
          <button
            key={store}
            type="button"
            className={activeStore === store ? "active" : ""}
            onClick={() => setSelectedStore(store)}
          >
            {store} ({stores[store]?.length ?? 0})
          </button>
        ))}
      </div>

      {/* INFORMACIÓN DEL SUPERMERCADO */}
      <div className="store-products-info">
        <h3>{activeStore}</h3>

        <span>{products.length} productos encontrados</span>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div className="store-products-grid">
        {products.map((product, index) => {
          const cartItem = toStoreCartItem(product, activeStore);

          const productKey = product.productUrl
            ? `${activeStore}:${product.productUrl}`
            : `${activeStore}:${product.name}:${index}`;

          return (
            <article key={productKey} className="store-product-card">
              {/* AGREGAR AL CARRITO */}
              {cartItem && <AddToCartButton item={cartItem} />}

              {/* IMAGEN */}
              <div className="store-product-image">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <span>Sin imagen</span>
                )}
              </div>

              {/* INFORMACIÓN */}
              <div className="store-product-content">
                {product.brand && (
                  <span className="store-product-brand">{product.brand}</span>
                )}

                <h3>{product.name}</h3>

                <strong className="store-product-price">
                  {priceFormatter.format(product.price)}
                </strong>

                {product.availability && (
                  <span className="store-product-availability">
                    {product.availability}
                  </span>
                )}

                {product.productUrl && (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-product-button"
                  >
                    Ver producto
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
