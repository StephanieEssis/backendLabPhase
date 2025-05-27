const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/stats', getCategoryStats);

// Routes admin
router.post('/', auth, adminOnly, createCategory);
router.patch('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router; 