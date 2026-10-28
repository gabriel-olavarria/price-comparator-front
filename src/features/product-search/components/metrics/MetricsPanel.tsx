import { useState} from "react";
import {ActionIcon, Collapse, Group, Stack, Text,} from "@mantine/core";
import {ChevronDown, ChevronUp, ChartNoAxesCombined} from "lucide-react";

import "./MetricsPanel.css";
import {useSearchResultStore} from "../../stores/searchResultStore.ts";
import {QuantitiesSection} from "./components/quantities-market/QuantitiesSection.tsx";
import {ProductMatches} from "./components/matches-comparision-product/ProductMatches.tsx";
import {CheapestProductBar} from "./components/matched-product/CheapestProductBar.tsx";


export function MetricsPanel() {
    const [opened, setOpened] = useState(true);

    const metrics = useSearchResultStore(
        state => state.metrics
    );
  console.log(metrics?.cheapestCanonicalStore);
    
    return (
        <div className="metrics-panel">
            <Group justify="space-between" className="metrics-panel__header" onClick={() => setOpened(current => !current)}>
                <div className="metrics-panel__heading">
                    <div className="metrics-panel__title">
                        <div className="metrics-panel__icon">
                            <ChartNoAxesCombined size={28} strokeWidth={2.4} />
                        </div>
                        <Text component="h2">
                            Métricas de comparación
                        </Text>
                    </div>
                    <div className="metrics-panel-container__subtitle">
                        <Text  className="metrics-panel__subtitle">
                            Resumen de los resultados encontrados
                        </Text>
                    </div>


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
                    <ProductMatches />
                    <CheapestProductBar />
                </Stack>
            </Collapse>
        </div>
    );
}