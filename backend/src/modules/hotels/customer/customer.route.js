import { Router } from "express";
import { validate } from "../../../middleware/validate.middleware.js";
import { searchRoomsSchema } from "../../../schemas/search.schema.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { getHotels, searchRooms } from "./customer.service.js";

export const hotelCustomerRouter = Router();

hotelCustomerRouter.get("/", async (req, res) => {
  try {
    const hotels = await getHotels();
    successRes({ res, message: "Hotels retrieved successfully", status: 200, data: hotels });
  } catch (err) {
    errorRes({ res, message: err.message, status: 500 });
  }
});

hotelCustomerRouter.get("/search/rooms", validate(searchRoomsSchema), async (req, res) => {
  try {
    const { location, checkIn, checkOut, adults, children, rooms } = req.query;
    const results = await searchRooms({ location, checkIn, checkOut, adults, children, rooms });
    successRes({ res, message: "Search results retrieved successfully", status: 200, data: results });
  } catch (err) {
    errorRes({ res, message: err.message, status: 500 });
  }
});
