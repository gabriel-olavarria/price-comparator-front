const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (value: number): string =>
  priceFormatter.format(value);

export const formatNumber = (value: number): string =>
  numberFormatter.format(value);

export const formatFuelPrice = (value: number | null | undefined): string => {
  if (value == null || !Number.isFinite(value)) {
    return "Sin información";
  }

  return formatPrice(value);
};
