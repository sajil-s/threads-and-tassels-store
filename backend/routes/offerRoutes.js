
import express from "express";
import Offer from "../models/Offer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: get the current offer configuration
router.get("/", async (req, res) => {
  try {
    let offer = await Offer.findOne().lean();

    if (!offer) {
      offer = await Offer.create({
        percentage: 10,
        isActive: false,
      });
      offer = offer.toObject();
    }

    return res.status(200).json({
      success: true,
      offer: {
        percentage: offer.percentage,
        isActive: offer.isActive,
      },
    });
  } catch (error) {
    console.error("Fetch offer failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve offer",
    });
  }
});

// Admin: update offer percentage and active status
router.patch("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { percentage, isActive } = req.body;

    if (
      percentage !== undefined &&
      (!Number.isInteger(percentage) || percentage < 1 || percentage > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage must be a whole number between 1 and 100",
      });
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    if (percentage === undefined && isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide percentage or isActive to update",
      });
    }

    const update = {};
    if (percentage !== undefined) update.percentage = percentage;
    if (isActive !== undefined) update.isActive = isActive;

    const offer = await Offer.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: {
        percentage: offer.percentage,
        isActive: offer.isActive,
      },
    });
  } catch (error) {
    console.error("Update offer failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not update offer",
    });
  }
});

export default router;
