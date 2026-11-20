import { Store } from "lucide-react";
import { getStoreLogo } from "./storeLogos";
import "./StoreLogo.css";

interface StoreLogoProps {
  store: string;
  size?: number;
  showBorder?: boolean;
  className?: string;
}

export function StoreLogo({
  store,
  size = 42,
  showBorder = true,
  className = "",
}: StoreLogoProps) {
  const logo = getStoreLogo(store);

  const normalizedStore = store.trim().toUpperCase();

  return (
    <span
      className={[
        "store-logo",
        showBorder ? "store-logo--border" : "",
        normalizedStore === "ACUENTA" ? "store-logo--acuenta" : "",
        normalizedStore === "JUMBO" ? "store-logo--jumbo" : "",
        normalizedStore === "LIDER" ? "store-logo--lider" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
      }}
      title={store}
      role="img"
      aria-label={store}
    >
      {logo ? (
        <img src={logo} alt="" />
      ) : (
        <Store size={size * 0.55} aria-hidden="true" />
      )}
    </span>
  );
}
