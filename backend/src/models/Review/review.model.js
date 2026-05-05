import mongoose from "mongoose";
import { reviewStatuses } from "../../enums/review.enums.js";

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },

    status: {
      type: String,
      enum: [...Object.values(reviewStatuses)],
      default: reviewStatuses.PUBLISHED,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
    strictQuery: true,
    strict: true,
    optimisticConcurrency: true,
  },
);

export const reviewModel = mongoose.model("Review", reviewSchema);
