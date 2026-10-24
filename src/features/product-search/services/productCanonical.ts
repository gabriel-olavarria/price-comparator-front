import type { ProductOffer } from "../models/ProductOffer";

/**
 * ============================================================
 * TIPOS
 * ============================================================
 */

export type CanonicalUnitType =
    | "volume"
    | "weight"
    | "count"
    | null;

export type CanonicalUnit =
    | "ml"
    | "g"
    | "un"
    | null;


/**
 * Producto ya normalizado para poder compararlo con productos
 * equivalentes de otros supermercados.
 */
export interface CanonicalProduct {

    product: ProductOffer;

    normalizedName: string;

    /**
     * Concepto semántico detectado previamente por product-search.
     *
     * Ej:
     * arroz
     * pastas
     * harinas
     * aceites
     */
    concept: string;

    /**
     * Tipo de unidad normalizada.
     */
    unitType: CanonicalUnitType;

    /**
     * Cantidad normalizada.
     *
     * 1 kg  -> 1000
     * 1 l   -> 1000
     * 500 g -> 500
     */
    quantity: number | null;

    /**
     * Unidad normalizada.
     *
     * kg -> g
     * l  -> ml
     */
    unit: CanonicalUnit;

    /**
     * Cantidad de productos contenidos en el pack.
     *
     * Ej:
     *
     * pack 6 x 350 ml
     *
     * packageCount = 6
     */
    packageCount: number;

    /**
     * Variante específica dentro del concepto.
     *
     * Ej arroz:
     *
     * grado-1
     * grado-2
     * integral
     * basmati
     * sushi
     */
    subtype: string | null;

    /**
     * Clave utilizada para agrupar productos comparables.
     *
     * Ej:
     *
     * arroz_grado-1_1000g
     */
    canonicalKey: string | null;
}


/**
 * ============================================================
 * CONSTRUCCIÓN DEL PRODUCTO CANÓNICO
 * ============================================================
 */

export function xgetCanonicalProduct(product: ProductOffer, concept: string): CanonicalProduct {

    const normalizedName = normalizeText(product.name);

    const measurement =
        extractMeasurement(normalizedName);

    const packageCount =
        extractPackageCount(normalizedName);

    const subtype =
        detectSubtype(
            normalizedName,
            concept
        );

    const canonicalKey =
        buildCanonicalKey({
            concept,
            subtype,
            quantity: measurement.quantity,
            unit: measurement.unit,
            packageCount
        });

    return {
        product,

        normalizedName,

        concept,

        unitType:
        measurement.unitType,

        quantity:
        measurement.quantity,

        unit:
        measurement.unit,

        packageCount,

        subtype,

        canonicalKey
    };
}


/**
 * ============================================================
 * MEDIDAS
 * ============================================================
 */

interface MeasurementResult {

    unitType: CanonicalUnitType;

    quantity: number | null;

    unit: CanonicalUnit;
}


/**
 * Extrae y normaliza la medida del producto.
 *
 * Ej:
 *
 * 1 kg   -> 1000 g
 * 500 g  -> 500 g
 * 1 l    -> 1000 ml
 * 500 ml -> 500 ml
 */
function extractMeasurement(name: string): MeasurementResult {

    /*
     * ========================================================
     * VOLUMEN
     * ========================================================
     */

    const volumeMatch =
        name.match(
            /\b(\d+(?:[.,]\d+)?)\s*(ml|cc|l|lt|lts|litro|litros)\b/
        );

    if (volumeMatch) {

        const value =
            parseNumber(volumeMatch[1]);

        const rawUnit =
            volumeMatch[2];

        if (
            [
                "l",
                "lt",
                "lts",
                "litro",
                "litros"
            ].includes(rawUnit)
        ) {

            return {
                unitType: "volume",
                quantity: value * 1000,
                unit: "ml"
            };
        }

        return {
            unitType: "volume",
            quantity: value,
            unit: "ml"
        };
    }


    /*
     * ========================================================
     * PESO
     * ========================================================
     */

    const weightMatch =
        name.match(
            /\b(\d+(?:[.,]\d+)?)\s*(mg|g|gr|grs|kg)\b/
        );

    if (weightMatch) {

        const value =
            parseNumber(weightMatch[1]);

        const rawUnit =
            weightMatch[2];

        if (rawUnit === "kg") {

            return {
                unitType: "weight",
                quantity: value * 1000,
                unit: "g"
            };
        }

        if (rawUnit === "mg") {

            return {
                unitType: "weight",
                quantity: value / 1000,
                unit: "g"
            };
        }

        return {
            unitType: "weight",
            quantity: value,
            unit: "g"
        };
    }


    /*
     * ========================================================
     * UNIDADES
     * ========================================================
     */

    const countMatch =
        name.match(
            /\b(\d+)\s*(un|unidad|unidades)\b/
        );

    if (countMatch) {

        return {
            unitType: "count",
            quantity: Number(countMatch[1]),
            unit: "un"
        };
    }


    /*
     * No fue posible detectar medida.
     */

    return {
        unitType: null,
        quantity: null,
        unit: null
    };
}


/**
 * ============================================================
 * PACKS
 * ============================================================
 */

function extractPackageCount(name: string): number {

    const patterns = [

        /\bpack\s+(?:de\s+)?(\d+)\b/,

        /\bcaja\s+(?:de\s+)?(\d+)\b/,

        /\b(\d+)\s*x\s*\d+(?:[.,]\d+)?\s*(?:ml|cc|l|lt|lts|g|gr|grs|kg)\b/,

        /\b(\d+)\s*(?:un|unidad|unidades)\s+de\s+\d+(?:[.,]\d+)?\s*(?:ml|cc|l|lt|lts|g|gr|grs|kg)\b/
    ];

    for (const pattern of patterns) {

        const match =
            name.match(pattern);

        if (match) {

            return Number(
                match[1]
            );
        }
    }

    return 1;
}


/**
 * ============================================================
 * SUBTIPOS
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Aquí ya NO determinamos qué es el producto.
 *
 * product-search.ts ya determinó:
 *
 * arroz
 * pastas
 * aceite
 * harina
 * etc.
 *
 * Aquí solamente identificamos variantes dentro del concepto.
 */

function detectSubtype(name: string, concept: string): string | null {

    /*
     * ========================================================
     * ARROZ
     * ========================================================
     */

    if (concept === "arroz") {

        if (
            containsAny(
                name,
                ["chaufan"]
            )
        ) {
            return "preparado-chaufan";
        }

        if (
            containsAny(
                name,
                ["curry"]
            )
        ) {
            return "preparado-curry";
        }

        if (
            containsAny(
                name,
                ["primavera"]
            )
        ) {
            return "preparado-primavera";
        }

        if (
            containsAny(
                name,
                ["campesino"]
            )
        ) {
            return "preparado-campesino";
        }

        if (
            containsAny(
                name,
                [
                    "champinon",
                    "champinones"
                ]
            )
        ) {
            return "preparado-champinon";
        }

        if (
            containsAny(
                name,
                ["arabe"]
            )
        ) {
            return "preparado-arabe";
        }

        if (
            containsAny(
                name,
                ["paella"]
            )
        ) {
            return "paella";
        }

        if (
            containsAny(
                name,
                ["sushi"]
            )
        ) {
            return "sushi";
        }

        if (
            containsAny(
                name,
                ["integral"]
            )
        ) {
            return "integral";
        }

        if (
            containsAny(
                name,
                ["risotto"]
            )
        ) {
            return "risotto";
        }

        if (
            containsAny(
                name,
                ["basmati"]
            )
        ) {
            return "basmati";
        }

        if (
            containsAny(
                name,
                ["wok"]
            )
        ) {
            return "preparado-wok";
        }

        if (
            containsAny(
                name,
                [
                    "pregraneado",
                    "preparado"
                ]
            )
        ) {
            return "preparado";
        }

        if (
            containsAny(
                name,
                [
                    "grado 1",
                    "g1"
                ]
            )
        ) {
            return "grado-1";
        }

        if (
            containsAny(
                name,
                [
                    "grado 2",
                    "g2"
                ]
            )
        ) {
            return "grado-2";
        }

        return "general";
    }


    /*
     * ========================================================
     * ACEITES
     * ========================================================
     */

    if (
        concept === "aceite" ||
        concept === "aceites"
    ) {

        if (
            containsAny(
                name,
                [
                    "pepita uva",
                    "pepita de uva"
                ]
            )
        ) {
            return "pepita-uva";
        }

        if (
            containsAny(
                name,
                ["palta"]
            )
        ) {
            return "palta";
        }

        if (
            containsAny(
                name,
                ["canola"]
            )
        ) {
            return "canola";
        }

        if (
            containsAny(
                name,
                ["maravilla"]
            )
        ) {
            return "maravilla";
        }

        if (
            containsAny(
                name,
                ["maiz"]
            )
        ) {
            return "maiz";
        }

        if (
            containsAny(
                name,
                ["coco"]
            )
        ) {
            return "coco";
        }

        if (
            containsAny(
                name,
                ["oliva"]
            )
        ) {

            if (
                containsAny(
                    name,
                    [
                        "extra virgen",
                        "extra-virgen"
                    ]
                )
            ) {
                return "oliva-extra-virgen";
            }

            return "oliva";
        }

        if (
            containsAny(
                name,
                [
                    "spray",
                    "aerosol"
                ]
            )
        ) {
            return "spray";
        }

        if (
            containsAny(
                name,
                ["vegetal"]
            )
        ) {
            return "vegetal";
        }

        /*
         * Conservamos el comportamiento anterior:
         * aceite sin subtipo explícito se considera vegetal.
         */
        return "vegetal";
    }


    /*
     * ========================================================
     * HARINAS
     * ========================================================
     */

    if (
        concept === "harina" ||
        concept === "harinas"
    ) {

        if (
            containsAny(
                name,
                [
                    "harina de arroz",
                    "harina arroz"
                ]
            )
        ) {
            return "arroz";
        }

        if (
            containsAny(
                name,
                [
                    "harina de maiz",
                    "harina maiz"
                ]
            )
        ) {
            return "maiz";
        }

        if (
            containsAny(
                name,
                [
                    "harina de avena",
                    "harina avena"
                ]
            )
        ) {
            return "avena";
        }

        if (
            containsAny(
                name,
                [
                    "harina de centeno",
                    "harina centeno"
                ]
            )
        ) {
            return "centeno";
        }

        if (
            containsAny(
                name,
                [
                    "harina de linaza",
                    "harina linaza"
                ]
            )
        ) {
            return "linaza";
        }

        if (
            containsAny(
                name,
                [
                    "harina de coco",
                    "harina coco"
                ]
            )
        ) {
            return "coco";
        }

        if (
            containsAny(
                name,
                [
                    "harina de almendra",
                    "harina almendra"
                ]
            )
        ) {
            return "almendra";
        }

        if (
            containsAny(
                name,
                [
                    "harina de nuez",
                    "harina nuez"
                ]
            )
        ) {
            return "nuez";
        }

        if (
            containsAny(
                name,
                ["sarraceno"]
            )
        ) {
            return "sarraceno";
        }

        if (
            containsAny(
                name,
                ["multicereal"]
            )
        ) {
            return "multicereal";
        }

        if (
            containsAny(
                name,
                ["tostada"]
            )
        ) {
            return "tostada";
        }

        if (
            containsAny(
                name,
                ["integral"]
            )
        ) {
            return "integral";
        }

        if (
            containsAny(
                name,
                [
                    "de fuerza",
                    "harina fuerza"
                ]
            )
        ) {
            return "fuerza";
        }

        if (
            containsAny(
                name,
                [
                    "reposteria",
                    "cake"
                ]
            )
        ) {
            return "reposteria";
        }

        if (
            containsAny(
                name,
                [
                    "panaderia",
                    "bake"
                ]
            )
        ) {
            return "panaderia";
        }

        if (
            containsAny(
                name,
                [
                    "multiproposito",
                    "todo uso"
                ]
            )
        ) {
            return "multiproposito";
        }

        if (
            containsAny(
                name,
                [
                    "sin polvos",
                    "sin polvo"
                ]
            )
        ) {
            return "sin-polvos";
        }

        if (
            containsAny(
                name,
                [
                    "con polvos",
                    "con polvo"
                ]
            )
        ) {
            return "con-polvos";
        }

        return "general";
    }


    /*
     * ========================================================
     * BEBIDAS ENERGÉTICAS
     * ========================================================
     */

    if (
        concept === "bebida-energetica" ||
        concept === "bebidas-energeticas"
    ) {

        if (
            containsAny(
                name,
                [
                    "sin azucar",
                    "sugar free",
                    "sugarfree"
                ]
            )
        ) {
            return "sin-azucar";
        }

        if (
            containsAny(
                name,
                [
                    "zero",
                    "zero sugar"
                ]
            )
        ) {
            return "zero";
        }

        if (
            containsAny(
                name,
                ["tropical"]
            )
        ) {
            return "tropical";
        }

        if (
            containsAny(
                name,
                [
                    "acai",
                    "açai"
                ]
            )
        ) {
            return "acai";
        }

        if (
            containsAny(
                name,
                ["sandia"]
            )
        ) {
            return "sandia";
        }

        if (
            containsAny(
                name,
                [
                    "arandano",
                    "arandanos"
                ]
            )
        ) {
            return "arandano";
        }

        if (
            containsAny(
                name,
                [
                    "dragon fruit",
                    "fruta del dragon"
                ]
            )
        ) {
            return "dragon-fruit";
        }

        if (
            containsAny(
                name,
                [
                    "pomelo",
                    "pomelo floral"
                ]
            )
        ) {
            return "pomelo";
        }

        if (
            containsAny(
                name,
                [
                    "curuba",
                    "sauco"
                ]
            )
        ) {
            return "curuba-sauco";
        }

        if (
            containsAny(
                name,
                [
                    "summer",
                    "frutos del bosque"
                ]
            )
        ) {
            return "frutos-bosque";
        }

        return "original";
    }


    /*
     * ========================================================
     * SALSAS
     * ========================================================
     */

    if (
        concept === "salsa" ||
        concept === "salsas"
    ) {

        if (
            containsAny(
                name,
                [
                    "bolonesa",
                    "bolognesa",
                    "bolognese"
                ]
            )
        ) {
            return "bolonesa";
        }

        if (
            containsAny(
                name,
                [
                    "arrabbiata",
                    "arrabiata"
                ]
            )
        ) {
            return "arrabbiata";
        }

        if (
            containsAny(
                name,
                [
                    "napolitana",
                    "napoletana"
                ]
            )
        ) {
            return "napolitana";
        }

        if (
            containsAny(
                name,
                ["mediterranea"]
            )
        ) {
            return "mediterranea";
        }

        if (
            containsAny(
                name,
                ["passata"]
            )
        ) {
            return "passata";
        }

        if (
            containsAny(
                name,
                ["pizza"]
            )
        ) {
            return "pizza";
        }

        if (
            containsAny(
                name,
                ["tuco"]
            )
        ) {
            return "tuco";
        }

        if (
            containsAny(
                name,
                ["casera"]
            )
        ) {
            return "casera";
        }

        if (
            containsAny(
                name,
                ["pesto"]
            )
        ) {
            return "pesto";
        }

        if (
            containsAny(
                name,
                [
                    "champinon",
                    "champinones"
                ]
            )
        ) {
            return "champinon";
        }

        if (
            containsAny(
                name,
                [
                    "parmesana",
                    "parmiggiano",
                    "parmesano"
                ]
            )
        ) {
            return "parmesana";
        }

        if (
            containsAny(
                name,
                [
                    "con trozos",
                    "trozos de tomate"
                ]
            )
        ) {
            return "con-trozos";
        }

        if (
            containsAny(
                name,
                ["marinara"]
            )
        ) {
            return "marinara";
        }

        if (
            containsAny(
                name,
                ["carne"]
            )
        ) {
            return "carne";
        }

        if (
            containsAny(
                name,
                ["pollo"]
            )
        ) {
            return "pollo";
        }

        if (
            containsAny(
                name,
                [
                    "albahaca",
                    "basilico"
                ]
            )
        ) {
            return "albahaca";
        }

        if (
            containsAny(
                name,
                ["oliva"]
            )
        ) {
            return "oliva";
        }

        if (
            containsAny(
                name,
                ["italiana"]
            )
        ) {
            return "italiana";
        }

        if (
            containsAny(
                name,
                ["pomarola"]
            )
        ) {
            return "pomarola";
        }

        if (
            containsAny(
                name,
                [
                    "natural",
                    "tradicional"
                ]
            )
        ) {
            return "natural";
        }

        return "general";
    }


    /*
     * ========================================================
     * RESTO DE CONCEPTOS
     * ========================================================
     *
     * Si todavía no tenemos reglas específicas para el concepto,
     * no inventamos un subtipo.
     */

    return "general";
}


/**
 * ============================================================
 * CANONICAL KEY
 * ============================================================
 */

interface CanonicalKeyParams {
    concept: string;
    subtype: string | null;
    quantity: number | null;
    unit: CanonicalUnit;
    packageCount: number;
}


function buildCanonicalKey({concept, subtype, quantity, unit, packageCount}: CanonicalKeyParams): string | null {

    if (
        !concept ||
        quantity === null ||
        !unit
    ) {
        return null;
    }

    const parts = [

        concept,

        subtype ?? "general",

        `${formatQuantity(quantity)}${unit}`
    ];

    if (packageCount > 1) {

        parts.push(
            `pack${packageCount}`
        );
    }

    return parts.join("_");
}


/**
 * ============================================================
 * NORMALIZACIÓN
 * ============================================================
 */

function normalizeText(value: string): string {

    return value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /([a-z])(\d)/g,
            "$1 $2"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}


function containsAny(value: string, terms: string[]): boolean {

    return terms.some(
        term =>
            value.includes(
                normalizeText(term)
            )
    );
}


function parseNumber(
    value: string
): number {

    return Number(
        value.replace(
            ",",
            "."
        )
    );
}


function formatQuantity(value: number): string {

    return Number.isInteger(value)
        ? String(value)
        : String(
            Number(
                value.toFixed(3)
            )
        );
}


/**
 * ============================================================
 * AGRUPACIÓN
 * ============================================================
 */

export interface CanonicalProductGroup {
    canonicalKey: string;
    products: CanonicalProductWithStore[];
}


export interface CanonicalProductWithStore extends CanonicalProduct {

    storeName: string;
}


/**
 * Agrupa productos que son realmente comparables.
 *
 * Ej:
 *
 * arroz_grado-1_1000g
 *
 * Jumbo
 * Lider
 * Unimarc
 * Santa Isabel
 */
export function groupCanonicalProducts(products: CanonicalProductWithStore[]): CanonicalProductGroup[] {

    const groups =
        new Map<
            string,
            CanonicalProductGroup
        >();

    for (const product of products) {

        if (!product.canonicalKey) {
            continue;
        }

        const existingGroup =
            groups.get(
                product.canonicalKey
            );

        if (existingGroup) {

            existingGroup.products.push(
                product
            );

            continue;
        }

        groups.set(
            product.canonicalKey,
            {
                canonicalKey:
                product.canonicalKey,

                products: [
                    product
                ]
            }
        );
    }

    return Array.from(
        groups.values()
    );
}


/**
 * ============================================================
 * CREAR PRODUCTOS CANÓNICOS DESDE RESULTADOS FILTRADOS
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Esta función recibe productos que YA fueron considerados
 * semánticamente relevantes por product-search.ts.
 *
 * concept debe ser el concepto detectado por product-search.
 */

export function createCanonicalProducts(stores: Record<string, ProductOffer[]>, concept: string): CanonicalProductWithStore[] {

    const canonicalProducts:
        CanonicalProductWithStore[] = [];

    for (
        const [storeName, products]
        of Object.entries(stores)
        ) {

        const productsWithPrice =
            [...products]
                .filter(
                    product =>
                        product.price > 0
                )
                .sort(
                    (a, b) =>
                        a.price - b.price
                );

        for (
            const product
            of productsWithPrice
            ) {

            const canonical =
                getCanonicalProduct(
                    product,
                    concept
                );

            canonicalProducts.push({
                storeName,
                ...canonical
            });
        }
    }

    return canonicalProducts;
}


/**
 * Alias temporal para no romper código existente.
 *
 * Puedes seguir llamando:
 *
 * logCanonicalProducts(...)
 *
 * mientras migramos el resto del proyecto.
 */
export function logCanonicalProducts(
    stores: Record<string, ProductOffer[]>,
    concept: string
): CanonicalProductWithStore[] {

    return createCanonicalProducts(
        stores,
        concept
    );
}


/**
 * ============================================================
 * PRODUCTO MÁS BARATO POR SUPERMERCADO
 * ============================================================
 *
 * Dentro de cada canonicalKey conserva solamente el producto
 * más barato encontrado en cada supermercado.
 */

export function getCheapestProductByStore(
    groups: CanonicalProductGroup[]
): CanonicalProductGroup[] {

    return groups.map(
        group => {

            const cheapestByStore =
                new Map<
                    string,
                    CanonicalProductWithStore
                >();

            for (
                const product
                of group.products
                ) {

                const current =
                    cheapestByStore.get(
                        product.storeName
                    );

                if (
                    !current ||
                    product.product.price <
                    current.product.price
                ) {

                    cheapestByStore.set(
                        product.storeName,
                        product
                    );
                }
            }

            return {

                canonicalKey:
                group.canonicalKey,

                products:
                    Array.from(
                        cheapestByStore.values()
                    )
                        .sort(
                            (a, b) =>
                                a.product.price -
                                b.product.price
                        )
            };
        }
    );
}


/**
 * ============================================================
 * PRODUCTO NOMINALMENTE MÁS BARATO
 * ============================================================
 *
 * Devuelve el producto con el menor precio final entre los
 * grupos comparables recibidos.
 */

export function getCheapestComparableProduct(
    groups: CanonicalProductGroup[]
): CanonicalProductWithStore | null {

    let cheapest:
        CanonicalProductWithStore | null =
        null;

    for (const group of groups) {

        for (
            const product
            of group.products
            ) {

            if (
                !cheapest ||
                product.product.price <
                cheapest.product.price
            ) {

                cheapest =
                    product;
            }
        }
    }

    return cheapest;
}


/**
 * ============================================================
 * PRECIO POR UNIDAD NORMALIZADA
 * ============================================================
 *
 * Esto NO modifica canonicalKey.
 *
 * Sirve para saber qué presentación tiene mejor precio
 * proporcional.
 *
 * Ej:
 *
 * arroz 500 g  $1.100 -> $2.200/kg
 * arroz 1 kg   $1.800 -> $1.800/kg
 * arroz 2 kg   $3.200 -> $1.600/kg
 */

export function getNormalizedUnitPrice(
    product: CanonicalProduct
): number | null {

    if (
        product.quantity === null ||
        product.quantity <= 0 ||
        product.product.price <= 0
    ) {
        return null;
    }

    /*
     * Precio por kilogramo.
     */
    if (
        product.unitType === "weight" &&
        product.unit === "g"
    ) {

        return (
            product.product.price /
            product.quantity
        ) * 1000;
    }

    /*
     * Precio por litro.
     */
    if (
        product.unitType === "volume" &&
        product.unit === "ml"
    ) {

        return (
            product.product.price /
            product.quantity
        ) * 1000;
    }

    /*
     * Precio por unidad.
     */
    if (
        product.unitType === "count" &&
        product.unit === "un"
    ) {

        return (
            product.product.price /
            product.quantity
        );
    }

    return null;
}


/**
 * ============================================================
 * MEJOR PRECIO PROPORCIONAL
 * ============================================================
 */

export function getBestUnitPriceProduct(
    groups: CanonicalProductGroup[]
): CanonicalProductWithStore | null {

    let bestProduct:
        CanonicalProductWithStore | null =
        null;

    let bestUnitPrice =
        Number.POSITIVE_INFINITY;

    for (const group of groups) {

        for (
            const product
            of group.products
            ) {

            const unitPrice =
                getNormalizedUnitPrice(
                    product
                );

            if (
                unitPrice === null
            ) {
                continue;
            }

            if (
                unitPrice <
                bestUnitPrice
            ) {

                bestUnitPrice =
                    unitPrice;

                bestProduct =
                    product;
            }
        }
    }

    return bestProduct;
}