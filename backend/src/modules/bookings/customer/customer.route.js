import { Router } from "express";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { userRoles } from "../../../enums/user.enums.js";
import { createBookingSchema } from "../../../schemas/booking.schema.js";
import { createBooking, getMyBookings } from "./customer.service.js";

export const bookingCustomerRouter = Router();

bookingCustomerRouter.get(
  "/me",
  auth,
  checkRole([userRoles.CUSTOMER]),
  async (req, res) => {
    try {
      const payload = await getMyBookings(req.user.id);
      successRes({
        res,
        message: "Bookings retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

bookingCustomerRouter.post(
  "/create-booking",
  auth,
  checkRole([userRoles.CUSTOMER]),
  validate(createBookingSchema),
  async (req, res) => {
    try {
      const booking = await createBooking(req.user._id, req.body);
      successRes({
        res,
        message: "Booking created successfully",
        status: 201,
        data: booking,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);
