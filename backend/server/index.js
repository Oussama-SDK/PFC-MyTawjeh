try {
  require('dotenv').config();
} catch {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env');

  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const separator = trimmed.indexOf('=');
        if (separator === -1) return;

        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
        if (key && process.env[key] === undefined) process.env[key] = value;
      });
  }
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const routes = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');
const { authLimiter, apiLimiter, securityHeaders } = require('./middleware/security');

// Import models to register them
require('./models/Eleve');
require('./models/Parent');
require('./models/Professeur');
require('./models/Admine');
require('./models/Note');
require('./models/Exercice');
require('./models/ResultatExercice');
require('./models/Roadmap');
require('./models/Metier');
require('./models/Concours');
require('./models/Annale');
require('./models/Notification');
require('./models/ProfilOnet');
require('./models/ChatHistory');

// Load model associations
require('./models/associations');

const app = express();

// Security & rate limiting
app.use(securityHeaders);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(apiLimiter);
app.use(express.json());

// Apply auth rate limiter to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log('âœ… MongoDB connected');
    app.listen(PORT, () => console.log(`ðŸš€ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('âŒ DB Error:', err.message);
    process.exit(1);
  });

