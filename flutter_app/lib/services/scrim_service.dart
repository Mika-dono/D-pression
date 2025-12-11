import '../models/scrim.dart';
import 'api_service.dart';

/// Scrim service for managing scrims
class ScrimService {
  final ApiService _api = ApiService();

  /// Get all scrims
  Future<List<Scrim>> getAllScrims() async {
    final response = await _api.get('/api/scrims');
    return (response as List).map((json) => Scrim.fromJson(json)).toList();
  }

  /// Get scrim by ID
  Future<Scrim> getScrimById(int id) async {
    final response = await _api.get('/api/scrims/$id');
    return Scrim.fromJson(response);
  }

  /// Get scrims by status
  Future<List<Scrim>> getScrimsByStatus(String status) async {
    final response = await _api.get('/api/scrims/status/$status');
    return (response as List).map((json) => Scrim.fromJson(json)).toList();
  }

  /// Get scrims by team ID
  Future<List<Scrim>> getScrimsByTeamId(int teamId) async {
    final response = await _api.get('/api/scrims/team/$teamId');
    return (response as List).map((json) => Scrim.fromJson(json)).toList();
  }

  /// Create scrim (admin only)
  Future<Scrim> createScrim(Scrim scrim) async {
    final response = await _api.post('/api/scrims', body: scrim.toJson());
    return Scrim.fromJson(response);
  }

  /// Update scrim (admin only)
  Future<Scrim> updateScrim(int id, Scrim scrim) async {
    final response = await _api.put('/api/scrims/$id', body: scrim.toJson());
    return Scrim.fromJson(response);
  }

  /// Delete scrim (admin only)
  Future<void> deleteScrim(int id) async {
    await _api.delete('/api/scrims/$id');
  }
}
