/**
 * TeamMember Model
 * Converted from Spring Boot JPA Entity
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TeamMember = sequelize.define('TeamMember', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(100)
    },
    champion_pool: {
      type: DataTypes.TEXT,
      field: 'champion_pool'
    },
    stats: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('stats');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('stats', value ? JSON.stringify(value) : null);
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'team_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['team_id'],
        name: 'idx_team_members_team_id'
      }
    ]
  });

  return TeamMember;
};
