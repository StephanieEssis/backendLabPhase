const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  addReview,
  checkAvailability
} = require('../controllers/roomController');
const { auth, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', getRooms);
router.get('/:id', getRoom);
router.get('/:id/availability', checkAvailability);

// Routes protégées (utilisateur connecté)
router.post('/:id/reviews', auth, addReview);

// Routes admin
router.post('/', auth, adminOnly, createRoom);
router.patch('/:id', auth, adminOnly, updateRoom);
router.delete('/:id', auth, adminOnly, deleteRoom);

module.exports = router;
