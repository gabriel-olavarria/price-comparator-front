import { House } from "lucide-react";

import { StoreLogo } from "../../../../shared/components/store-logo/StoreLogo";

interface RoutePointProps {
  pointName: string;
}

export function RoutePoint({ pointName }: RoutePointProps) {
  const label = pointName == "Casa" ? "Tu Casa" : pointName;
  const isHome = pointName === "Casa";

  return (
    <div className="supermarket-route-location" title={label}>
      {isHome ? (
        <House
          className="supermarket-route-home-icon"
          size={25}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <StoreLogo store={label} size={30} showBorder={false} />
      )}

      <span>{label}</span>
    </div>
  );
}
