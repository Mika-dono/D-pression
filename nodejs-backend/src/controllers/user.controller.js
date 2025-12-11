/**
 * User Controller
 * Handles user management endpoints
 * Converted from Spring Boot UserController
 */

const userService = require('../services/user.service');

class UserController {
  /**
   * GET /api/users
   * Get all users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/role/:role
   * Get users by role
   */
  async getUsersByRole(req, res, next) {
    try {
      const users = await userService.getUsersByRole(req.params.role);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users
   * Create new user
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user
      });
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Utilisateur mis à jour',
        user
      });
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('existe déjà')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id/toggle-active
   * Toggle user active status
   */
  async toggleUserActive(req, res, next) {
    try {
      const user = await userService.toggleUserActive(req.params.id);
      res.json({
        success: true,
        message: user.is_active ? 'Utilisateur activé' : 'Utilisateur désactivé',
        user
      });
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete user
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({
        success: true,
        message: 'Utilisateur supprimé'
      });
    } catch (error) {
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/users/stats
   * Get user statistics
   */
  async getUserStats(req, res, next) {
    try {
      const stats = await userService.getUserStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
