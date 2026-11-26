import { useEffect, useState } from "react";
import type { AddressSuggestion } from "../models/addressSuggestion.models.ts";
import { searchAddresses } from "../services/location.service";

export function useAddressAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const text = query.trim();

    setSuggestions([]);
    setLoading(false);
    setError(null);

    if (text.length < 5) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const results = await searchAddresses(text, controller.signal);

        if (!controller.signal.aborted) {
          setSuggestions(results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setError("No fue posible buscar direcciones.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { suggestions, loading, error };
}
