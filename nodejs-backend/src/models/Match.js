/**
 * Match Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    tournament: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    format: {
      type: DataTypes.STRING(50),
      defaultValue: 'Bo1',
      validate: {
        isIn: [['Bo1', 'Bo3', 'Bo5']]
      }
    },
    team1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    team2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING(10)
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'SCHEDULED',
      validate: {
        isIn: [['SCHEDULED', 'LIVE', 'COMPLETED']]
      }
    },
    score: {
      type: DataTypes.STRING(20)
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
    tableName: 'matches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['date'],
        name: 'idx_matches_date'
      },
      {
        fields: ['tournament'],
        name: 'idx_matches_tournament'
      }
    ]
  });

  return Match;
};
