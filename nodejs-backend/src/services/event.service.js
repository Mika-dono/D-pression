/**
 * Event Service
 * Handles event-related business logic
 */

const { Event, Team } = require('../models');
const { Op } = require('sequelize');

class EventService {
  /**
   * Get all events
   */
  async getAllEvents() {
    return await Event.findAll({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get event by ID
   */
  async getEventById(id) {
    return await Event.findByPk(id, {
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }]
    });
  }

  /**
   * Get events by type
   */
  async getEventsByType(type) {
    return await Event.findAll({
      where: { type },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents() {
    return await Event.findAll({
      where: {
        date: {
          [Op.gt]: new Date()
        }
      },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'ASC']]
    });
  }

  /**
   * Get events by team ID
   */
  async getEventsByTeamId(teamId) {
    return await Event.findAll({
      where: { team_id: teamId },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Create new event
   */
  async createEvent(eventData) {
    return await Event.create({
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      team_id: eventData.teamId,
      opponent: eventData.opponent,
      status: eventData.status || 'SCHEDULED'
    });
  }

  /**
   * Update event
   */
  async updateEvent(id, eventData) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Event not found');
    }

    if (eventData.title !== undefined) event.title = eventData.title;
    if (eventData.description !== undefined) event.description = eventData.description;
    if (eventData.type !== undefined) event.type = eventData.type;
    if (eventData.date !== undefined) event.date = eventData.date;
    if (eventData.time !== undefined) event.time = eventData.time;
    if (eventData.location !== undefined) event.location = eventData.location;
    if (eventData.status !== undefined) event.status = eventData.status;
    if (eventData.opponent !== undefined) event.opponent = eventData.opponent;

    await event.save();
    return await this.getEventById(event.id);
  }

  /**
   * Delete event
   */
  async deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Event not found');
    }

    await event.destroy();
    return true;
  }
}

module.exports = new EventService();
