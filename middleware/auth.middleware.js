const jwt = require('jsonwebtoken');

// Simple authentication middleware for demo purposes
const authenticateUser = (req, res, next) => {
  try {
    // In a real app, you would verify a JWT token here
    // For demo, we'll simulate a logged-in user with a header
    const userId = req.headers['x-user-id'] || "askjdhjklh1kj2h31j2h3123";
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID required in x-user-id header"
      });
    }
    
    // Attach user to request object
    req.user = { id: userId  };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = { authenticateUser };