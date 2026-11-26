import { useEffect, useRef, useState } from "react";
import { Alert, Loader, TextInput } from "@mantine/core";
import { MapPin, Search } from "lucide-react";

import { useAddressAutocomplete } from "../../hooks/useAddressAutocomplete";
import type { AddressSuggestion } from "../../models/addressSuggestion.models.ts";

interface Props {
  value?: string;
  onSelect: (suggestion: AddressSuggestion) => void;
}

export default function AddressSearch({ value = "", onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(value);
  const isEditingRef = useRef(false);

  const activeQuery = selectedQuery === query ? "" : query;

  const { suggestions, loading, error } = useAddressAutocomplete(activeQuery);

  useEffect(() => {
    if (isEditingRef.current) {
      return;
    }

    setQuery(value);
    setSelectedQuery(value);
  }, [value]);

  const handleSelect = (suggestion: AddressSuggestion) => {
    if (
      !Number.isFinite(suggestion.latitude) ||
      !Number.isFinite(suggestion.longitude)
    ) {
      return;
    }

    const displayName = suggestion.formatted.trim() || query;

    isEditingRef.current = false;
    setSelectedQuery(displayName);
    setQuery(displayName);

    onSelect(suggestion);
  };

  const showResults = activeQuery.trim().length >= 5 && suggestions.length > 0;

  return (
    <div className="location-picker__search-section">
      <div className="location-picker__search-row">
        <TextInput
          placeholder="Buscar dirección, calle o supermercado..."
          leftSection={<Search size={17} />}
          rightSection={loading ? <Loader size="xs" /> : null}
          value={query}
          onChange={(event) => {
            isEditingRef.current = true;
            setSelectedQuery(null);
            setQuery(event.currentTarget.value);
          }}
          className="location-picker__search-input"
          aria-label="Buscar dirección"
        />
      </div>

      {error && <Alert color="orange">{error}</Alert>}

      {showResults && (
        <div className="location-picker__results">
          {suggestions.map((suggestion, index) => (
            <button
              type="button"
              key={`${suggestion.matchId ?? "address"}-${index}`}
              className="location-picker__result"
              onClick={() => handleSelect(suggestion)}
            >
              <MapPin size={17} />

              <div className="location-picker__result-content">
                <span className="location-picker__result-title">
                  {suggestion.shortLabel || suggestion.formatted}
                </span>

                <span className="location-picker__result-subtitle">
                  {[suggestion.city, suggestion.region, suggestion.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
