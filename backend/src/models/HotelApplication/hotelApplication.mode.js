import mongoose from "mongoose";
import { applicationStatuses } from "../../enums/hotel.enums.js";

const hotelApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
  
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    hotelName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    numberOfRooms: { type: Number, required: true },
    documents: [{ type: String }],

    status: {
      type: String,
      enum: [...Object.values(applicationStatuses)],
      default: applicationStatuses.UNDER_REVIEW,
    },
    rejectionReason: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
    strictQuery: true,
    strict: true,
    optimisticConcurrency: true,
  },
);

hotelApplicationSchema.virtual("submittedBy").get(function () {
  return `${this.firstName} ${this.lastName}`; 
});

export const hotelApplicationModel = mongoose.model(
  "HotelApplication",
  hotelApplicationSchema,
);
