const express = require('express');
const categoryController = require('../controllers/categoryController');
const verifyAdminToken = require('../middlewares/verifyAdminToken');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin protected routes
router.post('/', verifyAdminToken, categoryController.createCategory);
router.put('/:id', verifyAdminToken, categoryController.updateCategory);
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;