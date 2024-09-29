"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
exports.decryptNationalId = decryptNationalId;
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit numeric code
}
function decryptNationalId(encryptedId) {
    // Implement your decryption logic here
    // This is a placeholder implementation
    // Replace this with your actual decryption logic
    const decryptedId = someDecryptionFunction(encryptedId); // Example: decrypt the ID
    return parseInt(decryptedId, 10); // Convert the decrypted ID to an integer
}
function someDecryptionFunction(encryptedId) {
    // Implement your actual decryption algorithm here
    // This is just an example
    return encryptedId; // Return the decrypted ID
}
//# sourceMappingURL=verify.js.map