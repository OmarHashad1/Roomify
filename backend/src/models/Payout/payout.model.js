import mongoose from "mongoose";
import { payoutStatuses } from "../../enums/payout.enums.js";

const payoutSchema = new mongoose.Schema(
  {
    hotel:              { type: mongoose.Schema.Types.ObjectId, ref: "Hotel",   required: true },
    booking:            { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount:             { type: Number, required: true },
    commissionDeducted: { type: Number, required: true },

    status: {
      type: String,
      enum: [...Object.values(payoutStatuses)],
      default: payoutStatuses.PENDING,
    },

    paidAt: { type: Date },
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

export const payoutModel = mongoose.model("Payout", payoutSchema);
