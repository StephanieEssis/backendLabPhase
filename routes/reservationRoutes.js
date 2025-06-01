const express = require('express');
const reservationController = require('../controllers/reservationController');
const verifyUserToken = require('../middlewares/verifyUserToken');

const router = express.Router();

// User protected routes
router.post('/', verifyUserToken, reservationController.createReservation);
router.get('/my-reservations', verifyUserToken, reservationController.getUserReservations);
router.put('/:id/cancel', verifyUserToken, reservationController.cancelReservation);

module.exports = router;