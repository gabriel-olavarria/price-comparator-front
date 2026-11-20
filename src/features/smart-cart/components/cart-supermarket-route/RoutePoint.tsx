import { House } from "lucide-react";

import { StoreLogo } from "../../../../shared/components/store-logo/StoreLogo";
import type { RouteLocation } from "../../models/route.models";

interface RoutePointProps {
  location: RouteLocation;
}

export function RoutePoint({ location }: RoutePointProps) {
  const label = location.isHome ? "Tu casa" : location.name;

  return (
    <div
      className="supermarket-route-location"
      title={location.address || label}
    >
      {location.isHome ? (
        <House
          className="supermarket-route-home-icon"
          size={25}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <StoreLogo store={location.name} size={30} showBorder={false} />
      )}

      <span>{label}</span>
    </div>
  );
}
