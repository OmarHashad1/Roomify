import joi from "joi";
import { userRoles, userStatuses } from "../enums/User.enums.js";
import { LOGOUT_FLAG } from "../enums/auth.enums.js";
export const signupSchema = {
  body: joi.object({
    firstName: joi.string().min(2).max(30).required(),
    lastName: joi.string().min(2).max(30).required(),
    email: joi
      .string()
      .email()
      .pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
      .required(),
    password: joi.string().min(8).max(30).required(),
    phone: joi
      .string()
      .pattern(/^\+\d{9,}$/)
      .required(),
    age: joi.number().min(18).max(100).required(),
    nationality: joi.string().required(),
    status: joi
      .string()
      .valid(...Object.values(userStatuses))
      .default(userStatuses.ACTIVE),
    role: joi.forbidden(),
    credentialChangedAt: joi.date().default(Date.now),
  }),
};

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required().pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
    password: joi.string().required(),
  }),
};

export const logoutSchema = {
  body: joi.object({
    flag: joi
      .string()
      .valid(...Object.values(LOGOUT_FLAG))
      .required(),
  }),
};
