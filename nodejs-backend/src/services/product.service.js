/**
 * Product Service
 * Handles product-related business logic
 */

const { Product } = require('../models');

class ProductService {
  /**
   * Get all products
   */
  async getAllProducts() {
    return await Product.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    return await Product.findByPk(id);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category) {
    return await Product.findAll({
      where: { category },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    return await Product.findAll({
      where: { featured: true },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Create new product
   */
  async createProduct(productData) {
    return await Product.create({
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      stock: productData.stock || 0,
      image_url: productData.imageUrl,
      featured: productData.featured || false
    });
  }

  /**
   * Update product
   */
  async updateProduct(id, productData) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    if (productData.name !== undefined) product.name = productData.name;
    if (productData.description !== undefined) product.description = productData.description;
    if (productData.category !== undefined) product.category = productData.category;
    if (productData.price !== undefined) product.price = productData.price;
    if (productData.stock !== undefined) product.stock = productData.stock;
    if (productData.imageUrl !== undefined) product.image_url = productData.imageUrl;
    if (productData.featured !== undefined) product.featured = productData.featured;

    await product.save();
    return product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
    return true;
  }

  /**
   * Update product stock
   */
  async updateStock(id, quantity) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock = Math.max(0, product.stock + quantity);
    await product.save();
    return product;
  }
}

module.exports = new ProductService();
