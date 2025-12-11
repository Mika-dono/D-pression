import '../models/post.dart';
import 'api_service.dart';

/// Post/News service for managing posts
class PostService {
  final ApiService _api = ApiService();

  /// Get all posts
  Future<List<Post>> getAllPosts() async {
    final response = await _api.get('/api/posts');
    return (response as List).map((json) => Post.fromJson(json)).toList();
  }

  /// Get post by ID (increments view count)
  Future<Post> getPostById(int id) async {
    final response = await _api.get('/api/posts/$id');
    return Post.fromJson(response);
  }

  /// Get posts by category
  Future<List<Post>> getPostsByCategory(String category) async {
    final response = await _api.get('/api/posts/category/$category');
    return (response as List).map((json) => Post.fromJson(json)).toList();
  }

  /// Get published posts
  Future<List<Post>> getPublishedPosts() async {
    final response = await _api.get('/api/posts/published');
    return (response as List).map((json) => Post.fromJson(json)).toList();
  }

  /// Create post (admin only)
  Future<Post> createPost(Post post) async {
    final response = await _api.post('/api/posts', body: post.toJson());
    return Post.fromJson(response);
  }

  /// Update post (admin only)
  Future<Post> updatePost(int id, Post post) async {
    final response = await _api.put('/api/posts/$id', body: post.toJson());
    return Post.fromJson(response);
  }

  /// Delete post (admin only)
  Future<void> deletePost(int id) async {
    await _api.delete('/api/posts/$id');
  }
}
