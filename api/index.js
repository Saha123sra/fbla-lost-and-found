// Vercel Serverless Function Handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import routes
const authRoutes = require('../server/routes/auth');
const itemRoutes = require('../server/routes/items');
const claimRoutes = require('../server/routes/claims');
const adminRoutes = require('../server/routes/admin');
const requestRoutes = require('../server/routes/requests');
const ownerRoutes = require('../server/routes/owner');
const faqRoutes = require('../server/routes/faq');
const testimonialRoutes = require('../server/routes/testimonials');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lost Dane Found API is running on Vercel!' });
});

// Handle uploads - note: Vercel serverless has limitations with file uploads
// For production, images should be uploaded directly to Supabase Storage from the client
app.get('/uploads/:filename', (req, res) => {
  res.status(404).json({ error: 'Local uploads not available in serverless mode. Images stored in Supabase.' });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
module.exports = app;
