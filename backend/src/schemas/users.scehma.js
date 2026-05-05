import joi from "joi";
import { userStatuses } from "../enums/User.enums.js";

export const updateProfileSchema = {
  body: joi.object({
    firstName: joi.string().min(2).max(30),
    lastName: joi.string().min(2).max(30),
    email: joi.string().email(),

    phone: joi.string().pattern(/^\+\d{9,}$/),

    age: joi.number().min(18).max(120),
    nationality: joi.string(),

    status: joi
      .string()
      .valid(...Object.values(userStatuses))
      .default(userStatuses.ACTIVE),
  }),
};

export const changePasswordSchema = {
  body: joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi.string().min(8).max(128).required(),
  }),
};
