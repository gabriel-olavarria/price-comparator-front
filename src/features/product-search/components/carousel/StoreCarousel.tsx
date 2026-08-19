import {useCallback, useEffect, useRef, useState} from "react";
import { StoreCard } from "./StoreCard.tsx";
import liderLogo from "../../../../assets/Lider.png";
import jumboLogo from "../../../../assets/jumbo.png";
import unimarcLogo from "../../../../assets/unimarc.svg";
import santaIsabelLogo from "../../../../assets/santaIsabel.png";
import aCuentaLogo from "../../../../assets/ACuenta.png";
import tottusLogo from "../../../../assets/tottus.png";

interface Store {
    id: number;
    name: string;
    logoUrl: string;
}

const stores: Store[] = [
    {
        id: 1,
        name: "Lider",
        logoUrl: liderLogo,
    },
    {
        id: 2,
        name: "Jumbo",
        logoUrl: jumboLogo,
    },
    {
        id: 3,
        name: "Unimarc",
        logoUrl: unimarcLogo,
    },
    {
        id: 4,
        name: "Santa Isabel",
        logoUrl: santaIsabelLogo,
    },
    {
        id: 5,
        name: "aCuenta",
        logoUrl: aCuentaLogo,
    },
    {
        id: 6,
        name: "Tottus",
        logoUrl: tottusLogo,
    },
];

export function StoreCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const moveCarousel = useCallback(() => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const firstCard =
            carousel.querySelector<HTMLElement>(".store-card");

        if (!firstCard) {
            return;
        }

        const styles = window.getComputedStyle(carousel);
        const gap = Number.parseFloat(styles.columnGap) || 0;

        const movement = firstCard.offsetWidth + gap;

        const maximumScroll =
            carousel.scrollWidth - carousel.clientWidth;

        const reachedEnd =
            carousel.scrollLeft >= maximumScroll - 5;

        carousel.scrollTo({
            left: reachedEnd
                ? 0
                : Math.min(
                    carousel.scrollLeft + movement,
                    maximumScroll,
                ),
            behavior: "smooth",
        });
    }, []);

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const intervalId = window.setInterval(
            moveCarousel,
            2500,
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isPaused, moveCarousel]);

    return (
        <section className="store-section">
            <div
                ref={carouselRef}
                className="store-carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {stores.map((store) => (
                    <StoreCard
                        key={store.id}
                        name={store.name}
                        logoUrl={store.logoUrl}
                    />
                ))}
            </div>
        </section>
    );
}