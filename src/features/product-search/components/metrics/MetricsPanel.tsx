import {useMemo, useState} from "react";
import {ActionIcon, Collapse, Group, Stack, Text,} from "@mantine/core";
import {ChevronDown, ChevronUp,} from "lucide-react";
import { QuantitiesSection } from "./components/quantities-market/QuantitiesSection";
import { ProductMatches } from "./components/matches-comparision-product/ProductMatches";
import { MatchedProductsBar } from "./components/matched-product/MatchedProductsBar";
import "./MetricsPanel.css";
import {CheapestProductBar} from "./components/matched-product/CheapestProductBar.tsx";
import {
    type CanonicalProductGroup,
    getCheapestComparableProduct,
    getCheapestProductByStore,
} from "../../services/productCanonical";

interface MetricsPanelProps {
    groups: CanonicalProductGroup[];
}
export function MetricsPanel({groups}: MetricsPanelProps) {
    const [opened, setOpened] = useState(true);
  //  const cheapestGroups = useMemo(() => getCheapestProductByStore(groups), [groups]);
  //  const comparableGroups = useMemo(
   //     () => cheapestGroups.filter(group => group.products.length >= 2),
   //      [cheapestGroups]
   //  );
   //
   //  const cheapestComparableProduct = useMemo(
   //      () => getCheapestComparableProduct(comparableGroups),
   //      [comparableGroups]
   //  );

    //console.log("CHEAPEST CANONICAL GROUPS:", cheapestGroups);
    //console.log("COMPARABLE GROUPS:", comparableGroups);
    
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
                    {/*<QuantitiesSection cheapestComparableProduct={cheapestComparableProduct}/>*/}
                    {/*<ProductMatches comparableGroups={comparableGroups}/>*/}
                    {/*<MatchedProductsBar comparableGroups={comparableGroups}/>*/}
                    {/*<CheapestProductBar comparableGroups={comparableGroups}/>*/}
                </Stack>
            </Collapse>
        </div>
    );
}