/**
 * Team Routes
 * Converted from Spring Boot TeamController
 */

const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/teams - Get all teams
router.get('/', teamController.getAllTeams);

// GET /api/teams/game/:game - Get teams by game
router.get('/game/:game', teamController.getTeamsByGame);

// GET /api/teams/:id - Get team by ID
router.get('/:id', teamController.getTeamById);

// POST /api/teams - Create new team (admin only)
router.post('/', authenticateToken, requireAdmin, teamController.createTeam);

// PUT /api/teams/:id - Update team (admin only)
router.put('/:id', authenticateToken, requireAdmin, teamController.updateTeam);

// DELETE /api/teams/:id - Delete team (admin only)
router.delete('/:id', authenticateToken, requireAdmin, teamController.deleteTeam);

module.exports = router;
