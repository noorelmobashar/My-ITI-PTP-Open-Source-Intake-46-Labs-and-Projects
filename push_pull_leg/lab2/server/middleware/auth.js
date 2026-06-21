const jwt = require("jsonwebtoken");

// =============================================
// Auth Middleware
// Protects routes by verifying the JWT token
// sent in the Authorization header.
//
// How it works:
// 1. Client sends: Authorization: Bearer <token>
// 2. We extract and verify the token
// 3. If valid, attach the user ID to req.user
// 4. If invalid, send 401 Unauthorized
// =============================================

const auth = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    // so downstream route handlers can use it
    req.user = { id: decoded.id };

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

module.exports = auth;
