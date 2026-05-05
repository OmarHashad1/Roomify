import { Router } from "express";
import joi from "joi";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { requireBody } from "../../../middleware/requireBody.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { userRoles } from "../../../enums/user.enums.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { errorRes, successRes } from "../../../utils/response.util.js";
import * as managerService from "./manager.service.js";

const updateBookingDatesSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
  body: joi.object({
    checkIn: joi.date().iso().required(),
    checkOut: joi.date().iso().greater(joi.ref("checkIn")).required(),
  }),
};

const updateBookingStatusSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
  body: joi.object({
    status: joi
      .string()
      .valid(
        bookingStatuses.CONFIRMED,
        bookingStatuses.CHECKED_IN,
        bookingStatuses.COMPLETED,
        bookingStatuses.CANCELLED_BY_HOTEL,
      )
      .required(),
  }),
};

export const bookingManagerRouter = new Router();

bookingManagerRouter.patch(
  "/:id",
  auth,
  checkRole([userRoles.HotelManager]),
  requireBody,
  validate(updateBookingDatesSchema),
  async (req, res) => {
    try {
      const payload = await managerService.updateBookingDatesByManager({
        bookingId: req.params.id,
        managerId: req.user._id?.toString() || req.user.id,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
      });

      successRes({
        res,
        message: "Booking dates updated successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

bookingManagerRouter.patch(
  "/:id/status",
  auth,
  checkRole([userRoles.HotelManager]),
  requireBody,
  validate(updateBookingStatusSchema),
  async (req, res) => {
    try {
      const payload = await managerService.updateBookingStatusByManager({
        bookingId: req.params.id,
        managerId: req.user._id?.toString() || req.user.id,
        nextStatus: req.body.status,
      });

      successRes({
        res,
        message: "Booking status updated successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
