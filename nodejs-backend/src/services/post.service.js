/**
 * Post Service
 * Handles post/news-related business logic
 */

const { Post } = require('../models');

class PostService {
  /**
   * Get all posts
   */
  async getAllPosts() {
    return await Post.findAll({
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get post by ID
   */
  async getPostById(id) {
    return await Post.findByPk(id);
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(category) {
    return await Post.findAll({
      where: { category },
      order: [['date', 'DESC']]
    });
  }

  /**
   * Get published posts
   */
  async getPublishedPosts() {
    return await Post.findAll({
      where: { is_published: true },
      order: [['date', 'DESC']]
    });
  }

  /**
   * Create new post
   */
  async createPost(postData) {
    return await Post.create({
      title: postData.title,
      excerpt: postData.excerpt,
      description: postData.description,
      category: postData.category,
      author: postData.author,
      date: postData.date || new Date(),
      is_published: postData.isPublished || false,
      view_count: postData.viewCount || 0
    });
  }

  /**
   * Update post
   */
  async updatePost(id, postData) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (postData.title !== undefined) post.title = postData.title;
    if (postData.excerpt !== undefined) post.excerpt = postData.excerpt;
    if (postData.description !== undefined) post.description = postData.description;
    if (postData.category !== undefined) post.category = postData.category;
    if (postData.author !== undefined) post.author = postData.author;
    if (postData.isPublished !== undefined) post.is_published = postData.isPublished;
    if (postData.viewCount !== undefined) post.view_count = postData.viewCount;

    await post.save();
    return post;
  }

  /**
   * Delete post
   */
  async deletePost(id) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new Error('Post not found');
    }

    await post.destroy();
    return true;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    const post = await Post.findByPk(id);
    if (post) {
      post.view_count = (post.view_count || 0) + 1;
      await post.save();
    }
  }
}

module.exports = new PostService();
