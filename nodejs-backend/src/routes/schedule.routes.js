/**
 * Schedule Routes
 * Converted from Spring Boot ScheduleController
 */

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/schedules - Get all schedules
router.get('/', scheduleController.getAllSchedules);

// GET /api/schedules/day/:day - Get schedule by day
router.get('/day/:day', scheduleController.getScheduleByDay);

// GET /api/schedules/team/:teamId - Get schedules by team ID
router.get('/team/:teamId', scheduleController.getSchedulesByTeamId);

// GET /api/schedules/:id - Get schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// POST /api/schedules - Create new schedule (admin only)
router.post('/', authenticateToken, requireAdmin, scheduleController.createSchedule);

// POST /api/schedules/day - Save or update schedule by day (admin only)
router.post('/day', authenticateToken, requireAdmin, scheduleController.saveOrUpdateByDay);

// PUT /api/schedules/:id - Update schedule (admin only)
router.put('/:id', authenticateToken, requireAdmin, scheduleController.updateSchedule);

// DELETE /api/schedules/:id - Delete schedule (admin only)
router.delete('/:id', authenticateToken, requireAdmin, scheduleController.deleteSchedule);

module.exports = router;
