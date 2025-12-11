/**
 * Product Controller
 * Handles product management endpoints
 * Converted from Spring Boot ProductController
 */

const productService = require('../services/product.service');

class ProductController {
  /**
   * GET /api/products
   * Get all products
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   * Get product by ID
   */
  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/category/:category
   * Get products by category
   */
  async getProductsByCategory(req, res, next) {
    try {
      const products = await productService.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/featured
   * Get featured products
   */
  async getFeaturedProducts(req, res, next) {
    try {
      const products = await productService.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products
   * Create new product
   */
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   * Update product
   */
  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   * Delete product
   */
  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new ProductController();
