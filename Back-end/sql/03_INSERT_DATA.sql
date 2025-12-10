-- ============================================
-- Script d'insertion des données initiales
-- À exécuter après 02_CREATE_TABLES.sql
-- ============================================

USE dpression_db;
GO

-- ==========================================
-- ÉQUIPES
-- ==========================================
SET IDENTITY_INSERT teams ON;

IF NOT EXISTS (SELECT 1 FROM teams WHERE id = 1)
BEGIN
    INSERT INTO teams (id, name, game, description, logo_url)
    VALUES 
    (1, 'D-Pression LoL', 'League of Legends', 'Équipe principale League of Legends', '/assets/teams/lol-logo.png'),
    (2, 'D-Pression Valorant', 'Valorant', 'Équipe tactique Valorant', '/assets/teams/valorant-logo.png'),
    (3, 'D-Pression Rocket League', 'Rocket League', 'Équipe Rocket League', '/assets/teams/rl-logo.png');
    PRINT 'Équipes insérées';
END

SET IDENTITY_INSERT teams OFF;
GO

-- ==========================================
-- JOUEURS
-- ==========================================
SET IDENTITY_INSERT players ON;

IF NOT EXISTS (SELECT 1 FROM players WHERE id = 1)
BEGIN
    INSERT INTO players (id, username, real_name, role, team_id, nationality)
    VALUES 
    -- LoL Team
    (1, 'ShadowKing', 'Lucas Martin', 'Top', 1, 'France'),
    (2, 'JungleWrath', 'Thomas Dupont', 'Jungle', 1, 'France'),
    (3, 'MidLaner99', 'Alexandre Bernard', 'Mid', 1, 'Belgique'),
    (4, 'ADCarry', 'Maxime Leroy', 'ADC', 1, 'France'),
    (5, 'SupportGod', 'Nicolas Petit', 'Support', 1, 'Suisse'),
    -- Valorant Team
    (6, 'HeadshotKing', 'Antoine Moreau', 'Duelist', 2, 'France'),
    (7, 'SmokeMaster', 'Julien Robert', 'Controller', 2, 'France'),
    (8, 'FlashBang', 'Pierre Dubois', 'Initiator', 2, 'France'),
    (9, 'AnchorMan', 'Mathieu Simon', 'Sentinel', 2, 'Belgique'),
    (10, 'FlexPlayer', 'Hugo Laurent', 'Flex', 2, 'France');
    PRINT 'Joueurs insérés';
END

SET IDENTITY_INSERT players OFF;
GO

-- ==========================================
-- ÉVÉNEMENTS
-- ==========================================
SET IDENTITY_INSERT events ON;

IF NOT EXISTS (SELECT 1 FROM events WHERE id = 1)
BEGIN
    INSERT INTO events (id, title, description, event_type, date, time, location, team_id, status)
    VALUES 
    (1, 'LFL Winter Split 2025', 'Compétition majeure de League of Legends', 'match', DATEADD(day, 7, GETDATE()), '18:00', 'Online', 1, 'SCHEDULED'),
    (2, 'Valorant Champions Tour', 'Tournoi VCT Challengers', 'match', DATEADD(day, 14, GETDATE()), '20:00', 'Paris', 2, 'SCHEDULED'),
    (3, 'Fan Meet Paris', 'Rencontre avec les fans à Paris', 'fanmeet', DATEADD(day, 30, GETDATE()), '14:00', 'Paris Gaming School', NULL, 'SCHEDULED'),
    (4, 'Stream Marathon', 'Marathon caritatif 24h', 'content', DATEADD(day, 21, GETDATE()), '10:00', 'Twitch', NULL, 'SCHEDULED');
    PRINT 'Événements insérés';
END

SET IDENTITY_INSERT events OFF;
GO

-- ==========================================
-- MATCHS
-- ==========================================
SET IDENTITY_INSERT matches ON;

IF NOT EXISTS (SELECT 1 FROM matches WHERE id = 1)
BEGIN
    INSERT INTO matches (id, tournament, format, team1, team2, date, time, hidden, status)
    VALUES 
    (1, 'LFL Winter 2025', 'Bo3', 'D-Pression', 'Karmine Corp', DATEADD(day, 3, GETDATE()), '18:00', 0, 'SCHEDULED'),
    (2, 'LFL Winter 2025', 'Bo3', 'D-Pression', 'Vitality.Bee', DATEADD(day, 7, GETDATE()), '20:00', 0, 'SCHEDULED'),
    (3, 'VCT Challengers', 'Bo3', 'D-Pression', 'Team Heretics', DATEADD(day, 5, GETDATE()), '19:00', 0, 'SCHEDULED'),
    (4, 'Scrim interne', 'Bo1', 'D-Pression A', 'D-Pression B', DATEADD(day, 1, GETDATE()), '15:00', 1, 'SCHEDULED');
    PRINT 'Matchs insérés';
END

SET IDENTITY_INSERT matches OFF;
GO

-- ==========================================
-- ARTICLES/NEWS
-- ==========================================
SET IDENTITY_INSERT posts ON;

IF NOT EXISTS (SELECT 1 FROM posts WHERE id = 1)
BEGIN
    INSERT INTO posts (id, title, content, summary, category, author, published, publish_date)
    VALUES 
    (1, 'Bienvenue sur le nouveau site D-Pression !', 
        'Nous sommes ravis de vous présenter notre tout nouveau site web. Restez connectés pour suivre nos actualités, matchs et événements.', 
        'Découvrez notre nouveau site !', 
        'Annonce', 'Admin', 1, GETDATE()),
    (2, 'Victoire en LFL !', 
        'Notre équipe LoL remporte une victoire écrasante 2-0 contre nos adversaires. GG à toute l''équipe !', 
        'Victoire 2-0 en LFL', 
        'Match', 'Admin', 1, DATEADD(day, -2, GETDATE())),
    (3, 'Nouveau partenariat annoncé', 
        'Nous sommes fiers d''annoncer un nouveau partenariat stratégique qui va nous permettre de développer notre structure.', 
        'Un partenariat stratégique', 
        'Annonce', 'Admin', 1, DATEADD(day, -5, GETDATE()));
    PRINT 'Articles insérés';
END

SET IDENTITY_INSERT posts OFF;
GO

-- ==========================================
-- PRODUITS (Boutique)
-- ==========================================
SET IDENTITY_INSERT products ON;

IF NOT EXISTS (SELECT 1 FROM products WHERE id = 1)
BEGIN
    INSERT INTO products (id, name, description, price, category, stock, available)
    VALUES 
    (1, 'Maillot D-Pression 2025', 'Maillot officiel de l''équipe', 59.99, 'Vêtements', 100, 1),
    (2, 'Hoodie D-Pression', 'Hoodie confortable avec logo brodé', 79.99, 'Vêtements', 50, 1),
    (3, 'Casquette D-Pression', 'Casquette snapback officielle', 29.99, 'Accessoires', 75, 1),
    (4, 'Mousepad XL', 'Tapis de souris gaming 900x400mm', 34.99, 'Gaming', 30, 1),
    (5, 'Poster Équipe LoL', 'Poster dédicacé A2', 19.99, 'Collectors', 20, 1);
    PRINT 'Produits insérés';
END

SET IDENTITY_INSERT products OFF;
GO

-- ==========================================
-- UTILISATEUR ADMIN
-- ==========================================
SET IDENTITY_INSERT users ON;

IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
BEGIN
    -- Mot de passe: admin123 (à changer en production !)
    INSERT INTO users (id, username, email, password, role, active)
    VALUES (1, 'admin', 'admin@dpression.gg', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx0Hl6FZxUOIjXsGKFVHWry', 'ADMIN', 1);
    PRINT 'Utilisateur admin créé (mot de passe: admin123)';
END

SET IDENTITY_INSERT users OFF;
GO

PRINT '========================================';
PRINT 'Données initiales insérées avec succès !';
PRINT '========================================';
GO
