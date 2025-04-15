const User = require('../models/User');
const { auth } = require('../utils/admin');

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.getById(req.user.uid);
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update current user profile
exports.updateCurrentUser = async (req, res) => {
  try {
    const updates = req.body;
    
    // Validate updates if needed
    
    const updatedUser = await User.update(req.user.uid, updates);
    
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Search for users
exports.searchUsers = async (req, res) => {
  try {
    const { interests, limit = 10 } = req.query;
    
    // Parse interests if it's a string
    const parsedInterests = interests ? 
      (typeof interests === 'string' ? [interests] : interests) : 
      [];
    
    const users = await User.search({ interests: parsedInterests }, parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to search users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 