/// Post/News model for KJX Esports app
class Post {
  final int? id;
  final String title;
  final String content;
  final String category;
  final String? imageUrl;
  final String? author;
  final bool isPublished;
  final int viewCount;
  final DateTime? publishDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Post({
    this.id,
    required this.title,
    required this.content,
    required this.category,
    this.imageUrl,
    this.author,
    this.isPublished = true,
    this.viewCount = 0,
    this.publishDate,
    this.createdAt,
    this.updatedAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? '',
      imageUrl: json['image_url'] ?? json['imageUrl'],
      author: json['author'],
      isPublished: json['is_published'] ?? json['isPublished'] ?? true,
      viewCount: json['view_count'] ?? json['viewCount'] ?? 0,
      publishDate: json['publish_date'] != null || json['publishDate'] != null
          ? DateTime.parse(json['publish_date'] ?? json['publishDate'])
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
      'title': title,
      'content': content,
      'category': category,
      if (imageUrl != null) 'image_url': imageUrl,
      if (author != null) 'author': author,
      'is_published': isPublished,
      'view_count': viewCount,
      if (publishDate != null) 'publish_date': publishDate!.toIso8601String(),
    };
  }

  /// Get excerpt from content (first 150 chars)
  String get excerpt {
    if (content.length <= 150) return content;
    return '${content.substring(0, 150)}...';
  }

  Post copyWith({
    int? id,
    String? title,
    String? content,
    String? category,
    String? imageUrl,
    String? author,
    bool? isPublished,
    int? viewCount,
    DateTime? publishDate,
  }) {
    return Post(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      imageUrl: imageUrl ?? this.imageUrl,
      author: author ?? this.author,
      isPublished: isPublished ?? this.isPublished,
      viewCount: viewCount ?? this.viewCount,
      publishDate: publishDate ?? this.publishDate,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  @override
  String toString() => 'Post(id: $id, title: $title, category: $category)';
}
