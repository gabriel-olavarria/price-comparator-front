import "./SearchFiltersPanel.css";

interface SearchFiltersPanelProps {
    availableCategories: string[];
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
}

export function SearchFiltersPanel({
                                       availableCategories,
                                       selectedCategories,
                                       onCategoriesChange,
                                   }: SearchFiltersPanelProps) {
    function toggleCategory(category: string) {
        const isSelected =
            selectedCategories.includes(category);

        const nextCategories = isSelected
            ? selectedCategories.filter(
                (selectedCategory) =>
                    selectedCategory !== category,
            )
            : [
                ...selectedCategories,
                category,
            ];

        onCategoriesChange(nextCategories);
    }

    return (
        <section className="search-filters-panel">
            <div className="search-filters-panel__group">
                <h2 className="search-filters-panel__title">
                    Categorías encontradas
                </h2>

                {availableCategories.length === 0 ? (
                    <p className="search-filters-panel__empty">
                        No se encontraron categorías.
                    </p>
                ) : (
                    <div className="search-filters-panel__categories">
                        {availableCategories.map(
                            (category) => (
                                <label
                                    className="search-filters-panel__option"
                                    key={category}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(
                                            category,
                                        )}
                                        onChange={() =>
                                            toggleCategory(
                                                category,
                                            )
                                        }
                                    />

                                    <span>
                                        {category}
                                    </span>
                                </label>
                            ),
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}