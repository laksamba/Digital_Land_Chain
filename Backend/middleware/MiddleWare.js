
import jwt from 'jsonwebtoken';


// Authentication Middleware: Verifies JWT token
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Token received:", token);
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log("Decoded JWT user:", req.user);

    next();
  } catch (error) {
     console.error("JWT Verification Error:", error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Role-Based Access Control Middleware
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Authenticated User Role:", req.user.role);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};


// KYC Verification Middleware
export const checkKyc = (req, res, next) => {
  // If user is admin, skip KYC check
  console.log("Checking KYC for user:", req.user?.email);
  if (req.user?.role === 'admin') {
    return next();
  }

  // For other roles, enforce KYC verification
  if (!req.user || req.user.kycStatus !== 'Verified') {
    return res.status(403).json({ error: 'KYC not verified. Access denied.' });
  }

  next();
};



// Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.',
  });
};