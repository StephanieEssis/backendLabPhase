const express = require('express');
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes protégées (utilisateur connecté)
router.post('/', auth, createBooking);
router.get('/me', auth, getUserBookings);
router.get('/:id', auth, getBooking);
router.patch('/:id', auth, updateBooking);
router.post('/:id/cancel', auth, cancelBooking);

// Routes admin
router.get('/', auth, adminOnly, getAllBookings);

module.exports = router; 