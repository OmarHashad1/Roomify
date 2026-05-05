import joi from "joi";
import { userRoles, userStatuses } from "../enums/user.enums.js";

export const userFiltersSchema = {
  query: joi.object({
    role: joi.string().valid(...Object.values(userRoles)),
    status: joi.string().valid(...Object.values(userStatuses)),
  }),
};

export const userIdParamSchema = {
  params: joi.object({
    userId: joi.string().hex().length(24).required(),
  }),
};

export const updateUserStatusSchema = {
  params: joi.object({
    userId: joi.string().hex().length(24).required(),
  }),
  body: joi.object({
    status: joi
      .string()
      .valid(...Object.values(userStatuses))
      .required(),
  }),
};
