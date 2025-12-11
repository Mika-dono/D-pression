'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'USER'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Teams table
    await queryInterface.createTable('Teams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      game: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      logo_url: {
        type: Sequelize.STRING(500)
      },
      description: {
        type: Sequelize.TEXT
      },
      achievements: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create TeamMembers table
    await queryInterface.createTable('TeamMembers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      gamertag: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      role: {
        type: Sequelize.STRING(50)
      },
      photo_url: {
        type: Sequelize.STRING(500)
      },
      nationality: {
        type: Sequelize.STRING(50)
      },
      join_date: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Events table
    await queryInterface.createTable('Events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(200)
      },
      prize_pool: {
        type: Sequelize.STRING(50)
      },
      image_url: {
        type: Sequelize.STRING(500)
      },
      team_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Matches table
    await queryInterface.createTable('Matches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tournament: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      opponent: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      result: {
        type: Sequelize.STRING(50)
      },
      score: {
        type: Sequelize.STRING(20)
      },
      match_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      stream_url: {
        type: Sequelize.STRING(500)
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Memberships table
    await queryInterface.createTable('Memberships', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      duration_months: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      benefits: {
        type: Sequelize.TEXT
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Payments table
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'EUR'
      },
      payment_method: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'PENDING'
      },
      description: {
        type: Sequelize.STRING(500)
      },
      card_last_four: {
        type: Sequelize.STRING(4)
      },
      card_brand: {
        type: Sequelize.STRING(20)
      },
      external_id: {
        type: Sequelize.STRING(100)
      },
      error_message: {
        type: Sequelize.STRING(500)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Posts table
    await queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING(500)
      },
      author: {
        type: Sequelize.STRING(100)
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      publish_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Products table
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING(500)
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Schedules table
    await queryInterface.createTable('Schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      day: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      activities: {
        type: Sequelize.TEXT
      },
      team_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create Scrims table
    await queryInterface.createTable('Scrims', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      opponent: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      game: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      scrim_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'SCHEDULED'
      },
      notes: {
        type: Sequelize.TEXT
      },
      team_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('Users', ['username']);
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Teams', ['game']);
    await queryInterface.addIndex('TeamMembers', ['team_id']);
    await queryInterface.addIndex('Events', ['team_id']);
    await queryInterface.addIndex('Events', ['date']);
    await queryInterface.addIndex('Matches', ['match_date']);
    await queryInterface.addIndex('Payments', ['transaction_id']);
    await queryInterface.addIndex('Payments', ['user_email']);
    await queryInterface.addIndex('Posts', ['category']);
    await queryInterface.addIndex('Products', ['category']);
    await queryInterface.addIndex('Schedules', ['team_id']);
    await queryInterface.addIndex('Scrims', ['team_id']);
    await queryInterface.addIndex('Scrims', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Scrims');
    await queryInterface.dropTable('Schedules');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('Posts');
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('Memberships');
    await queryInterface.dropTable('Matches');
    await queryInterface.dropTable('Events');
    await queryInterface.dropTable('TeamMembers');
    await queryInterface.dropTable('Teams');
    await queryInterface.dropTable('Users');
  }
};
