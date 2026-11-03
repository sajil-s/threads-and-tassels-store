
import Offer from "../models/Offer.js";

export const getCurrentOffer = async () => {
  const offer = await Offer.findOne().lean();

  return {
    percentage: offer?.percentage ?? 10,
    isActive: offer?.isActive ?? false,
  };
};

export const getEffectivePrice = (product, offer) => {
  const discountPrice = product.discountPrice;

  if (!offer.isActive) {
    return discountPrice;
  }

  return Math.round(
    discountPrice * (1 - offer.percentage / 100)
  );
};
