const Admin = require('../models/Admin');
const User = require('../models/User');
const Room = require('../models/Room');
const Category = require('../models/Category');
const Reservation = require('../models/Reservation');
const jwt = require('jsonwebtoken');

const adminController = {
  // Login admin
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          username: admin.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (req, res) => {
    try {
      const totalRooms = await Room.countDocuments();
      const availableRooms = await Room.countDocuments({ isAvailable: true });
      const totalUsers = await User.countDocuments();
      
      // Reservations by category
      const reservationsByCategory = await Reservation.aggregate([
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'room'
          }
        },
        { $unwind: '$room' },
        {
          $lookup: {
            from: 'categories',
            localField: 'room.categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category.name',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        totalRooms,
        availableRooms,
        totalUsers,
        reservationsByCategory
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all reservations
  getAllReservations: async (req, res) => {
    try {
      const reservations = await Reservation.find()
        .populate('userId', 'fullName email phone')
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
  }
};

module.exports = adminController;
