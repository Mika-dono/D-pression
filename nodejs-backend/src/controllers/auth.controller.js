/**
 * Auth Controller
 * Handles authentication endpoints
 * Converted from Spring Boot AuthController
 */

const authService = require('../services/auth.service');

class AuthController {
  /**
   * POST /auth/login
   * Admin login (for admin dashboard)
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      const result = await authService.adminLogin(username, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/user/login
   * User login (for regular users)
   */
  async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.userLogin(email, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/register
   * Register new user
   */
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email and password are required'
        });
      }

      const result = await authService.register(username, email, password);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Logout
   */
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
}

module.exports = new AuthController();
