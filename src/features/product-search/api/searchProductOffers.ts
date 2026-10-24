import { httpClient } from "../../../shared/api/axios.ts";

import type {
    SearchProductOffersParams,
    SearchProductOffersResponse,
} from "../models/ProductOffer.ts";

export async function searchProductOffers(request: SearchProductOffersParams, turnstileToken: string, signal?: AbortSignal): Promise<SearchProductOffersResponse> {
    const response = await httpClient.get<SearchProductOffersResponse>("/api/product/search",
        {
            params: {
                query: request.query,
                categories: request.categories,
            },
            headers: {
                "X-Turnstile-Token": turnstileToken,
            },
            signal,
        }
    );

    return response.data;
}