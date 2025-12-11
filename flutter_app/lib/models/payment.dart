/// Payment model for KJX Esports app
enum PaymentMethod { CARD, PAYPAL, STRIPE, WISE }

enum PaymentStatus { PENDING, COMPLETED, FAILED, REFUNDED }

class Payment {
  final int? id;
  final String transactionId;
  final String userEmail;
  final double amount;
  final String currency;
  final PaymentMethod paymentMethod;
  final PaymentStatus status;
  final String? description;
  final String? cardLastFour;
  final String? cardBrand;
  final String? externalId;
  final String? errorMessage;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Payment({
    this.id,
    required this.transactionId,
    required this.userEmail,
    required this.amount,
    this.currency = 'EUR',
    required this.paymentMethod,
    this.status = PaymentStatus.PENDING,
    this.description,
    this.cardLastFour,
    this.cardBrand,
    this.externalId,
    this.errorMessage,
    this.createdAt,
    this.updatedAt,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'],
      transactionId: json['transaction_id'] ?? json['transactionId'] ?? '',
      userEmail: json['user_email'] ?? json['userEmail'] ?? '',
      amount: (json['amount'] is String)
          ? double.parse(json['amount'])
          : (json['amount'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'EUR',
      paymentMethod: _parsePaymentMethod(json['payment_method'] ?? json['paymentMethod']),
      status: _parsePaymentStatus(json['status']),
      description: json['description'],
      cardLastFour: json['card_last_four'] ?? json['cardLastFour'],
      cardBrand: json['card_brand'] ?? json['cardBrand'],
      externalId: json['external_id'] ?? json['externalId'],
      errorMessage: json['error_message'] ?? json['errorMessage'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  static PaymentMethod _parsePaymentMethod(String? method) {
    switch (method?.toUpperCase()) {
      case 'CARD':
        return PaymentMethod.CARD;
      case 'PAYPAL':
        return PaymentMethod.PAYPAL;
      case 'STRIPE':
        return PaymentMethod.STRIPE;
      case 'WISE':
        return PaymentMethod.WISE;
      default:
        return PaymentMethod.CARD;
    }
  }

  static PaymentStatus _parsePaymentStatus(String? status) {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return PaymentStatus.PENDING;
      case 'COMPLETED':
        return PaymentStatus.COMPLETED;
      case 'FAILED':
        return PaymentStatus.FAILED;
      case 'REFUNDED':
        return PaymentStatus.REFUNDED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'transaction_id': transactionId,
      'user_email': userEmail,
      'amount': amount,
      'currency': currency,
      'payment_method': paymentMethod.name,
      'status': status.name,
      if (description != null) 'description': description,
      if (cardLastFour != null) 'card_last_four': cardLastFour,
      if (cardBrand != null) 'card_brand': cardBrand,
      if (externalId != null) 'external_id': externalId,
      if (errorMessage != null) 'error_message': errorMessage,
    };
  }

  bool get isCompleted => status == PaymentStatus.COMPLETED;
  bool get isFailed => status == PaymentStatus.FAILED;
  bool get isPending => status == PaymentStatus.PENDING;

  @override
  String toString() =>
      'Payment(id: $id, transactionId: $transactionId, amount: $amount $currency, status: ${status.name})';
}

/// Card payment request model
class CardPaymentRequest {
  final String cardNumber;
  final String cardHolder;
  final String expiryMonth;
  final String expiryYear;
  final String cvv;
  final double amount;
  final String email;
  final String? description;

  CardPaymentRequest({
    required this.cardNumber,
    required this.cardHolder,
    required this.expiryMonth,
    required this.expiryYear,
    required this.cvv,
    required this.amount,
    required this.email,
    this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'cardNumber': cardNumber.replaceAll(' ', ''),
      'cardHolder': cardHolder,
      'expiryMonth': expiryMonth,
      'expiryYear': expiryYear,
      'cvv': cvv,
      'amount': amount,
      'email': email,
      if (description != null) 'description': description,
    };
  }
}
