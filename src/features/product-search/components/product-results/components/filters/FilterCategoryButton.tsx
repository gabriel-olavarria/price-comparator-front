import { useState } from 'react';
import { Popover, Button} from '@mantine/core';
import { Filter } from 'lucide-react';
import {FilterCategoryPanel} from "./FilterCategoryPanel.tsx"; // O el ícono que estés usando (ej. tabler-icons)

interface FilterCategoryButtonProps {
    availableCategories: string[];
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
}

export function FilterCategoryButton({availableCategories, selectedCategories, onCategoryChange,}: FilterCategoryButtonProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <Popover
            opened={filtersOpen}
            onChange={setFiltersOpen}
            position="bottom-start"
            shadow="md"
            width={320}>
            <Popover.Target>
                <Button variant="default" leftSection={<Filter size={18} />} onClick={() => setFiltersOpen((current) => !current)}>
                    Filtros
                </Button>
            </Popover.Target>
            <FilterCategoryPanel availableCategories={availableCategories} selectedCategories={selectedCategories} onCategoryChange={onCategoryChange}/>
        </Popover>
    );
}