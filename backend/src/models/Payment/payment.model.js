import mongoose from "mongoose";
import {
  paymentProviders,
  paymentMethods,
  paymentStatuses,
  refundStatuses,
} from "../../enums/payment.enums.js";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    paidBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },

    amount:        { type: Number, required: true },
    currency:      { type: String, required: true },
    transactionId: { type: String },

    provider: {
      type: String,
      enum: [...Object.values(paymentProviders)],
      required: true,
    },
    method: {
      type: String,
      enum: [...Object.values(paymentMethods)],
      required: true,
    },

    status: {
      type: String,
      enum: [...Object.values(paymentStatuses)],
      default: paymentStatuses.PENDING,
    },

    refundAmount: { type: Number },
    refundStatus: {
      type: String,
      enum: [...Object.values(refundStatuses)],
      default: refundStatuses.NONE,
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

export const paymentModel = mongoose.model("Payment", paymentSchema);
