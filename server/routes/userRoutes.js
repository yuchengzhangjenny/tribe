const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes (require authentication)
router.use(authMiddleware);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Update current user profile
router.patch('/me', userController.updateCurrentUser);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Search for users
router.get('/', userController.searchUsers);

module.exports = router; 