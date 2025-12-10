-- V2__Seed_Initial_Data.sql
-- Initial test data for D-PRESSION Esports

-- Insert Teams
INSERT INTO teams (name, game, description, win_rate)
VALUES 
    (N'D-PRESSION LoL', N'lol', N'Roster principal League of Legends - Compétiteurs LFL', 0.72),
    (N'D-PRESSION Valorant', N'valorant', N'Équipe professionnelle Valorant - VCT EMEA', 0.68),
    (N'D-PRESSION Academy', N'lol', N'Programme de développement des talents', 0.58),
    (N'D-PRESSION CS2', N'cs2', N'Division Counter-Strike 2', 0.65);

-- Insert Team Members
INSERT INTO team_members (team_id, name, position, role, champion_pool)
VALUES 
    (1, N'ShadowStrike', N'Top', N'Toplaner', N'Aatrox, Fiora, Jayce, K''Sante'),
    (1, N'JungleKing', N'Jungle', N'Jungler', N'Lee Sin, Viego, Elise, Nidalee'),
    (1, N'MidMaster', N'Mid', N'Midlaner', N'Ahri, Syndra, LeBlanc, Azir'),
    (1, N'MaxKill', N'ADC', N'ADC', N'Caitlyn, Jinx, Aphelios, Kai''Sa'),
    (1, N'Guardian', N'Support', N'Support', N'Thresh, Rakan, Lulu, Nautilus'),
    (1, N'Coach Titan', N'Coach', N'Head Coach', N'Strategic Analysis'),
    (2, N'FlashPoint', N'Duelist', N'Duelist', N'Jett, Raze, Reyna, Neon'),
    (2, N'Sentinel9', N'Sentinel', N'Sentinel', N'Killjoy, Cypher, Chamber, Sage'),
    (2, N'SmokeScreen', N'Controller', N'Controller', N'Brimstone, Viper, Omen, Astra'),
    (2, N'InfoGather', N'Initiator', N'Initiator', N'Sova, Breach, Fade, Gekko'),
    (2, N'FlexMaster', N'Flex', N'Flex', N'Sage, Skye, KAY/O, Harbor'),
    (3, N'RisingTop', N'Top', N'Toplaner', N'Garen, Darius, Renekton'),
    (3, N'JungleRookie', N'Jungle', N'Jungler', N'Sejuani, Amumu, Vi'),
    (3, N'MidProspect', N'Mid', N'Midlaner', N'Lux, Annie, Viktor'),
    (3, N'ADCTalent', N'ADC', N'ADC', N'Miss Fortune, Ashe, Ezreal'),
    (3, N'SupportStar', N'Support', N'Support', N'Leona, Braum, Soraka'),
    (4, N'AWPGod', N'Sniper', N'AWPer', N'AWP Specialist'),
    (4, N'EntryKing', N'Entry', N'Entry Fragger', N'AK-47, M4A4'),
    (4, N'SupportCS', N'Support', N'Support', N'Smokes, Flashes'),
    (4, N'Lurker', N'Lurk', N'Lurker', N'Deagle Expert'),
    (4, N'IGLeader', N'IGL', N'In-Game Leader', N'Tactical Mastermind');

-- Insert Events
INSERT INTO events (title, description, event_type, date, time, location, status)
VALUES 
    (N'LFL Spring Split - Week 5', N'Match officiel contre Team Vitality', N'match', '2025-01-25 18:00:00', N'18:00', N'Online - Twitch', N'SCHEDULED'),
    (N'Scrim vs G2 Esports', N'Entrainement contre G2', N'scrim', '2025-01-22 14:00:00', N'14:00', N'Online', N'SCHEDULED'),
    (N'VCT EMEA - Playoffs', N'Quart de finale Valorant Champions Tour', N'match', '2025-01-28 20:00:00', N'20:00', N'Berlin, Allemagne', N'SCHEDULED'),
    (N'Meet & Greet Paris', N'Rencontre avec les joueurs et fans', N'fanmeet', '2025-02-01 15:00:00', N'15:00', N'Paris - Gaming House', N'SCHEDULED'),
    (N'Stream Communautaire', N'Stream avec les membres de la communauté', N'event', '2025-01-24 19:00:00', N'19:00', N'Twitch', N'SCHEDULED'),
    (N'LFL Spring Split - Week 4', N'Match contre Karmine Corp - Victoire 2-1', N'match', '2025-01-18 18:00:00', N'18:00', N'Online', N'COMPLETED'),
    (N'Bootcamp Valencia', N'Camp d''entraînement intensif', N'event', '2025-02-15 10:00:00', N'10:00', N'Valencia, Espagne', N'SCHEDULED');

-- Insert Products
INSERT INTO products (name, description, category, price, stock, is_featured)
VALUES 
    (N'Jersey D-PRESSION 2025', N'Maillot officiel saison 2025 - Design premium', N'apparel', 69.99, 150, 1),
    (N'Jersey D-PRESSION Away', N'Maillot extérieur édition limitée', N'apparel', 69.99, 80, 1),
    (N'Hoodie D-PRESSION Premium', N'Sweatshirt oversize coton bio', N'apparel', 89.99, 75, 1),
    (N'Casquette D-PRESSION', N'Casquette snapback brodée', N'merchandise', 34.99, 200, 0),
    (N'Tapis de souris XXL', N'Tapis gaming 900x400mm', N'merchandise', 29.99, 120, 0),
    (N'Mug D-PRESSION', N'Mug céramique 350ml', N'merchandise', 14.99, 300, 0),
    (N'T-Shirt Signature', N'T-shirt signature joueurs', N'apparel', 39.99, 100, 1),
    (N'Pack Fan Ultimate', N'Jersey + Hoodie + Casquette', N'bundle', 159.99, 30, 1),
    (N'Sticker Pack', N'Lot de 10 stickers holographiques', N'merchandise', 9.99, 500, 0),
    (N'Poster Équipe 2025', N'Poster haute qualité 60x90cm', N'merchandise', 19.99, 200, 0),
    (N'Écharpe Fan', N'Écharpe tricotée aux couleurs D-PRESSION', N'apparel', 24.99, 150, 0),
    (N'Gourde Sport', N'Gourde isotherme 750ml', N'merchandise', 22.99, 100, 0);

-- Insert Memberships
INSERT INTO memberships (name, description, price, duration_days, benefits, is_active)
VALUES 
    (N'FAN', N'Pour les supporters occasionnels', 4.99, 30, N'Discord communautaire,Badge membre,Newsletter exclusive,5% réduction boutique,Alertes matchs', 1),
    (N'SUPPORTER', N'Le choix des vrais fans', 9.99, 30, N'Avantages FAN,Salons VIP Discord,Q&A mensuels joueurs,15% réduction boutique,Contenus backstage,Wallpapers HD,Replays VOD premium', 1),
    (N'ELITE', N'Pour les passionnés', 19.99, 30, N'Avantages SUPPORTER,Accès scrims live,Meet & Greet prioritaires,25% réduction boutique,Produit offert inscription,Nom sur le site,Support prioritaire 24/7', 1),
    (N'LEGEND', N'L''expérience ultime', 49.99, 30, N'Avantages ELITE,Visite gaming house annuelle,Maillot signé inscription,40% réduction boutique,Call privé joueur,Crédits boutique mensuels,Places VIP événements,Mention spéciale streams', 1);

-- Insert Posts
INSERT INTO posts (title, excerpt, description, category, author, date, is_published)
VALUES 
    (N'D-PRESSION remporte la LFL Spring Split 2025', N'Une victoire historique pour notre équipe League of Legends', N'D-PRESSION s''impose face à Karmine Corp en finale dans un BO5 épique. Notre roster LoL a démontré une maîtrise exceptionnelle tout au long du split, culminant avec cette victoire mémorable devant plus de 100 000 viewers.', N'esports', N'Thomas Durand', '2025-01-20 14:00:00', 1),
    (N'Nouvelle collection merchandise été 2025', N'Découvrez notre toute nouvelle ligne de vêtements officiels', N'En collaboration avec des designers français renommés, nous lançons une collection exclusive mêlant streetwear et esport. Jersey, hoodie, et accessoires disponibles dès maintenant sur notre boutique.', N'releases', N'Sophie Martin', '2025-01-18 10:00:00', 1),
    (N'Interview exclusive avec MaxKill', N'Rencontre avec notre nouvel ADC', N'MaxKill nous partage sa vision de l''esport, ses ambitions avec D-PRESSION, et ses objectifs pour la saison 2025. Un entretien passionnant avec l''un des joueurs les plus prometteurs de la scène française.', N'interviews', N'Lucas Bernard', '2025-01-16 11:00:00', 1),
    (N'Partenariat officiel avec Logitech G', N'D-PRESSION s''associe à Logitech G', N'Nous sommes fiers d''annoncer notre partenariat officiel avec Logitech G. Tous nos joueurs seront équipés du meilleur matériel gaming pour performer au plus haut niveau.', N'announcements', N'Marie Lefebvre', '2025-01-14 09:00:00', 1),
    (N'Résultats VCT EMEA - Qualifications réussies', N'Notre équipe Valorant qualifiée pour les playoffs', N'L''équipe Valorant D-PRESSION termine 4ème du groupe et se qualifie pour les playoffs EMEA. Rendez-vous le 28 janvier pour le quart de finale.', N'esports', N'Thomas Durand', '2025-01-12 16:00:00', 1),
    (N'Event communautaire : Tournoi membres D-PRESSION', N'Participez à notre prochain tournoi réservé aux membres', N'Tournoi exclusif réservé aux membres FAN et plus ! Des prix exclusifs à gagner : maillots signés, places pour le prochain event, et une chance de jouer contre nos pros.', N'community', N'Sophie Martin', '2025-01-10 12:00:00', 1),
    (N'L''academy D-PRESSION révèle ses nouveaux talents', N'Découvrez la nouvelle promotion 2025', N'Notre programme academy continue de former les futures stars de l''esport français. Présentation des 5 nouveaux talents qui rejoignent notre structure de formation.', N'announcements', N'Lucas Bernard', '2025-01-08 15:00:00', 1),
    (N'Behind the scenes : Une journée à la gaming house', N'Coulisses exclusives de notre quotidien', N'Plongez dans le quotidien de nos joueurs professionnels avec ce reportage exclusif. Entraînements, analyse vidéo, moments de détente : découvrez tout ce qui se passe dans notre gaming house parisienne.', N'community', N'Marie Lefebvre', '2025-01-06 14:00:00', 1);

-- Insert Scrims
INSERT INTO scrims (team_id, opponent, description, date, status, game)
VALUES 
    (1, N'G2 Esports', N'Scrim préparation LFL - Bo3', '2025-01-22 14:00:00', N'APPROVED', N'lol'),
    (1, N'Karmine Corp', N'Scrim revenge - Bo5', '2025-01-23 15:00:00', N'PENDING', N'lol'),
    (1, N'Fnatic', N'Scrim international', '2025-01-24 16:00:00', N'PENDING', N'lol'),
    (2, N'NAVI', N'Scrim préparation playoffs', '2025-01-25 17:00:00', N'APPROVED', N'valorant'),
    (2, N'Team Liquid', N'Scrim BO3', '2025-01-26 18:00:00', N'PENDING', N'valorant'),
    (4, N'FaZe Clan', N'Scrim CS2 - Practice', '2025-01-27 19:00:00', N'PENDING', N'cs2');

-- Insert Schedules
INSERT INTO schedules (team_id, day_of_week, start_time, end_time, activity)
VALUES 
    (1, N'LUNDI', N'09:00', N'12:00', N'Analyse vidéos & Review'),
    (1, N'LUNDI', N'14:00', N'19:00', N'Solo Queue & Practice'),
    (1, N'MARDI', N'09:00', N'11:00', N'Réunion stratégie'),
    (1, N'MARDI', N'14:00', N'20:00', N'Scrim Block'),
    (1, N'MERCREDI', N'10:00', N'18:00', N'Jour de repos'),
    (1, N'JEUDI', N'09:00', N'12:00', N'Theory crafting'),
    (1, N'JEUDI', N'14:00', N'20:00', N'Scrim Block'),
    (1, N'VENDREDI', N'10:00', N'13:00', N'Préparation match officiel'),
    (1, N'VENDREDI', N'18:00', N'22:00', N'Match officiel LFL'),
    (1, N'SAMEDI', N'10:00', N'14:00', N'Débriefing & Content'),
    (1, N'DIMANCHE', N'10:00', N'18:00', N'Repos & Vie personnelle');

-- Insert Users
INSERT INTO users (username, email, role, is_active)
VALUES 
    (N'admin', N'admin@d-pression.gg', N'ADMIN', 1),
    (N'coach_titan', N'coach@d-pression.gg', N'COACH', 1),
    (N'community_manager', N'community@d-pression.gg', N'MODERATOR', 1),
    (N'fan_member_1', N'fan1@gmail.com', N'USER', 1),
    (N'fan_member_2', N'fan2@gmail.com', N'USER', 1);
