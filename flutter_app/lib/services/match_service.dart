import '../models/match.dart';
import 'api_service.dart';

/// Match service for managing matches
class MatchService {
  final ApiService _api = ApiService();

  /// Get all matches
  Future<List<Match>> getAllMatches() async {
    final response = await _api.get('/api/matches');
    return (response as List).map((json) => Match.fromJson(json)).toList();
  }

  /// Get visible matches
  Future<List<Match>> getVisibleMatches() async {
    final response = await _api.get('/api/matches/visible');
    return (response as List).map((json) => Match.fromJson(json)).toList();
  }

  /// Get match by ID
  Future<Match> getMatchById(int id) async {
    final response = await _api.get('/api/matches/$id');
    return Match.fromJson(response);
  }

  /// Get matches by tournament
  Future<List<Match>> getMatchesByTournament(String tournament) async {
    final response = await _api.get('/api/matches/tournament/$tournament');
    return (response as List).map((json) => Match.fromJson(json)).toList();
  }

  /// Get upcoming matches
  Future<List<Match>> getUpcomingMatches() async {
    final response = await _api.get('/api/matches/upcoming');
    return (response as List).map((json) => Match.fromJson(json)).toList();
  }

  /// Create match (admin only)
  Future<Match> createMatch(Match match) async {
    final response = await _api.post('/api/matches', body: match.toJson());
    return Match.fromJson(response);
  }

  /// Update match (admin only)
  Future<Match> updateMatch(int id, Match match) async {
    final response = await _api.put('/api/matches/$id', body: match.toJson());
    return Match.fromJson(response);
  }

  /// Toggle match visibility (admin only)
  Future<Match> toggleVisibility(int id) async {
    final response = await _api.patch('/api/matches/$id/toggle');
    return Match.fromJson(response);
  }

  /// Delete match (admin only)
  Future<void> deleteMatch(int id) async {
    await _api.delete('/api/matches/$id');
  }
}
