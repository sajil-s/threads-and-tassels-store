




import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // First check for JWT in the HttpOnly cookie
    const cookieToken = req.cookies?.token;

    // Also support Bearer token for existing Postman tests
    const authHeader = req.headers.authorization;

    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    console.error("Authentication failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authMiddleware;
