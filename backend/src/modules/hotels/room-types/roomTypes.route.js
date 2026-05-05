import { Router } from "express";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { getRoomTypeById, getRoomTypesByHotel } from "./roomTypes.service.js";
import { getRoomTypeSchema } from "../../../schemas/roomType.schema.js";
import { auth } from "../../../middleware/auth.middleware.js";

export const roomTypesRouter = Router();

roomTypesRouter.get("/hotel/:hotelId", auth, async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const rooms = await getRoomTypesByHotel(req.params.hotelId, checkIn, checkOut);
    successRes({
      res,
      message: "Room types retrieved successfully",
      status: 200,
      data: rooms,
    });
  } catch (err) {
    errorRes({ res, message: err.message, status: 500 });
  }
});

roomTypesRouter.get("/:id", validate(getRoomTypeSchema), async (req, res) => {
  try {
    const roomType = await getRoomTypeById(req.params.id);
    successRes({
      res,
      message: "Room type retrieved successfully",
      status: 200,
      data: roomType,
    });
  } catch (err) {
    const status = err.message === "Room type not found" ? 404 : 500;
    errorRes({ res, message: err.message, status });
  }
});
