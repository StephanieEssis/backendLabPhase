const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/stats', getCategoryStats);

// Routes admin
router.post('/', auth, admin, createCategory);
router.patch('/:id', auth, admin, updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

module.exports = router; 