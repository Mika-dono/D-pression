/**
 * Team Controller
 * Handles team management endpoints
 * Converted from Spring Boot TeamController
 */

const teamService = require('../services/team.service');

class TeamController {
  /**
   * GET /api/teams
   * Get all teams
   */
  async getAllTeams(req, res, next) {
    try {
      const teams = await teamService.getAllTeams();
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/teams/:id
   * Get team by ID
   */
  async getTeamById(req, res, next) {
    try {
      const team = await teamService.getTeamById(req.params.id);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/teams/game/:game
   * Get teams by game
   */
  async getTeamsByGame(req, res, next) {
    try {
      const teams = await teamService.getTeamsByGame(req.params.game);
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/teams
   * Create new team
   */
  async createTeam(req, res, next) {
    try {
      const team = await teamService.createTeam(req.body);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/teams/:id
   * Update team
   */
  async updateTeam(req, res, next) {
    try {
      const team = await teamService.updateTeam(req.params.id, req.body);
      res.json(team);
    } catch (error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/teams/:id
   * Delete team
   */
  async deleteTeam(req, res, next) {
    try {
      await teamService.deleteTeam(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new TeamController();
