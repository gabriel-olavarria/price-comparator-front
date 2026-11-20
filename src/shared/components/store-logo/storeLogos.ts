import unimarcLogo from "../../../assets/unimarc-logo.svg";
import jumboLogo from "../../../assets/jumbo-logo.png";
import liderLogo from "../../../assets/lider-logo.png";
import santaIsabelLogo from "../../../assets/santaIsabel.png";
import tottusLogo from "../../../assets/tottus-logo.png";
import acuentaLogo from "../../../assets/acuenta-logo.png";

export const storeLogos: Record<string, string> = {
  UNIMARC: unimarcLogo,
  JUMBO: jumboLogo,
  LIDER: liderLogo,
  SANTA_ISABEL: santaIsabelLogo,
  TOTTUS: tottusLogo,
  ACUENTA: acuentaLogo,
};

export function normalizeStoreName(name: string): string {
  return name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function getStoreLogo(storeName: string): string | undefined {
  return storeLogos[normalizeStoreName(storeName)];
}
