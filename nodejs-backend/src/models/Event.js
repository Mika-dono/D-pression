/**
 * Event Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
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
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'event_type'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING(10)
    },
    location: {
      type: DataTypes.STRING(255)
    },
    team_id: {
      type: DataTypes.BIGINT,
      field: 'team_id',
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    opponent: {
      type: DataTypes.STRING(255)
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'SCHEDULED',
      validate: {
        isIn: [['SCHEDULED', 'COMPLETED', 'CANCELLED']]
      }
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
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['date'],
        name: 'idx_events_date'
      },
      {
        fields: ['event_type'],
        name: 'idx_events_type'
      },
      {
        fields: ['team_id'],
        name: 'idx_events_team_id'
      }
    ]
  });

  return Event;
};
