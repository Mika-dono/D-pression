/**
 * Auth Service
 * Handles authentication logic
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const crypto = require('crypto');

class AuthService {
  /**
   * Hash password using SHA-256 (compatible with Spring Boot)
   * For production, consider using bcrypt instead
   */
  hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('base64');
  }

  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'kyojin-kjx-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * Admin login
   */
  async adminLogin(username, password) {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    const hashedPassword = this.hashPassword(password);
    
    if (hashedPassword !== user.password_hash || user.role !== 'ADMIN') {
      return { success: false, message: 'Invalid username or password' };
    }

    const token = this.generateToken(user);
    
    return {
      success: true,
      message: 'Login successful',
      username: user.username,
      token: `admin-token-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * User login (for regular users)
   */
  async userLogin(email, password) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    const hashedPassword = this.hashPassword(password);
    
    if (hashedPassword !== user.password_hash || !user.is_active) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    const token = this.generateToken(user);
    
    return {
      success: true,
      message: 'Login successful',
      token: `user-token-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Register new user
   */
  async register(username, email, password) {
    // Check if username exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return { success: false, message: 'Ce nom d\'utilisateur est déjà pris' };
    }

    // Check if email exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return { success: false, message: 'Cette adresse email est déjà utilisée' };
    }

    // Create new user
    const hashedPassword = this.hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: 'USER',
      is_active: true
    });

    const token = this.generateToken(newUser);

    return {
      success: true,
      message: 'Inscription réussie ! Bienvenue chez Kyojin KJX',
      token: `user-token-${Date.now()}`,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'kyojin-kjx-secret');
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthService();
