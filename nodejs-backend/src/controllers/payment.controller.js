/**
 * Payment Controller
 * Handles payment endpoints with fake/test payment simulation
 * Converted from Spring Boot PaymentController
 */

const paymentService = require('../services/payment.service');

class PaymentController {
  /**
   * GET /api/payments
   * Get all payments
   */
  async getAllPayments(req, res, next) {
    try {
      const payments = await paymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/:id
   * Get payment by ID
   */
  async getPaymentById(req, res, next) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/transaction/:transactionId
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(req, res, next) {
    try {
      const payment = await paymentService.getPaymentByTransactionId(req.params.transactionId);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/user/:email
   * Get payments by user email
   */
  async getPaymentsByUser(req, res, next) {
    try {
      const payments = await paymentService.getPaymentsByUserEmail(req.params.email);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/completed
   * Get completed payments
   */
  async getCompletedPayments(req, res, next) {
    try {
      const payments = await paymentService.getCompletedPayments();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payments/stats
   * Get payment statistics
   */
  async getPaymentStats(req, res, next) {
    try {
      const stats = {
        totalRevenue: await paymentService.getTotalRevenue(),
        cardPayments: await paymentService.getPaymentCountByMethod('CARD'),
        paypalPayments: await paymentService.getPaymentCountByMethod('PAYPAL'),
        stripePayments: await paymentService.getPaymentCountByMethod('STRIPE'),
        wisePayments: await paymentService.getPaymentCountByMethod('WISE')
      };
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payments/card
   * Process credit card payment (FAKE/TEST API)
   */
  async processCardPayment(req, res, next) {
    try {
      console.log('Processing card payment request');
      const payment = await paymentService.processCardPayment(req.body);
      
      res.json({
        success: payment.status === 'COMPLETED',
        transactionId: payment.transaction_id,
        status: payment.status,
        message: payment.status === 'COMPLETED' 
          ? 'Payment processed successfully' 
          : payment.error_message,
        payment
      });
    } catch (error) {
      console.error('Card payment error:', error.message);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/payments/paypal/create
   * Create PayPal payment intent
   */
  async createPayPalPayment(req, res, next) {
    try {
      req.body.paymentMethod = 'PAYPAL';
      const payment = await paymentService.createExternalPayment(req.body);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        paymentId: payment.id,
        approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${payment.transaction_id}`
      });
    } catch (error) {
      console.error('PayPal create error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/payments/paypal/confirm
   * Confirm PayPal payment
   */
  async confirmPayPalPayment(req, res, next) {
    try {
      const { transactionId, paypalOrderId } = req.body;
      const payment = await paymentService.confirmExternalPayment(transactionId, paypalOrderId, true);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        status: payment.status,
        message: 'PayPal payment confirmed successfully'
      });
    } catch (error) {
      console.error('PayPal confirm error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/payments/stripe/create
   * Create Stripe payment intent
   */
  async createStripePayment(req, res, next) {
    try {
      req.body.paymentMethod = 'STRIPE';
      const payment = await paymentService.createExternalPayment(req.body);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        paymentId: payment.id,
        clientSecret: `pi_test_${payment.transaction_id}_secret_xxx`
      });
    } catch (error) {
      console.error('Stripe create error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/payments/stripe/confirm
   * Confirm Stripe payment
   */
  async confirmStripePayment(req, res, next) {
    try {
      const { transactionId, paymentIntentId } = req.body;
      const payment = await paymentService.confirmExternalPayment(transactionId, paymentIntentId, true);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        status: payment.status,
        message: 'Stripe payment confirmed successfully'
      });
    } catch (error) {
      console.error('Stripe confirm error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/payments/wise/create
   * Create Wise transfer
   */
  async createWiseTransfer(req, res, next) {
    try {
      req.body.paymentMethod = 'WISE';
      const payment = await paymentService.createExternalPayment(req.body);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        paymentId: payment.id,
        transferUrl: `https://wise.com/pay/${payment.transaction_id}`
      });
    } catch (error) {
      console.error('Wise create error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /api/payments/wise/confirm
   * Confirm Wise transfer
   */
  async confirmWiseTransfer(req, res, next) {
    try {
      const { transactionId, transferId } = req.body;
      const payment = await paymentService.confirmExternalPayment(transactionId, transferId, true);
      
      res.json({
        success: true,
        transactionId: payment.transaction_id,
        status: payment.status,
        message: 'Wise transfer confirmed successfully'
      });
    } catch (error) {
      console.error('Wise confirm error:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * PATCH /api/payments/:id/status
   * Update payment status
   */
  async updatePaymentStatus(req, res, next) {
    try {
      const { status } = req.body;
      const payment = await paymentService.updatePaymentStatus(req.params.id, status);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
