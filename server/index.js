const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const claimRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');
const requestRoutes = require('./routes/requests');
const ownerRoutes = require('./routes/owner');
const faqRoutes = require('./routes/faq');
const testimonialRoutes = require('./routes/testimonials');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: isProduction ? true : (process.env.FRONTEND_URL || 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 })); // Increased limit

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  res.json({ status: 'ok', message: 'Lost Dane Found API is running!' });
});

// Serve static frontend in production
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  // Handle SPA routing - serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling - 404 for API routes only
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🐕 Lost Dane Found Server running on port ${PORT}`);
});

module.exports = app;
