import { Router } from "express";
import { validate } from "../../../../middleware/validate.middleware.js";
import { auth, checkRole } from "../../../../middleware/auth.middleware.js";
import { uploadRoomTypePhotos, toRelativePath } from "../../../../middleware/upload.middleware.js";
import * as managerRoomTypeService from "./manager.service.js";
import { errorRes, successRes } from "../../../../utils/response.util.js";
import { createRoomTypeSchema } from "../../../../schemas/roomType.schema.js";
import { logger } from "../../../../utils/winston.utils.js";
import { logActorTypes } from "../../../../enums/log.enums.js";
import { makeError } from "../../../../utils/errorMaker.util.js";
import { roomTypeStatuses } from "../../../../enums/roomType.enums.js";

export const managerRouter = new Router();

managerRouter.get(
  "/hotels/room-types/hotel/:hotelId",
  auth,
  checkRole(["hotel_manager"]),
  async (req, res) => {
    try {
      const payload = await managerRoomTypeService.listManagerRoomTypes({
        managerId: req.user.id,
        hotelId: req.params.hotelId,
        status: req.query.status,
      });

      successRes({
        res,
        message: "Room types retrieved successfully",
        status: 200,
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

const normalizeRoomTypePayload = (req, _res, next) => {
  const files = req.files || [];
  if (files.length > 0) {
    req.body.mainPhoto = toRelativePath(files[0].path);
    req.body.photos = files.slice(1).map((f) => toRelativePath(f.path));
  }

  const parseArrayField = (field) => {
    if (typeof req.body[field] !== "string") return;
    const value = req.body[field].trim();
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        req.body[field] = parsed;
        return;
      }
    } catch {
      // fall through to comma-split
    }
    req.body[field] = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseNumberField = (field) => {
    if (typeof req.body[field] !== "string") return;
    const num = Number(req.body[field]);
    if (!Number.isNaN(num)) req.body[field] = num;
  };

  const parseBooleanField = (field) => {
    if (typeof req.body[field] !== "string") return;
    const v = req.body[field].trim().toLowerCase();
    if (v === "true") req.body[field] = true;
    else if (v === "false") req.body[field] = false;
  };

  parseArrayField("amenities");
  parseArrayField("photos");
  parseNumberField("bedroomCount");
  parseNumberField("pricePerNight");
  parseNumberField("maxGuests");
  parseBooleanField("smokingAllowed");

  next();
};

managerRouter.post(
  "/hotels/room-types",
  auth,
  checkRole(["hotel_manager"]),
  uploadRoomTypePhotos,
  normalizeRoomTypePayload,
  validate(createRoomTypeSchema),
  async (req, res) => {
    try {
      const payload = await managerRoomTypeService.createNewRoomType({
        managerId: req.user.id,
        roomTypeData: req.body,
      });

      successRes({
        res,
        message: "Room type created successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);

managerRouter.patch(
  "/hotels/room-types/:id",
  auth,
  checkRole(["hotel_manager"]),
  uploadRoomTypePhotos,
  normalizeRoomTypePayload,
  async (req, res) => {
    try {
      const payload = await managerRoomTypeService.updateRoomType(
        req.user.id,
        req.params.id,
        req.body,
      );

      successRes({
        res,
        message: "Room type updated successfully",
        data: payload,
      });
    } catch (error) {
      errorRes({
        res,
        message: "Failed to update room type: " + error.message,
        status: error.status || 500,
      });
    }
  },
);

managerRouter.patch(
  "/hotels/room-types/:id/status",
  auth,
  checkRole(["hotel_manager"]),
  async (req, res) => {
    try {
      const payload = await managerRoomTypeService.setRoomTypeStatus(
        req.user.id,
        req.params.id,
        req.body.status,
      );

      successRes({
        res,
        message: "Room type status updated successfully",
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
