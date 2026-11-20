
import "./Hero.css";

export function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
                <h1 id="hero-title">
                    Compara precios en
                    <br />
                    los principales
                    <br />
                    supermercados
                </h1>

                <p>
                    Encuentra dónde está más barato tu súper
                    y ahorra en cada compra.
                </p>
            </div>

            <div className="hero-art" aria-hidden="true">
                <div className="hero-orbit" />

                <span className="grocery greens">🥬</span>
                <span className="grocery banana">🍌</span>
                <span className="grocery carrot">🥕</span>
                <span className="grocery milk">🥛</span>

                <span className="discount-tag">%</span>

                <div className="basket">
                    <div className="basket-rim" />

                    <div className="basket-body">
                        <i />
                        <i />
                        <i />
                        <i />
                    </div>
                </div>
            </div>
        </section>
    );
}
