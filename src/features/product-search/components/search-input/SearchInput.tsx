
interface SearchInputProps {
    value: string;
    disabled?: boolean;
    disabledSubmit?: boolean;
    isLoading?: boolean;
    onChange: (value: string) => void;
}

export function SearchInput({value, disabled = false, disabledSubmit = false, isLoading = false, onChange,}: SearchInputProps) {
    return (
        <>
            <input type="search" name="q" disabled={disabled} placeholder="Busca un producto (ej. leche, arroz, detergente)"
                   aria-label="Buscar producto" autoComplete="off"
                   onChange={(event) => onChange(event.target.value)}
            />
            <button type="submit" className="primary-button"   
                    disabled={disabled || disabledSubmit || !value.trim()}
            >   
                {isLoading ? "Buscando..." : "Buscar"} 
            </button>
        </>
    );
}
