/**
 * Membership Service
 * Handles membership-related business logic
 */

const { Membership } = require('../models');

class MembershipService {
  /**
   * Get all memberships
   */
  async getAllMemberships() {
    return await Membership.findAll({
      order: [['price', 'ASC']]
    });
  }

  /**
   * Get membership by ID
   */
  async getMembershipById(id) {
    return await Membership.findByPk(id);
  }

  /**
   * Get active memberships
   */
  async getActiveMemberships() {
    return await Membership.findAll({
      where: { is_active: true },
      order: [['price', 'ASC']]
    });
  }

  /**
   * Create new membership
   */
  async createMembership(membershipData) {
    return await Membership.create({
      name: membershipData.name,
      description: membershipData.description,
      price: membershipData.price,
      duration_days: membershipData.durationDays || 30,
      benefits: membershipData.benefits,
      is_active: membershipData.isActive !== undefined ? membershipData.isActive : true
    });
  }

  /**
   * Update membership
   */
  async updateMembership(id, membershipData) {
    const membership = await Membership.findByPk(id);
    if (!membership) {
      throw new Error('Membership not found');
    }

    if (membershipData.name !== undefined) membership.name = membershipData.name;
    if (membershipData.description !== undefined) membership.description = membershipData.description;
    if (membershipData.price !== undefined) membership.price = membershipData.price;
    if (membershipData.durationDays !== undefined) membership.duration_days = membershipData.durationDays;
    if (membershipData.benefits !== undefined) membership.benefits = membershipData.benefits;
    if (membershipData.isActive !== undefined) membership.is_active = membershipData.isActive;

    await membership.save();
    return membership;
  }

  /**
   * Delete membership
   */
  async deleteMembership(id) {
    const membership = await Membership.findByPk(id);
    if (!membership) {
      throw new Error('Membership not found');
    }

    await membership.destroy();
    return true;
  }
}

module.exports = new MembershipService();
