/// Team model for KJX Esports app
class Team {
  final int? id;
  final String name;
  final String game;
  final String? logoUrl;
  final String? description;
  final String? achievements;
  final List<TeamMember>? members;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Team({
    this.id,
    required this.name,
    required this.game,
    this.logoUrl,
    this.description,
    this.achievements,
    this.members,
    this.createdAt,
    this.updatedAt,
  });

  factory Team.fromJson(Map<String, dynamic> json) {
    return Team(
      id: json['id'],
      name: json['name'] ?? '',
      game: json['game'] ?? '',
      logoUrl: json['logo_url'] ?? json['logoUrl'],
      description: json['description'],
      achievements: json['achievements'],
      members: json['members'] != null
          ? (json['members'] as List).map((m) => TeamMember.fromJson(m)).toList()
          : null,
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
      'game': game,
      if (logoUrl != null) 'logo_url': logoUrl,
      if (description != null) 'description': description,
      if (achievements != null) 'achievements': achievements,
    };
  }

  Team copyWith({
    int? id,
    String? name,
    String? game,
    String? logoUrl,
    String? description,
    String? achievements,
    List<TeamMember>? members,
  }) {
    return Team(
      id: id ?? this.id,
      name: name ?? this.name,
      game: game ?? this.game,
      logoUrl: logoUrl ?? this.logoUrl,
      description: description ?? this.description,
      achievements: achievements ?? this.achievements,
      members: members ?? this.members,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() => 'Team(id: $id, name: $name, game: $game)';
}

/// Team Member model
class TeamMember {
  final int? id;
  final int? teamId;
  final String gamertag;
  final String? role;
  final String? photoUrl;
  final String? nationality;
  final DateTime? joinDate;

  TeamMember({
    this.id,
    this.teamId,
    required this.gamertag,
    this.role,
    this.photoUrl,
    this.nationality,
    this.joinDate,
  });

  factory TeamMember.fromJson(Map<String, dynamic> json) {
    return TeamMember(
      id: json['id'],
      teamId: json['team_id'] ?? json['teamId'],
      gamertag: json['gamertag'] ?? '',
      role: json['role'],
      photoUrl: json['photo_url'] ?? json['photoUrl'],
      nationality: json['nationality'],
      joinDate: json['join_date'] != null || json['joinDate'] != null
          ? DateTime.parse(json['join_date'] ?? json['joinDate'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      if (teamId != null) 'team_id': teamId,
      'gamertag': gamertag,
      if (role != null) 'role': role,
      if (photoUrl != null) 'photo_url': photoUrl,
      if (nationality != null) 'nationality': nationality,
      if (joinDate != null) 'join_date': joinDate!.toIso8601String(),
    };
  }

  @override
  String toString() => 'TeamMember(id: $id, gamertag: $gamertag, role: $role)';
}
