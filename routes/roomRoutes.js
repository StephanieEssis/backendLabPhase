const express = require('express');
const roomController = require('../controllers/roomController');
const verifyAdminToken = require('../middlewares/verifyAdminToken');

const router = express.Router();

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

// Admin protected routes
router.post('/', verifyAdminToken, roomController.createRoom);
router.put('/:id', verifyAdminToken, roomController.updateRoom);
router.delete('/:id', verifyAdminToken, roomController.deleteRoom);

module.exports = router;