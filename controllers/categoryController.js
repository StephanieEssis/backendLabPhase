const Category = require('../models/Category');

const categoryController = {
  // Create category
  createCategory: async (req, res) => {
    try {
      const { name, description, pricePerNight } = req.body;

      const category = new Category({ name, description, pricePerNight });
      await category.save();

      res.status(201).json({
        message: 'Category created successfully',
        category
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      res.status(500).json({ message: error.message });
    }
  },

  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const { name, description, pricePerNight } = req.body;

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, pricePerNight },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({
        message: 'Category updated successfully',
        category
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      res.status(500).json({ message: error.message });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoryController;