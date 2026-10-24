import { httpClient } from "../../../shared/api/axios.ts";
import type {SearchParams, SearchResultResponse} from "../models/SearchResponse.ts";

export async function searchProduct(request: SearchParams, turnstileToken: string, signal?: AbortSignal): Promise<SearchResultResponse> {
    const response = await httpClient.get<SearchResultResponse>("/api/product/search",
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
    console.log(response);
    return response.data;
}