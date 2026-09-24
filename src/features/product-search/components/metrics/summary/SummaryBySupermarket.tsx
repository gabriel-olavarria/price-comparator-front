import {
    Card,
    Divider,
    Group,
    Stack,
    Text,
} from "@mantine/core";

import "./SummaryBySupermarket.css";

export function SummaryBySupermarket() {
    return (
        <Card
            className="summary-by-supermarket"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text fw={700} size="lg">
                Cantidad de productos 
            </Text>

            <Stack gap={0} mt="md">
                <Group justify="space-between" py="sm">
                    <Text>Lider</Text>
                    <Text fw={700}>24</Text>
                </Group>

                <Divider />

                <Group justify="space-between" py="sm">
                    <Text>Jumbo</Text>
                    <Text fw={700}>17</Text>
                </Group>
            </Stack>
        </Card>
    );
}