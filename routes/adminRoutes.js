const express = require('express');
const adminController = require('../controllers/adminController');
const verifyAdminToken = require('../middlewares/verifyAdminToken');

const router = express.Router();

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/dashboard', verifyAdminToken, adminController.getDashboardStats);
router.get('/reservations', verifyAdminToken, adminController.getAllReservations);

module.exports = router;