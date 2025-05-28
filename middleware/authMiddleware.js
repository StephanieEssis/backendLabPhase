const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'Authentification requise'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'Utilisateur non trouvé'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token invalide'
    });
  }
};

// Middleware de vérification du rôle admin
const admin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Accès refusé - Droits administrateur requis'
    });
  }
  next();
};

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue sur le serveur'
  });
};

module.exports = {
  auth,
  admin,
  errorHandler
};
