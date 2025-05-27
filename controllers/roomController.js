const Room = require('../models/Room');
const Category = require('../models/Category');

// Obtenir toutes les chambres avec filtres
const getRooms = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      capacity,
      status,
      amenities,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (amenities) {
      filter.amenities = {
        $all: Array.isArray(amenities) ? amenities : [amenities]
      };
    }

    const rooms = await Room.find(filter)
      .sort(sort)
      .populate('category', 'name description')
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName'
      });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une chambre spécifique
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('category', 'name description')
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName'
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Créer une nouvelle chambre (admin)
const createRoom = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mettre à jour une chambre (admin)
const updateRoom = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name', 'description', 'price', 'capacity',
      'images', 'amenities', 'status', 'size', 'floor'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Mises à jour non valides'
      });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    updates.forEach(update => room[update] = req.body[update]);
    await room.save();

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Supprimer une chambre (admin)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    await room.remove();

    res.json({
      success: true,
      message: 'Chambre supprimée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Ajouter un avis
const addReview = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    room.reviews.push(review);
    await room.save();

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Vérifier la disponibilité
const checkAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    const isAvailable = await room.isAvailable(new Date(startDate), new Date(endDate));

    res.json({
      success: true,
      data: {
        isAvailable,
        room: room._id
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  addReview,
  checkAvailability
};
