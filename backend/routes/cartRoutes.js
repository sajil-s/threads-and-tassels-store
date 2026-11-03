
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCurrentOffer,
  getEffectivePrice,
} from "../services/pricingService.js";


const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      "cart.product"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const offer = await getCurrentOffer();

const items = user.cart
  .filter((item) => item.product)
  .map((item) => {
    const price = getEffectivePrice(item.product, offer);

    return {
      product: item.product,
      quantity: item.quantity,
      price,
      subtotal: price * item.quantity,
    };
  });

const total = items.reduce(
  (sum, item) => sum + item.subtotal,
  0
);

    return res.status(200).json({
      success: true,
      items,
      total,
    });
  } catch (error) {
    console.error("Fetch cart failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
});

//////////////////////////////////////////


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (
      typeof productId !== "string" ||
      !mongoose.isValidObjectId(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and positive integer quantity are required",
      });
    }

    const [user, product] = await Promise.all([
      User.findById(req.user.userId),
      Product.findById(productId),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    console.error("Add to cart failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
});



//////////////////////////////////////////////

router.patch("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID and positive integer quantity are required",
      });
    }

    const [user, product] = await Promise.all([
      User.findById(req.user.userId),
      Product.findById(productId),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    const item = user.cart.find(
      (entry) => entry.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    item.quantity = quantity;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
    });
  } catch (error) {
    console.error("Update cart failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
});


//////////////////////////////////////////////


router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const originalLength = user.cart.length;

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    if (user.cart.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
});

export default router;
