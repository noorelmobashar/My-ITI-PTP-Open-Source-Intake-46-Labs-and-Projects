const crypto = require('crypto');

/**
 * Generates a random hexadecimal string of length n.
 * @param {number} n - The length of the hex string to generate.
 * @returns {string} The generated hex string.
 */
const generateRandomHex = (n) => {
    if (n <= 0) return '';
    return crypto.randomBytes(Math.ceil(n / 2))
        .toString('hex')
        .slice(0, n);
};

module.exports = generateRandomHex;

// Example usage:
// console.log(generateRandomHex(12)); // e.g., 'f3a2b1c4d5e6'

console.log(generateRandomHex(64));