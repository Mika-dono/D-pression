import '../models/product.dart';
import 'api_service.dart';

/// Product service for managing products
class ProductService {
  final ApiService _api = ApiService();

  /// Get all products
  Future<List<Product>> getAllProducts() async {
    final response = await _api.get('/api/products');
    return (response as List).map((json) => Product.fromJson(json)).toList();
  }

  /// Get product by ID
  Future<Product> getProductById(int id) async {
    final response = await _api.get('/api/products/$id');
    return Product.fromJson(response);
  }

  /// Get products by category
  Future<List<Product>> getProductsByCategory(String category) async {
    final response = await _api.get('/api/products/category/$category');
    return (response as List).map((json) => Product.fromJson(json)).toList();
  }

  /// Get featured products
  Future<List<Product>> getFeaturedProducts() async {
    final response = await _api.get('/api/products/featured');
    return (response as List).map((json) => Product.fromJson(json)).toList();
  }

  /// Create product (admin only)
  Future<Product> createProduct(Product product) async {
    final response = await _api.post('/api/products', body: product.toJson());
    return Product.fromJson(response);
  }

  /// Update product (admin only)
  Future<Product> updateProduct(int id, Product product) async {
    final response = await _api.put('/api/products/$id', body: product.toJson());
    return Product.fromJson(response);
  }

  /// Delete product (admin only)
  Future<void> deleteProduct(int id) async {
    await _api.delete('/api/products/$id');
  }
}
