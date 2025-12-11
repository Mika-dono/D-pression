/**
 * Match Routes
 * Converted from Spring Boot MatchController
 */

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/matches - Get all matches
router.get('/', matchController.getAllMatches);

// GET /api/matches/visible - Get visible matches
router.get('/visible', matchController.getVisibleMatches);

// GET /api/matches/upcoming - Get upcoming matches
router.get('/upcoming', matchController.getUpcomingMatches);

// GET /api/matches/tournament/:tournament - Get matches by tournament
router.get('/tournament/:tournament', matchController.getMatchesByTournament);

// GET /api/matches/:id - Get match by ID
router.get('/:id', matchController.getMatchById);

// POST /api/matches - Create new match (admin only)
router.post('/', authenticateToken, requireAdmin, matchController.createMatch);

// PUT /api/matches/:id - Update match (admin only)
router.put('/:id', authenticateToken, requireAdmin, matchController.updateMatch);

// PATCH /api/matches/:id/toggle - Toggle match visibility (admin only)
router.patch('/:id/toggle', authenticateToken, requireAdmin, matchController.toggleVisibility);

// DELETE /api/matches/:id - Delete match (admin only)
router.delete('/:id', authenticateToken, requireAdmin, matchController.deleteMatch);

module.exports = router;
