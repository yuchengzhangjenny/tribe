const { auth } = require('../utils/admin');

/**
 * Middleware to verify Firebase authentication token
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No authentication token provided' 
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];
    
    // Verify token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user to request
    req.user = decodedToken;
    
    // Continue to the route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Token expired' 
      });
    }
    
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-token') {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid token' 
      });
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware; 