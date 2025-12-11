/**
 * Kyojin KJX E-sports Backend API
 * Main Application Entry Point
 * 
 * Converted from Spring Boot to Node.js + Express + Sequelize
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const teamRoutes = require('./routes/team.routes');
const eventRoutes = require('./routes/event.routes');
const matchRoutes = require('./routes/match.routes');
const membershipRoutes = require('./routes/membership.routes');
const paymentRoutes = require('./routes/payment.routes');
const postRoutes = require('./routes/post.routes');
const productRoutes = require('./routes/product.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const scrimRoutes = require('./routes/scrim.routes');

// Import Middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8081;

// ============== MIDDLEWARE ==============
// Security headers
app.use(helmet());

// CORS configuration - allowing all origins like Spring Boot @CrossOrigin(origins = "*")
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============== ROUTES ==============
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Kyojin KJX API',
    version: '1.0.0'
  });
});

// API Information
app.get('/', (req, res) => {
  res.json({
    name: 'Kyojin KJX E-sports API',
    version: '1.0.0',
    description: 'Backend API for Kyojin KJX E-sports Organization',
    endpoints: {
      auth: '/auth',
      users: '/api/users',
      teams: '/api/teams',
      events: '/api/events',
      matches: '/api/matches',
      memberships: '/api/memberships',
      payments: '/api/payments',
      posts: '/api/posts',
      products: '/api/products',
      schedules: '/api/schedules',
      scrims: '/api/scrims'
    }
  });
});

// Auth routes (no /api prefix like Spring Boot)
app.use('/auth', authRoutes);

// API routes
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/scrims', scrimRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use(errorHandler);

// ============== DATABASE & SERVER ==============
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync models (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      // In development, sync models. Use migrations in production.
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synchronized.');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🎮 Kyojin KJX E-sports API Server                           ║
║                                                                ║
║   Server running on: http://localhost:${PORT}                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Database: ${process.env.DB_DIALECT || 'mssql'}                                       ║
║                                                                ║
║   Endpoints:                                                   ║
║   • Auth:        http://localhost:${PORT}/auth                   ║
║   • Users:       http://localhost:${PORT}/api/users              ║
║   • Teams:       http://localhost:${PORT}/api/teams              ║
║   • Events:      http://localhost:${PORT}/api/events             ║
║   • Matches:     http://localhost:${PORT}/api/matches            ║
║   • Memberships: http://localhost:${PORT}/api/memberships        ║
║   • Payments:    http://localhost:${PORT}/api/payments           ║
║   • Posts:       http://localhost:${PORT}/api/posts              ║
║   • Products:    http://localhost:${PORT}/api/products           ║
║   • Schedules:   http://localhost:${PORT}/api/schedules          ║
║   • Scrims:      http://localhost:${PORT}/api/scrims             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing server...');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;
