const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const webhookRoutes = require('./routes/webhookRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const pool = require('./config/database');
const LostFound = require('./models/LostFound');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CMUQ Campus Companion API',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook',
      events: '/api/events',
      lostFound: '/api/lost-found'
    }
  });
});

// Webhook routes (for Zapier)
app.use('/webhook', webhookRoutes);

// API routes (for mobile app)
app.use('/api/events', eventsRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database tables on startup
async function initializeDatabase() {
  try {
    // Initialize Events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'Other',
        location VARCHAR(255),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        link TEXT,
        source VARCHAR(50) DEFAULT 'email',
        raw_email_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
      CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    `);

    // Add link column if it doesn't exist (migration for existing databases)
    await pool.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS link TEXT;
    `);

    // Initialize Lost & Found table
    await LostFound.initTable();

    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
}

// Start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  CMUQ Campus Companion API Server         ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log(`   → Webhook: http://localhost:${PORT}/webhook/events`);
    console.log(`   → Events API: http://localhost:${PORT}/api/events`);
    console.log(`   → Lost & Found API: http://localhost:${PORT}/api/lost-found`);
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('');
  });
}

startServer();

module.exports = app;
