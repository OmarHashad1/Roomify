import mongoose from "mongoose";
import { userRoles, userStatuses } from "../../enums/user.enums.js";

const userSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === userRoles.CUSTOMER;
      },
    },
    age: {
      type: Number,
      required: function () {
        return this.role === userRoles.CUSTOMER;
      },
    },
    nationality: {
      type: String,
      required: function () {
        return this.role === userRoles.CUSTOMER;
      },
    },
    age: {
      type: Number,
      required: function () {
        return this.role === userRoles.CUSTOMER;
      },
    },
    nationality: {
      type: String,
      required: function () {
        return this.role === userRoles.CUSTOMER;
      },
    },
    credentialChangedAt: { type: Date },
    role: {
      type: String,
      required: true,

      enum: [...Object.values(userRoles)],
      default: userRoles.CUSTOMER,
    },
    status: {
      type: String,
      enum: [...Object.values(userStatuses)],
      default: userStatuses.ACTIVE,
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

export const userModel = mongoose.model("User", userSchema);
