// src/router/router.ts
import { Router } from 'express';
import mainController from '../controllers/main';
import userController from '../controllers/user';
import majorController from '../controllers/major';
import { isAuthenticated } from '../middlewares/authMiddleware'; [cite_start]// [cite: 1956]
import { rankingPage } from '../controllers/ranking';

const router = Router();

// Public Routes
router.get('/about', mainController.about); [cite_start]// [cite: 1960]
router.all('/register', userController.create); [cite_start]// [cite: 1960]
router.all('/login', userController.login); [cite_start]// [cite: 1960]
router.get('/logout', userController.logout); [cite_start]// [cite: 1962]

router.get('/ranking', rankingPage);

// Game related routes (can be public or protected, depending on your choice for Task 17)
router.get('/ranking', mainController.ranking); [cite_start]// [cite: 1961]
router.get('/lorem/:count', mainController.lorem); // Task 6 - Adjust if needed

// Handlebars examples from slides (can be kept public or protected)
router.get('/hb1', mainController.hb1);
router.get('/hb2', mainController.hb2);
router.get('/hb3', mainController.hb3);
router.get('/hb4', mainController.hb4);

[cite_start]// Protected Routes (require authentication) [cite: 1952, 1956]
router.get('/', isAuthenticated, mainController.index); [cite_start]// Main game page [cite: 1951, 1961]
router.post('/save-score', isAuthenticated, mainController.saveScore); [cite_start]// Save game score [cite: 1953]
router.all('/profile/edit', isAuthenticated, userController.editProfile); [cite_start]// Edit user profile [cite: 1962]
router.all('/profile/change-password', isAuthenticated, userController.changePassword); [cite_start]// Change user password [cite: 1962]

// CRUD for Majors (example, you might want to protect these with admin middleware)
router.get('/major', majorController.index);
router.all('/major/create', majorController.create);
router.get('/major/read/:id', majorController.read); // Placeholder, implement read in majorController
router.all('/major/update/:id', majorController.update); // Placeholder, implement update in majorController
router.post('/major/remove/:id', majorController.remove); [cite_start]// [cite: 1947]

// CRUD for Users (example, you might want to protect these with admin middleware)
router.get('/user', userController.index);
router.post('/user/remove/:id', userController.remove); [cite_start]// [cite: 1947]

export default router;

import { rankingPage } from '../controllers/ranking';
router.get('/ranking', rankingPage);

