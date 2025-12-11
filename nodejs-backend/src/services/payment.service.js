/**
 * Payment Service
 * Handles payment-related business logic with fake/test payment simulation
 */

const { Payment, sequelize } = require('../models');
const { Op } = require('sequelize');

class PaymentService {
  /**
   * Get all payments
   */
  async getAllPayments() {
    return await Payment.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id) {
    return await Payment.findByPk(id);
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(transactionId) {
    return await Payment.findOne({
      where: { transaction_id: transactionId }
    });
  }

  /**
   * Get payments by user email
   */
  async getPaymentsByUserEmail(email) {
    return await Payment.findAll({
      where: { user_email: email },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get completed payments
   */
  async getCompletedPayments() {
    return await Payment.findAll({
      where: { status: 'COMPLETED' },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Process card payment (FAKE/TEST API)
   */
  async processCardPayment(paymentData) {
    console.log('Processing card payment...');

    const cardNumber = paymentData.cardNumber || '';
    const expiryDate = paymentData.expiryDate || '';
    const cvv = paymentData.cvv || '';
    const cardHolder = paymentData.cardHolder || '';

    // Validate card
    if (!this.validateCard(cardNumber, expiryDate, cvv)) {
      throw new Error('Invalid card details');
    }

    // Create payment record
    let payment = await Payment.create({
      user_email: paymentData.email,
      user_name: cardHolder,
      amount: paymentData.amount,
      currency: paymentData.currency || 'EUR',
      payment_method: 'CARD',
      product_type: paymentData.productType,
      product_name: paymentData.productName,
      card_last_four: cardNumber.replace(/[\s-]/g, '').slice(-4),
      card_brand: this.detectCardBrand(cardNumber),
      billing_address: paymentData.billingAddress,
      billing_city: paymentData.billingCity,
      billing_postal_code: paymentData.billingPostalCode,
      billing_country: paymentData.billingCountry,
      status: 'PENDING'
    });

    // Simulate payment processing
    const paymentSuccess = this.simulateCardPayment(cardNumber);

    if (paymentSuccess) {
      payment.status = 'COMPLETED';
      payment.completed_at = new Date();
      payment.external_transaction_id = `FAKE-${Date.now()}`;
      payment.provider_response = JSON.stringify({ success: true, message: 'Payment processed successfully' });
      console.log(`Card payment COMPLETED: ${payment.transaction_id}`);
    } else {
      payment.status = 'FAILED';
      payment.error_message = 'Payment declined - insufficient funds or invalid card';
      console.log(`Card payment FAILED: ${payment.transaction_id}`);
    }

    await payment.save();
    return payment;
  }

  /**
   * Create external payment (PayPal, Stripe, Wise)
   */
  async createExternalPayment(paymentData) {
    const method = paymentData.paymentMethod;
    console.log(`Creating ${method} payment...`);

    return await Payment.create({
      user_email: paymentData.email,
      user_name: paymentData.userName,
      amount: paymentData.amount,
      currency: paymentData.currency || 'EUR',
      payment_method: method.toUpperCase(),
      product_type: paymentData.productType,
      product_name: paymentData.productName,
      status: 'PENDING'
    });
  }

  /**
   * Confirm external payment
   */
  async confirmExternalPayment(transactionId, externalId, success) {
    const payment = await this.getPaymentByTransactionId(transactionId);
    if (!payment) {
      throw new Error('Payment not found: ' + transactionId);
    }

    payment.external_transaction_id = externalId;

    if (success) {
      payment.status = 'COMPLETED';
      payment.completed_at = new Date();
      console.log(`External payment COMPLETED: ${transactionId}`);
    } else {
      payment.status = 'FAILED';
      payment.error_message = 'External payment failed';
      console.log(`External payment FAILED: ${transactionId}`);
    }

    await payment.save();
    return payment;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id, status) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('Payment not found: ' + id);
    }

    payment.status = status;
    if (status === 'COMPLETED') {
      payment.completed_at = new Date();
    }

    await payment.save();
    return payment;
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue() {
    const result = await Payment.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: { status: 'COMPLETED' },
      raw: true
    });
    return result?.total || 0;
  }

  /**
   * Get payment count by method
   */
  async getPaymentCountByMethod(method) {
    return await Payment.count({
      where: { payment_method: method }
    });
  }

  // ============== VALIDATION HELPERS ==============

  validateCard(cardNumber, expiryDate, cvv) {
    // Remove spaces and dashes
    cardNumber = cardNumber.replace(/[\s-]/g, '');

    // Check card number length (13-19 digits)
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return false;
    }

    // Check if all digits
    if (!/^\d+$/.test(cardNumber)) {
      return false;
    }

    // Luhn algorithm check
    if (!this.luhnCheck(cardNumber)) {
      return false;
    }

    // Validate expiry (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    // Check if not expired
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month), 0);
    if (expiry < new Date()) {
      return false;
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      return false;
    }

    return true;
  }

  luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber[i], 10);
      
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    return (sum % 10 === 0);
  }

  detectCardBrand(cardNumber) {
    cardNumber = cardNumber.replace(/[\s-]/g, '');
    
    if (cardNumber.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cardNumber)) return 'MASTERCARD';
    if (/^3[47]/.test(cardNumber)) return 'AMEX';
    if (/^6(?:011|5)/.test(cardNumber)) return 'DISCOVER';
    
    return 'UNKNOWN';
  }

  simulateCardPayment(cardNumber) {
    // Cards ending with 0000 fail (for testing)
    if (cardNumber.endsWith('0000')) {
      return false;
    }
    // 95% success rate for simulation
    return Math.random() > 0.05;
  }
}

module.exports = new PaymentService();
