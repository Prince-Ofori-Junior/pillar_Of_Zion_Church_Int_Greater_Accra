/**
 * Format a number to currency string (USD by default)
 * @param amount - number
 * @param currency - currency code, default "USD"
 * @returns formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
