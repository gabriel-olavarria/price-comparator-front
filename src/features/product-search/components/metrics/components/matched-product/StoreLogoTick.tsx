
import type { CheapestStoreCount } from "../../../../models/productCheapestCount.ts";
import unimarcLogo from "../../../../../../assets/unimarc-logo.svg";
import jumboLogo from "../../../../../../assets/jumbo-logo.png";
import liderLogo from "../../../../../../assets/lider-logo.png";
import santeIsabelLogo from "../../../../../../assets/santaIsabel.png";
import tottusLogo from "../../../../../../assets/tottus-logo.png";

interface StoreLogoTickProps {
    x?: number;
    y?: number;
    payload?: {
        value: string;
    };
    data: CheapestStoreCount[];
}

const storeLogos: Record<string, string> = {
    UNIMARC: unimarcLogo,
    JUMBO: jumboLogo,
    LIDER: liderLogo,
    SANTA_ISABEL: santeIsabelLogo,
    TOTTUS: tottusLogo,
};

export function StoreLogoTick({x = 0, y = 0, payload, data,}: StoreLogoTickProps) {
    const store = data.find(
        item => item.sellerName === String(payload?.value ?? "")
    );

    if (!store) return null;

    const logo = storeLogos[store.store];

    if (!logo) return null;

    const size = 42;
    const centerX = x - 28;

    return (
        <g>
            <circle
                cx={centerX}
                cy={y}
                r={size / 2 + 3}
                fill="#ffffff"
                stroke="#e9ecef"
                strokeWidth={1.5}
            />

            <image
                href={logo}
                x={centerX - size / 2}
                y={y - size / 2}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid meet"
            />
        </g>
    );
}
