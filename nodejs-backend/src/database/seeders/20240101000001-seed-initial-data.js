'use strict';
const crypto = require('crypto');

/**
 * Hash password using SHA-256 (compatible with Spring Boot)
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('base64');
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Insert Admin User (password: admin123)
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@kjx.com',
        password: hashPassword('admin123'),
        role: 'ADMIN',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'user1',
        email: 'user1@test.com',
        password: hashPassword('user123'),
        role: 'USER',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        username: 'user2',
        email: 'user2@test.com',
        password: hashPassword('user123'),
        role: 'USER',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    // Insert Teams
    await queryInterface.bulkInsert('Teams', [
      {
        name: 'KJX Valorant',
        game: 'Valorant',
        logo_url: '/assets/teams/valorant.png',
        description: 'Notre équipe Valorant professionnelle',
        achievements: 'VCT EMEA 2024 - Top 8, Valorant Champions 2024 - Participants',
        created_at: now,
        updated_at: now
      },
      {
        name: 'KJX League of Legends',
        game: 'League of Legends',
        logo_url: '/assets/teams/lol.png',
        description: 'Notre équipe LoL en LEC',
        achievements: 'LEC Winter 2024 - Playoffs, Worlds 2024 - Play-ins',
        created_at: now,
        updated_at: now
      },
      {
        name: 'KJX CS2',
        game: 'Counter-Strike 2',
        logo_url: '/assets/teams/cs2.png',
        description: 'Notre roster CS2 international',
        achievements: 'ESL Pro League S19 - Top 16, IEM Cologne 2024 - Participants',
        created_at: now,
        updated_at: now
      },
      {
        name: 'KJX Fortnite',
        game: 'Fortnite',
        logo_url: '/assets/teams/fortnite.png',
        description: 'Notre équipe Fortnite Battle Royale',
        achievements: 'FNCS 2024 - Grand Finals Qualified',
        created_at: now,
        updated_at: now
      }
    ]);

    // Insert Team Members for Valorant (team_id: 1)
    await queryInterface.bulkInsert('TeamMembers', [
      { team_id: 1, gamertag: 'ScreaM', role: 'Duelist', photo_url: '/assets/players/scream.jpg', nationality: 'Belgium', join_date: new Date('2023-01-15'), created_at: now, updated_at: now },
      { team_id: 1, gamertag: 'Nivera', role: 'Sentinel', photo_url: '/assets/players/nivera.jpg', nationality: 'Belgium', join_date: new Date('2023-01-15'), created_at: now, updated_at: now },
      { team_id: 1, gamertag: 'Zyppan', role: 'Initiator', photo_url: '/assets/players/zyppan.jpg', nationality: 'Sweden', join_date: new Date('2023-03-01'), created_at: now, updated_at: now },
      { team_id: 1, gamertag: 'BONECOLD', role: 'Controller', photo_url: '/assets/players/bonecold.jpg', nationality: 'Latvia', join_date: new Date('2023-06-01'), created_at: now, updated_at: now },
      { team_id: 1, gamertag: 'Leo', role: 'Initiator', photo_url: '/assets/players/leo.jpg', nationality: 'Sweden', join_date: new Date('2023-09-01'), created_at: now, updated_at: now },
      // LoL team (team_id: 2)
      { team_id: 2, gamertag: 'Caps', role: 'Mid Lane', photo_url: '/assets/players/caps.jpg', nationality: 'Denmark', join_date: new Date('2024-01-01'), created_at: now, updated_at: now },
      { team_id: 2, gamertag: 'Jankos', role: 'Jungle', photo_url: '/assets/players/jankos.jpg', nationality: 'Poland', join_date: new Date('2024-01-01'), created_at: now, updated_at: now },
      { team_id: 2, gamertag: 'BrokenBlade', role: 'Top Lane', photo_url: '/assets/players/brokenblade.jpg', nationality: 'Germany', join_date: new Date('2024-01-01'), created_at: now, updated_at: now },
      { team_id: 2, gamertag: 'Hans Sama', role: 'ADC', photo_url: '/assets/players/hanssama.jpg', nationality: 'France', join_date: new Date('2024-01-01'), created_at: now, updated_at: now },
      { team_id: 2, gamertag: 'Mikyx', role: 'Support', photo_url: '/assets/players/mikyx.jpg', nationality: 'Slovenia', join_date: new Date('2024-01-01'), created_at: now, updated_at: now }
    ]);

    // Insert Events
    await queryInterface.bulkInsert('Events', [
      { name: 'VCT EMEA Stage 2', description: 'Le deuxième stage du Valorant Champions Tour EMEA', type: 'TOURNAMENT', date: new Date('2024-07-15'), location: 'Berlin, Germany', prize_pool: '$200,000', image_url: '/assets/events/vct-emea.jpg', team_id: 1, created_at: now, updated_at: now },
      { name: 'LEC Summer Split 2024', description: 'Split été de la League of Legends European Championship', type: 'LEAGUE', date: new Date('2024-06-01'), location: 'Berlin, Germany', prize_pool: '$500,000', image_url: '/assets/events/lec-summer.jpg', team_id: 2, created_at: now, updated_at: now },
      { name: 'ESL Pro League Season 20', description: 'Nouvelle saison de ESL Pro League CS2', type: 'TOURNAMENT', date: new Date('2024-08-15'), location: 'Malta', prize_pool: '$850,000', image_url: '/assets/events/esl-pro.jpg', team_id: 3, created_at: now, updated_at: now },
      { name: 'Meet & Greet Paris', description: 'Rencontrez nos joueurs à Paris', type: 'COMMUNITY', date: new Date('2024-09-20'), location: 'Paris, France', prize_pool: null, image_url: '/assets/events/meet-paris.jpg', team_id: null, created_at: now, updated_at: now }
    ]);

    // Insert Matches
    await queryInterface.bulkInsert('Matches', [
      { tournament: 'VCT EMEA Stage 2', opponent: 'Team Liquid', result: 'WIN', score: '2-1', match_date: new Date('2024-07-16 18:00:00'), stream_url: 'https://twitch.tv/valorant', is_hidden: false, created_at: now, updated_at: now },
      { tournament: 'VCT EMEA Stage 2', opponent: 'Fnatic', result: 'LOSS', score: '1-2', match_date: new Date('2024-07-18 20:00:00'), stream_url: 'https://twitch.tv/valorant', is_hidden: false, created_at: now, updated_at: now },
      { tournament: 'LEC Summer 2024', opponent: 'G2 Esports', result: 'WIN', score: '2-0', match_date: new Date('2024-06-05 19:00:00'), stream_url: 'https://twitch.tv/lec', is_hidden: false, created_at: now, updated_at: now },
      { tournament: 'LEC Summer 2024', opponent: 'MAD Lions', result: 'WIN', score: '2-1', match_date: new Date('2024-06-12 18:00:00'), stream_url: 'https://twitch.tv/lec', is_hidden: false, created_at: now, updated_at: now },
      { tournament: 'ESL Pro League S20', opponent: 'NAVI', result: null, score: null, match_date: new Date('2024-08-20 21:00:00'), stream_url: 'https://twitch.tv/esl_csgo', is_hidden: true, created_at: now, updated_at: now }
    ]);

    // Insert Memberships
    await queryInterface.bulkInsert('Memberships', [
      { name: 'KJX Fan', description: 'Membership de base pour les fans', price: 4.99, duration_months: 1, benefits: 'Badge Discord, Accès early aux annonces, Emotes exclusives', is_active: true, created_at: now, updated_at: now },
      { name: 'KJX Supporter', description: 'Pour les supporters dévoués', price: 9.99, duration_months: 1, benefits: 'Tous les avantages Fan, Réductions boutique 10%, Accès streams privés', is_active: true, created_at: now, updated_at: now },
      { name: 'KJX Elite', description: 'Le membership premium', price: 24.99, duration_months: 1, benefits: 'Tous les avantages Supporter, Meet & Greet prioritaire, Merchandise exclusive, Réductions 25%', is_active: true, created_at: now, updated_at: now },
      { name: 'KJX Lifetime', description: 'Accès à vie', price: 199.99, duration_months: 0, benefits: 'Tous les avantages Elite à vie, Nom dans les crédits, Invitation événements VIP', is_active: true, created_at: now, updated_at: now }
    ]);

    // Insert Products
    await queryInterface.bulkInsert('Products', [
      { name: 'KJX Jersey 2024', description: 'Maillot officiel KJX saison 2024', price: 79.99, category: 'APPAREL', image_url: '/assets/products/jersey-2024.jpg', stock: 150, is_featured: true, created_at: now, updated_at: now },
      { name: 'KJX Hoodie Black', description: 'Hoodie noir avec logo KJX brodé', price: 59.99, category: 'APPAREL', image_url: '/assets/products/hoodie-black.jpg', stock: 200, is_featured: true, created_at: now, updated_at: now },
      { name: 'KJX Cap', description: 'Casquette snapback KJX', price: 29.99, category: 'ACCESSORIES', image_url: '/assets/products/cap.jpg', stock: 300, is_featured: false, created_at: now, updated_at: now },
      { name: 'KJX Mousepad XL', description: 'Tapis de souris gaming XL (900x400mm)', price: 34.99, category: 'GAMING', image_url: '/assets/products/mousepad.jpg', stock: 100, is_featured: true, created_at: now, updated_at: now },
      { name: 'KJX Poster Pack', description: 'Pack de 3 posters joueurs', price: 19.99, category: 'COLLECTIBLES', image_url: '/assets/products/posters.jpg', stock: 500, is_featured: false, created_at: now, updated_at: now },
      { name: 'KJX Sticker Pack', description: 'Pack de 10 stickers KJX', price: 9.99, category: 'COLLECTIBLES', image_url: '/assets/products/stickers.jpg', stock: 1000, is_featured: false, created_at: now, updated_at: now }
    ]);

    // Insert Posts
    await queryInterface.bulkInsert('Posts', [
      { title: 'VCT EMEA: Notre parcours commence!', content: 'Nous sommes ravis d\'annoncer notre participation au VCT EMEA Stage 2. Notre équipe Valorant est prête à en découdre. Suivez-nous sur Twitch pour ne rien manquer!', category: 'NEWS', image_url: '/assets/posts/vct-start.jpg', author: 'KJX Media', is_published: true, view_count: 1250, publish_date: new Date('2024-07-10'), created_at: now, updated_at: now },
      { title: 'Nouveau Roster LoL Annoncé', content: 'Nous sommes fiers de présenter notre nouveau roster League of Legends pour le LEC Summer Split 2024. Bienvenue à Caps, Jankos, BrokenBlade, Hans Sama et Mikyx!', category: 'ANNOUNCEMENT', image_url: '/assets/posts/lol-roster.jpg', author: 'KJX Media', is_published: true, view_count: 3500, publish_date: new Date('2024-05-15'), created_at: now, updated_at: now },
      { title: 'Nouvelle Collection Merch 2024', content: 'Découvrez notre nouvelle collection de merchandise pour 2024. Jerseys, hoodies, et accessoires gaming vous attendent dans notre boutique!', category: 'SHOP', image_url: '/assets/posts/merch-2024.jpg', author: 'KJX Shop', is_published: true, view_count: 890, publish_date: new Date('2024-06-01'), created_at: now, updated_at: now },
      { title: 'Meet & Greet Paris - Inscriptions Ouvertes', content: 'Rejoignez-nous à Paris le 20 septembre pour rencontrer nos joueurs. Les inscriptions sont ouvertes pour les membres Elite et Lifetime!', category: 'COMMUNITY', image_url: '/assets/posts/meetup-paris.jpg', author: 'KJX Events', is_published: true, view_count: 2100, publish_date: new Date('2024-08-01'), created_at: now, updated_at: now }
    ]);

    // Insert Schedules
    await queryInterface.bulkInsert('Schedules', [
      { day: 'MONDAY', activities: '10:00 - VOD Review, 14:00 - Practice Block 1, 18:00 - Scrims', team_id: 1, created_at: now, updated_at: now },
      { day: 'TUESDAY', activities: '10:00 - Individual Practice, 14:00 - Team Practice, 18:00 - Scrims', team_id: 1, created_at: now, updated_at: now },
      { day: 'WEDNESDAY', activities: '10:00 - Strat Development, 14:00 - Practice Block, 18:00 - Scrims', team_id: 1, created_at: now, updated_at: now },
      { day: 'THURSDAY', activities: '10:00 - Physical Training, 14:00 - Mental Coaching, 18:00 - Light Practice', team_id: 1, created_at: now, updated_at: now },
      { day: 'FRIDAY', activities: '10:00 - Pre-match Preparation, 14:00 - Team Meeting, 18:00 - Match Day', team_id: 1, created_at: now, updated_at: now },
      { day: 'SATURDAY', activities: 'Rest Day / Content Creation', team_id: 1, created_at: now, updated_at: now },
      { day: 'SUNDAY', activities: 'Rest Day / Optional Ranked', team_id: 1, created_at: now, updated_at: now }
    ]);

    // Insert Scrims
    await queryInterface.bulkInsert('Scrims', [
      { opponent: 'Team Vitality', game: 'Valorant', scrim_date: new Date('2024-07-10 18:00:00'), status: 'COMPLETED', notes: 'Good practice, worked on Haven setups', team_id: 1, created_at: now, updated_at: now },
      { opponent: 'Karmine Corp', game: 'Valorant', scrim_date: new Date('2024-07-12 19:00:00'), status: 'COMPLETED', notes: 'Practiced Ascent and Lotus', team_id: 1, created_at: now, updated_at: now },
      { opponent: 'BIG Clan', game: 'Valorant', scrim_date: new Date('2024-07-20 18:00:00'), status: 'SCHEDULED', notes: null, team_id: 1, created_at: now, updated_at: now },
      { opponent: 'Excel Esports', game: 'League of Legends', scrim_date: new Date('2024-06-03 14:00:00'), status: 'COMPLETED', notes: 'Tested new bot lane compositions', team_id: 2, created_at: now, updated_at: now },
      { opponent: 'Team Heretics', game: 'League of Legends', scrim_date: new Date('2024-06-10 15:00:00'), status: 'CANCELLED', notes: 'Cancelled due to LEC schedule conflict', team_id: 2, created_at: now, updated_at: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Scrims', null, {});
    await queryInterface.bulkDelete('Schedules', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Memberships', null, {});
    await queryInterface.bulkDelete('Matches', null, {});
    await queryInterface.bulkDelete('Events', null, {});
    await queryInterface.bulkDelete('TeamMembers', null, {});
    await queryInterface.bulkDelete('Teams', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
