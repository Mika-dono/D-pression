/**
 * Match Service
 * Handles match-related business logic
 */

const { Match } = require('../models');
const { Op } = require('sequelize');

class MatchService {
  /**
   * Get all matches ordered by date DESC
   */
  async getAllMatches() {
    return await Match.findAll({
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get visible matches (not hidden)
   */
  async getVisibleMatches() {
    return await Match.findAll({
      where: { hidden: false },
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get match by ID
   */
  async getMatchById(id) {
    return await Match.findByPk(id);
  }

  /**
   * Get matches by tournament
   */
  async getMatchesByTournament(tournament) {
    return await Match.findAll({
      where: {
        tournament: {
          [Op.like]: `%${tournament}%`
        }
      },
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches() {
    return await Match.findAll({
      where: {
        date: {
          [Op.gt]: new Date()
        },
        hidden: false
      },
      order: [['date', 'ASC']]
    });
  }

  /**
   * Create new match
   */
  async createMatch(matchData) {
    return await Match.create({
      tournament: matchData.tournament,
      format: matchData.format || 'Bo1',
      team1: matchData.team1,
      team2: matchData.team2,
      date: matchData.date,
      time: matchData.time,
      hidden: matchData.hidden || false,
      status: matchData.status || 'SCHEDULED',
      score: matchData.score
    });
  }

  /**
   * Update match
   */
  async updateMatch(id, matchData) {
    const match = await Match.findByPk(id);
    if (!match) {
      throw new Error('Match not found with id: ' + id);
    }

    if (matchData.tournament !== undefined) match.tournament = matchData.tournament;
    if (matchData.format !== undefined) match.format = matchData.format;
    if (matchData.team1 !== undefined) match.team1 = matchData.team1;
    if (matchData.team2 !== undefined) match.team2 = matchData.team2;
    if (matchData.date !== undefined) match.date = matchData.date;
    if (matchData.time !== undefined) match.time = matchData.time;
    if (matchData.hidden !== undefined) match.hidden = matchData.hidden;
    if (matchData.status !== undefined) match.status = matchData.status;
    if (matchData.score !== undefined) match.score = matchData.score;

    await match.save();
    return match;
  }

  /**
   * Toggle match visibility
   */
  async toggleVisibility(id) {
    const match = await Match.findByPk(id);
    if (!match) {
      throw new Error('Match not found with id: ' + id);
    }

    match.hidden = !match.hidden;
    await match.save();
    return match;
  }

  /**
   * Delete match
   */
  async deleteMatch(id) {
    const match = await Match.findByPk(id);
    if (!match) {
      throw new Error('Match not found with id: ' + id);
    }

    await match.destroy();
    return true;
  }
}

module.exports = new MatchService();
