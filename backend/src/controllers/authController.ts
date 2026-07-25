// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string, role: ('USER' | 'ORGANIZER' | 'ADMIN')[]) => {
    return jwt.sign(
        { id: userId, role: role }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '7d' }
    );
};

export const registerUser = async (req: Request, res: Response) => {
    // TODO: Implement Discord-based registration/login via webhook or OAuth callback.
    // Placeholder logic for flow validation:
    res.status(201).json({ 
        message: "Registration successful (Pending full Discord OAuth implementation)", 
        token: generateToken('discord_fallback_id', 'USER') 
    });
};

export const loginUser = async (req: Request, res: Response) => {
    // TODO: Implement flow that exchanges temporary code for a User object in the DB.
    res.status(200).json({ 
        message: "Login successful (Pending full Discord OAuth implementation)", 
        token: generateToken('discord_fallback_id', 'USER') 
    });
};

export const getMe = async (req: Request, res: Response) => {
    // The token is already validated by authenticateToken middleware
    if (!req.userId || !req.userRole) {
        return res.status(401).json({ message: "User identification failed." });
    }

    // TODO: Fetch full user profile from DB using req.userId and combine with token data.
    res.status(200).json({ 
        id: req.userId, 
        role: req.userRole,
        message: "Successfully retrieved current user details." 
    });
};