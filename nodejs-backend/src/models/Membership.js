/**
 * Membership Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Membership = sequelize.define('Membership', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duration_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      field: 'duration_days'
    },
    benefits: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('benefits');
        if (!rawValue) return null;
        // Check if it's JSON or comma-separated
        try {
          return JSON.parse(rawValue);
        } catch {
          return rawValue.split(',').map(b => b.trim());
        }
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('benefits', value.join(','));
        } else {
          this.setDataValue('benefits', value);
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
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
    tableName: 'memberships',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Membership;
};
