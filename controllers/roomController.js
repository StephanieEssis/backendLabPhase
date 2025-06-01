const Room = require('../models/Room');
const Category = require('../models/Category');

const roomController = {
  // Create room
  createRoom: async (req, res) => {
    try {
      const { name, description, categoryId, capacity, image } = req.body;

      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }

      const room = new Room({ name, description, categoryId, capacity, image });
      await room.save();

      const populatedRoom = await Room.findById(room._id).populate('categoryId');

      res.status(201).json({
        message: 'Room created successfully',
        room: populatedRoom
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all rooms
  getAllRooms: async (req, res) => {
    try {
      const { category, available } = req.query;
      let filter = {};

      if (category) {
        filter.categoryId = category;
      }
      if (available !== undefined) {
        filter.isAvailable = available === 'true';
      }

      const rooms = await Room.find(filter)
        .populate('categoryId')
        .sort({ createdAt: -1 });

      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate('categoryId');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update room
  updateRoom: async (req, res) => {
    try {
      const { name, description, categoryId, capacity, image, isAvailable } = req.body;

      // Check if category exists
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(400).json({ message: 'Category not found' });
        }
      }

      const room = await Room.findByIdAndUpdate(
        req.params.id,
        { name, description, categoryId, capacity, image, isAvailable },
        { new: true, runValidators: true }
      ).populate('categoryId');

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      res.json({
        message: 'Room updated successfully',
        room
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete room
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = roomController;