import '../models/event.dart';
import 'api_service.dart';

/// Event service for managing events
class EventService {
  final ApiService _api = ApiService();

  /// Get all events
  Future<List<Event>> getAllEvents() async {
    final response = await _api.get('/api/events');
    return (response as List).map((json) => Event.fromJson(json)).toList();
  }

  /// Get event by ID
  Future<Event> getEventById(int id) async {
    final response = await _api.get('/api/events/$id');
    return Event.fromJson(response);
  }

  /// Get events by type
  Future<List<Event>> getEventsByType(String type) async {
    final response = await _api.get('/api/events/type/$type');
    return (response as List).map((json) => Event.fromJson(json)).toList();
  }

  /// Get upcoming events
  Future<List<Event>> getUpcomingEvents() async {
    final response = await _api.get('/api/events/upcoming');
    return (response as List).map((json) => Event.fromJson(json)).toList();
  }

  /// Get events by team ID
  Future<List<Event>> getEventsByTeamId(int teamId) async {
    final response = await _api.get('/api/events/team/$teamId');
    return (response as List).map((json) => Event.fromJson(json)).toList();
  }

  /// Create event (admin only)
  Future<Event> createEvent(Event event) async {
    final response = await _api.post('/api/events', body: event.toJson());
    return Event.fromJson(response);
  }

  /// Update event (admin only)
  Future<Event> updateEvent(int id, Event event) async {
    final response = await _api.put('/api/events/$id', body: event.toJson());
    return Event.fromJson(response);
  }

  /// Delete event (admin only)
  Future<void> deleteEvent(int id) async {
    await _api.delete('/api/events/$id');
  }
}
