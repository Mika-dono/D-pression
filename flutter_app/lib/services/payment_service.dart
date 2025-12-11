import '../models/payment.dart';
import 'api_service.dart';

/// Payment service for handling payments (FAKE/TEST API)
class PaymentService {
  final ApiService _api = ApiService();

  /// Get all payments (admin only)
  Future<List<Payment>> getAllPayments() async {
    final response = await _api.get('/api/payments');
    return (response as List).map((json) => Payment.fromJson(json)).toList();
  }

  /// Get payment by ID
  Future<Payment> getPaymentById(int id) async {
    final response = await _api.get('/api/payments/$id');
    return Payment.fromJson(response);
  }

  /// Get payment by transaction ID
  Future<Payment> getPaymentByTransactionId(String transactionId) async {
    final response = await _api.get('/api/payments/transaction/$transactionId');
    return Payment.fromJson(response);
  }

  /// Get payments by user email
  Future<List<Payment>> getPaymentsByEmail(String email) async {
    final response = await _api.get('/api/payments/user/$email');
    return (response as List).map((json) => Payment.fromJson(json)).toList();
  }

  /// Get completed payments (admin only)
  Future<List<Payment>> getCompletedPayments() async {
    final response = await _api.get('/api/payments/completed');
    return (response as List).map((json) => Payment.fromJson(json)).toList();
  }

  /// Get payment statistics (admin only)
  Future<Map<String, dynamic>> getPaymentStats() async {
    final response = await _api.get('/api/payments/stats');
    return response as Map<String, dynamic>;
  }

  /// Process credit card payment (FAKE API)
  Future<Map<String, dynamic>> processCardPayment(CardPaymentRequest request) async {
    final response = await _api.post('/api/payments/card', body: request.toJson());
    return response as Map<String, dynamic>;
  }

  /// Create PayPal payment intent
  Future<Map<String, dynamic>> createPayPalPayment({
    required double amount,
    required String email,
    String? description,
  }) async {
    final response = await _api.post('/api/payments/paypal/create', body: {
      'amount': amount,
      'email': email,
      if (description != null) 'description': description,
    });
    return response as Map<String, dynamic>;
  }

  /// Confirm PayPal payment
  Future<Map<String, dynamic>> confirmPayPalPayment({
    required String transactionId,
    required String paypalOrderId,
  }) async {
    final response = await _api.post('/api/payments/paypal/confirm', body: {
      'transactionId': transactionId,
      'paypalOrderId': paypalOrderId,
    });
    return response as Map<String, dynamic>;
  }

  /// Create Stripe payment intent
  Future<Map<String, dynamic>> createStripePayment({
    required double amount,
    required String email,
    String? description,
  }) async {
    final response = await _api.post('/api/payments/stripe/create', body: {
      'amount': amount,
      'email': email,
      if (description != null) 'description': description,
    });
    return response as Map<String, dynamic>;
  }

  /// Confirm Stripe payment
  Future<Map<String, dynamic>> confirmStripePayment({
    required String transactionId,
    required String paymentIntentId,
  }) async {
    final response = await _api.post('/api/payments/stripe/confirm', body: {
      'transactionId': transactionId,
      'paymentIntentId': paymentIntentId,
    });
    return response as Map<String, dynamic>;
  }

  /// Create Wise transfer
  Future<Map<String, dynamic>> createWiseTransfer({
    required double amount,
    required String email,
    String? description,
  }) async {
    final response = await _api.post('/api/payments/wise/create', body: {
      'amount': amount,
      'email': email,
      if (description != null) 'description': description,
    });
    return response as Map<String, dynamic>;
  }

  /// Confirm Wise transfer
  Future<Map<String, dynamic>> confirmWiseTransfer({
    required String transactionId,
    required String transferId,
  }) async {
    final response = await _api.post('/api/payments/wise/confirm', body: {
      'transactionId': transactionId,
      'transferId': transferId,
    });
    return response as Map<String, dynamic>;
  }
}
