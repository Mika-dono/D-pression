/**
 * Schedule Service
 * Handles schedule-related business logic
 */

const { Schedule, Team } = require('../models');

class ScheduleService {
  /**
   * Get all schedules
   */
  async getAllSchedules() {
    return await Schedule.findAll({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['id', 'ASC']]
    });
  }

  /**
   * Get schedule by ID
   */
  async getScheduleById(id) {
    return await Schedule.findByPk(id, {
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }]
    });
  }

  /**
   * Get schedule by day
   */
  async getScheduleByDay(dayOfWeek) {
    return await Schedule.findOne({
      where: { day_of_week: dayOfWeek },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }]
    });
  }

  /**
   * Get schedules by team ID
   */
  async getSchedulesByTeamId(teamId) {
    return await Schedule.findAll({
      where: { team_id: teamId },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['id', 'ASC']]
    });
  }

  /**
   * Create new schedule
   */
  async createSchedule(scheduleData) {
    return await Schedule.create({
      team_id: scheduleData.teamId,
      day_of_week: scheduleData.dayOfWeek,
      start_time: scheduleData.startTime,
      end_time: scheduleData.endTime,
      activity: scheduleData.activity,
      notes: scheduleData.notes
    });
  }

  /**
   * Update schedule
   */
  async updateSchedule(id, scheduleData) {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error('Schedule not found with id: ' + id);
    }

    if (scheduleData.dayOfWeek !== undefined) schedule.day_of_week = scheduleData.dayOfWeek;
    if (scheduleData.startTime !== undefined) schedule.start_time = scheduleData.startTime;
    if (scheduleData.endTime !== undefined) schedule.end_time = scheduleData.endTime;
    if (scheduleData.activity !== undefined) schedule.activity = scheduleData.activity;
    if (scheduleData.notes !== undefined) schedule.notes = scheduleData.notes;

    await schedule.save();
    return await this.getScheduleById(schedule.id);
  }

  /**
   * Save or update by day
   */
  async saveOrUpdateByDay(scheduleData) {
    const existing = await Schedule.findOne({
      where: { day_of_week: scheduleData.dayOfWeek }
    });

    if (existing) {
      existing.start_time = scheduleData.startTime;
      existing.end_time = scheduleData.endTime;
      existing.activity = scheduleData.activity;
      existing.notes = scheduleData.notes;
      await existing.save();
      return await this.getScheduleById(existing.id);
    }

    return await this.createSchedule(scheduleData);
  }

  /**
   * Delete schedule
   */
  async deleteSchedule(id) {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error('Schedule not found with id: ' + id);
    }

    await schedule.destroy();
    return true;
  }
}

module.exports = new ScheduleService();
