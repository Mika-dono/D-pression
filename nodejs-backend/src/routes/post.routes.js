/**
 * Post Routes
 * Converted from Spring Boot PostController
 */

const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// GET /api/posts - Get all posts
router.get('/', postController.getAllPosts);

// GET /api/posts/published - Get published posts
router.get('/published', postController.getPublishedPosts);

// GET /api/posts/category/:category - Get posts by category
router.get('/category/:category', postController.getPostsByCategory);

// GET /api/posts/:id - Get post by ID
router.get('/:id', postController.getPostById);

// POST /api/posts - Create new post (admin only)
router.post('/', authenticateToken, requireAdmin, postController.createPost);

// PUT /api/posts/:id - Update post (admin only)
router.put('/:id', authenticateToken, requireAdmin, postController.updatePost);

// DELETE /api/posts/:id - Delete post (admin only)
router.delete('/:id', authenticateToken, requireAdmin, postController.deletePost);

module.exports = router;
