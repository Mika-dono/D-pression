/**
 * Post Controller
 * Handles post/news management endpoints
 * Converted from Spring Boot PostController
 */

const postService = require('../services/post.service');

class PostController {
  /**
   * GET /api/posts
   * Get all posts
   */
  async getAllPosts(req, res, next) {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/:id
   * Get post by ID (increments view count)
   */
  async getPostById(req, res, next) {
    try {
      await postService.incrementViewCount(req.params.id);
      const post = await postService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/category/:category
   * Get posts by category
   */
  async getPostsByCategory(req, res, next) {
    try {
      const posts = await postService.getPostsByCategory(req.params.category);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/published
   * Get published posts
   */
  async getPublishedPosts(req, res, next) {
    try {
      const posts = await postService.getPublishedPosts();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/posts
   * Create new post
   */
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.body);
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/posts/:id
   * Update post
   */
  async updatePost(req, res, next) {
    try {
      const post = await postService.updatePost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete post
   */
  async deletePost(req, res, next) {
    try {
      await postService.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new PostController();
