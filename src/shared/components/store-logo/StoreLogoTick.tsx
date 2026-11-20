import type { CheapestStoreCount } from "./productCheapestCount.ts";

import { getStoreLogo } from "./storeLogos";

interface StoreLogoTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  data: CheapestStoreCount[];
  size?: number;
}

export function StoreLogoTick({
  x = 0,
  y = 0,
  payload,
  data,
  size = 42,
}: StoreLogoTickProps) {
  const sellerName = String(payload?.value ?? "");

  const store = data.find((item) => item.sellerName === sellerName);

  if (!store) return null;

  const logo = getStoreLogo(store.store);

  if (!logo) return null;

  const centerX = x - 28;
  const radius = size / 2 + 3;

  return (
    <g>
      <circle
        cx={centerX}
        cy={y}
        r={radius}
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
