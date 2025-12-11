/**
 * Scrim Service
 * Handles scrim-related business logic
 */

const { Scrim, Team } = require('../models');

class ScrimService {
  /**
   * Get all scrims
   */
  async getAllScrims() {
    return await Scrim.findAll({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get scrim by ID
   */
  async getScrimById(id) {
    return await Scrim.findByPk(id, {
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }]
    });
  }

  /**
   * Get scrims by status
   */
  async getScrimsByStatus(status) {
    return await Scrim.findAll({
      where: { status },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'game']
      }],
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get scrims by team ID
   */
  async getScrimsByTeamId(teamId) {
    return await Scrim.findAll({
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
   * Create new scrim
   */
  async createScrim(scrimData) {
    const scrim = await Scrim.create({
      team_id: scrimData.teamId,
      opponent: scrimData.opponent,
      description: scrimData.description,
      date: scrimData.date,
      status: scrimData.status || 'PENDING',
      game: scrimData.game,
      notes: scrimData.notes
    });

    return await this.getScrimById(scrim.id);
  }

  /**
   * Update scrim
   */
  async updateScrim(id, scrimData) {
    const scrim = await Scrim.findByPk(id);
    if (!scrim) {
      throw new Error('Scrim not found');
    }

    if (scrimData.opponent !== undefined) scrim.opponent = scrimData.opponent;
    if (scrimData.description !== undefined) scrim.description = scrimData.description;
    if (scrimData.date !== undefined) scrim.date = scrimData.date;
    if (scrimData.status !== undefined) scrim.status = scrimData.status;
    if (scrimData.game !== undefined) scrim.game = scrimData.game;
    if (scrimData.notes !== undefined) scrim.notes = scrimData.notes;

    await scrim.save();
    return await this.getScrimById(scrim.id);
  }

  /**
   * Delete scrim
   */
  async deleteScrim(id) {
    const scrim = await Scrim.findByPk(id);
    if (!scrim) {
      throw new Error('Scrim not found');
    }

    await scrim.destroy();
    return true;
  }
}

module.exports = new ScrimService();
