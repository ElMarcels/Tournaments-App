// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Augment the Request type to include user details (pulled from JWT payload)
declare global {
    namespace Express {
        Request: { 
            userId?: string; // Discord ID of the authenticated user
            userRole?: string; // Role extracted from token
        };
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 * Middleware to authenticate incoming requests using a Bearer Token 
 * passed in the Authorization header (e.g., 'Bearer <token>').
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Expects format: Bearer <token>
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authentication required: No token provided.' });
    }

    try {
        // Verify the token using the stored secret key
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id;   // Discord ID
        req.userRole = payload.role; // Role (e.g., 'ADMIN', 'ORGANIZER')
        next();
    } catch (error) {
        console.error("JWT Verification failed:", error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

/**
 * Middleware to enforce specific user roles required to access a route handler.
 * @param allowedRoles - An array of role strings (e.g., ['ADMIN', 'ORGANIZER']).
 */
export const checkRole = (allowedRoles: ('USER' | 'ORGANIZER' | 'ADMIN')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole as any)) {
            return res.status(403).json({ 
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.` 
            });
        }
        next();
    };
};