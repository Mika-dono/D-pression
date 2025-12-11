/// Membership model for KJX Esports app
class Membership {
  final int? id;
  final String name;
  final String? description;
  final double price;
  final int durationMonths;
  final String? benefits;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Membership({
    this.id,
    required this.name,
    this.description,
    required this.price,
    this.durationMonths = 1,
    this.benefits,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Membership.fromJson(Map<String, dynamic> json) {
    return Membership(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] is String)
          ? double.parse(json['price'])
          : (json['price'] ?? 0).toDouble(),
      durationMonths: json['duration_months'] ?? json['durationMonths'] ?? 1,
      benefits: json['benefits'],
      isActive: json['is_active'] ?? json['isActive'] ?? true,
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
      'price': price,
      'duration_months': durationMonths,
      if (benefits != null) 'benefits': benefits,
      'is_active': isActive,
    };
  }

  List<String> get benefitsList {
    if (benefits == null || benefits!.isEmpty) return [];
    return benefits!.split(', ');
  }

  bool get isLifetime => durationMonths == 0;

  Membership copyWith({
    int? id,
    String? name,
    String? description,
    double? price,
    int? durationMonths,
    String? benefits,
    bool? isActive,
  }) {
    return Membership(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      durationMonths: durationMonths ?? this.durationMonths,
      benefits: benefits ?? this.benefits,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() => 'Membership(id: $id, name: $name, price: $price)';
}
