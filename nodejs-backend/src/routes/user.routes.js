/**
 * User Routes
 * Converted from Spring Boot UserController
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/users/stats - Get user statistics (before :id to prevent conflict)
router.get('/stats', authenticateToken, userController.getUserStats);

// GET /api/users - Get all users
router.get('/', authenticateToken, userController.getAllUsers);

// GET /api/users/role/:role - Get users by role
router.get('/role/:role', authenticateToken, userController.getUsersByRole);

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticateToken, userController.getUserById);

// POST /api/users - Create new user
router.post('/', authenticateToken, requireAdmin, userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', authenticateToken, userController.updateUser);

// PATCH /api/users/:id/toggle-active - Toggle user active status
router.patch('/:id/toggle-active', authenticateToken, requireAdmin, userController.toggleUserActive);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router;
