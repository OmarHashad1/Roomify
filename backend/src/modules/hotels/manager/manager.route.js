import { Router } from "express";
import joi from "joi";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { uploadHotelPhotos, toRelativePath } from "../../../middleware/upload.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { userRoles } from "../../../enums/user.enums.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { updateHotelSchema } from "../../../schemas/hotel.schema.js";
import { errorRes, successRes } from "../../../utils/response.util.js";
import * as managerService from "./manager.service.js";

export const hotelManagerRouter = new Router();

const listHotelBookingsSchema = {
  params: joi.object({
    hotelId: joi.string().hex().length(24).required(),
  }),
  query: joi.object({
    status: joi
      .string()
      .valid(...Object.values(bookingStatuses))
      .optional(),
  }),
};

const hotelIdParamSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
};

hotelManagerRouter.get(
  "/mine",
  auth,
  checkRole([userRoles.HotelManager]),
  async (req, res) => {
    try {
      const payload = await managerService.listManagerHotels({
        managerId: req.user._id?.toString() || req.user.id,
      });

      successRes({
        res,
        message: "Manager hotels retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

const normalizeHotelUpdatePayload = (req, res, next) => {
  if (req.files?.length) {
    req.body.photos = req.files.map((file) => toRelativePath(file.path));
  }

  const parseArrayField = (field) => {
    if (typeof req.body[field] !== "string") return;

    const value = req.body[field].trim();
    if (!value) return;

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) req.body[field] = parsed;
    } catch {
      req.body[field] = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  };

  const parseNumberField = (field) => {
    if (typeof req.body[field] !== "string") return;
    const value = Number(req.body[field]);
    if (!Number.isNaN(value)) req.body[field] = value;
  };

  parseArrayField("photos");
  parseArrayField("amenities");
  parseNumberField("stars");
  parseNumberField("numberOfRooms");

  const hasBody = req.body && Object.keys(req.body).length > 0;
  if (!hasBody) {
    return errorRes({
      res,
      message: "Request body or uploaded photos cannot be empty",
      status: 400,
    });
  }

  next();
};

hotelManagerRouter.patch(
  "/:id",
  auth,
  checkRole([userRoles.HotelManager]),
  uploadHotelPhotos,
  normalizeHotelUpdatePayload,
  validate(updateHotelSchema),
  async (req, res) => {
    try {
      const payload = await managerService.updateHotelByManager({
        hotelId: req.params.id,
        managerId: req.user._id?.toString() || req.user.id,
        updateData: req.body,
      });

      successRes({
        res,
        message: "Hotel updated successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

hotelManagerRouter.get(
  "/:id",
  auth,
  checkRole([userRoles.HotelManager]),
  validate(hotelIdParamSchema),
  async (req, res) => {
    try {
      const payload = await managerService.getHotelDetailsByManager({
        hotelId: req.params.id,
        managerId: req.user._id?.toString() || req.user.id,
      });

      successRes({
        res,
        message: "Hotel details retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

hotelManagerRouter.get(
  "/:hotelId/bookings",
  auth,
  checkRole([userRoles.HotelManager]),
  validate(listHotelBookingsSchema),
  async (req, res) => {
    try {
      const payload = await managerService.listHotelBookingsByManager({
        hotelId: req.params.hotelId,
        managerId: req.user._id?.toString() || req.user.id,
        status: req.query.status,
      });

      successRes({
        res,
        message: "Hotel bookings retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
