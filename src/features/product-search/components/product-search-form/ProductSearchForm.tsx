import { type SubmitEventHandler, useState } from "react";

import "./ProductSearchForm.css";
import {SearchInput} from "../search-input/SearchInput.tsx";

interface ProductSearchFormProps {
    isLoading: boolean;
    onSearch: (
        query: string,
        categories: string[]
    ) => Promise<void>;
}

export function ProductSearchForm({isLoading, onSearch,}: ProductSearchFormProps) {
    const [query, setQuery] = useState("");
    const [searchFeedback, setSearchFeedback] = useState("");
    const handleSubmit: SubmitEventHandler<HTMLFormElement> =
        async (event) => {
            event.preventDefault();
            setSearchFeedback(`Buscando: ${query}`);
            const normalizedQuery = query.trim();

            if (!normalizedQuery || isLoading) {
                return;
            }

            await onSearch(normalizedQuery, []);
        };

    return (
        <>
            <form className="search-bar" role="search" onSubmit={handleSubmit}>
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="7.3" />
                    <path d="m16.5 16.5 5 5" />
                </svg>
                <SearchInput
                    value={query}
                    disabled={isLoading}
                    disabledSubmit={false}
                    isLoading={isLoading}
                    onChange={setQuery}
                />
            </form>

            <p className="search-feedback" role="status" aria-live="polite">
                {searchFeedback}
            </p>
        </>
    );
}