import { Search } from "lucide-react";
import "./SearchInput.css";

interface SearchInputProps {
    value: string;
    disabled?: boolean;
    isLoading?: boolean;
    onChange: (value: string) => void;
}

export function SearchInput({
                                value,
                                disabled = false,
                                isLoading = false,
                                onChange,
                         
                            }: SearchInputProps) {
    return (
        <div className="search-input">
            <Search
                className="search-input__search-icon"
                size={21}
                aria-hidden="true"
            />

            <label
                className="search-input__label"
                htmlFor="product-search"
            >
                Buscar producto
            </label>

            <input
                id="product-search"
                className="search-input__field"
                type="search"
                value={value}
                disabled={disabled}
                placeholder="Busca un producto, por ejemplo Coca-Cola"
                autoComplete="off"
                onChange={(event) => onChange(event.target.value)}
            />
            
            <button
                className="search-input__button"
                type="submit"
                disabled={disabled || !value.trim()}
            >
                {isLoading ? "Buscando..." : "Buscar"}
            </button>
        </div>
    );
}