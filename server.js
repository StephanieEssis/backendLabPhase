  const express = require('express');
  const dotenv = require('dotenv');
  const cors = require('cors');
  // import morgan from 'morgan';
  const connectDB = require('./config/db');

  // Routes
  const authRoutes = require('./routes/auth');
  const roomRoutes = require('./routes/rooms');
  const categoryRoutes = require('./routes/categories');
  const bookingRoutes = require('./routes/bookings');
  const statsRoutes = require('./routes/stats');

  // Middleware
  const { errorHandler } = require('./middleware/authMiddleware');

  // Configuration
  dotenv.config();
  const app = express();
  const port = process.env.PORT || 9000;

  // Connexion à la base de données
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  // // Logger en développement
  // if (process.env.NODE_ENV === 'development') {
  //   app.use(morgan('dev'));
  // }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/stats', statsRoutes);

  // Route de test
  // app.get('/api/test', (req, res) => {
  //   res.json({
  //     success: true,
  //     message: 'API MylanLodge fonctionne correctement'
  //   });
  // });

  // Middleware de gestion des erreurs
  app.use(errorHandler);

  // Gestion des routes non trouvées
  // app.use('*', (req, res) => {
  //   res.status(404).json({
  //     success: false,
  //     message: 'Route non trouvée'
  //   });
  // });

  // Démarrage du serveur
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  }); 