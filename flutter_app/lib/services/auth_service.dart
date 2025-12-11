import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

/// Authentication service for handling login, register, and token management
class AuthService {
  final ApiService _api = ApiService();
  
  User? _currentUser;
  
  // Singleton pattern
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  /// Get current user
  User? get currentUser => _currentUser;

  /// Check if user is logged in
  bool get isLoggedIn => _api.isAuthenticated && _currentUser != null;

  /// Check if current user is admin
  bool get isAdmin => _currentUser?.role == 'ADMIN';

  /// Admin login
  Future<Map<String, dynamic>> adminLogin(String username, String password) async {
    try {
      final response = await _api.post('/auth/login', body: {
        'username': username,
        'password': password,
      });

      if (response['success'] == true) {
        _api.setToken(response['token']);
        _currentUser = User.fromJson(response['user']);
        await _saveToken(response['token']);
        return {
          'success': true,
          'user': _currentUser,
          'message': response['message'],
        };
      }

      return {
        'success': false,
        'message': response['message'] ?? 'Login failed',
      };
    } on ApiException catch (e) {
      return {
        'success': false,
        'message': e.message,
      };
    }
  }

  /// User login
  Future<Map<String, dynamic>> userLogin(String email, String password) async {
    try {
      final response = await _api.post('/auth/user/login', body: {
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        _api.setToken(response['token']);
        _currentUser = User.fromJson(response['user']);
        await _saveToken(response['token']);
        return {
          'success': true,
          'user': _currentUser,
          'message': response['message'],
        };
      }

      return {
        'success': false,
        'message': response['message'] ?? 'Login failed',
      };
    } on ApiException catch (e) {
      return {
        'success': false,
        'message': e.message,
      };
    }
  }

  /// Register new user
  Future<Map<String, dynamic>> register(String username, String email, String password) async {
    try {
      final response = await _api.post('/auth/register', body: {
        'username': username,
        'email': email,
        'password': password,
      });

      if (response['success'] == true) {
        return {
          'success': true,
          'message': response['message'] ?? 'Registration successful',
        };
      }

      return {
        'success': false,
        'message': response['message'] ?? 'Registration failed',
      };
    } on ApiException catch (e) {
      return {
        'success': false,
        'message': e.message,
      };
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {
      // Ignore logout API errors
    } finally {
      _api.clearToken();
      _currentUser = null;
      await _clearToken();
    }
  }

  /// Try to restore session from saved token
  Future<bool> tryAutoLogin() async {
    final token = await _getSavedToken();
    if (token == null) return false;

    _api.setToken(token);
    
    try {
      // Try to get user info to validate token
      // You might need to add a /auth/me endpoint
      return true;
    } catch (_) {
      await _clearToken();
      _api.clearToken();
      return false;
    }
  }

  /// Save token to local storage
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  /// Get saved token
  Future<String?> _getSavedToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  /// Clear saved token
  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}
