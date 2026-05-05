import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { requireBody } from "../../middleware/requireBody.middleware.js";
import { updateProfile as updateProfileMiddleware } from "../../middleware/updateProfile.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import * as userService from "./users.service.js";
import { errorRes, successRes } from "../../utils/response.util.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../../schemas/users.scehma.js";

export const userRouter = new Router();

userRouter.get("/profile", auth, async (req, res) => {
  try {
    const payload = await userService.getProfile(req.user.id);
    successRes({
      res,
      message: "User profile retrieved successfully",
      status: 200,
      data: payload,
    });
  } catch (error) {
    errorRes({ res, message: error.message, status: error.status || 500 });
  }
});

userRouter.patch(
  "/profile",
  auth,
  requireBody,
  updateProfileMiddleware,
  validate(updateProfileSchema),
  async (req, res) => {
    try {
      const payload = await userService.updateProfile(
        req.user.id,
        req.body,
        req.decoded,
      );
      successRes({
        res,
        message: "User profile updated successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

userRouter.patch(
  "/profile/password",
  auth,
  validate(changePasswordSchema),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const payload = await userService.changePassword(
        req.user.id,
        { currentPassword, newPassword },
        req.decoded,
      );
      successRes({
        res,
        message: "Password changed successfully",
        status: 200,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
