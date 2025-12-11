/**
 * Scrim Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Scrim = sequelize.define('Scrim', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'team_id',
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    opponent: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'PENDING',
      validate: {
        isIn: [['PENDING', 'APPROVED', 'REJECTED']]
      }
    },
    game: {
      type: DataTypes.STRING(100)
    },
    notes: {
      type: DataTypes.TEXT
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
    tableName: 'scrims',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status'],
        name: 'idx_scrims_status'
      },
      {
        fields: ['team_id'],
        name: 'idx_scrims_team_id'
      },
      {
        fields: ['date'],
        name: 'idx_scrims_date'
      }
    ]
  });

  return Scrim;
};
