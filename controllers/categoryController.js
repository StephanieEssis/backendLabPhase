const Category = require('../models/Category');
const Room = require('../models/Room');

// Obtenir toutes les catégories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: 'rooms',
        select: 'name status'
      });

    res.json({
      categories
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Obtenir une catégorie spécifique
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'rooms',
        select: 'name description price status images'
      });

    if (!category) {
      return res.status(404).json({
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      category
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Créer une nouvelle catégorie (admin)
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      category
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Mettre à jour une catégorie (admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      category
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Supprimer une catégorie (admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Catégorie non trouvée'
      });
    }

    // Vérifier si des chambres sont associées à cette catégorie
    const roomCount = await Room.countDocuments({ category: category._id });
    if (roomCount > 0) {
      return res.status(400).json({
        message: 'Impossible de supprimer une catégorie avec des chambres associées'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Obtenir les statistiques d'une catégorie
const getCategoryStats = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('rooms');
      
    if (!category) {
      return res.status(404).json({
        message: 'Catégorie non trouvée'
      });
    }

    const totalRooms = category.rooms.length;
    const availableRooms = category.rooms.filter(room => room.status === 'disponible').length;

    res.json({
      stats: {
        totalRooms,
        availableRooms,
        occupancyRate: totalRooms ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
}; 