import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import authMiddleware  from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";




const router = express.Router();




router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    
    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    
const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(phone.trim())) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid 10-digit Indian mobile number",
  });
}


    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and contain a letter and a number",
      });
    }

    
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
    });

    
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.error("Registration failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
    });
  }
});





//loginroutes


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
});

    return res.status(200).json({
  success: true,
  message: "Welcome back!",
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  },
});

  } catch (error) {
    console.error("Auth Error [Login]:", error.message);
    
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});



router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "fullName email phone role"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Failed to fetch user:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});
///////////////////////////

// Logout customer or admin
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
//////////admin user routes
router.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const page = Number.parseInt(req.query.page, 10) || 1;
      const limit = Number.parseInt(req.query.limit, 10) || 10;
      const search = req.query.search?.trim() || "";

      if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Page must be positive and limit must be between 1 and 50",
        });
      }

      const filter = {};

      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const [users, totalUsers] = await Promise.all([
        User.find(filter)
          .select("fullName email phone role cart createdAt")
          .populate("cart.product", "title images category actualPrice discountPrice stock")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),

        User.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          limit,
        },
      });
    } catch (error) {
      console.error("Admin users listing failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve users",
      });
    }
  }
);


///////////user api for admin 

router.get(
  "/admin/users/:userId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

    const user = await User.findById(userId)
  .select("fullName email phone role createdAt cart")
  .populate(
    "cart.product",
    "title images category materialType actualPrice discountPrice stock"
  )
  .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const [totalOrders, spendingResult, recentOrders] =
        await Promise.all([
          Order.countDocuments({ user: userId }),

          Order.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(userId),
                paymentStatus: "paid",
              },
            },
            {
              $group: {
                _id: null,
                totalSpent: { $sum: "$totalAmount" },
              },
            },
          ]),

          Order.find({ user: userId })
            .select(
              "_id totalAmount currency orderStatus paymentStatus createdAt"
            )
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),
        ]);

      return res.status(200).json({
        success: true,
        user: {
          ...user,
          totalOrders,
          totalSpent: spendingResult[0]?.totalSpent ?? 0,
          recentOrders,
        },
      });
    } catch (error) {
      console.error("Admin user details failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve user details",
      });
    }
  }
);

////admin role update


router.patch(
  "/admin/users/:userId/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role must be either user or admin",
        });
      }

      if (userId === req.user.userId) {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own role",
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { new: true, runValidators: true }
      ).select("fullName email phone role");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      console.error("Admin role update failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not update user role",
      });
    }
  }
);


export default router;
