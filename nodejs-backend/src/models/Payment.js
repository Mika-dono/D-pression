/**
 * Payment Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      unique: true,
      field: 'transaction_id'
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'user_email',
      validate: {
        isEmail: true
      }
    },
    user_name: {
      type: DataTypes.STRING(255),
      field: 'user_name'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'EUR'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_method',
      validate: {
        isIn: [['CARD', 'PAYPAL', 'STRIPE', 'WISE']]
      }
    },
    product_type: {
      type: DataTypes.STRING(100),
      field: 'product_type'
    },
    product_id: {
      type: DataTypes.BIGINT,
      field: 'product_id'
    },
    product_name: {
      type: DataTypes.STRING(255),
      field: 'product_name'
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'PENDING',
      validate: {
        isIn: [['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']]
      }
    },
    card_last_four: {
      type: DataTypes.STRING(4),
      field: 'card_last_four'
    },
    card_brand: {
      type: DataTypes.STRING(50),
      field: 'card_brand'
    },
    external_transaction_id: {
      type: DataTypes.STRING(255),
      field: 'external_transaction_id'
    },
    provider_response: {
      type: DataTypes.TEXT,
      field: 'provider_response'
    },
    error_message: {
      type: DataTypes.TEXT,
      field: 'error_message'
    },
    billing_address: {
      type: DataTypes.TEXT,
      field: 'billing_address'
    },
    billing_city: {
      type: DataTypes.STRING(100),
      field: 'billing_city'
    },
    billing_postal_code: {
      type: DataTypes.STRING(20),
      field: 'billing_postal_code'
    },
    billing_country: {
      type: DataTypes.STRING(100),
      field: 'billing_country'
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
    },
    completed_at: {
      type: DataTypes.DATE,
      field: 'completed_at'
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status'],
        name: 'idx_payments_status'
      },
      {
        fields: ['payment_method'],
        name: 'idx_payments_method'
      },
      {
        fields: ['user_email'],
        name: 'idx_payments_user_email'
      },
      {
        unique: true,
        fields: ['transaction_id'],
        name: 'idx_payments_transaction_id'
      }
    ],
    hooks: {
      beforeCreate: (payment) => {
        if (!payment.transaction_id) {
          payment.transaction_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
      }
    }
  });

  return Payment;
};
