import '../models/schedule.dart';
import 'api_service.dart';

/// Schedule service for managing schedules
class ScheduleService {
  final ApiService _api = ApiService();

  /// Get all schedules
  Future<List<Schedule>> getAllSchedules() async {
    final response = await _api.get('/api/schedules');
    return (response as List).map((json) => Schedule.fromJson(json)).toList();
  }

  /// Get schedule by ID
  Future<Schedule> getScheduleById(int id) async {
    final response = await _api.get('/api/schedules/$id');
    return Schedule.fromJson(response);
  }

  /// Get schedule by day
  Future<Schedule> getScheduleByDay(String day) async {
    final response = await _api.get('/api/schedules/day/$day');
    return Schedule.fromJson(response);
  }

  /// Get schedules by team ID
  Future<List<Schedule>> getSchedulesByTeamId(int teamId) async {
    final response = await _api.get('/api/schedules/team/$teamId');
    return (response as List).map((json) => Schedule.fromJson(json)).toList();
  }

  /// Create schedule (admin only)
  Future<Schedule> createSchedule(Schedule schedule) async {
    final response = await _api.post('/api/schedules', body: schedule.toJson());
    return Schedule.fromJson(response);
  }

  /// Save or update schedule by day (admin only)
  Future<Schedule> saveOrUpdateByDay(Schedule schedule) async {
    final response = await _api.post('/api/schedules/day', body: schedule.toJson());
    return Schedule.fromJson(response);
  }

  /// Update schedule (admin only)
  Future<Schedule> updateSchedule(int id, Schedule schedule) async {
    final response = await _api.put('/api/schedules/$id', body: schedule.toJson());
    return Schedule.fromJson(response);
  }

  /// Delete schedule (admin only)
  Future<void> deleteSchedule(int id) async {
    await _api.delete('/api/schedules/$id');
  }
}
