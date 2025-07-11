// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    [cite_start]// [cite: 1956]
    if (req.session.uid) { // Check if user ID exists in session
        next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        [cite_start]// User is not authenticated, redirect to login page [cite: 1957]
        res.redirect('/login');
    }
};