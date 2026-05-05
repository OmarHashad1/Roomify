import { Router } from "express";
import { errorRes, successRes } from "../../utils/response.util.js";
import { auth, checkRole } from "../../middleware/auth.middleware.js";
import { userRoles } from "../../enums/user.enums.js";
import * as adminService from "./admin.service.js";

export const adminRouter = new Router();

adminRouter.get(
  "/logs",
  auth,
  checkRole([userRoles.ADMIN]),
  async (req, res) => {
    try {
      const logs = await adminService.listLogs();
      successRes({
        res,
        message: "Logs retrieved successfully",
        status: 200,
        data: logs,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
