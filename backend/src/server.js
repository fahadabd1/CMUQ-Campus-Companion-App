const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const webhookRoutes = require('./routes/webhookRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CMUQ Campus Companion API',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook',
      events: '/api/events'
    }
  });
});

// Webhook routes (for Zapier)
app.use('/webhook', webhookRoutes);

// API routes (for mobile app)
app.use('/api/events', eventsRoutes);

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

// Start server
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
  console.log(`   → API: http://localhost:${PORT}/api/events`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

module.exports = app;
