import { Router } from "express";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { hotelIdSchema, updateHotelStatusSchema } from "../../../schemas/hotel.schema.js";
import * as adminHotelService from "./admin.service.js";

export const hotelAdminRouter = new Router();

hotelAdminRouter.get(
  "/",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.query;
      const result = await adminHotelService.listHotels({ status });
      successRes({ res, message: "Hotels retrieved successfully", status: 200, data: result });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

hotelAdminRouter.get(
  "/:id",
  auth,
  checkRole(["admin"]),
  validate(hotelIdSchema),
  async (req, res) => {
    try {
      const hotel = await adminHotelService.getHotelById(req.params.id);
      successRes({ res, message: "Hotel retrieved successfully", status: 200, data: hotel });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

hotelAdminRouter.patch(
  "/:id/status",
  auth,
  checkRole(["admin"]),
  validate(updateHotelStatusSchema),
  async (req, res) => {
    try {
      const { status } = req.body;
      const hotel = await adminHotelService.updateHotelStatus(req.params.id, { status });
      successRes({ res, message: "Hotel status updated successfully", status: 200, data: hotel });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);
