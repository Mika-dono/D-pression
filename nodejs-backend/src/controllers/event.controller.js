/**
 * Event Controller
 * Handles event management endpoints
 * Converted from Spring Boot EventController
 */

const eventService = require('../services/event.service');

class EventController {
  /**
   * GET /api/events
   * Get all events
   */
  async getAllEvents(req, res, next) {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/:id
   * Get event by ID
   */
  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/type/:type
   * Get events by type
   */
  async getEventsByType(req, res, next) {
    try {
      const events = await eventService.getEventsByType(req.params.type);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/upcoming
   * Get upcoming events
   */
  async getUpcomingEvents(req, res, next) {
    try {
      const events = await eventService.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/team/:teamId
   * Get events by team ID
   */
  async getEventsByTeamId(req, res, next) {
    try {
      const events = await eventService.getEventsByTeamId(req.params.teamId);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/events
   * Create new event
   */
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/events/:id
   * Update event
   */
  async updateEvent(req, res, next) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/events/:id
   * Delete event
   */
  async deleteEvent(req, res, next) {
    try {
      await eventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new EventController();
