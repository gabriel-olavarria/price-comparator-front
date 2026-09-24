import {
    Card,
    Group,
    Image,
    Stack,
    Text,
} from "@mantine/core";
import cocaColaZero from "../../../../../assets/cocacola1.5.png";
import "./CheapestMatchedProduct.css";

export function CheapestMatchedProduct() {
    return (
        <Card
            className="cheapest-matched-product"
            radius="lg"
            padding="lg"
            withBorder
        >
            <Text fw={700} size="lg">
                Producto más barato coincidente
            </Text>

            <Group
                mt="lg"
                gap="lg"
                wrap="nowrap"
            >
                <Image
                    src={cocaColaZero}
                    alt="Coca-Cola Zero"
                    className="cheapest-matched-product__image"
                    fit="contain"
                />

                <Stack gap={3}>
                    <Text fw={600}>
                        Coca-Cola Zero 1.5L
                    </Text>

                    <Text size="sm" c="dimmed">
                        Lider
                    </Text>

                    <Text
                        fw={700}
                        size="xl"
                    >
                        $1.590
                    </Text>
                </Stack>
            </Group>
        </Card>
    );
}