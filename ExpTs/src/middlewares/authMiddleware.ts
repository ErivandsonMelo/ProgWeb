// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.uid) { // Check if user ID exists in session
        next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
};