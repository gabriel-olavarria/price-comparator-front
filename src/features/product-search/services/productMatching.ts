import type { ProductOffer } from "../models/ProductOffer";
import type { MatchedProduct } from "../models/MatchedProduct";

type ProductsByStore = Record<string, ProductOffer[]>;
type UnitType = "volume" | "weight" | null;

interface ParsedProduct {
    product: ProductOffer;
    storeName: string;
    normalizedName: string;
    tokens: Set<string>;
    quantity: number | null;
    unitType: UnitType;
    packageCount: number;
    brand: string | null;
    family: string | null;
    variant: string | null;
}

interface ProductGroup {
    name: string;
    productsByStore: Record<string, ProductOffer | null>;
    reference: ParsedProduct;
}

const MATCH_THRESHOLD = 0.72;

/**
 * Matching de productos entre supermercados.
 *
 * Reglas principales:
 *
 * 1. Nunca compara productos del mismo supermercado.
 * 2. Normaliza unidades:
 *      1 L = 1000 ml
 *      500 cc = 500 ml
 *      1 kg = 1000 g
 * 3. Distingue unidades individuales y packs.
 * 4. Distingue variantes/sabores conocidos.
 * 5. Evita mezclar familias distintas.
 * 6. Usa marca como señal, pero no como requisito absoluto.
 * 7. Compara palabras significativas del nombre.
 * 8. Exige una similitud mínima.
 */
export function matchProductsByStore(stores: ProductsByStore): MatchedProduct[] {
    const storeNames = Object.keys(stores);
    const parsedProducts = parseProducts(stores);
    const groups: ProductGroup[] = [];

    for (const parsedProduct of parsedProducts) {
        let bestGroup: ProductGroup | null = null;
        let bestScore = 0;

        for (const group of groups) {
            if (group.productsByStore[parsedProduct.storeName]) {
                continue;
            }

            const score = calculateMatchScore(parsedProduct, group.reference);

            if (score >= MATCH_THRESHOLD && score > bestScore) {
                bestGroup = group;
                bestScore = score;
            }
        }

        if (bestGroup) {
            bestGroup.productsByStore[parsedProduct.storeName] = parsedProduct.product;
            continue;
        }

        const productsByStore: Record<string, ProductOffer | null> = {};

        for (const storeName of storeNames) {
            productsByStore[storeName] = null;
        }

        productsByStore[parsedProduct.storeName] = parsedProduct.product;

        groups.push({
            name: parsedProduct.product.name,
            productsByStore,
            reference: parsedProduct,
        });
    }

    return groups
        .filter(group => Object.values(group.productsByStore).filter(Boolean).length >= 2)
        .map(group => ({
            name: getBestDisplayName(group.productsByStore),
            productsByStore: group.productsByStore,
        }));
}

/* =========================================================
   PARSEO
   ========================================================= */

function parseProducts(stores: ProductsByStore): ParsedProduct[] {
    return Object.entries(stores).flatMap(([storeName, products]) =>
        products
            .filter(isComparableProduct)
            .map(product => {
                const normalizedName = normalizeText(product.name);
                const family = detectProductFamily(product);

                return {
                    product,
                    storeName,
                    normalizedName,
                    tokens: extractImportantTokens(normalizedName),
                    ...extractQuantity(normalizedName),
                    packageCount: extractPackageCount(normalizedName),
                    brand: normalizeBrand(product.brand),
                    family,
                    variant: detectProductVariant(normalizedName, family),
                };
            })
    );
}

/* =========================================================
   SCORE
   ========================================================= */

function calculateMatchScore(a: ParsedProduct, b: ParsedProduct): number {
    if (a.family && b.family && a.family !== b.family) {
        return 0;
    }

    if (a.packageCount !== b.packageCount) {
        return 0;
    }

    if (a.variant && b.variant && a.variant !== b.variant) {
        return 0;
    }

    if (a.quantity !== null && b.quantity !== null) {
        if (a.unitType !== b.unitType) {
            return 0;
        }

        if (Math.abs(a.quantity - b.quantity) > 1) {
            return 0;
        }
    }

    const tokenSimilarity = calculateTokenSimilarity(a.tokens, b.tokens);
    const nameSimilarity = calculateStringSimilarity(a.normalizedName, b.normalizedName);
    const brandScore = calculateBrandScore(a, b);
    const quantityScore = calculateQuantityScore(a, b);

    return (
        tokenSimilarity * 0.45 +
        nameSimilarity * 0.20 +
        brandScore * 0.20 +
        quantityScore * 0.15
    );
}

/* =========================================================
   MARCA
   ========================================================= */

function calculateBrandScore(a: ParsedProduct, b: ParsedProduct): number {
    if (!a.brand || !b.brand) {
        return 0.5;
    }

    if (a.brand === b.brand) {
        return 1;
    }

    const brandAInB = containsCompact(b.normalizedName, a.brand);
    const brandBInA = containsCompact(a.normalizedName, b.brand);

    if (brandAInB || brandBInA) {
        return 0.8;
    }

    return 0;
}

function normalizeBrand(brand?: string | null): string | null {
    if (!brand) {
        return null;
    }

    const normalized = normalizeText(brand).replace(/\s+/g, "");

    return normalized || null;
}

function containsCompact(text: string, value: string): boolean {
    return text.replace(/\s+/g, "").includes(value.replace(/\s+/g, ""));
}

/* =========================================================
   CANTIDAD / UNIDAD
   ========================================================= */

function extractQuantity(name: string): { quantity: number | null; unitType: UnitType } {
    const liters = name.match(/(\d+(?:[.,]\d+)?)\s*(l|lt|lts|litro|litros)\b/);

    if (liters) {
        return {
            quantity: parseNumber(liters[1]) * 1000,
            unitType: "volume",
        };
    }

    const milliliters = name.match(/(\d+(?:[.,]\d+)?)\s*(ml|cc)\b/);

    if (milliliters) {
        return {
            quantity: parseNumber(milliliters[1]),
            unitType: "volume",
        };
    }

    const kilograms = name.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilos)\b/);

    if (kilograms) {
        return {
            quantity: parseNumber(kilograms[1]) * 1000,
            unitType: "weight",
        };
    }

    const grams = name.match(/(\d+(?:[.,]\d+)?)\s*(g|gr|grs|gramo|gramos)\b/);

    if (grams) {
        return {
            quantity: parseNumber(grams[1]),
            unitType: "weight",
        };
    }

    return {
        quantity: null,
        unitType: null,
    };
}

/* =========================================================
   PACK / CANTIDAD DE UNIDADES
   ========================================================= */

function extractPackageCount(name: string): number {
    const patterns = [
        /\bpack\s+(?:de\s+)?(\d+)\b/,
        /\bcaja\s+(?:de\s+)?(\d+)\b/,
        /\b(\d+)\s*(?:un|unidad|unidades)\b/,
        /\b(\d+)\s*(?:lata|latas)\s+de\b/,
        /\b(\d+)\s*(?:botella|botellas)\s+de\b/,
        /\b(\d+)\s*x\s*\d+(?:[.,]\d+)?\s*(?:ml|cc|l|lt|lts|g|gr|grs|kg)\b/,
        /\bx\s*(\d+)\b/,
    ];

    for (const pattern of patterns) {
        const match = name.match(pattern);

        if (!match) {
            continue;
        }

        const count = Number(match[1]);

        if (Number.isFinite(count) && count > 0) {
            return count;
        }
    }

    return 1;
}

function calculateQuantityScore(a: ParsedProduct, b: ParsedProduct): number {
    if (a.quantity === null || b.quantity === null) {
        return 0.5;
    }

    return a.quantity === b.quantity && a.unitType === b.unitType ? 1 : 0;
}

function parseNumber(value: string): number {
    return Number(value.replace(",", "."));
}

/* =========================================================
   VARIANTE / SABOR
   ========================================================= */

function detectProductVariant(name: string, family: string | null): string | null {
    if (containsAny(name, ["sin azucar", "sugar free", "sugarfree", "libre de azucar"])) {
        return "sugar-free";
    }

    if (containsAny(name, ["zero"])) {
        return "zero";
    }

    if (containsAny(name, ["fruta del dragon"])) {
        return "dragon-fruit";
    }

    if (containsAny(name, ["curuba y flor de sauco", "curuba", "flor de sauco"])) {
        return "curuba-sauco";
    }

    if (containsAny(name, ["pomelo floral", "spring pomelo", "spring edition"])) {
        return "pomelo-floral";
    }

    if (containsAny(name, ["tropical", "yellow edition", "edicion yellow"])) {
        return "tropical";
    }

    if (containsAny(name, ["sandia"])) {
        return "sandia";
    }

    if (containsAny(name, ["acai"])) {
        return "acai";
    }

    if (containsAny(name, ["arandano", "arandanos"])) {
        return "arandano";
    }

    /*
     * Para bebidas energéticas sin una variante
     * explícita asumimos la presentación original.
     *
     * Esto impide, por ejemplo, que Red Bull normal
     * haga match con Tropical o Zero.
     */
    if (family === "energy-drink") {
        return "original";
    }

    return null;
}

function containsAny(value: string, values: string[]): boolean {
    return values.some(item => value.includes(item));
}

/* =========================================================
   TOKENS
   ========================================================= */

function extractImportantTokens(value: string): Set<string> {
    const ignoredWords = new Set([
        "de",
        "del",
        "la",
        "el",
        "los",
        "las",
        "en",
        "con",
        "para",
        "por",

        "botella",
        "botellas",
        "bot",
        "pet",
        "doypack",
        "pack",
        "caja",
        "lata",
        "latas",
        "unidad",
        "unidades",
        "un",

        "ml",
        "cc",
        "l",
        "lt",
        "lts",

        "g",
        "gr",
        "grs",
        "kg",
    ]);

    const tokens = value
        .split(" ")
        .map(token => token.trim())
        .filter(token => token.length > 1)
        .filter(token => !ignoredWords.has(token))
        .filter(token => !/^\d+(?:[.,]\d+)?$/.test(token));

    return new Set(tokens);
}

function calculateTokenSimilarity(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) {
        return 0;
    }

    const intersection = [...a].filter(token => b.has(token)).length;
    const union = new Set([...a, ...b]).size;

    return intersection / union;
}

/* =========================================================
   NOMBRE
   ========================================================= */

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/(\d)(ml|cc|lt|kg|gr)\b/g, "$1 $2")
        .replace(/[^a-z0-9.,\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function calculateStringSimilarity(a: string, b: string): number {
    if (a === b) {
        return 1;
    }

    const maxLength = Math.max(a.length, b.length);

    if (maxLength === 0) {
        return 1;
    }

    const distance = levenshteinDistance(a, b);

    return 1 - distance / maxLength;
}

function levenshteinDistance(a: string, b: string): number {
    const matrix = Array.from(
        { length: b.length + 1 },
        () => new Array<number>(a.length + 1)
    );

    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            matrix[j][i] = Math.min(
                matrix[j - 1][i] + 1,
                matrix[j][i - 1] + 1,
                matrix[j - 1][i - 1] + cost
            );
        }
    }

    return matrix[b.length][a.length];
}

/* =========================================================
   FAMILIA
   ========================================================= */

function detectProductFamily(product: ProductOffer): string | null {
    const value = normalizeText([
        product.name,
        ...(product.categories ?? []),
    ].join(" "));

    /*
     * Resultados no alimentarios.
     */
    if (
        value.includes("jugueteria") ||
        value.includes("bloques de construccion") ||
        value.includes("auto red bull racing")
    ) {
        return "toy";
    }

    /*
     * Bebidas energéticas.
     */
    if (
        value.includes("bebida energetica") ||
        value.includes("bebidas energeticas") ||
        value.includes("bebida energizante") ||
        value.includes("energizante")
    ) {
        return "energy-drink";
    }

    /*
     * Antes que "vinagre", revisamos productos
     * que solamente contienen la palabra vinagre
     * como atributo.
     */
    if (value.includes("lavaloza") || value.includes("lavalozas")) {
        return "cleaning";
    }

    if (value.includes("limpia vidrio") || value.includes("limpiavidrio")) {
        return "cleaning";
    }

    if (value.includes("gomita") || value.includes("gummies")) {
        return "candy";
    }

    if (value.includes("alcuza")) {
        return "kitchen-accessory";
    }

    if (value.includes("vinagreta")) {
        return "vinaigrette";
    }

    if (
        value.includes("pepinillo") ||
        value.includes("pickles") ||
        value.includes("cebollita")
    ) {
        return "pickles";
    }

    if (value.includes("vinagre")) {
        return "vinegar";
    }

    return null;
}

/* =========================================================
   FILTRO
   ========================================================= */

function isComparableProduct(product: ProductOffer): boolean {
    if (!product.name || product.price <= 0) {
        return false;
    }

    return true;
}

/* =========================================================
   DISPLAY
   ========================================================= */

function getBestDisplayName(productsByStore: Record<string, ProductOffer | null>): string {
    const products = Object.values(productsByStore)
        .filter((product): product is ProductOffer => product !== null);

    if (products.length === 0) {
        return "Producto";
    }

    return products
        .map(product => product.name)
        .sort((a, b) => b.length - a.length)[0];
}