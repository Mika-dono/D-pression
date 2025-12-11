/**
 * Product Routes
 * Converted from Spring Boot ProductController
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', productController.getFeaturedProducts);

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProductById);

// POST /api/products - Create new product (admin only)
router.post('/', authenticateToken, requireAdmin, productController.createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
