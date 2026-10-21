/**
 * Formats a number to Egyptian Pounds (EGP) currency string
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatCurrency(amount, currency = "EGP") {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${currency}`;
  }
  // Ensure non-negative and properly rounded
  const cleanAmount = Math.max(0, Number(amount));
  const formatted = cleanAmount % 1 === 0 ? cleanAmount.toString() : cleanAmount.toFixed(2);
  return `${formatted} ${currency}`;
}

export default formatCurrency;
