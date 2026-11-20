import { useEffect, useRef, useState } from "react";
import { Alert, Button, Loader, TextInput } from "@mantine/core";
import { MapPin, Search } from "lucide-react";

import { searchAddresses } from "../../services/geocoding.service.ts";
import type { AddressResult } from "../../models/location.models.ts";

interface Props {
  value?: string;
  onSelect: (result: AddressResult) => void;
}

export default function AddressSearch({ value = "", onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controller = useRef<AbortController | null>(null);
  const lastRequest = useRef(0);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    return () => controller.current?.abort();
  }, []);

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      setError("Escribe al menos 3 caracteres.");
      return;
    }

    if (Date.now() - lastRequest.current < 1100) {
      setError("Espera un momento antes de buscar nuevamente.");
      return;
    }

    controller.current?.abort();

    const request = new AbortController();
    controller.current = request;
    lastRequest.current = Date.now();

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchAddresses(query, request.signal);

      if (request.signal.aborted) return;

      setResults(data);

      if (!data.length) {
        setError("No se encontraron direcciones.");
      }
    } catch {
      if (!request.signal.aborted) {
        setError("No fue posible buscar la dirección.");
      }
    } finally {
      if (!request.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="location-picker__search-section">
      <div className="location-picker__search-row">
        <TextInput
          placeholder="Buscar dirección, calle o supermercado..."
          leftSection={<Search size={17} />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleSearch();
            }
          }}
          className="location-picker__search-input"
        />

        <Button
          onClick={() => void handleSearch()}
          disabled={loading}
          className="location-picker__primary"
        >
          {loading ? <Loader size="xs" color="white" /> : "Buscar"}
        </Button>
      </div>

      {error && <Alert color="orange">{error}</Alert>}

      {results.length > 0 && (
        <div className="location-picker__results">
          {results.map((result) => (
            <button
              type="button"
              key={result.id}
              className="location-picker__result"
              onClick={() => {
                onSelect(result);
                setQuery(result.displayName);
                setResults([]);
              }}
            >
              <MapPin size={17} />
              <span>{result.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
