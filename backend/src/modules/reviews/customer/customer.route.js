import { Router } from "express";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { errorRes, successRes } from "../../../utils/response.util.js";
import { userRoles } from "../../../enums/user.enums.js";
import * as customerReviewService from "./customer.service.js";
import { createReviewSchema } from "../../../schemas/reviews.schema.js";

export const customerReviewRouter = new Router();

customerReviewRouter.get(
  "/me",
  auth,
  checkRole([userRoles.CUSTOMER]),
  async (req, res) => {
    try {
      const payload = await customerReviewService.getMyReviews(req.user.id);
      successRes({
        res,
        message: "Customer reviews retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

customerReviewRouter.post(
  "/",
  auth,
  checkRole([userRoles.CUSTOMER]),
  validate(createReviewSchema),
  async (req, res) => {
    try {
      const payload = await customerReviewService.createReview(
        req.user.id,
        req.body,
      );
      successRes({
        res,
        message: "Review created successfully",
        status: 201,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

customerReviewRouter.delete(
  "/me/:reviewId",
  auth,
  checkRole([userRoles.CUSTOMER]),
  async (req, res) => {
    try {
      const payload = await customerReviewService.deleteReview(
        req.user.id,
        req.params.reviewId,
      );
      successRes({
        res,
        message: "Review deleted successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
