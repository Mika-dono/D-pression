/// Scrim model for KJX Esports app
enum ScrimStatus { SCHEDULED, COMPLETED, CANCELLED }

class Scrim {
  final int? id;
  final String opponent;
  final String game;
  final DateTime scrimDate;
  final ScrimStatus status;
  final String? notes;
  final int? teamId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Scrim({
    this.id,
    required this.opponent,
    required this.game,
    required this.scrimDate,
    this.status = ScrimStatus.SCHEDULED,
    this.notes,
    this.teamId,
    this.createdAt,
    this.updatedAt,
  });

  factory Scrim.fromJson(Map<String, dynamic> json) {
    return Scrim(
      id: json['id'],
      opponent: json['opponent'] ?? '',
      game: json['game'] ?? '',
      scrimDate: DateTime.parse(json['scrim_date'] ?? json['scrimDate']),
      status: _parseStatus(json['status']),
      notes: json['notes'],
      teamId: json['team_id'] ?? json['teamId'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  static ScrimStatus _parseStatus(String? status) {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return ScrimStatus.SCHEDULED;
      case 'COMPLETED':
        return ScrimStatus.COMPLETED;
      case 'CANCELLED':
        return ScrimStatus.CANCELLED;
      default:
        return ScrimStatus.SCHEDULED;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'opponent': opponent,
      'game': game,
      'scrim_date': scrimDate.toIso8601String(),
      'status': status.name,
      if (notes != null) 'notes': notes,
      if (teamId != null) 'team_id': teamId,
    };
  }

  bool get isUpcoming =>
      status == ScrimStatus.SCHEDULED && scrimDate.isAfter(DateTime.now());
  bool get isCompleted => status == ScrimStatus.COMPLETED;
  bool get isCancelled => status == ScrimStatus.CANCELLED;

  Scrim copyWith({
    int? id,
    String? opponent,
    String? game,
    DateTime? scrimDate,
    ScrimStatus? status,
    String? notes,
    int? teamId,
  }) {
    return Scrim(
      id: id ?? this.id,
      opponent: opponent ?? this.opponent,
      game: game ?? this.game,
      scrimDate: scrimDate ?? this.scrimDate,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      teamId: teamId ?? this.teamId,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() =>
      'Scrim(id: $id, opponent: $opponent, game: $game, status: ${status.name})';
}
