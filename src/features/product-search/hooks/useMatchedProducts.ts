import { useMemo } from "react";

import { useProductSearchStore } from "../stores/productSearchStore";
import { matchProductsByStore } from "../services/productMatching";

export function useMatchedProducts() {

    const productsByStore =
        useProductSearchStore(
            state =>
                state.result?.stores ?? {}
        );

    return useMemo(
        () =>
            matchProductsByStore(
                productsByStore
            ),
        [productsByStore]
    );
}