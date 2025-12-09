-- V2__Seed_Initial_Data.sql
-- Initial test data for KJX Esports

-- Insert Teams
INSERT INTO teams (name, game, description, win_rate)
VALUES 
    (N'KJX Red', N'lol', N'Roster principal League of Legends', 0.65),
    (N'KJX Blue', N'valorant', N'Équipe professionnelle Valorant', 0.72),
    (N'KJX Academy', N'lol', N'Équipe académique League of Legends', 0.55);

-- Insert Team Members
INSERT INTO team_members (team_id, name, position, role, champion_pool)
VALUES 
    (1, N'Player1', N'Top', N'Adc', N'Aatrox, Fiora, Jayce'),
    (1, N'Player2', N'Jungle', N'Jungler', N'Lee Sin, Elise, Nidalee'),
    (1, N'Player3', N'Mid', N'Mid', N'Ahri, Syndra, LeBlanc'),
    (1, N'Player4', N'ADC', N'Adc', N'Caitlyn, Jinx, Aphelios'),
    (1, N'Player5', N'Support', N'Support', N'Thresh, Rakan, Lulu'),
    (2, N'Valorant1', N'Duelist', N'Duelist', N'Jett, Raze, Reyna'),
    (2, N'Valorant2', N'Sentinel', N'Sentinel', N'Killjoy, Cypher, Sage'),
    (2, N'Valorant3', N'Smokes', N'Smokes', N'Brimstone, Viper, Omen'),
    (2, N'Valorant4', N'Info', N'Info', N'Sova, Breach, Fade'),
    (2, N'Valorant5', N'Support', N'Support', N'Sage, Skye, Astra');

-- Insert Events
INSERT INTO events (title, description, event_type, date, time, location, status)
VALUES 
    (N'Match LEC Week 1', N'Première semaine du circuit LEC officiel', N'match', '2025-01-20 19:00:00', N'19:00', N'Paris', N'SCHEDULED'),
    (N'Scrim vs Team X', N'Match d''entraînement contre Team X', N'scrim', '2025-01-18 18:00:00', N'18:00', N'Online', N'SCHEDULED'),
    (N'Fan Meet KJX', N'Rencontre avec les fans', N'fanmeet', '2025-01-25 15:00:00', N'15:00', N'Paris', N'SCHEDULED'),
    (N'Valorant Pro Match', N'Match professionnel Valorant', N'match', '2025-01-22 20:00:00', N'20:00', N'Online', N'SCHEDULED');

-- Insert Products
INSERT INTO products (name, description, category, price, stock, is_featured)
VALUES 
    (N'Jersey KJX Home', N'Maillot domicile officiel KJX', N'apparel', 59.99, 100, 1),
    (N'Jersey KJX Away', N'Maillot extérieur officiel KJX', N'apparel', 59.99, 80, 1),
    (N'KJX Cap', N'Casquette officielle KJX', N'merchandise', 29.99, 150, 0),
    (N'KJX Hoodie', N'Sweatshirt KJX Premium', N'apparel', 79.99, 50, 1),
    (N'KJX Mouse Pad', N'Tapis de souris gaming KJX', N'merchandise', 19.99, 200, 0),
    (N'KJX Energy Drink', N'Boisson énergisante officielle', N'food', 3.99, 500, 0);

-- Insert Memberships
INSERT INTO memberships (name, description, price, duration_days, benefits, is_active)
VALUES 
    (N'Tier 1', N'Accès à contenu backstage basique', 4.99, 30, N'Backstage access,Discord access,Early drops', 1),
    (N'Tier 2', N'Accès complet memberships', 9.99, 30, N'All Tier 1 benefits,Exclusive merchandise,Q&A mensuel', 1),
    (N'Tier 3', N'VIP access complet', 19.99, 30, N'All Tier 2 benefits,Private salon,Meet and greet', 1),
    (N'Premium', N'Accès illimité VIP', 29.99, 30, N'All benefits,Priority support,Lifetime perks', 1);

-- Insert Posts
INSERT INTO posts (title, excerpt, description, category, author, date, is_published)
VALUES 
    (N'Annonce nouvelle équipe', N'KJX annonce l''arrivée de trois nouveaux joueurs', N'KJX Esports est fier d''annoncer l''arrivée de trois nouveaux joueurs pour la saison 2025', N'annonce', N'KJX Admin', '2025-01-15 10:00:00', 1),
    (N'Résultats Weekly', N'Les résultats de la semaine en détail', N'Cette semaine, KJX a enregistré 4 victoires en 5 matchs', N'results', N'KJX Admin', '2025-01-14 14:30:00', 1),
    (N'Interview du nouvel ADC', N'Découvrez le nouvel ADC de l''équipe', N'Rencontre avec notre nouvel ADC recruté', N'interview', N'KJX Admin', '2025-01-13 11:00:00', 1),
    (N'Drops boutique janvier', N'Nouvelle collection de vêtements disponible', N'Découvrez notre nouvelle collection de hoodies et t-shirts', N'boutique', N'KJX Admin', '2025-01-12 09:00:00', 1);

-- Insert Scrims
INSERT INTO scrims (team_id, opponent, description, date, status, game)
VALUES 
    (1, N'Team X', N'Scrim préparation LEC', '2025-01-18 18:00:00', N'PENDING', N'lol'),
    (1, N'Team Y', N'Scrim test nouvelle composition', '2025-01-19 19:00:00', N'APPROVED', N'lol'),
    (2, N'Valorant Team A', N'Scrim Valorant', '2025-01-17 17:00:00', N'REJECTED', N'valorant');

-- Insert Schedules
INSERT INTO schedules (team_id, day_of_week, start_time, end_time, activity)
VALUES 
    (1, N'LUNDI', N'10:00', N'13:00', N'Analyse vidéos'),
    (1, N'LUNDI', N'14:00', N'18:00', N'Entraînement'),
    (1, N'MARDI', N'10:00', N'12:00', N'Réunion stratégie'),
    (1, N'MARDI', N'14:00', N'18:00', N'Scrim'),
    (1, N'MERCREDI', N'10:00', N'18:00', N'Repos'),
    (1, N'JEUDI', N'10:00', N'13:00', N'Entraînement'),
    (1, N'JEUDI', N'14:00', N'18:00', N'Scrim'),
    (1, N'VENDREDI', N'10:00', N'13:00', N'Préparation match'),
    (1, N'VENDREDI', N'15:00', N'19:00', N'Match'),
    (1, N'SAMEDI', N'10:00', N'14:00', N'Débriefing'),
    (1, N'DIMANCHE', N'10:00', N'18:00', N'Repos');

-- Insert Users
INSERT INTO users (username, email, role, is_active)
VALUES 
    (N'admin', N'admin@kjx.gg', N'ADMIN', 1),
    (N'coach', N'coach@kjx.gg', N'COACH', 1),
    (N'user1', N'user1@kjx.gg', N'USER', 1);
