
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      validate: {
        validator: Number.isInteger,
        message: "Offer percentage must be a whole number",
      },
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
