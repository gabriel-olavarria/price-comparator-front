
import { useResultHead } from "./useResultHead";
import type { SortOption } from "./useResultHead";

import "./ResultHead.css";

export function ResultHead() {
    const {
        stores,
        totalResults,
        query,
        selectedStore,
        sortBy,
        onStoreChange,
        onSortChange
    } = useResultHead();

    return (
        <>
            <section className="results-heading">
                <h1>
                    Resultados para “{query}”
                </h1>

                <p>
                    {totalResults}{" "}
                    {totalResults === 1
                        ? "producto encontrado"
                        : "productos encontrados"}
                </p>
            </section>

            <div className="results-toolbar">
                <div
                    className="store-filters"
                    role="group"
                    aria-label="Filtrar por supermercado"
                >
                    <button
                        type="button"
                        className={`filter-chip ${
                            selectedStore === null ? "active" : ""
                        }`}
                        aria-pressed={selectedStore === null}
                        onClick={() => onStoreChange(null)}
                    >
                        Todos
                    </button>

                    {stores.map((store) => (
                        <button
                            key={store}
                            type="button"
                            className={`filter-chip ${
                                selectedStore === store ? "active" : ""
                            }`}
                            aria-pressed={selectedStore === store}
                            onClick={() => onStoreChange(store)}
                        >
                            {store}
                        </button>
                    ))}
                </div>

                <label className="sort-control">
                    <span>Ordenar por:</span>

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            onSortChange(
                                event.target.value as SortOption
                            )
                        }
                        aria-label="Ordenar resultados"
                    >
                        <option value="price-asc">
                            Menor precio
                        </option>

                        <option value="price-desc">
                            Mayor precio
                        </option>

                        <option value="name">
                            Nombre
                        </option>
                    </select>
                </label>
            </div>
        </>
    );
}
