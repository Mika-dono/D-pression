/**
 * Post Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    excerpt: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING(100)
    },
    author: {
      type: DataTypes.STRING(255)
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published'
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['date'],
        name: 'idx_posts_date'
      },
      {
        fields: ['is_published'],
        name: 'idx_posts_published'
      },
      {
        fields: ['category'],
        name: 'idx_posts_category'
      }
    ]
  });

  return Post;
};
