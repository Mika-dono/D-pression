import '../models/membership.dart';
import 'api_service.dart';

/// Membership service for managing memberships
class MembershipService {
  final ApiService _api = ApiService();

  /// Get all memberships
  Future<List<Membership>> getAllMemberships() async {
    final response = await _api.get('/api/memberships');
    return (response as List).map((json) => Membership.fromJson(json)).toList();
  }

  /// Get membership by ID
  Future<Membership> getMembershipById(int id) async {
    final response = await _api.get('/api/memberships/$id');
    return Membership.fromJson(response);
  }

  /// Get active memberships
  Future<List<Membership>> getActiveMemberships() async {
    final response = await _api.get('/api/memberships/active');
    return (response as List).map((json) => Membership.fromJson(json)).toList();
  }

  /// Create membership (admin only)
  Future<Membership> createMembership(Membership membership) async {
    final response = await _api.post('/api/memberships', body: membership.toJson());
    return Membership.fromJson(response);
  }

  /// Update membership (admin only)
  Future<Membership> updateMembership(int id, Membership membership) async {
    final response = await _api.put('/api/memberships/$id', body: membership.toJson());
    return Membership.fromJson(response);
  }

  /// Delete membership (admin only)
  Future<void> deleteMembership(int id) async {
    await _api.delete('/api/memberships/$id');
  }
}
