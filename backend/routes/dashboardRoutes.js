
import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();





router.get(
  "/recent-orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select(
          "_id user totalAmount paymentStatus orderStatus createdAt"
        )
        .populate("user", "fullName")
        .lean();

      return res.status(200).json({
        success: true,
        count: recentOrders.length,
        recentOrders,
      });
    } catch (error) {
      console.error("Recent orders fetch failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve recent orders",
      });
    }
  }
);




//////////////////////////


router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

try {
  const { startDate, endDate } = req.query;

  let dateFilter = {};

  if (startDate || endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      !startDate ||
      !endDate ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      startDate.length !== 10 ||
      endDate.length !== 10 ||
      startDate > endDate ||
      start.toISOString().slice(0, 10) !== startDate ||
      end.toISOString().slice(0, 10) !== endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid startDate and endDate in YYYY-MM-DD format",
      });
    }

    dateFilter = {
      createdAt: {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lt: new Date(
          new Date(`${endDate}T00:00:00.000Z`).getTime() +
            24 * 60 * 60 * 1000
        ),
      },
    };
  }

  const [totalRevenue, totalOrders, totalCustomers, totalProducts,categoryStats] =

        await Promise.all([
     Order.aggregate([
  {
    $match: {
      ...dateFilter,
      paymentStatus: "paid",
    },
  },
  {
    $group: {
      _id: null,
      revenue: { $sum: "$totalAmount" },
    },
  },
]),
Order.countDocuments(dateFilter),
          User.countDocuments({ role: "user" }),
          Product.countDocuments(),
          
Order.aggregate([
  {
    $match: {
      ...dateFilter,
      paymentStatus: "paid",
      orderStatus: {
    $nin: ["cancelled", "returned"],
  },
    },
  },
  { $unwind: "$items" },
  {
    $lookup: {
      from: Product.collection.name,
      localField: "items.product",
      foreignField: "_id",
      as: "productDetails",
    },
  },
  { $unwind: "$productDetails" },
  {
    $group: {
      _id: "$productDetails.category",
      totalOrders: { $addToSet: "$_id" },
      unitsSold: { $sum: "$items.quantity" },
      revenue: {
        $sum: {
          $multiply: ["$items.price", "$items.quantity"],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      orderCount: { $size: "$totalOrders" },
      unitsSold: 1,
      revenue: 1,
    },
  },
  { $sort: { unitsSold: -1, revenue: -1 } },
]),

        ]);

      return res.status(200).json({
        success: true,
        analytics: {
          totalRevenue: totalRevenue[0]?.revenue ?? 0,
          totalOrders,
          totalCustomers,
          totalProducts,
        },
        categoryStats,
      });
    } catch (error) {
      console.error("Dashboard analytics failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve dashboard analytics",
      });
    }
  }
);

export default router;
