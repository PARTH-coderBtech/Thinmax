const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token)
    return res.status(401).json({ message: "Unauthorized, token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;