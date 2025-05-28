const express = require('express');
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getFeaturedRooms } = require('../controllers/roomController');
const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', getAllRooms);
router.get('/featured', getFeaturedRooms);
router.get('/:id', getRoomById);

// Routes protégées (admin seulement)
router.post('/', auth, admin, createRoom);
router.put('/:id', auth, admin, updateRoom);
router.delete('/:id', auth, admin, deleteRoom);

module.exports = router;
