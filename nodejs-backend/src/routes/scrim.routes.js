/**
 * Scrim Routes
 * Converted from Spring Boot ScrimController
 */

const express = require('express');
const router = express.Router();
const scrimController = require('../controllers/scrim.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/scrims - Get all scrims
router.get('/', scrimController.getAllScrims);

// GET /api/scrims/status/:status - Get scrims by status
router.get('/status/:status', scrimController.getScrimsByStatus);

// GET /api/scrims/team/:teamId - Get scrims by team ID
router.get('/team/:teamId', scrimController.getScrimsByTeamId);

// GET /api/scrims/:id - Get scrim by ID
router.get('/:id', scrimController.getScrimById);

// POST /api/scrims - Create new scrim (admin only)
router.post('/', authenticateToken, requireAdmin, scrimController.createScrim);

// PUT /api/scrims/:id - Update scrim (admin only)
router.put('/:id', authenticateToken, requireAdmin, scrimController.updateScrim);

// DELETE /api/scrims/:id - Delete scrim (admin only)
router.delete('/:id', authenticateToken, requireAdmin, scrimController.deleteScrim);

module.exports = router;
