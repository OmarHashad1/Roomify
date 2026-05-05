import mongoose from "mongoose";
export const roomAvailabilitySchema = new mongoose.Schema(
  {
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    date: { type: Date, required: true },
    availableCount: { type: Number, required: true },
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

roomAvailabilitySchema.index({ roomType: 1, date: 1 }, { unique: true });

export const roomAvailabilityModel = mongoose.model(
  "RoomAvailability",
  roomAvailabilitySchema,
);
