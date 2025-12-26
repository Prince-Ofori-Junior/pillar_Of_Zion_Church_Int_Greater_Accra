/**
 * Format a date string to "MMM DD, YYYY"
 * @param dateStr - ISO date string or Date object
 * @returns formatted date string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
