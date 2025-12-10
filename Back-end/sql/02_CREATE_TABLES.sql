-- ============================================
-- Script de création des tables
-- À exécuter après 01_CREATE_DATABASE.sql
-- ============================================

USE dpression_db;
GO

-- ==========================================
-- TABLE: teams (Équipes)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[teams]') AND type in (N'U'))
BEGIN
    CREATE TABLE teams (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        game NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        logo_url NVARCHAR(500),
        banner_url NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Table teams créée';
END
GO

-- ==========================================
-- TABLE: players (Joueurs)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[players]') AND type in (N'U'))
BEGIN
    CREATE TABLE players (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL,
        real_name NVARCHAR(255),
        role NVARCHAR(100),
        team_id BIGINT,
        profile_image NVARCHAR(500),
        nationality NVARCHAR(100),
        twitter_url NVARCHAR(500),
        twitch_url NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_players_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_players_team_id ON players(team_id);
    PRINT 'Table players créée';
END
GO

-- ==========================================
-- TABLE: events (Événements)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[events]') AND type in (N'U'))
BEGIN
    CREATE TABLE events (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        event_type NVARCHAR(100) NOT NULL,
        date DATETIME2 NOT NULL,
        time NVARCHAR(10),
        location NVARCHAR(255),
        team_id BIGINT,
        opponent NVARCHAR(255),
        status NVARCHAR(50) DEFAULT 'SCHEDULED',
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_events_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_events_date ON events(date);
    CREATE INDEX idx_events_type ON events(event_type);
    CREATE INDEX idx_events_team_id ON events(team_id);
    PRINT 'Table events créée';
END
GO

-- ==========================================
-- TABLE: matches (Matchs)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[matches]') AND type in (N'U'))
BEGIN
    CREATE TABLE matches (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        tournament NVARCHAR(255) NOT NULL,
        format NVARCHAR(50) DEFAULT 'Bo3',
        team1 NVARCHAR(255) NOT NULL,
        team2 NVARCHAR(255) NOT NULL,
        date DATETIME2,
        time NVARCHAR(10),
        hidden BIT DEFAULT 0,
        status NVARCHAR(50) DEFAULT 'SCHEDULED',
        score NVARCHAR(50),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_matches_tournament ON matches(tournament);
    CREATE INDEX idx_matches_date ON matches(date);
    PRINT 'Table matches créée';
END
GO

-- ==========================================
-- TABLE: scrims (Entraînements)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[scrims]') AND type in (N'U'))
BEGIN
    CREATE TABLE scrims (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        team_id BIGINT NOT NULL,
        opponent NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        date DATETIME2 NOT NULL,
        status NVARCHAR(50) DEFAULT 'PENDING',
        game NVARCHAR(100),
        notes NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_scrims_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_scrims_status ON scrims(status);
    CREATE INDEX idx_scrims_team_id ON scrims(team_id);
    CREATE INDEX idx_scrims_date ON scrims(date);
    PRINT 'Table scrims créée';
END
GO

-- ==========================================
-- TABLE: schedules (Emplois du temps)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[schedules]') AND type in (N'U'))
BEGIN
    CREATE TABLE schedules (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        day_of_week NVARCHAR(20) NOT NULL,
        start_time NVARCHAR(10),
        end_time NVARCHAR(10),
        activity NVARCHAR(255),
        team_id BIGINT,
        notes NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_schedules_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_schedules_day ON schedules(day_of_week);
    CREATE INDEX idx_schedules_team_id ON schedules(team_id);
    PRINT 'Table schedules créée';
END
GO

-- ==========================================
-- TABLE: posts (Articles/News)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[posts]') AND type in (N'U'))
BEGIN
    CREATE TABLE posts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        content NVARCHAR(MAX),
        summary NVARCHAR(500),
        image_url NVARCHAR(500),
        category NVARCHAR(100),
        author NVARCHAR(255),
        published BIT DEFAULT 0,
        publish_date DATETIME2,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_posts_category ON posts(category);
    CREATE INDEX idx_posts_published ON posts(published);
    PRINT 'Table posts créée';
END
GO

-- ==========================================
-- TABLE: products (Boutique)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND type in (N'U'))
BEGIN
    CREATE TABLE products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        price DECIMAL(10,2) NOT NULL,
        image_url NVARCHAR(500),
        category NVARCHAR(100),
        stock INT DEFAULT 0,
        available BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_products_category ON products(category);
    CREATE INDEX idx_products_available ON products(available);
    PRINT 'Table products créée';
END
GO

-- ==========================================
-- TABLE: memberships (Adhésions)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[memberships]') AND type in (N'U'))
BEGIN
    CREATE TABLE memberships (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        phone NVARCHAR(20),
        membership_type NVARCHAR(50) DEFAULT 'STANDARD',
        status NVARCHAR(50) DEFAULT 'PENDING',
        start_date DATE,
        end_date DATE,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_memberships_email ON memberships(email);
    CREATE INDEX idx_memberships_status ON memberships(status);
    PRINT 'Table memberships créée';
END
GO

-- ==========================================
-- TABLE: users (Utilisateurs Admin)
-- ==========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) DEFAULT 'USER',
        active BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_email ON users(email);
    PRINT 'Table users créée';
END
GO

PRINT '========================================';
PRINT 'Toutes les tables ont été créées !';
PRINT '========================================';
GO
