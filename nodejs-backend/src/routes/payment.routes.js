/**
 * Payment Routes
 * Converted from Spring Boot PaymentController
 * FAKE/TEST payment API for development and testing
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/payments - Get all payments (admin only)
router.get('/', authenticateToken, requireAdmin, paymentController.getAllPayments);

// GET /api/payments/stats - Get payment statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, paymentController.getPaymentStats);

// GET /api/payments/completed - Get completed payments (admin only)
router.get('/completed', authenticateToken, requireAdmin, paymentController.getCompletedPayments);

// GET /api/payments/transaction/:transactionId - Get payment by transaction ID
router.get('/transaction/:transactionId', paymentController.getPaymentByTransactionId);

// GET /api/payments/user/:email - Get payments by user email
router.get('/user/:email', authenticateToken, paymentController.getPaymentsByUser);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', authenticateToken, paymentController.getPaymentById);

// POST /api/payments/card - Process credit card payment (FAKE API)
router.post('/card', paymentController.processCardPayment);

// POST /api/payments/paypal/create - Create PayPal payment intent
router.post('/paypal/create', paymentController.createPayPalPayment);

// POST /api/payments/paypal/confirm - Confirm PayPal payment
router.post('/paypal/confirm', paymentController.confirmPayPalPayment);

// POST /api/payments/stripe/create - Create Stripe payment intent
router.post('/stripe/create', paymentController.createStripePayment);

// POST /api/payments/stripe/confirm - Confirm Stripe payment
router.post('/stripe/confirm', paymentController.confirmStripePayment);

// POST /api/payments/wise/create - Create Wise transfer
router.post('/wise/create', paymentController.createWiseTransfer);

// POST /api/payments/wise/confirm - Confirm Wise transfer
router.post('/wise/confirm', paymentController.confirmWiseTransfer);

// PATCH /api/payments/:id/status - Update payment status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, paymentController.updatePaymentStatus);

module.exports = router;
