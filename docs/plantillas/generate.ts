import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { reactFile, typescriptFile, axiosFile } from './mermaid-nodes.ts';

const diagram = `flowchart LR
    subgraph FEATURES["📁 features"]
        direction TB
        SEARCH["📁 product-search"]:::folder
        CART["📁 smart-cart"]:::folder
    end

    subgraph MODULE["📁 smart-cart"]
        direction TB
        ${reactFile('PAGE', 'SmartCartPage.tsx')}
        ${reactFile('HOOK', 'useSmartCart.ts')}
        ${typescriptFile('STORE', 'smartCart.store.ts')}
    end

    subgraph SHARED["📁 shared"]
        direction TB
        ${axiosFile('HTTP', 'axios-client.ts')}
        ${typescriptFile('PRODUCT', 'product.model.ts')}
    end

    CART --> PAGE
    PAGE -->|Uses| HOOK
    HOOK -->|Updates| STORE
    HOOK -->|Imports| PRODUCT
    SEARCH -->|Uses| HTTP

    classDef folder fill:#20212b,stroke:#7036d9,color:#ffffff,stroke-width:2px
    classDef file fill:#292a37,stroke:#52526a,color:#ffffff,rx:12,ry:12

    style FEATURES fill:#15151e,stroke:#7036d9,color:#ffffff
    style MODULE fill:#15151e,stroke:#7036d9,color:#ffffff
    style SHARED fill:#15151e,stroke:#7036d9,color:#ffffff

    linkStyle default stroke:#a78bfa,stroke-width:2px
`;

const destination = resolve('docs/arquitectura.mmd');
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, diagram, 'utf8');
console.log(`Diagrama generado: ${destination}`);
