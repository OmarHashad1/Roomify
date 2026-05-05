import mongoose from "mongoose";
import {
  bookingStatuses,
  paymentMethods,
  paymentStatuses,
} from "../../enums/booking.enums.js";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },

    status: {
      type: String,
      enum: [...Object.values(bookingStatuses)],
      default: bookingStatuses.PENDING_PAYMENT,
    },

    subtotal: { type: Number, required: true },
    finalNightPrice: { type: Number, required: true },

    cancelledAt: { type: Date },

    updatedInformation: {
      email: { type: String },
      phone: { type: String },
    },

    numGuests: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: [...Object.values(paymentMethods)],
      default: paymentMethods.CASH,
    },
    paymentStatus: {
      type: String,
      enum: [...Object.values(paymentStatuses)],
      default: paymentStatuses.PENDING,
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

export const bookingModel = mongoose.model("Booking", bookingSchema);
