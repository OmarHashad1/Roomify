import { reviewModel } from "../../models/Review/review.model.js";

export const getHotelReviews = async ({ hotelId }) => {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }
  const hotelReviews = await reviewModel
    .find({ hotel: hotelId })
    .populate("customer", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();
  return hotelReviews;
};
