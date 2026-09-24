import {
    Card,
    Group,
    RingProgress,
    Stack,
    Text,
} from "@mantine/core";

import "./ComparableProducts.css";

export function ComparableProducts() {
    const liderMatches = 6;
    const jumboMatches = 4;
    const totalMatches = liderMatches + jumboMatches;

    return (
        <Card
            className="comparable-products"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text fw={700} size="lg">
                Productos comparables
            </Text>

            <Group
                mt="lg"
                justify="space-between"
                align="center"
                wrap="nowrap"
            >
                <RingProgress
                    size={130}
                    thickness={14}
                    roundCaps
                    sections={[
                        {
                            value: (liderMatches / totalMatches) * 100,
                            color: "blue.6",
                        },
                        {
                            value: (jumboMatches / totalMatches) * 100,
                            color: "orange.6",
                        },
                    ]}
                    label={
                        <Stack
                            gap={0}
                            align="center"
                        >
                            <Text fw={700} size="xl">
                                {totalMatches}
                            </Text>

                            <Text size="xs" c="dimmed">
                                matches
                            </Text>
                        </Stack>
                    }
                />

                <Stack gap="md">
                    <Group gap="xs">
                        <span className="comparable-products__dot comparable-products__dot--lider" />

                        <Text size="sm">
                            Lider
                        </Text>

                        <Text fw={700}>
                            {liderMatches}
                        </Text>
                    </Group>

                    <Group gap="xs">
                        <span className="comparable-products__dot comparable-products__dot--jumbo" />

                        <Text size="sm">
                            Jumbo
                        </Text>

                        <Text fw={700}>
                            {jumboMatches}
                        </Text>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
}