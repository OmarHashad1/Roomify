import mongoose from "mongoose";
import { logLevels, logActorTypes } from "../../enums/log.enums.js";

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: [...Object.values(logLevels)],
      required: true,
    },

    action:   { type: String, required: true },
    targetId: { type: String, default: null },

    actor: {
      type: {
        type: String,
        enum: [...Object.values(logActorTypes)],
        required: true,
      },
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },

    message: { type: String, required: true },
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

export const logModel = mongoose.model("Log", logSchema);
