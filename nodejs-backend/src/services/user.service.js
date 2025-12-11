/**
 * User Service
 * Handles user-related business logic
 */

const { User } = require('../models');
const crypto = require('crypto');

class UserService {
  /**
   * Hash password using SHA-256 (compatible with Spring Boot)
   */
  hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('base64');
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role) {
    return await User.findAll({
      where: { role: role.toUpperCase() },
      attributes: { exclude: ['password_hash'] }
    });
  }

  /**
   * Get users by active status
   */
  async getUsersByActiveStatus(isActive) {
    return await User.findAll({
      where: { is_active: isActive },
      attributes: { exclude: ['password_hash'] }
    });
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    // Check if username exists
    const existingUsername = await User.findOne({ where: { username: userData.username } });
    if (existingUsername) {
      throw new Error('Ce nom d\'utilisateur existe déjà');
    }

    // Check if email exists
    const existingEmail = await User.findOne({ where: { email: userData.email } });
    if (existingEmail) {
      throw new Error('Cette adresse email existe déjà');
    }

    const hashedPassword = this.hashPassword(userData.password);

    return await User.create({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      role: userData.role ? userData.role.toUpperCase() : 'USER',
      is_active: userData.isActive !== undefined ? userData.isActive : true
    });
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Check username uniqueness if updating
    if (userData.username && userData.username !== user.username) {
      const existingUsername = await User.findOne({ where: { username: userData.username } });
      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur existe déjà');
      }
      user.username = userData.username;
    }

    // Check email uniqueness if updating
    if (userData.email && userData.email !== user.email) {
      const existingEmail = await User.findOne({ where: { email: userData.email } });
      if (existingEmail) {
        throw new Error('Cette adresse email existe déjà');
      }
      user.email = userData.email;
    }

    if (userData.role) {
      user.role = userData.role.toUpperCase();
    }

    if (userData.isActive !== undefined) {
      user.is_active = userData.isActive;
    }

    if (userData.password && userData.password.trim() !== '') {
      user.password_hash = this.hashPassword(userData.password);
    }

    await user.save();
    return user;
  }

  /**
   * Toggle user active status
   */
  async toggleUserActive(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    user.is_active = !user.is_active;
    await user.save();
    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    await user.destroy();
    return true;
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const total = await User.count();
    const admins = await User.count({ where: { role: 'ADMIN' } });
    const users = await User.count({ where: { role: 'USER' } });
    const coaches = await User.count({ where: { role: 'COACH' } });
    const moderators = await User.count({ where: { role: 'MODERATOR' } });
    const active = await User.count({ where: { is_active: true } });
    const inactive = await User.count({ where: { is_active: false } });

    return {
      total,
      admins,
      users,
      coaches,
      moderators,
      active,
      inactive
    };
  }
}

module.exports = new UserService();
