import { useCallback, useRef, useState } from "react";
import { useSearch } from "../hooks/useSearch.ts";
import { useTurnstile } from "../../../shared/security/useTurnstile";

export function useProductSearchPage() {
  const { result, isLoading, error, search } = useSearch();
  const turnstile = useTurnstile();
  const searchInProgressRef = useRef(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    async (query: string, categories: string[]): Promise<void> => {
      if (searchInProgressRef.current || isLoading) {
        return;
      }

      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        return;
      }

      searchInProgressRef.current = true;
      setIsSearching(true);

      try {
        const token = await turnstile.execute();

        await search(normalizedQuery, categories, token);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      } finally {
        turnstile.reset();

        searchInProgressRef.current = false;
        setIsSearching(false);
      }
    },
    [isLoading, search, turnstile.execute, turnstile.reset],
  );

  return {
    result,
    isLoading,
    isSearching,
    error,
    handleSearch,
    turnstile,
  };
}
