-- V1__Initial_Schema.sql for Ultimate_db
-- KJX Esports Team Management Database Schema

-- Teams table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'teams')
CREATE TABLE teams (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    game NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    logo_url NVARCHAR(500),
    win_rate FLOAT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_teams_game ON teams(game);
CREATE INDEX idx_teams_name ON teams(name);

-- Team Members table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'team_members')
CREATE TABLE team_members (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    team_id BIGINT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    position NVARCHAR(100) NOT NULL,
    role NVARCHAR(100),
    champion_pool NVARCHAR(MAX),
    stats NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);

-- Events table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'events')
CREATE TABLE events (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    event_type NVARCHAR(100) NOT NULL,
    date DATETIME2 NOT NULL,
    time NVARCHAR(10),
    location NVARCHAR(255),
    team_id BIGINT,
    opponent NVARCHAR(255),
    status NVARCHAR(50) DEFAULT 'SCHEDULED',
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_team_id ON events(team_id);

-- Products table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
CREATE TABLE products (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url NVARCHAR(500),
    is_featured BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Memberships table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'memberships')
CREATE TABLE memberships (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT DEFAULT 30,
    benefits NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Posts table (News/Blog)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'posts')
CREATE TABLE posts (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    excerpt NVARCHAR(MAX),
    description NVARCHAR(MAX),
    category NVARCHAR(100),
    author NVARCHAR(255),
    date DATETIME2 NOT NULL,
    is_published BIT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_posts_date ON posts(date);
CREATE INDEX idx_posts_published ON posts(is_published);
CREATE INDEX idx_posts_category ON posts(category);

-- Scrims (Scrim Requests) table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'scrims')
CREATE TABLE scrims (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    team_id BIGINT NOT NULL,
    opponent NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    date DATETIME2 NOT NULL,
    status NVARCHAR(50) DEFAULT 'PENDING',
    game NVARCHAR(100),
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_scrims_status ON scrims(status);
CREATE INDEX idx_scrims_team_id ON scrims(team_id);
CREATE INDEX idx_scrims_date ON scrims(date);

-- Schedules table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'schedules')
CREATE TABLE schedules (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    team_id BIGINT,
    day_of_week NVARCHAR(10) NOT NULL,
    start_time NVARCHAR(10),
    end_time NVARCHAR(10),
    activity NVARCHAR(255),
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_schedules_team_id ON schedules(team_id);
CREATE INDEX idx_schedules_day ON schedules(day_of_week);

-- Users table (for admin and members)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
CREATE TABLE users (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(255) NOT NULL UNIQUE,
    email NVARCHAR(255) UNIQUE,
    password_hash NVARCHAR(500),
    role NVARCHAR(50) DEFAULT 'USER',
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Audit Log table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_log')
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    action NVARCHAR(255) NOT NULL,
    entity_type NVARCHAR(100),
    entity_id BIGINT,
    user_id BIGINT,
    details NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
