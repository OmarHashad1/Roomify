import { Router } from "express";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { getApplicationByIdSchema } from "../../../schemas/hotelApplication.schema.js";
import * as adminApplicationService from "./admin.service.js";

export const hotelApplicationAdminRouter = new Router();

hotelApplicationAdminRouter.get(
  "/:id",
  auth,
  checkRole(["admin"]),
  validate(getApplicationByIdSchema),
  async (req, res) => {
    try {
      const application = await adminApplicationService.getApplicationById(req.params.id);
      successRes({
        res,
        message: "Application retrieved successfully",
        status: 200,
        data: application,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

hotelApplicationAdminRouter.patch(
  "/:id",
  auth,
  checkRole(["admin"]),
  validate(getApplicationByIdSchema),
  async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      const application = await adminApplicationService.updateApplicationStatus(
        req.params.id,
        { status, rejectionReason, adminId: req.user._id },
      );
      successRes({
        res,
        message: "Application status updated successfully",
        status: 200,
        data: application,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

hotelApplicationAdminRouter.get(
  "/",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.query;
      const applications = await adminApplicationService.listApplications({
        status,
      });
      successRes({
        res,
        message: "Applications retrieved successfully",
        status: 200,
        data: applications,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);
