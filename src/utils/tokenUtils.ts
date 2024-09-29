// src/utils/tokenUtils.ts
import { Request } from 'express';

export function getUserIdFromToken(req: Request): number | null {
    // Example implementation, replace with your actual token extraction logic
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        // Decode token and extract user ID
        // This is just a placeholder; replace with actual token decoding logic
        try {
            const decoded = decodeToken(token); // Replace with actual token decoding
            return decoded.userId;
        } catch (err) {
            console.error('Token decoding error:', err);
            return null;
        }
    }
    return null;
}

// Example decodeToken function
function decodeToken(token: string): { userId: number } {
    // Replace with actual token decoding logic
    return { userId: 1 }; // Placeholder
}
