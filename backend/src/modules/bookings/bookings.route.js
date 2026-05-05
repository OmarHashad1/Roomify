import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { errorRes, successRes } from "../../utils/response.util.js";
import * as bookingService from "./bookings.service.js";
import { bookingIdParamSchema } from "../../schemas/booking.schema.js";

export const bookingsRouter = new Router();

bookingsRouter.get(
  "/:bookingId",
  auth,
  validate(bookingIdParamSchema),
  async (req, res) => {
    try {
      const payload = await bookingService.getBookingDetails(
        req.user,
        req.params.bookingId,
      );
      successRes({
        res,
        message: "Booking details retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
