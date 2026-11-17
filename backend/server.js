
import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { startReservationCleanup } from "./services/reservationCleanup.js";
import offerRoutes from "./routes/offerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// Trust the nearest Hostinger reverse proxy
app.set("trust proxy", 1);

// CORS configuration
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// API routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);



// TEMPORARY: Hostinger proxy diagnostic
app.get("/api/debug-ip", (req, res) => {
  const expectedSecret = process.env.IP_DIAGNOSTIC_SECRET;
  const providedSecret = req.get("X-Diagnostic-Secret");

  if (
    !expectedSecret ||
    !providedSecret ||
    providedSecret !== expectedSecret
  ) {
    return res.status(404).json({
      success: false,
      message: "Not found",
    });
  }

  return res.status(200).json({
    ip: req.ip,
    ips: req.ips,
    remoteAddress: req.socket.remoteAddress,
    forwardedFor: req.get("X-Forwarded-For") || null,
    realIp: req.get("X-Real-IP") || null,
  });
});

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Threads & Tassels server is running",
  });
});

// Hostinger-compatible port
const PORT = process.env.PORT || 5000;

// Start server

const startServer = async () => {
  // Start listening immediately for Hostinger.
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    // Connect MongoDB after the HTTP server starts.
    await connectDb();

    // Start scheduled tasks only after DB connection.
    startReservationCleanup();

    console.log("Backend initialized successfully");
  } catch (error) {
    console.error("Backend initialization failed:", error.message);

    server.close(() => {
      process.exit(1);
    });
  }
};

startServer();