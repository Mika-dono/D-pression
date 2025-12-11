/**
 * Team Service
 * Handles team-related business logic
 */

const { Team, TeamMember } = require('../models');

class TeamService {
  /**
   * Get all teams with members
   */
  async getAllTeams() {
    return await Team.findAll({
      include: [{
        model: TeamMember,
        as: 'members'
      }],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get team by ID
   */
  async getTeamById(id) {
    return await Team.findByPk(id, {
      include: [{
        model: TeamMember,
        as: 'members'
      }]
    });
  }

  /**
   * Get teams by game
   */
  async getTeamsByGame(game) {
    return await Team.findAll({
      where: { game },
      include: [{
        model: TeamMember,
        as: 'members'
      }]
    });
  }

  /**
   * Create new team
   */
  async createTeam(teamData) {
    const team = await Team.create({
      name: teamData.name,
      game: teamData.game,
      description: teamData.description,
      logo_url: teamData.logoUrl,
      win_rate: teamData.winRate || 0.0
    });

    // Add members if provided
    if (teamData.members && teamData.members.length > 0) {
      for (const member of teamData.members) {
        await TeamMember.create({
          team_id: team.id,
          name: member.name,
          position: member.position,
          role: member.role,
          champion_pool: member.championPool,
          stats: member.stats
        });
      }
    }

    return await this.getTeamById(team.id);
  }

  /**
   * Update team
   */
  async updateTeam(id, teamData) {
    const team = await Team.findByPk(id);
    if (!team) {
      throw new Error('Team not found');
    }

    if (teamData.name !== undefined) team.name = teamData.name;
    if (teamData.game !== undefined) team.game = teamData.game;
    if (teamData.description !== undefined) team.description = teamData.description;
    if (teamData.logoUrl !== undefined) team.logo_url = teamData.logoUrl;
    if (teamData.winRate !== undefined) team.win_rate = teamData.winRate;

    await team.save();
    return await this.getTeamById(team.id);
  }

  /**
   * Delete team
   */
  async deleteTeam(id) {
    const team = await Team.findByPk(id);
    if (!team) {
      throw new Error('Team not found');
    }

    await team.destroy();
    return true;
  }

  /**
   * Add member to team
   */
  async addTeamMember(teamId, memberData) {
    const team = await Team.findByPk(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return await TeamMember.create({
      team_id: teamId,
      name: memberData.name,
      position: memberData.position,
      role: memberData.role,
      champion_pool: memberData.championPool,
      stats: memberData.stats
    });
  }

  /**
   * Remove member from team
   */
  async removeTeamMember(memberId) {
    const member = await TeamMember.findByPk(memberId);
    if (!member) {
      throw new Error('Team member not found');
    }

    await member.destroy();
    return true;
  }
}

module.exports = new TeamService();
