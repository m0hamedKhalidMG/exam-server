const jwt = require('jsonwebtoken');

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Access Token Required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    req.user = user; // Attach user data to request
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.user === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// Middleware to check if the user is logged in
exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Please log in first' });
  }
};

exports.checkIfSuspended = (req, res, next) => {
  console.log(req.user)
    if (req.user && req.user.stateuser) {
      return res.status(403).json({ message: 'Your account is suspended. Please contact support.' });
    }
    next();
  };