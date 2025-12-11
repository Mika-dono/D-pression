/// Match model for KJX Esports app
class Match {
  final int? id;
  final String tournament;
  final String opponent;
  final String? result;
  final String? score;
  final DateTime matchDate;
  final String? streamUrl;
  final bool isHidden;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Match({
    this.id,
    required this.tournament,
    required this.opponent,
    this.result,
    this.score,
    required this.matchDate,
    this.streamUrl,
    this.isHidden = false,
    this.createdAt,
    this.updatedAt,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'],
      tournament: json['tournament'] ?? '',
      opponent: json['opponent'] ?? '',
      result: json['result'],
      score: json['score'],
      matchDate: DateTime.parse(json['match_date'] ?? json['matchDate']),
      streamUrl: json['stream_url'] ?? json['streamUrl'],
      isHidden: json['is_hidden'] ?? json['isHidden'] ?? false,
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
      'tournament': tournament,
      'opponent': opponent,
      if (result != null) 'result': result,
      if (score != null) 'score': score,
      'match_date': matchDate.toIso8601String(),
      if (streamUrl != null) 'stream_url': streamUrl,
      'is_hidden': isHidden,
    };
  }

  bool get isUpcoming => matchDate.isAfter(DateTime.now());
  bool get isWin => result?.toUpperCase() == 'WIN';
  bool get isLoss => result?.toUpperCase() == 'LOSS';

  Match copyWith({
    int? id,
    String? tournament,
    String? opponent,
    String? result,
    String? score,
    DateTime? matchDate,
    String? streamUrl,
    bool? isHidden,
  }) {
    return Match(
      id: id ?? this.id,
      tournament: tournament ?? this.tournament,
      opponent: opponent ?? this.opponent,
      result: result ?? this.result,
      score: score ?? this.score,
      matchDate: matchDate ?? this.matchDate,
      streamUrl: streamUrl ?? this.streamUrl,
      isHidden: isHidden ?? this.isHidden,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() =>
      'Match(id: $id, tournament: $tournament, opponent: $opponent, result: $result)';
}
