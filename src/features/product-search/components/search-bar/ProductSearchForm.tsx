import { type SubmitEventHandler, useState } from "react";
import { SearchInput } from "./SearchInput";

import "./ProductSearchForm.css";

interface ProductSearchFormProps {
    isLoading: boolean;
    onSearch: (
        query: string,
        categories: string[]
    ) => Promise<void>;
}

export function ProductSearchForm({
                                      isLoading,
                                      onSearch,
                                  }: ProductSearchFormProps) {
    const [query, setQuery] = useState("");

    const handleSubmit: SubmitEventHandler<HTMLFormElement> =
        async (event) => {
            event.preventDefault();

            const normalizedQuery = query.trim();

            if (!normalizedQuery || isLoading) {
                return;
            }

            await onSearch(normalizedQuery, []);
        };

    return (
        <form
            className="product-search-form"
            onSubmit={handleSubmit}
        >
            <div className="product-search-form__content">
                <SearchInput
                    value={query}
                    disabled={isLoading}
                    disabledSubmit={false}
                    isLoading={isLoading}
                    onChange={setQuery}
                />
            </div>
        </form>
    );
}