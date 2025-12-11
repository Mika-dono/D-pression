/**
 * Match Controller
 * Handles match management endpoints
 * Converted from Spring Boot MatchController
 */

const matchService = require('../services/match.service');

class MatchController {
  /**
   * GET /api/matches
   * Get all matches
   */
  async getAllMatches(req, res, next) {
    try {
      const matches = await matchService.getAllMatches();
      res.json(matches);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/matches/visible
   * Get visible matches (not hidden)
   */
  async getVisibleMatches(req, res, next) {
    try {
      const matches = await matchService.getVisibleMatches();
      res.json(matches);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/matches/:id
   * Get match by ID
   */
  async getMatchById(req, res, next) {
    try {
      const match = await matchService.getMatchById(req.params.id);
      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }
      res.json(match);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/matches/tournament/:tournament
   * Get matches by tournament
   */
  async getMatchesByTournament(req, res, next) {
    try {
      const matches = await matchService.getMatchesByTournament(req.params.tournament);
      res.json(matches);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/matches/upcoming
   * Get upcoming matches
   */
  async getUpcomingMatches(req, res, next) {
    try {
      const matches = await matchService.getUpcomingMatches();
      res.json(matches);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/matches
   * Create new match
   */
  async createMatch(req, res, next) {
    try {
      const match = await matchService.createMatch(req.body);
      res.json(match);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/matches/:id
   * Update match
   */
  async updateMatch(req, res, next) {
    try {
      const match = await matchService.updateMatch(req.params.id, req.body);
      res.json(match);
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * PATCH /api/matches/:id/toggle
   * Toggle match visibility
   */
  async toggleVisibility(req, res, next) {
    try {
      const match = await matchService.toggleVisibility(req.params.id);
      res.json(match);
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/matches/:id
   * Delete match
   */
  async deleteMatch(req, res, next) {
    try {
      await matchService.deleteMatch(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new MatchController();
