import { Router } from "express";
import { auth, checkRole } from "../../../../../middleware/auth.middleware.js";
import * as managerRoomAvailabilityService from "./manager.service.js";
import { errorRes, successRes } from "../../../../../utils/response.util.js";
import { logger } from "../../../../../utils/winston.utils.js";
import { logActorTypes } from "../../../../../enums/log.enums.js";
import { makeError } from "../../../../../utils/errorMaker.util.js";

export const managerAvailabilityRouter = Router();

managerAvailabilityRouter.post(
  "/",
  auth,
  checkRole("hotel_manager"),
  async (req, res) => {
    try {
      const payload = await managerRoomAvailabilityService.setRoomAvailability(
        req.user.id,
        req.body,
      );

      successRes({
        res,
        message: "Room availability has been set successfully",
        data: payload,
      });
    } catch (error) {
      errorRes({
        res,
        message: error.message,
        status: error.status || 500,
      });
    }
  },
);

managerAvailabilityRouter.patch(
  "/:date",
  auth,
  checkRole("hotel_manager"),

  async (req, res) => {
    try {
      const payload =
        await managerRoomAvailabilityService.updateAvailabilityByDate(
          req.user.id,
          req.params.date,
          req.body,
        );

      successRes({
        res,
        message: "Room availability has been updated successfully",
        data: payload,
      });
    } catch (error) {
      errorRes({
        res,
        message: error.message,
        status: error.status || 500,
      });
    }
  },
);
