-- data.sql - Initial data for D-PRESSION Esports (H2 compatible)

-- Insert Teams
INSERT INTO teams (name, game, description, win_rate, created_at, updated_at) VALUES 
    ('D-PRESSION LoL', 'lol', 'Roster principal League of Legends - Competiteurs LFL', 0.72, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('D-PRESSION Valorant', 'valorant', 'Equipe professionnelle Valorant - VCT EMEA', 0.68, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('D-PRESSION Academy', 'lol', 'Programme de developpement des talents', 0.58, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('D-PRESSION CS2', 'cs2', 'Division Counter-Strike 2', 0.65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Team Members
INSERT INTO team_members (team_id, name, position, role, champion_pool, created_at) VALUES 
    (1, 'ShadowStrike', 'Top', 'Toplaner', 'Aatrox, Fiora, Jayce, KSante', CURRENT_TIMESTAMP),
    (1, 'JungleKing', 'Jungle', 'Jungler', 'Lee Sin, Viego, Elise, Nidalee', CURRENT_TIMESTAMP),
    (1, 'MidMaster', 'Mid', 'Midlaner', 'Ahri, Syndra, LeBlanc, Azir', CURRENT_TIMESTAMP),
    (1, 'MaxKill', 'ADC', 'ADC', 'Caitlyn, Jinx, Aphelios, KaiSa', CURRENT_TIMESTAMP),
    (1, 'Guardian', 'Support', 'Support', 'Thresh, Rakan, Lulu, Nautilus', CURRENT_TIMESTAMP),
    (1, 'Coach Titan', 'Coach', 'Head Coach', 'Strategic Analysis', CURRENT_TIMESTAMP),
    (2, 'FlashPoint', 'Duelist', 'Duelist', 'Jett, Raze, Reyna, Neon', CURRENT_TIMESTAMP),
    (2, 'Sentinel9', 'Sentinel', 'Sentinel', 'Killjoy, Cypher, Chamber, Sage', CURRENT_TIMESTAMP),
    (2, 'SmokeScreen', 'Controller', 'Controller', 'Brimstone, Viper, Omen, Astra', CURRENT_TIMESTAMP),
    (2, 'InfoGather', 'Initiator', 'Initiator', 'Sova, Breach, Fade, Gekko', CURRENT_TIMESTAMP),
    (2, 'FlexMaster', 'Flex', 'Flex', 'Sage, Skye, KAYO, Harbor', CURRENT_TIMESTAMP),
    (3, 'RisingTop', 'Top', 'Toplaner', 'Garen, Darius, Renekton', CURRENT_TIMESTAMP),
    (3, 'JungleRookie', 'Jungle', 'Jungler', 'Sejuani, Amumu, Vi', CURRENT_TIMESTAMP),
    (3, 'MidProspect', 'Mid', 'Midlaner', 'Lux, Annie, Viktor', CURRENT_TIMESTAMP),
    (3, 'ADCTalent', 'ADC', 'ADC', 'Miss Fortune, Ashe, Ezreal', CURRENT_TIMESTAMP),
    (3, 'SupportStar', 'Support', 'Support', 'Leona, Braum, Soraka', CURRENT_TIMESTAMP),
    (4, 'AWPGod', 'Sniper', 'AWPer', 'AWP Specialist', CURRENT_TIMESTAMP),
    (4, 'EntryKing', 'Entry', 'Entry Fragger', 'AK-47, M4A4', CURRENT_TIMESTAMP),
    (4, 'SupportCS', 'Support', 'Support', 'Smokes, Flashes', CURRENT_TIMESTAMP),
    (4, 'Lurker', 'Lurk', 'Lurker', 'Deagle Expert', CURRENT_TIMESTAMP),
    (4, 'IGLeader', 'IGL', 'In-Game Leader', 'Tactical Mastermind', CURRENT_TIMESTAMP);

-- Insert Events (without team_id FK for simplicity)
INSERT INTO events (title, description, event_type, date, time, location, status, created_at, updated_at) VALUES 
    ('LFL Spring Split - Week 5', 'Match officiel contre Team Vitality', 'match', '2025-01-25 18:00:00', '18:00', 'Online - Twitch', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Scrim vs G2 Esports', 'Entrainement contre G2', 'scrim', '2025-01-22 14:00:00', '14:00', 'Online', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('VCT EMEA - Playoffs', 'Quart de finale Valorant Champions Tour', 'match', '2025-01-28 20:00:00', '20:00', 'Berlin, Allemagne', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Meet and Greet Paris', 'Rencontre avec les joueurs et fans', 'fanmeet', '2025-02-01 15:00:00', '15:00', 'Paris - Gaming House', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Stream Communautaire', 'Stream avec les membres de la communaute', 'event', '2025-01-24 19:00:00', '19:00', 'Twitch', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('LFL Spring Split - Week 4', 'Match contre Karmine Corp - Victoire 2-1', 'match', '2025-01-18 18:00:00', '18:00', 'Online', 'COMPLETED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bootcamp Valencia', 'Camp entrainement intensif', 'event', '2025-02-15 10:00:00', '10:00', 'Valencia, Espagne', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products
INSERT INTO products (name, description, category, price, stock, is_featured, created_at, updated_at) VALUES 
    ('Jersey D-PRESSION 2025', 'Maillot officiel saison 2025 - Design premium', 'apparel', 69.99, 150, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Jersey D-PRESSION Away', 'Maillot exterieur edition limitee', 'apparel', 69.99, 80, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hoodie D-PRESSION Premium', 'Sweatshirt oversize coton bio', 'apparel', 89.99, 75, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Casquette D-PRESSION', 'Casquette snapback brodee', 'merchandise', 34.99, 200, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Tapis de souris XXL', 'Tapis gaming 900x400mm', 'merchandise', 29.99, 120, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mug D-PRESSION', 'Mug ceramique 350ml', 'merchandise', 14.99, 300, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('T-Shirt Signature', 'T-shirt signature joueurs', 'apparel', 39.99, 100, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Pack Fan Ultimate', 'Jersey + Hoodie + Casquette', 'bundle', 159.99, 30, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Sticker Pack', 'Lot de 10 stickers holographiques', 'merchandise', 9.99, 500, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Poster Equipe 2025', 'Poster haute qualite 60x90cm', 'merchandise', 19.99, 200, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Echarpe Fan', 'Echarpe tricotee aux couleurs D-PRESSION', 'apparel', 24.99, 150, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Gourde Sport', 'Gourde isotherme 750ml', 'merchandise', 22.99, 100, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Memberships
INSERT INTO memberships (name, description, price, duration_days, benefits, is_active, created_at, updated_at) VALUES 
    ('FAN', 'Pour les supporters occasionnels', 4.99, 30, 'Discord communautaire,Badge membre,Newsletter exclusive,5% reduction boutique,Alertes matchs', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SUPPORTER', 'Le choix des vrais fans', 9.99, 30, 'Avantages FAN,Salons VIP Discord,QA mensuels joueurs,15% reduction boutique,Contenus backstage,Wallpapers HD,Replays VOD premium', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ELITE', 'Pour les passionnes', 19.99, 30, 'Avantages SUPPORTER,Acces scrims live,Meet Greet prioritaires,25% reduction boutique,Produit offert inscription,Nom sur le site,Support prioritaire 24/7', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('LEGEND', 'Experience ultime', 49.99, 30, 'Avantages ELITE,Visite gaming house annuelle,Maillot signe inscription,40% reduction boutique,Call prive joueur,Credits boutique mensuels,Places VIP evenements,Mention speciale streams', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Posts
INSERT INTO posts (title, excerpt, description, category, author, date, is_published, created_at, updated_at) VALUES 
    ('D-PRESSION remporte la LFL Spring Split 2025', 'Une victoire historique pour notre equipe League of Legends', 'D-PRESSION simpose face a Karmine Corp en finale dans un BO5 epique. Notre roster LoL a demontre une maitrise exceptionnelle tout au long du split.', 'esports', 'Thomas Durand', '2025-01-20 14:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Nouvelle collection merchandise ete 2025', 'Decouvrez notre toute nouvelle ligne de vetements officiels', 'En collaboration avec des designers francais renommes, nous lancons une collection exclusive melant streetwear et esport.', 'releases', 'Sophie Martin', '2025-01-18 10:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Interview exclusive avec MaxKill', 'Rencontre avec notre nouvel ADC', 'MaxKill nous partage sa vision de esport, ses ambitions avec D-PRESSION, et ses objectifs pour la saison 2025.', 'interviews', 'Lucas Bernard', '2025-01-16 11:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Partenariat officiel avec Logitech G', 'D-PRESSION sassocie avec Logitech G', 'Nous sommes fiers dannoncer notre partenariat officiel avec Logitech G pour equiper tous nos joueurs.', 'announcements', 'Marie Lefebvre', '2025-01-14 09:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Resultats VCT EMEA - Qualifications reussies', 'Notre equipe Valorant qualifiee pour les playoffs', 'Equipe Valorant D-PRESSION termine 4eme du groupe et se qualifie pour les playoffs EMEA.', 'esports', 'Thomas Durand', '2025-01-12 16:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Event communautaire : Tournoi membres D-PRESSION', 'Participez a notre prochain tournoi reserve aux membres', 'Tournoi exclusif reserve aux membres FAN et plus ! Des prix exclusifs a gagner.', 'community', 'Sophie Martin', '2025-01-10 12:00:00', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Scrims
INSERT INTO scrims (team_id, opponent, description, date, status, game, created_at, updated_at) VALUES 
    (1, 'G2 Esports', 'Scrim preparation LFL - Bo3', '2025-01-22 14:00:00', 'APPROVED', 'lol', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'Karmine Corp', 'Scrim revenge - Bo5', '2025-01-23 15:00:00', 'PENDING', 'lol', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'Fnatic', 'Scrim international', '2025-01-24 16:00:00', 'PENDING', 'lol', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'NAVI', 'Scrim preparation playoffs', '2025-01-25 17:00:00', 'APPROVED', 'valorant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Team Liquid', 'Scrim BO3', '2025-01-26 18:00:00', 'PENDING', 'valorant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'FaZe Clan', 'Scrim CS2 - Practice', '2025-01-27 19:00:00', 'PENDING', 'cs2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Schedules
INSERT INTO schedules (team_id, day_of_week, start_time, end_time, activity, created_at, updated_at) VALUES 
    (1, 'LUNDI', '09:00', '12:00', 'Analyse videos et Review', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'LUNDI', '14:00', '19:00', 'Solo Queue et Practice', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'MARDI', '09:00', '11:00', 'Reunion strategie', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'MARDI', '14:00', '20:00', 'Scrim Block', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'MERCREDI', '10:00', '18:00', 'Jour de repos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'JEUDI', '09:00', '12:00', 'Theory crafting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'JEUDI', '14:00', '20:00', 'Scrim Block', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'VENDREDI', '10:00', '13:00', 'Preparation match officiel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'VENDREDI', '18:00', '22:00', 'Match officiel LFL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'SAMEDI', '10:00', '14:00', 'Debriefing et Content', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 'DIMANCHE', '10:00', '18:00', 'Repos et Vie personnelle', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Users
INSERT INTO users (username, email, role, is_active, created_at, updated_at) VALUES 
    ('admin', 'admin@d-pression.gg', 'ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('coach_titan', 'coach@d-pression.gg', 'COACH', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('community_manager', 'community@d-pression.gg', 'MODERATOR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
