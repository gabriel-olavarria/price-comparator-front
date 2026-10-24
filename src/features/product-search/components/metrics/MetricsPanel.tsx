import { useState} from "react";
import {ActionIcon, Collapse, Group, Stack, Text,} from "@mantine/core";
import {ChevronDown, ChevronUp,} from "lucide-react";

import "./MetricsPanel.css";
import {useSearchResultStore} from "../../stores/searchResultStore.ts";
import {QuantitiesSection} from "./components/quantities-market/QuantitiesSection.tsx";


export function MetricsPanel() {
    const [opened, setOpened] = useState(true);

    const metrics = useSearchResultStore(
        state => state.metrics
    );
  console.log(metrics);
    
    return (
        <div className="metrics-panel">
            <Group justify="space-between" className="metrics-panel__header" onClick={() => setOpened(current => !current)}>
                <div>
                    <Text fw={700} size="lg" c="dark">Métricas de comparación</Text>
                    <Text size="sm" c="gray.5">Resumen de los resultados encontrados</Text>
                </div>
                <ActionIcon variant="subtle" size="lg" radius="md" aria-label={opened ? "Minimizar métricas" : "Mostrar métricas"}
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpened(current => !current);
                    }}
                >
                    {opened ? (<ChevronUp size={22} />) : (<ChevronDown size={22} />)}
                </ActionIcon>
            </Group>
            <Collapse expanded={opened}>
                <Stack className="metrics-panel__content" gap="xl">
                    <QuantitiesSection />
                    {/*<ProductMatches comparableGroups={comparableGroups}/>*/}
                    {/*<MatchedProductsBar comparableGroups={comparableGroups}/>*/}
                    {/*<CheapestProductBar comparableGroups={comparableGroups}/>*/}
                </Stack>
            </Collapse>
        </div>
    );
}