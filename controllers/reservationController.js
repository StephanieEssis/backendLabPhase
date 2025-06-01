const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Category = require('../models/Category');

const reservationController = {
  // Create reservation
  createReservation: async (req, res) => {
    try {
      const { roomId, checkInDate, checkOutDate } = req.body;
      const userId = req.user._id;

      // Check if room exists and is available
      const room = await Room.findById(roomId).populate('categoryId');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (!room.isAvailable) {
        return res.status(400).json({ message: 'Room is not available' });
      }

      // Calculate total price
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * room.categoryId.pricePerNight;

      // Create reservation
      const reservation = new Reservation({
        roomId,
        userId,
        checkInDate,
        checkOutDate,
        totalPrice
      });

      await reservation.save();

      // Update room availability
      await Room.findByIdAndUpdate(roomId, { isAvailable: false });

      const populatedReservation = await Reservation.findById(reservation._id)
        .populate('userId', 'fullName email phone')
        .populate({
          path: 'roomId',
          populate: {
            path: 'categoryId',
            model: 'Category'
          }
        });

      res.status(201).json({
        message: 'Reservation created successfully',
        reservation: populatedReservation
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user reservations
  getUserReservations: async (req, res) => {
    try {
      const userId = req.user._id;

      const reservations = await Reservation.find({ userId })
        .populate({
          path: 'roomId',
          populate: {
            path: 'categoryId',
            model: 'Category'
          }
        })
        .sort({ createdAt: -1 });

      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel reservation
  cancelReservation: async (req, res) => {
    try {
      const reservationId = req.params.id;
      const userId = req.user._id;

      const reservation = await Reservation.findOne({ 
        _id: reservationId, 
        userId 
      });

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      if (reservation.status === 'cancelled') {
        return res.status(400).json({ message: 'Reservation already cancelled' });
      }

      // Update reservation status
      reservation.status = 'cancelled';
      await reservation.save();

      // Make room available again
      await Room.findByIdAndUpdate(reservation.roomId, { isAvailable: true });

      res.json({
        message: 'Reservation cancelled successfully',
        reservation
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = reservationController;