"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptNationalId = exports.generateVerificationCode = void 0;
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit numeric code
}
exports.generateVerificationCode = generateVerificationCode;
function decryptNationalId(encryptedId) {
    // Implement your decryption logic here
    // This is a placeholder implementation
    // Replace this with your actual decryption logic
    const decryptedId = someDecryptionFunction(encryptedId); // Example: decrypt the ID
    return parseInt(decryptedId, 10); // Convert the decrypted ID to an integer
}
exports.decryptNationalId = decryptNationalId;
function someDecryptionFunction(encryptedId) {
    // Implement your actual decryption algorithm here
    // This is just an example
    return encryptedId; // Return the decrypted ID
}
