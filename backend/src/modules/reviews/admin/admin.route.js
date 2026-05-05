import { Router } from "express";
import { errorRes, successRes } from "../../../utils/response.util.js";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  reviewFiltersSchema,
  updateReviewStatusSchema,
} from "../../../schemas/reviews.schema.js";
import { userRoles } from "../../../enums/user.enums.js";
import * as adminService from "./admin.service.js";

export const adminReviewsRouter = new Router();

adminReviewsRouter.get(
  "/",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(reviewFiltersSchema),
  async (req, res) => {
    try {
      const { status, hotel } = req.query;
      const reviews = await adminService.listReviews({ status, hotel });
      successRes({
        res,
        message: "Reviews retrieved successfully",
        status: 200,
        data: reviews,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

adminReviewsRouter.patch(
  "/:reviewId/status",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(updateReviewStatusSchema),
  async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { status } = req.body;
      await adminService.updateReviewStatus(reviewId, status, req.user._id);
      successRes({
        res,
        message: "Review status updated successfully",
        status: 200,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
