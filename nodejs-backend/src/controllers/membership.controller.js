/**
 * Membership Controller
 * Handles membership management endpoints
 * Converted from Spring Boot MembershipController
 */

const membershipService = require('../services/membership.service');

class MembershipController {
  /**
   * GET /api/memberships
   * Get all memberships
   */
  async getAllMemberships(req, res, next) {
    try {
      const memberships = await membershipService.getAllMemberships();
      res.json(memberships);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/memberships/:id
   * Get membership by ID
   */
  async getMembershipById(req, res, next) {
    try {
      const membership = await membershipService.getMembershipById(req.params.id);
      if (!membership) {
        return res.status(404).json({
          success: false,
          message: 'Membership not found'
        });
      }
      res.json(membership);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/memberships/active
   * Get active memberships
   */
  async getActiveMemberships(req, res, next) {
    try {
      const memberships = await membershipService.getActiveMemberships();
      res.json(memberships);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/memberships
   * Create new membership
   */
  async createMembership(req, res, next) {
    try {
      const membership = await membershipService.createMembership(req.body);
      res.json(membership);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/memberships/:id
   * Update membership
   */
  async updateMembership(req, res, next) {
    try {
      const membership = await membershipService.updateMembership(req.params.id, req.body);
      res.json(membership);
    } catch (error) {
      if (error.message === 'Membership not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/memberships/:id
   * Delete membership
   */
  async deleteMembership(req, res, next) {
    try {
      await membershipService.deleteMembership(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Membership not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new MembershipController();
