import {
    Badge,
    Card,
    Group,
    Stack,
    Table,
    Text,
} from "@mantine/core";

import "./ProductMatches.css";

export function ProductMatches() {
    return (
        <Card
            className="product-matches"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Stack gap={4} mb="lg">
                <Text fw={700} size="lg">
                    Productos coincidentes
                </Text>

                <Text size="sm" c="dimmed">
                    Productos similares encontrados entre supermercados
                </Text>
            </Stack>

            <Table.ScrollContainer minWidth={800}>
                <Table
                    verticalSpacing="md"
                    horizontalSpacing="lg"
                    highlightOnHover
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                Producto
                            </Table.Th>

                            <Table.Th>
                                Lider
                            </Table.Th>

                            <Table.Th>
                                Jumbo
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                <Text fw={600}>
                                    Coca-Cola Zero 3 L
                                </Text>
                            </Table.Td>

                            <Table.Td>
                                <Group
                                    justify="space-between"
                                    wrap="nowrap"
                                >
                                    <Text>
                                        $2.490
                                    </Text>

                                    <Badge
                                        variant="light"
                                        size="sm"
                                    >
                                        Mejor precio
                                    </Badge>
                                </Group>
                            </Table.Td>

                            <Table.Td>
                                <Text>
                                    $2.690
                                </Text>
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td>
                                <Text fw={600}>
                                    Coca-Cola Original 2 L
                                </Text>
                            </Table.Td>

                            <Table.Td>
                                <Text>
                                    $2.190
                                </Text>
                            </Table.Td>

                            <Table.Td>
                                <Group
                                    justify="space-between"
                                    wrap="nowrap"
                                >
                                    <Text>
                                        $1.990
                                    </Text>

                                    <Badge
                                        variant="light"
                                        size="sm"
                                    >
                                        Mejor precio
                                    </Badge>
                                </Group>
                            </Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Td>
                                <Text fw={600}>
                                    Coca-Cola Light 1.5 L
                                </Text>
                            </Table.Td>

                            <Table.Td>
                                <Text>
                                    $1.790
                                </Text>
                            </Table.Td>

                            <Table.Td>
                                <Group
                                    justify="space-between"
                                    wrap="nowrap"
                                >
                                    <Text>
                                        $1.690
                                    </Text>

                                    <Badge
                                        variant="light"
                                        size="sm"
                                    >
                                        Mejor precio
                                    </Badge>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Card>
    );
}