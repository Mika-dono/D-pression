/**
 * Scrim Controller
 * Handles scrim management endpoints
 * Converted from Spring Boot ScrimController
 */

const scrimService = require('../services/scrim.service');

class ScrimController {
  /**
   * GET /api/scrims
   * Get all scrims
   */
  async getAllScrims(req, res, next) {
    try {
      const scrims = await scrimService.getAllScrims();
      res.json(scrims);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/scrims/:id
   * Get scrim by ID
   */
  async getScrimById(req, res, next) {
    try {
      const scrim = await scrimService.getScrimById(req.params.id);
      if (!scrim) {
        return res.status(404).json({
          success: false,
          message: 'Scrim not found'
        });
      }
      res.json(scrim);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/scrims/status/:status
   * Get scrims by status
   */
  async getScrimsByStatus(req, res, next) {
    try {
      const scrims = await scrimService.getScrimsByStatus(req.params.status);
      res.json(scrims);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/scrims/team/:teamId
   * Get scrims by team ID
   */
  async getScrimsByTeamId(req, res, next) {
    try {
      const scrims = await scrimService.getScrimsByTeamId(req.params.teamId);
      res.json(scrims);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/scrims
   * Create new scrim
   */
  async createScrim(req, res, next) {
    try {
      const scrim = await scrimService.createScrim(req.body);
      res.json(scrim);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/scrims/:id
   * Update scrim
   */
  async updateScrim(req, res, next) {
    try {
      const scrim = await scrimService.updateScrim(req.params.id, req.body);
      res.json(scrim);
    } catch (error) {
      if (error.message === 'Scrim not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/scrims/:id
   * Delete scrim
   */
  async deleteScrim(req, res, next) {
    try {
      await scrimService.deleteScrim(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Scrim not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new ScrimController();
