/// Event model for KJX Esports app
class Event {
  final int? id;
  final String name;
  final String? description;
  final String type;
  final DateTime date;
  final String? location;
  final String? prizePool;
  final String? imageUrl;
  final int? teamId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Event({
    this.id,
    required this.name,
    this.description,
    required this.type,
    required this.date,
    this.location,
    this.prizePool,
    this.imageUrl,
    this.teamId,
    this.createdAt,
    this.updatedAt,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      type: json['type'] ?? '',
      date: DateTime.parse(json['date']),
      location: json['location'],
      prizePool: json['prize_pool'] ?? json['prizePool'],
      imageUrl: json['image_url'] ?? json['imageUrl'],
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
      'name': name,
      if (description != null) 'description': description,
      'type': type,
      'date': date.toIso8601String(),
      if (location != null) 'location': location,
      if (prizePool != null) 'prize_pool': prizePool,
      if (imageUrl != null) 'image_url': imageUrl,
      if (teamId != null) 'team_id': teamId,
    };
  }

  bool get isUpcoming => date.isAfter(DateTime.now());

  Event copyWith({
    int? id,
    String? name,
    String? description,
    String? type,
    DateTime? date,
    String? location,
    String? prizePool,
    String? imageUrl,
    int? teamId,
  }) {
    return Event(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      date: date ?? this.date,
      location: location ?? this.location,
      prizePool: prizePool ?? this.prizePool,
      imageUrl: imageUrl ?? this.imageUrl,
      teamId: teamId ?? this.teamId,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() => 'Event(id: $id, name: $name, type: $type, date: $date)';
}
