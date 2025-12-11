/**
 * Event Routes
 * Converted from Spring Boot EventController
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/events - Get all events
router.get('/', eventController.getAllEvents);

// GET /api/events/upcoming - Get upcoming events
router.get('/upcoming', eventController.getUpcomingEvents);

// GET /api/events/type/:type - Get events by type
router.get('/type/:type', eventController.getEventsByType);

// GET /api/events/team/:teamId - Get events by team ID
router.get('/team/:teamId', eventController.getEventsByTeamId);

// GET /api/events/:id - Get event by ID
router.get('/:id', eventController.getEventById);

// POST /api/events - Create new event (admin only)
router.post('/', authenticateToken, requireAdmin, eventController.createEvent);

// PUT /api/events/:id - Update event (admin only)
router.put('/:id', authenticateToken, requireAdmin, eventController.updateEvent);

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', authenticateToken, requireAdmin, eventController.deleteEvent);

module.exports = router;
