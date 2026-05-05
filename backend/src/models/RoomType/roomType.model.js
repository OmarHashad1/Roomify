import mongoose from "mongoose";
import { roomTypeStatuses } from "../../enums/roomType.enums.js";

export const roomTypeSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    type:     { type: String, required: true },
    description: { type: String, required: true },
    mainPhoto:   { type: String, required: true },
    photos:      [{ type: String }],
    view:        { type: String },

    bedroomCount: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true },
    maxGuests:     { type: Number, required: true },

    smokingAllowed: { type: Boolean, default: false },

    status: {
      type: String,
      enum: [...Object.values(roomTypeStatuses)],
      default: roomTypeStatuses.ACTIVE,
    },

    amenities: [{ type: String }],
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

export const roomTypeModel = mongoose.model("RoomType", roomTypeSchema);
