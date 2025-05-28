const Room = require('../models/Room');
const Category = require('../models/Category');

// Obtenir toutes les chambres
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('category')
      .sort({ createdAt: -1 });

    const formattedRooms = rooms.map(room => ({
      id: room._id,
      name: room.name,
      description: room.description,
      price: room.price,
      image: room.images[0]?.url || '',
      rating: 4.5, // Valeur par défaut
      reviews: 0,  // Valeur par défaut
      size: `${room.capacity * 10}m²`, // Estimation basée sur la capacité
      maxGuests: room.capacity
    }));

    res.json({
      success: true,
      rooms: formattedRooms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une chambre par son ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('category');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    const formattedRoom = {
      id: room._id,
      name: room.name,
      description: room.description,
      longDescription: room.description,
      price: room.price,
      image: room.images[0]?.url || '',
      images: room.images.map(img => img.url),
      amenities: room.amenities,
      size: `${room.capacity * 10}m²`,
      maxGuests: room.capacity,
      rating: 4.5,
      reviews: 0,
      category: room.category.name
    };

    res.json({
      success: true,
      room: formattedRoom
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les chambres en vedette
const getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('category')
      .limit(3)
      .sort({ price: -1 });

    const formattedRooms = rooms.map(room => ({
      id: room._id,
      name: room.name,
      description: room.description,
      price: room.price,
      image: room.images[0]?.url || ''
    }));

    res.json({
      success: true,
      rooms: formattedRooms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Créer une nouvelle chambre (admin seulement)
const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json({
      room
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Mettre à jour une chambre (admin seulement)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        message: 'Chambre non trouvée'
      });
    }

    res.json({
      room
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Supprimer une chambre (admin seulement)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: 'Chambre non trouvée'
      });
    }

    res.json({
      message: 'Chambre supprimée avec succès'
    });
  } catch (error) {
    res.status(400).json({
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
  getAllRooms,
  getRoomById,
  getFeaturedRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  addReview,
  checkAvailability
};
