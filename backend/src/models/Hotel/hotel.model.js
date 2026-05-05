import mongoose from "mongoose";
import { hotelStatuses } from "../../enums/hotel.enums.js";

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [...Object.values(hotelStatuses)],
      default: hotelStatuses.ACTIVE,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    phone: {
      type: String,
      required: function () {
        return this?.status === hotelStatuses.ACTIVE;
      },
    },
    email: {
      type: String,
      required: function () {
        return this?.status === hotelStatuses.ACTIVE;
      },
      lowercase: true,
      trim: true,
    },

    address: {
      street:      { type: String, required: true, trim: true },
      city:        { type: String, required: true, trim: true },
      country:     { type: String, required: true, trim: true, default: "Egypt" },
    },

    photos: [{ type: String }],
    amenities: [{ type: String }],

    numberOfRooms: { type: Number, required: true },
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

export const hotelModel = mongoose.model("Hotel", hotelSchema);
