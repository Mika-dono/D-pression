import '../models/team.dart';
import 'api_service.dart';

/// Team service for managing teams
class TeamService {
  final ApiService _api = ApiService();

  /// Get all teams
  Future<List<Team>> getAllTeams() async {
    final response = await _api.get('/api/teams');
    return (response as List).map((json) => Team.fromJson(json)).toList();
  }

  /// Get team by ID
  Future<Team> getTeamById(int id) async {
    final response = await _api.get('/api/teams/$id');
    return Team.fromJson(response);
  }

  /// Get teams by game
  Future<List<Team>> getTeamsByGame(String game) async {
    final response = await _api.get('/api/teams/game/$game');
    return (response as List).map((json) => Team.fromJson(json)).toList();
  }

  /// Create team (admin only)
  Future<Team> createTeam(Team team) async {
    final response = await _api.post('/api/teams', body: team.toJson());
    return Team.fromJson(response);
  }

  /// Update team (admin only)
  Future<Team> updateTeam(int id, Team team) async {
    final response = await _api.put('/api/teams/$id', body: team.toJson());
    return Team.fromJson(response);
  }

  /// Delete team (admin only)
  Future<void> deleteTeam(int id) async {
    await _api.delete('/api/teams/$id');
  }
}
