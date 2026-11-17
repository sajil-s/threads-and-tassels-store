


import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id role tokenVersion"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    const currentVersion = user.tokenVersion ?? 0;

    // Temporary compatibility for JWTs issued before tokenVersion
    // was introduced. Remove this fallback after the old tokens expire.
    const tokenVersion = decoded.tokenVersion ?? 0;

    if (
      !Number.isInteger(tokenVersion) ||
      tokenVersion !== currentVersion
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError" ||
      error.name === "CastError"
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



// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     // First check for JWT in the HttpOnly cookie
//     const cookieToken = req.cookies?.token;

//     // Also support Bearer token for existing Postman tests
//     const authHeader = req.headers.authorization;

//     const bearerToken = authHeader?.startsWith("Bearer ")
//       ? authHeader.slice(7)
//       : null;

//     const token = cookieToken || bearerToken;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     // Verify JWT signature and expiration
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = {
//       userId: decoded.userId,
//       role: decoded.role,
//     };

//     next();
//   } catch (error) {
//     if (
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError" ||
//       error.name === "NotBeforeError"
//     ) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or expired token",
//       });
//     }

//     console.error("Authentication failed:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Authentication failed",
//     });
//   }
// };

// export default authMiddleware;
