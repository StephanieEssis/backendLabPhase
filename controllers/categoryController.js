import Category from '../models/Category.js';

// Obtenir toutes les catégories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true })
      .populate({
        path: 'rooms',
        select: 'name status'
      });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une catégorie spécifique
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'rooms',
        select: 'name description price status images'
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Créer une nouvelle catégorie (admin)
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mettre à jour une catégorie (admin)
export const updateCategory = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'basePrice', 'features', 'image', 'active'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Mises à jour non valides'
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    updates.forEach(update => category[update] = req.body[update]);
    await category.save();

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Supprimer une catégorie (admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Vérifier si des chambres sont associées à cette catégorie
    const roomCount = await category.rooms.length;
    if (roomCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une catégorie avec des chambres associées'
      });
    }

    await category.remove();

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les statistiques d'une catégorie
export const getCategoryStats = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    const availableRooms = await category.getAvailableRoomsCount();
    const totalRooms = await category.rooms.length;

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupancyRate: totalRooms ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 