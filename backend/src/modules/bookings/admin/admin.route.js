import { Router } from "express";
import { errorRes, successRes } from "../../../utils/response.util.js";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import {
  bookingFiltersSchema,
  bookingIdParamSchema,
} from "../../../schemas/booking.schema.js";
import { userRoles } from "../../../enums/user.enums.js";
import * as adminService from "./admin.service.js";

export const adminBookingsRouter = new Router();

adminBookingsRouter.get(
  "/",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(bookingFiltersSchema),
  async (req, res) => {
    try {
      const { status, hotel } = req.query;
      const bookings = await adminService.listBookings({ status, hotel });
      successRes({
        res,
        message: "Bookings retrieved successfully",
        status: 200,
        data: bookings,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

adminBookingsRouter.get(
  "/:bookingId",
  auth,
  checkRole([userRoles.ADMIN]),
  validate(bookingIdParamSchema),
  async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await adminService.getBookingById(bookingId);
      successRes({
        res,
        message: "Booking retrieved successfully",
        status: 200,
        data: booking,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
