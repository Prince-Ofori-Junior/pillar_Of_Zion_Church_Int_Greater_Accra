/**
 * Format a JavaScript date to a readable string
 * Example: 2025-12-22 -> "Dec 22, 2025"
 */
export const formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

/**
 * Validate an email string
 * Returns true if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Format a number to currency
 * Example: 1000 -> "GHS 1,000.00"
 */
export const formatCurrency = (amount, currency = 'GHS') => {
  if (isNaN(amount)) return '';
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency }).format(amount);
};

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Capitalize the first letter of each word
 * Example: "john doe" -> "John Doe"
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
