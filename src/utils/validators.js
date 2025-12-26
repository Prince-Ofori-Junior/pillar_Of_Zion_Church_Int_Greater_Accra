/**
 * Validate email format
 * @param email
 * @returns boolean
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * @param password
 * @returns boolean
 */
export const isValidPassword = (password) => {
  // Minimum 6 characters, at least 1 letter and 1 number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};

/**
 * Validate non-empty string
 * @param str
 * @returns boolean
 */
export const isNotEmpty = (str) => str && str.trim().length > 0;
