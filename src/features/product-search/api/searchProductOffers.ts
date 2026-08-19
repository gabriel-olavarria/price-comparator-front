import { httpClient } from "../../../shared/api/axios.ts";
import type {SearchProductOffersParams, SearchProductOffersResponse,} from "../models/ProductOffer.ts";

export async function searchProductOffers(request: SearchProductOffersParams, signal?: AbortSignal): Promise<SearchProductOffersResponse>  {

    const response = await httpClient.get<SearchProductOffersResponse>(
            "/api/product-offers/search",
            {
                params: {
                    query: request.query,
                    categories: request.categories,
                },
                signal,
            },
        );
    console.log(response);
    return response.data;
}