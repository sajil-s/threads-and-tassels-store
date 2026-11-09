// import "dotenv/config";
// import express from "express";
// import connectDb from "./config/db.js"; 
// import productRoutes from "./routes/productRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import { startReservationCleanup } from "./services/reservationCleanup.js";
// import offerRoutes from "./routes/offerRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";




// const app=express();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );



// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/products",productRoutes);
// app.use("/api/auth",authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/offers", offerRoutes);
// app.use("/api/admin/dashboard", dashboardRoutes);




// const PORT = process.env.PORT || 5000;

// app.get("/",(req,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"Threads & Tassels server is running",
//     })
// });


// const startServer=async()=>{
//     await connectDb();
//     startReservationCleanup();



// app.listen(PORT,()=>{
//     console.log(`server is run on port ${PORT}`)
// })
// }

// startServer();


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
  try {
    await connectDb();

    startReservationCleanup();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
