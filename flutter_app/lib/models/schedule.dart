/// Schedule model for KJX Esports app
class Schedule {
  final int? id;
  final String day;
  final String? activities;
  final int? teamId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Schedule({
    this.id,
    required this.day,
    this.activities,
    this.teamId,
    this.createdAt,
    this.updatedAt,
  });

  factory Schedule.fromJson(Map<String, dynamic> json) {
    return Schedule(
      id: json['id'],
      day: json['day'] ?? '',
      activities: json['activities'],
      teamId: json['team_id'] ?? json['teamId'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'day': day,
      if (activities != null) 'activities': activities,
      if (teamId != null) 'team_id': teamId,
    };
  }

  /// Parse activities string into list
  List<String> get activityList {
    if (activities == null || activities!.isEmpty) return [];
    return activities!.split(', ');
  }

  Schedule copyWith({
    int? id,
    String? day,
    String? activities,
    int? teamId,
  }) {
    return Schedule(
      id: id ?? this.id,
      day: day ?? this.day,
      activities: activities ?? this.activities,
      teamId: teamId ?? this.teamId,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() => 'Schedule(id: $id, day: $day)';
}
