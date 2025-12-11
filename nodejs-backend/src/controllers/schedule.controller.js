/**
 * Schedule Controller
 * Handles schedule management endpoints
 * Converted from Spring Boot ScheduleController
 */

const scheduleService = require('../services/schedule.service');

class ScheduleController {
  /**
   * GET /api/schedules
   * Get all schedules
   */
  async getAllSchedules(req, res, next) {
    try {
      const schedules = await scheduleService.getAllSchedules();
      res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/:id
   * Get schedule by ID
   */
  async getScheduleById(req, res, next) {
    try {
      const schedule = await scheduleService.getScheduleById(req.params.id);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: 'Schedule not found'
        });
      }
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/day/:day
   * Get schedule by day
   */
  async getScheduleByDay(req, res, next) {
    try {
      const schedule = await scheduleService.getScheduleByDay(req.params.day);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: 'Schedule not found'
        });
      }
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/team/:teamId
   * Get schedules by team ID
   */
  async getSchedulesByTeamId(req, res, next) {
    try {
      const schedules = await scheduleService.getSchedulesByTeamId(req.params.teamId);
      res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/schedules
   * Create new schedule
   */
  async createSchedule(req, res, next) {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/schedules/day
   * Save or update schedule by day
   */
  async saveOrUpdateByDay(req, res, next) {
    try {
      const schedule = await scheduleService.saveOrUpdateByDay(req.body);
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/schedules/:id
   * Update schedule
   */
  async updateSchedule(req, res, next) {
    try {
      const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
      res.json(schedule);
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
   * DELETE /api/schedules/:id
   * Delete schedule
   */
  async deleteSchedule(req, res, next) {
    try {
      await scheduleService.deleteSchedule(req.params.id);
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

module.exports = new ScheduleController();
