import { Popover, Stack, Text, Checkbox } from '@mantine/core';

interface FilterCategoryPanelProps {
    availableCategories: string[];
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
}

export function FilterCategoryPanel({ availableCategories, selectedCategories, onCategoryChange,}: FilterCategoryPanelProps) {
    return (
        <Popover.Dropdown>
            <Stack gap="sm">
                <Text fw={600}>Filtrar resultados</Text>
                <Text size="sm" c="dimmed">
                    Categorías
                </Text>
                {availableCategories.length === 0 ? (
                    <Text size="sm" c="dimmed">
                        No se encontraron categorías.
                    </Text>
                ) : (
                    <Checkbox.Group
                        value={selectedCategories}
                        onChange={onCategoryChange}
                    >
                        <Stack gap="xs">
                            {availableCategories.map((category) => (
                                <Checkbox
                                    key={category}
                                    value={category}
                                    label={category}
                                    styles={{ label: { color: '#202124' } }}
                                />
                            ))}
                        </Stack>
                    </Checkbox.Group>
                )}
            </Stack>
        </Popover.Dropdown>
    );
}