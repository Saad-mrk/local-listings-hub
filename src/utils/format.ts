export const formatCurrency = (value: number, currency = "MAD"): string => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};
