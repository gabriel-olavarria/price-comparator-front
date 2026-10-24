// product-search.ts

// ============================================================
// MODELOS
// ============================================================

import type {ProductOffer} from "../models/ProductOffer.ts";

export interface SearchResponse {
    query: string | null;
    totalResults: number;
    stores: Record<string, ProductOffer[]>;
}

export interface ProductConcept {
    /**
     * Identificador interno del concepto.
     *
     * Ej:
     * arroz
     * pastas
     * sopas
     */
    id: string;

    /**
     * Sinónimos/equivalencias que representan
     * el mismo concepto.
     */
    aliases: string[];

    /**
     * Frases completas que representan el concepto.
     *
     * Tienen mayor especificidad que un alias.
     */
    phrases?: string[];

    /**
     * Términos que indican QUÉ ES principalmente
     * el producto.
     *
     * Ej:
     * "bebida de arroz"
     *
     * headTerm = bebida
     * arroz = componente secundario
     */
    headTerms?: string[];
}

export interface ConceptMatch {
    concept: ProductConcept;
    term: string;
    index: number;
    isPhrase: boolean;
}

export interface RankedProduct {
    product: ProductOffer;
    score: number;
    debug: ProductScoreDebug;
}

export interface ProductScoreDebug {
    queryConcept?: string;
    productConcept?: string;

    exactName: boolean;
    startsWithQuery: boolean;
    containsQuery: boolean;
    categoryMatch: boolean;
    brandMatch: boolean;

    tokenCoverage: number;

    reasons: string[];
}


// ============================================================
// CONCEPTOS DE PRODUCTOS
// ============================================================

/**
 * Esta lista describe CONCEPTOS, no productos concretos.
 *
 * NO:
 * "Arroz Tucapel 1kg"
 *
 * SÍ:
 * arroz
 * pastas
 * sopas
 * bebidas
 *
 * Los aliases permiten equivalencias:
 *
 * tallarines
 * fideos
 * spaghetti
 * pasta
 *
 * todos pertenecen a:
 *
 * pastas
 */
export const PRODUCT_CONCEPTS: ProductConcept[] = [

    // ========================================================
    // ARROZ
    // ========================================================

    {
        id: "arroz",

        aliases: [
            "arroz",
            "arroces"
        ],

        headTerms: [
            "arroz",
            "arroces"
        ],

        phrases: [
            "arroz integral",
            "arroz basmati",
            "arroz jazmin",
            "arroz pregraneado",
            "arroz grado 1",
            "arroz grado 2"
        ]
    },


    // ========================================================
    // PASTAS
    // ========================================================

    {
        id: "pastas",

        aliases: [
            "pasta",
            "pastas",

            "fideo",
            "fideos",

            "tallarin",
            "tallarines",

            "spaghetti",
            "espagueti",
            "espaguetis",

            "fettuccine",
            "fetuccine",
            "fetuccini",

            "linguine",

            "penne",

            "rigatoni",

            "macarron",
            "macarrones"
        ],

        headTerms: [
            "pasta",
            "pastas",

            "fideo",
            "fideos",

            "tallarin",
            "tallarines",

            "spaghetti",
            "espagueti",
            "espaguetis",

            "fettuccine",
            "fetuccine",
            "fetuccini",

            "linguine",
            "penne",
            "rigatoni",

            "macarron",
            "macarrones"
        ],

        phrases: [
            "fideos de arroz",
            "pasta de arroz"
        ]
    },


    // ========================================================
    // SOPAS / CALDOS
    // ========================================================

    {
        id: "sopas",

        aliases: [
            "sopa",
            "sopas",
            "caldo",
            "caldos"
        ],

        headTerms: [
            "sopa",
            "sopas",
            "caldo",
            "caldos"
        ],

        phrases: [
            "sopa instantanea",
            "sopa de pollo",
            "sopa de verduras",
            "caldo en polvo"
        ]
    },


    // ========================================================
    // LECHES
    // ========================================================

    {
        id: "leches",

        aliases: [
            "leche",
            "leches"
        ],

        headTerms: [
            "leche",
            "leches"
        ],

        phrases: [
            "leche entera",
            "leche descremada",
            "leche semidescremada",
            "leche sin lactosa"
        ]
    },


    // ========================================================
    // BEBIDAS
    // ========================================================

    {
        id: "bebidas",

        aliases: [
            "bebida",
            "bebidas"
        ],

        headTerms: [
            "bebida",
            "bebidas"
        ],

        phrases: [
            "bebida vegetal",
            "bebida de arroz",
            "bebida de avena",
            "bebida de almendras",
            "bebida de soya"
        ]
    },


    // ========================================================
    // JUGOS
    // ========================================================

    {
        id: "jugos",

        aliases: [
            "jugo",
            "jugos",
            "zumo",
            "zumos"
        ],

        headTerms: [
            "jugo",
            "jugos",
            "zumo",
            "zumos"
        ]
    },


    // ========================================================
    // CEREALES
    // ========================================================

    {
        id: "cereales",

        aliases: [
            "cereal",
            "cereales"
        ],

        headTerms: [
            "cereal",
            "cereales"
        ]
    },


    // ========================================================
    // HARINAS
    // ========================================================

    {
        id: "harinas",

        aliases: [
            "harina",
            "harinas"
        ],

        headTerms: [
            "harina",
            "harinas"
        ],

        phrases: [
            "harina de trigo",
            "harina integral",
            "harina sin polvos",
            "harina con polvos",
            "harina de arroz"
        ]
    },


    // ========================================================
    // ACEITES
    // ========================================================

    {
        id: "aceites",

        aliases: [
            "aceite",
            "aceites"
        ],

        headTerms: [
            "aceite",
            "aceites"
        ],

        phrases: [
            "aceite vegetal",
            "aceite de oliva",
            "aceite de maravilla",
            "aceite de canola"
        ]
    },


    // ========================================================
    // SAZONADORES / CONDIMENTOS
    // ========================================================

    {
        id: "sazonadores",

        aliases: [
            "sazonador",
            "sazonadores",
            "condimento",
            "condimentos"
        ],

        headTerms: [
            "sazonador",
            "sazonadores",
            "condimento",
            "condimentos"
        ],

        phrases: [
            "sazonador para arroz"
        ]
    },


    // ========================================================
    // ALIMENTOS PARA MASCOTAS
    // ========================================================

    {
        id: "alimento-mascotas",

        aliases: [
            "alimento perro",
            "alimento perros",
            "alimento gato",
            "alimento gatos",
            "comida perro",
            "comida perros",
            "comida gato",
            "comida gatos"
        ],

        headTerms: [
            "alimento perro",
            "alimento perros",
            "alimento gato",
            "alimento gatos",
            "comida perro",
            "comida perros",
            "comida gato",
            "comida gatos"
        ]
    },


    // ========================================================
    // PAPEL HIGIÉNICO
    // ========================================================

    {
        id: "papel-higienico",

        aliases: [
            "papel higienico",
            "papel confort",
            "confort"
        ],

        headTerms: [
            "papel higienico",
            "papel confort"
        ]
    },


    // ========================================================
    // PAPEL
    // ========================================================

    {
        id: "papel",

        aliases: [
            "papel"
        ],

        headTerms: [
            "papel"
        ],

        phrases: [
            "papel de arroz",
            "papel mantequilla",
            "papel aluminio"
        ]
    },


    // ========================================================
    // CHOCOLATE
    // ========================================================

    {
        id: "chocolate",

        aliases: [
            "chocolate",
            "chocolates"
        ],

        headTerms: [
            "chocolate",
            "chocolates"
        ]
    },
    // ========================================================
    // COLADOS Y PICADOS
    // ========================================================
    {
        id: "colados-picados",

        aliases: [
            "colado",
            "colados",
            "picado",
            "picados"
        ],

        headTerms: [
            "colado",
            "colados",
            "picado",
            "picados"
        ],

        phrases: [
            "colados picados y otros"
        ]
    },
];


// ============================================================
// NORMALIZACIÓN
// ============================================================

export function normalize(
    value?: string | null
): string {

    if (!value) {
        return "";
    }

    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// TOKENIZACIÓN
// ============================================================

export function tokenize(
    value?: string | null
): string[] {

    const normalized =
        normalize(value);

    if (!normalized) {
        return [];
    }

    return normalized
        .split(" ")
        .filter(Boolean);
}


// ============================================================
// CONTIENE TÉRMINO COMPLETO
// ============================================================

/**
 * Evita coincidencias parciales.
 *
 * pan integral + pan => true
 * panko + pan        => false
 */
export function containsTerm(
    value: string,
    term: string
): boolean {

    const text =
        normalize(value);

    const search =
        normalize(term);

    if (!text || !search) {
        return false;
    }

    return (` ${text} `)
        .includes(` ${search} `);
}


// ============================================================
// POSICIÓN DEL TÉRMINO
// ============================================================

function getTermIndex(
    value: string,
    term: string
): number {

    const normalizedValue =
        normalize(value);

    const normalizedTerm =
        normalize(term);

    if (
        !normalizedValue ||
        !normalizedTerm
    ) {
        return -1;
    }

    if (
        !containsTerm(
            normalizedValue,
            normalizedTerm
        )
    ) {
        return -1;
    }

    return normalizedValue.indexOf(
        normalizedTerm
    );
}


// ============================================================
// CREAR MATCH
// ============================================================

function createConceptMatch(value: string, concept: ProductConcept,term: string,isPhrase: boolean): ConceptMatch | undefined {

    const index = getTermIndex(value, term);

    if (index < 0) {
        return undefined;
    }

    return { concept, term: normalize(term), index, isPhrase };
}


// ============================================================
// ORDENAR MATCHES
// ============================================================

function sortConceptMatches(matches: ConceptMatch[]): ConceptMatch[] {

    return matches.sort((a, b) => {

        /**
         * El concepto que aparece primero
         * normalmente representa qué ES
         * el producto.
         */
        if (a.index !== b.index) {
            return a.index - b.index;
        }

        /**
         * Si empiezan en el mismo lugar,
         * gana el término más específico.
         */
        if (a.term.length !== b.term.length) {
            return b.term.length - a.term.length;
        }

        /**
         * Finalmente favorecemos frases.
         */
        if (a.isPhrase !== b.isPhrase) {
            return a.isPhrase ? -1 : 1;
        }

        return 0;
    });
}


// ============================================================
// DETECTAR CONCEPTO DE UNA CONSULTA
// ============================================================

/**
 * Esta función interpreta la intención de búsqueda.
 *
 * Ej:
 *
 * arroz
 *      => arroz
 *
 * tallarines
 *      => pastas
 *
 * fideos
 *      => pastas
 *
 * papel de arroz
 *      => papel
 *
 * bebida de arroz
 *      => bebidas
 */
export function detectQueryConcept(query: string): ConceptMatch | undefined {

    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
        return undefined;
    }

    const matches: ConceptMatch[] = [];


    // ========================================================
    // 1. FRASES
    // ========================================================

    for (const concept of PRODUCT_CONCEPTS) {

        for ( const phrase of concept.phrases ?? []) {

            const match =
                createConceptMatch( normalizedQuery,
                    concept,
                    phrase,
                    true
                );

            if (match) {
                matches.push(match);
            }
        }
    }

    /**
     * Si la consulta contiene una frase específica, la frase gana.
     * Ej: papel de arroz
     * no debe terminar simplemente en arroz.
     */
    if (matches.length > 0) {
        return sortConceptMatches( matches)[0];
    }

    // ========================================================
    // 2. ALIASES
    // ========================================================

    for (const concept of PRODUCT_CONCEPTS) {

        for (
            const alias
            of concept.aliases
            ) {

            const match =
                createConceptMatch(
                    normalizedQuery,
                    concept,
                    alias,
                    false
                );

            if (match) {
                matches.push(match);
            }
        }
    }

    if (matches.length === 0) {
        return undefined;
    }

    return sortConceptMatches(matches)[0];
}


// ============================================================
// DETECTAR CONCEPTO PRINCIPAL DE UN TEXTO
// ============================================================

/**
 * Esta función intenta determinar QUÉ ES principalmente el producto.
 * Ej: "Sopa de pollo con arroz"
 * sopa  -> posición 0
 * arroz -> posterior
 * Resultado: SOPAS
 * 
 * "Bebida de arroz"
 * bebida -> posición 0
 * arroz  -> posterior
 * Resultado: BEBIDAS
 *
 *
 * "Fideos de arroz"
 * fideos -> posición 0
 * arroz  -> posterior
 * Resultado: PASTAS
 */
export function detectMainProductConcept(value: string): ConceptMatch | undefined {
    const normalizedValue = normalize(value);

    if (!normalizedValue) {
        return undefined;
    }

    const matches: ConceptMatch[] = [];

    for (const concept of PRODUCT_CONCEPTS) {
        const terms = concept.headTerms?.length ? concept.headTerms : concept.aliases;
        
        for (const term of terms) {
            const match = createConceptMatch( normalizedValue, concept, term,  term.includes(" "));

            if (match) {
                matches.push(match);
            }
        }
    }

    if (matches.length === 0) {
        return undefined;
    }
    
    return sortConceptMatches(matches)[0];
}


// ============================================================
// DETECTAR CONCEPTO DE CATEGORÍA
// ============================================================

function detectCategoryConcept( category: string): ConceptMatch | undefined {

    const normalizedCategory = normalize(category);

    if (!normalizedCategory) {
        return undefined;
    }

    const matches: ConceptMatch[] = [];

    // ========================================================
    // FRASES
    // ========================================================

    for (const concept of PRODUCT_CONCEPTS) {

        for ( const phrase of concept.phrases ?? []) {
            const match =
                createConceptMatch(normalizedCategory, concept, phrase, true);

            if (match) {
                matches.push(match);
            }
        }
    }


    // ========================================================
    // ALIASES
    // ========================================================

    for (const concept of PRODUCT_CONCEPTS) {
        for (const alias of concept.aliases) {
            const match = createConceptMatch( normalizedCategory, concept,alias,false);
            if (match) {
                matches.push(match);
            }
        }
    }

    if (matches.length === 0) {
        return undefined;
    }
    return sortConceptMatches( matches)[0];
}


// ============================================================
// DETECTAR CONCEPTO DEL PRODUCTO
// ============================================================

export function detectProductConcept(product: ProductOffer): ConceptMatch | undefined {

    /**
     * 1. Si tenemos categorías, son nuestra
     * evidencia más fuerte.
     *
     * Recorremos desde la más específica
     * hacia la más general.
     */
    if (product.categories?.length) {

        const categories = [...product.categories].reverse();
        for (const category of categories) {
            const match = detectCategoryConcept(category);

            if (match) {
                return match;
            }
        }
    }


    /**
     * 2. Si el supermercado no entrega
     * categorías (por ejemplo algunos
     * resultados de Unimarc), analizamos
     * el nombre.
     */
    return detectMainProductConcept( product.name);
}


// ============================================================
// COBERTURA DE TOKENS
// ============================================================

export function calculateTokenCoverage(query: string, product: ProductOffer): number {

    const queryTokens = tokenize(query);
    let matchedTokens = 0;    
    
    if (queryTokens.length === 0) {
        return 0;
    }
    const searchableText = normalize([
        product.name, 
        product.brand ?? "", 
        ...(product.categories ?? []) ].join(" "));
    
    for (const token of queryTokens) {
        if (containsTerm( searchableText, token)) {
            matchedTokens++;
        }
    }
    
    return (matchedTokens/queryTokens.length);
}


// ============================================================
// COINCIDENCIA CON CATEGORÍA
// ============================================================

function hasCategoryMatch(product: ProductOffer,query: string): boolean {
    return (product.categories ?? [] ).some(category => containsTerm( category, query ) );
}


// ============================================================
// CALCULAR SCORE
// ============================================================

export function calculateProductScore( product: ProductOffer,query: string): RankedProduct {
    const normalizedQuery = normalize(query);
    const normalizedName = normalize(product.name);
    const normalizedBrand = normalize(product.brand);
    const reasons: string[] = [];
    let score = 0;
    // ========================================================
    // CONCEPTOS
    // ========================================================
    const queryConcept = detectQueryConcept(query);
    const productConcept = detectProductConcept(product);

    // 1. NOMBRE EXACTO
    const exactName = normalizedName === normalizedQuery;
    if (exactName) {
        score += 1000;
        reasons.push("Nombre exactamente igual a la búsqueda");
    }

    // 2. COMIENZA CON LA CONSULTA
    const startsWithQuery = normalizedName === normalizedQuery || normalizedName.startsWith(`${normalizedQuery} `);
    if (startsWithQuery) {
        score += 500;
        reasons.push("El nombre comienza con la búsqueda");
    }

    // 3. CONTIENE LA CONSULTA
    const containsQuery = containsTerm(normalizedName, normalizedQuery);
    if (containsQuery) {
        score += 200;
        reasons.push("El nombre contiene la búsqueda completa" );
    }

    // 4. MISMO CONCEPTO
    const sameConcept = !!queryConcept && !!productConcept && queryConcept.concept.id === productConcept.concept.id;
    if (sameConcept) {
        score += 700;
        reasons.push(`Concepto compatible: ${queryConcept!.concept.id}`);
    }

    // 5. CONCEPTO DIFERENTE
    const differentConcept = !!queryConcept && !!productConcept && queryConcept.concept.id !==  productConcept.concept.id;
    
    if (differentConcept) {
        score -= 800;
        reasons.push(`Concepto diferente: búsqueda=${queryConcept!.concept.id}, producto=${productConcept!.concept.id}`);
    }

    // 6. CATEGORÍAS
    const categoryMatch = hasCategoryMatch( product,  normalizedQuery);
    if (categoryMatch) {
        score += 300;
        reasons.push("La categoría contiene la búsqueda");
    }

    // 7. MARCA
    const brandMatch =  normalizedBrand === normalizedQuery;
    if (brandMatch) {
        score += 500;
        reasons.push("La búsqueda coincide exactamente con la marca" );
    }

    // 8. COBERTURA DE TOKENS
    const tokenCoverage = calculateTokenCoverage(query, product );
    score += tokenCoverage * 300;
    if (tokenCoverage > 0) {
        reasons.push(`Cobertura de palabras: ${Math.round( tokenCoverage * 100 )}%` );
    }

    // 9. POSICIÓN DEL PRIMER TÉRMINO
    const queryTokens = tokenize(normalizedQuery);
    const nameTokens = tokenize(normalizedName);
    
    if (queryTokens.length > 0) {
        const firstQueryToken = queryTokens[0];
        const position = nameTokens.indexOf( firstQueryToken);

        if (position === 0) {
            score += 150;
            reasons.push("El primer término buscado aparece al inicio");
        } else if (position === 1) {
            score += 75;
        } else if (position >= 2) {
            score += 20;
        }
    }


    // ========================================================
    // RESULTADO
    // ========================================================

    return {
        product,
        score: Math.round(score),
        debug: {
            queryConcept:
            queryConcept?.concept.id,
            productConcept:
            productConcept?.concept.id,
            exactName,
            startsWithQuery,
            containsQuery,
            categoryMatch,
            brandMatch,
            tokenCoverage,
            reasons
        }
    };
}

// ============================================================
// RANKEAR PRODUCTOS
// ============================================================

export function rankProducts( query: string, products: ProductOffer[], minimumScore = 300): RankedProduct[] {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
        return [];
    }

    if (!Array.isArray(products)) {
        return [];
    }

    return products.map(product =>   
        calculateProductScore(product, query))
        .filter(result =>  result.score >=  minimumScore)
        .sort((a, b) => b.score - a.score);
}


// ============================================================
// PROCESAR RESPUESTA COMPLETA
// ============================================================

/**
 * Uso normal:
 *
 * const result = searchProducts(response);
 */
export function searchProducts(response?: SearchResponse | null,minimumScore = 300): SearchResponse | null {

    if (!response?.stores) {
        return null;
    }

    const query = response.query ?? "";
    const stores: Record<string, ProductOffer[]> = {};

    for (const [storeName, products] of Object.entries(response.stores)) {
        stores[storeName] = rankProducts( query, products ?? [], minimumScore )
            .map(result => result.product);
    }

    return { ...response, stores };
}


// ============================================================
// DEBUG
// ============================================================

/**
 * Devuelve TODOS los productos por defecto,
 * incluso los que tienen score negativo.
 *
 * Esto permite analizar por qué fueron
 * aceptados/rechazados.
 */
export function debugSearchProducts( response?: SearchResponse | null, minimumScore = -Infinity): Record<string, RankedProduct[]> {

    if (!response?.stores) {
        return {};
    }

    const query = response.query ?? "";
    const stores: Record<string, RankedProduct[]> = {};
    for (const [storeName, products] of Object.entries(response.stores)) {
        stores[storeName] = rankProducts( query, products ?? [], minimumScore );
    }

    return stores;
}
export function getQueryConcept( query: string): string | null {
    const match = detectQueryConcept(query);
    return match?.concept.id ?? null;
}