import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { hotelReviewsSchema } from "../../schemas/hotelReviews.shcema.js";
import { logger } from "../../utils/winston.utils.js";
import { errorRes, successRes } from "../../utils/response.util.js";
import { logActorTypes } from "../../enums/log.enums.js";
import { getHotelReviews } from "./reviews.service.js";
export const reviewsRouter = Router();

reviewsRouter.get(
  "/hotel/:id",
  auth,
  validate(hotelReviewsSchema),
  async (req, res) => {
    try {
      const hotelId = req.params.id;
      const hotelReviews = await getHotelReviews({ hotelId });
      successRes({
        res,
        message: "Hotel reviews retrieved successfully",
        status: 200,
        data: hotelReviews,
      });
    } catch (err) {
      logger.error(`Failed to get hotel reviews: ${err.message}`, {
        action: "GET_HOTEL_REVIEWS_FAILED",
        actor: { type: logActorTypes.USER, id: req.user?.id },
      });
      errorRes({ res, message: err.message, status: 500 });
    }
  },
);
