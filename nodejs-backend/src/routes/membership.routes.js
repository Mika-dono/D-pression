/**
 * Membership Routes
 * Converted from Spring Boot MembershipController
 */

const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membership.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/memberships - Get all memberships
router.get('/', membershipController.getAllMemberships);

// GET /api/memberships/active - Get active memberships
router.get('/active', membershipController.getActiveMemberships);

// GET /api/memberships/:id - Get membership by ID
router.get('/:id', membershipController.getMembershipById);

// POST /api/memberships - Create new membership (admin only)
router.post('/', authenticateToken, requireAdmin, membershipController.createMembership);

// PUT /api/memberships/:id - Update membership (admin only)
router.put('/:id', authenticateToken, requireAdmin, membershipController.updateMembership);

// DELETE /api/memberships/:id - Delete membership (admin only)
router.delete('/:id', authenticateToken, requireAdmin, membershipController.deleteMembership);

module.exports = router;
