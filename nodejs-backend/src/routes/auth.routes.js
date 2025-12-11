/**
 * Auth Routes
 * Converted from Spring Boot AuthController
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/login - Admin login
router.post('/login', authController.login);

// POST /auth/user/login - User login
router.post('/user/login', authController.userLogin);

// POST /auth/register - Register new user
router.post('/register', authController.register);

// POST /auth/logout - Logout
router.post('/logout', authController.logout);

module.exports = router;
