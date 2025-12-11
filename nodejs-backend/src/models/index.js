/**
 * Sequelize Models Index
 * Auto-loads all models and sets up associations
 */

const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance based on dialect
let sequelize;

if (dbConfig.dialect === 'sqlite') {
  // SQLite configuration
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage || './database.sqlite',
    logging: dbConfig.logging,
    define: dbConfig.define
  });
} else {
  // SQL Server / Other databases
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      dialectOptions: dbConfig.dialectOptions,
      logging: dbConfig.logging,
      pool: dbConfig.pool,
      define: dbConfig.define
    }
  );
}

// Import Models
const User = require('./User')(sequelize);
const Team = require('./Team')(sequelize);
const TeamMember = require('./TeamMember')(sequelize);
const Event = require('./Event')(sequelize);
const Match = require('./Match')(sequelize);
const Membership = require('./Membership')(sequelize);
const Payment = require('./Payment')(sequelize);
const Post = require('./Post')(sequelize);
const Product = require('./Product')(sequelize);
const Schedule = require('./Schedule')(sequelize);
const Scrim = require('./Scrim')(sequelize);

// Define Associations

// Team <-> TeamMember (One-to-Many)
Team.hasMany(TeamMember, {
  foreignKey: 'team_id',
  as: 'members',
  onDelete: 'CASCADE'
});
TeamMember.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team'
});

// Team <-> Event (One-to-Many)
Team.hasMany(Event, {
  foreignKey: 'team_id',
  as: 'events',
  onDelete: 'SET NULL'
});
Event.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team'
});

// Team <-> Scrim (One-to-Many)
Team.hasMany(Scrim, {
  foreignKey: 'team_id',
  as: 'scrims',
  onDelete: 'CASCADE'
});
Scrim.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team'
});

// Team <-> Schedule (One-to-Many)
Team.hasMany(Schedule, {
  foreignKey: 'team_id',
  as: 'schedules',
  onDelete: 'SET NULL'
});
Schedule.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team'
});

// Export models and sequelize instance
const db = {
  sequelize,
  Sequelize,
  User,
  Team,
  TeamMember,
  Event,
  Match,
  Membership,
  Payment,
  Post,
  Product,
  Schedule,
  Scrim
};

module.exports = db;
