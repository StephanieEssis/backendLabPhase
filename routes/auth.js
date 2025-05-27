const express = require('express');
const { register, login, getProfile, updateProfile, logout } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.post('/logout', auth, logout);

module.exports = router;
