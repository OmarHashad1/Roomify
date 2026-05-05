import { Router } from "express";
import { errorRes, successRes } from "../../../utils/response.util.js";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  userFiltersSchema,
  userIdParamSchema,
  updateUserStatusSchema,
} from "../../../schemas/adminUsers.schema.js";
import { userRoles } from "../../../enums/user.enums.js";
import * as adminService from "./admin.service.js";

export const adminUsersRouter = new Router();

adminUsersRouter.get(
  "/",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(userFiltersSchema),
  async (req, res) => {
    try {
      const { role, status } = req.query;
      const users = await adminService.listUsers({ role, status });
      successRes({
        res,
        message: "Users retrieved successfully",
        status: 200,
        data: users,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

adminUsersRouter.get(
  "/:userId",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(userIdParamSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await adminService.getUserById(userId);
      successRes({
        res,
        message: "User retrieved successfully",
        status: 200,
        data: user,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

adminUsersRouter.patch(
  "/:userId/force-logout",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(userIdParamSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      await adminService.forceLogoutUser(userId, req.user._id);
      successRes({
        res,
        message: "User force logged out successfully",
        status: 200,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

adminUsersRouter.patch(
  "/:userId/status",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(updateUserStatusSchema),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      await adminService.updateUserStatus(userId, status, req.user._id);
      successRes({
        res,
        message: "User status updated successfully",
        status: 200,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
