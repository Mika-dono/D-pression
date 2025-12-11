/**
 * Schedule Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.BIGINT,
      field: 'team_id',
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    day_of_week: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'day_of_week'
    },
    start_time: {
      type: DataTypes.STRING(10),
      field: 'start_time'
    },
    end_time: {
      type: DataTypes.STRING(10),
      field: 'end_time'
    },
    activity: {
      type: DataTypes.STRING(255)
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
    tableName: 'schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['team_id'],
        name: 'idx_schedules_team_id'
      },
      {
        fields: ['day_of_week'],
        name: 'idx_schedules_day'
      }
    ]
  });

  return Schedule;
};
