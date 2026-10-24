import "../styles/QuantitiesByMarket.css";
import {useSearchResultStore} from "../../../../stores/searchResultStore.ts";


const STORE_COLORS = [
    "#1677f2",
    "#169b55",
    "#e72d45",
    "#ef3858",
    "#72c936",
];

export function QuantitiesByMarket() {

    const totalProductsByStore = useSearchResultStore(
        (state) => state.metrics?.totalProductsByStore
    ) ?? [];
    
    const totalProducts = totalProductsByStore.reduce((total, item) => total + item.totalProducts, 0);
    const maxProducts = Math.max(...totalProductsByStore.map((item) => item.totalProducts), 1);

    const formatNumber = (value: number) => new Intl.NumberFormat("es-CL").format(value);

    return (
        <article className="market-card">
            <div className="market-card__header">
                <div className="market-card__heading">
                    <div className="market-card__title-row">
                        <svg
                            width="35"
                            height="35"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg>

                        <h2>Supermercados</h2>
                    </div>

                    <div className="market-card__summary">
                        <p>Productos encontrados</p>
                        <strong>{formatNumber(totalProducts)}</strong>
                    </div>
                </div>

                <div className="market-card__decoration" aria-hidden="true">
                    <span/>
                    <span/>
                    <span/>
                </div>
            </div>

            <div className="market-card__body">
                <div className="market-card__stores">
                    {totalProductsByStore.map((item, index) => {
                        const percentage =
                            (item.totalProducts / maxProducts) * 100;

                        return (
                            <div className="market-card__store" key={item.store}>
                                <div
                                    className="market-card__store-icon"
                                    style={{
                                        backgroundColor:
                                            STORE_COLORS[index % STORE_COLORS.length],
                                    }}
                                >
                  <span>
                    {item.store.charAt(0).toUpperCase()}
                  </span>
                                </div>

                                <div className="market-card__store-info">
                  <span className="market-card__store-name">
                    {item.store}
                  </span>

                                    <div className="market-card__progress">
                                        <div
                                            className="market-card__progress-fill"
                                            style={{width: `${percentage}%`}}
                                        />
                                    </div>
                                </div>

                                <strong className="market-card__store-total">
                                    {formatNumber(item.totalProducts)}
                                </strong>
                            </div>
                        );
                    })}
                </div>
            </div>
        </article>
    );
}