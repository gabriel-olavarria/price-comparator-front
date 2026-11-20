
import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import type {
    CanonicalGroupResponse
} from "../../models/MetricResponse.ts";

const SCROLL_DISTANCE = 160;
const SCROLL_TOLERANCE = 1;

export function useTopProductCard(group: CanonicalGroupResponse) {

    // PRODUCTOS Y PRECIOS

    const products = useMemo(
        () => [...group.products].sort(
            (a, b) => a.price - b.price
        ),
        [group.products]
    );

    const cheapestProduct = products[0];

    const otherProducts = useMemo(
        () => products.slice(1),
        [products]
    );

    const imageUrl = useMemo(
        () => products.find(
            product => product.imageUrl
        )?.imageUrl,
        [products]
    );

    // ESTADO DEL CARRUSEL

    const carouselRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // ACTUALIZAR ESTADO DEL DESPLAZAMIENTO

    useEffect(() => {

        const element = carouselRef.current;

        if (!element) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        const updateScroll = () => {

            const {
                scrollLeft,
                scrollWidth,
                clientWidth
            } = element;

            const maxScroll = Math.max(
                0,
                scrollWidth - clientWidth
            );

            setCanScrollLeft(
                scrollLeft > SCROLL_TOLERANCE
            );

            setCanScrollRight(
                maxScroll - scrollLeft > SCROLL_TOLERANCE
            );
        };

        const observer = new ResizeObserver(updateScroll);

        observer.observe(element);

        const content = element.firstElementChild;

        if (content) {
            observer.observe(content);
        }

        element.addEventListener(
            "scroll",
            updateScroll,
            { passive: true }
        );

        updateScroll();

        return () => {
            observer.disconnect();

            element.removeEventListener(
                "scroll",
                updateScroll
            );
        };

    }, [products]);

    // DESPLAZAR CARRUSEL

    const scroll = (direction: number): void => {

        const element = carouselRef.current;

        if (!element || !Number.isFinite(direction)) {
            return;
        }

        element.scrollBy({
            left: direction * SCROLL_DISTANCE,
            behavior: "smooth"
        });
    };

    // ABRIR PRODUCTO EN EL SUPERMERCADO

    const openProduct = (url?: string | null): void => {

        if (!url) {
            return;
        }

        try {
            const parsedUrl = new URL(url);

            if (
                parsedUrl.protocol !== "https:" &&
                parsedUrl.protocol !== "http:"
            ) {
                return;
            }

            window.open(
                parsedUrl.href,
                "_blank",
                "noopener,noreferrer"
            );

        } catch {
            // Ignorar enlaces inválidos.
        }
    };

    return {
        // Productos
        products,
        cheapestProduct,
        otherProducts,
        imageUrl,

        // Carrusel
        carouselRef,
        canScrollLeft,
        canScrollRight,
        scroll,

        // Navegación
        openProduct
    };
}
