function generateVerificationCode(): number {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit numeric code
}
    
function decryptNationalId(encryptedId:string) {
    // Implement your decryption logic here
    // This is a placeholder implementation
    // Replace this with your actual decryption logic
    const decryptedId = someDecryptionFunction(encryptedId); // Example: decrypt the ID
    return parseInt(decryptedId, 10); // Convert the decrypted ID to an integer
}
function someDecryptionFunction(encryptedId : string) {
    // Implement your actual decryption algorithm here
    // This is just an example
    return encryptedId; // Return the decrypted ID
}
export { generateVerificationCode , decryptNationalId };