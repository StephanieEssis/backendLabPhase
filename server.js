const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const roomRoutes = require('./routes/rooms');
const categoryRoutes = require('./routes/categories');

// Configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/categories', categoryRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`);
}); 